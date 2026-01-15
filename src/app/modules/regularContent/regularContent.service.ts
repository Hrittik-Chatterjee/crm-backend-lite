import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import {
  IRegularContent,
  IRegularContentQueryParams,
  IRegularContentPaginatedResponse,
} from "./regularContent.interface";
import { RegularContent } from "./regularContent.model";
import { UserRole } from "../user/user.interface";
import { Business } from "../business/business.model";

/**
 * Helper function to get today's date in MM/DD/YYYY format
 */
const getTodayDateString = (): string => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const year = today.getFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Helper function to sync tags from content to business
 * Extracts unique hashtags from content tags and appends new ones to business tags
 */
const syncTagsToBusiness = async (
  businessId: string,
  contentTags?: string
): Promise<void> => {
  if (!contentTags || !contentTags.trim()) {
    return; // No tags to sync
  }

  // Find the business
  const business = await Business.findById(businessId);
  if (!business) {
    return; // Business not found, skip sync
  }

  // Extract hashtags from content tags (split by space and filter hashtags)
  const contentHashtags = contentTags
    .trim()
    .split(/\s+/)
    .filter((tag) => tag.startsWith("#") && tag.length > 1)
    .map((tag) => tag.toLowerCase());

  // Extract hashtags from business tags
  const businessTags = business.tags || "";
  const businessHashtags = businessTags
    .trim()
    .split(/\s+/)
    .filter((tag) => tag.startsWith("#") && tag.length > 1)
    .map((tag) => tag.toLowerCase());

  // Find new hashtags that are in content but not in business
  const newHashtags = contentHashtags.filter(
    (tag) => !businessHashtags.includes(tag)
  );

  // If there are new hashtags, append them to business tags
  if (newHashtags.length > 0) {
    const updatedTags = businessTags.trim()
      ? `${businessTags.trim()} ${newHashtags.join(" ")}`
      : newHashtags.join(" ");

    await Business.findByIdAndUpdate(businessId, { tags: updatedTags });

    console.log(
      `✅ Synced ${newHashtags.length} new tag(s) to business ${
        business.businessName
      }: ${newHashtags.join(", ")}`
    );
  }
};

const createRegularContent = async (
  user: any,
  payload: Partial<IRegularContent>
): Promise<IRegularContent> => {
  const business = await Business.findById(payload.business);

  if (!business) {
    throw new AppError(StatusCodes.NOT_FOUND, "Business not found");
  }

  const newPayload = {
    ...payload,
    addedBy: user.id,
    assignedCD: business.assignedCD ? business.assignedCD[0] : undefined,
    assignedCW: business.assignedCW ? business.assignedCW[0] : undefined,
    assignedVE: business.assignedVE ? business.assignedVE[0] : undefined,
  };

  const content = await RegularContent.create(newPayload);

  const populatedContent = await RegularContent.findById(content._id)
    .populate("business", "businessName typeOfBusiness contactPerson")
    .populate("addedBy", "username roles")
    .populate("assignedCD", "username roles")
    .populate("assignedCW", "username roles")
    .populate("assignedVE", "username roles");

  if (!populatedContent) {
    return content;
  }

  return populatedContent;
};

const getAllRegularContents = async (
  queryParams: IRegularContentQueryParams,
  user: any
): Promise<IRegularContentPaginatedResponse> => {
  // Build the query filter
  const filter: any = {};

  // Date filtering
  if (queryParams.todayOnly === "true") {
    filter.date = getTodayDateString();
  } else if (queryParams.date) {
    filter.date = queryParams.date;
  }

  // Business filtering
  if (queryParams.business) {
    filter.business = queryParams.business;
  }

  // Assignment filtering
  if (queryParams.assignedCD) {
    filter.assignedCD = queryParams.assignedCD;
  }
  if (queryParams.assignedCW) {
    filter.assignedCW = queryParams.assignedCW;
  }
  if (queryParams.assignedVE) {
    filter.assignedVE = queryParams.assignedVE;
  }
  if (queryParams.addedBy) {
    filter.addedBy = queryParams.addedBy;
  }

  // Status filtering (optional - shows all content by default)
  if (queryParams.status !== undefined) {
    filter.status = queryParams.status === "true";
  }

  // ContentType filtering (optional query param)
  if (queryParams.contentType) {
    filter.contentType = queryParams.contentType;
  }

  // Role-based filtering with contentType visibility
  if (
    user &&
    !user.roles.includes(UserRole.SUPER_ADMIN) &&
    !user.roles.includes(UserRole.ADMIN) &&
    !user.roles.includes(UserRole.CONTENT_WRITER)
  ) {
    // Content Designers: see only poster/both content assigned to them
    if (user.roles.includes(UserRole.CONTENT_DESIGNER)) {
      filter.assignedCD = user.id;
      filter.contentType = { $in: ["poster", "both"] };
    }
    // Video Editors: see only video/both content assigned to them
    else if (user.roles.includes(UserRole.VIDEO_EDITOR)) {
      filter.assignedVE = user.id;
      filter.contentType = { $in: ["video", "both"] };
    }
  }

  // Pagination
  const page = parseInt(queryParams.page || "1");
  const limit = parseInt(queryParams.limit || "20");
  const skip = (page - 1) * limit;

  // Sorting
  const sortBy = queryParams.sortBy || "date";
  const sortOrder = queryParams.sortOrder === "asc" ? 1 : -1;
  const sortOptions: any = { [sortBy]: sortOrder };

  // Add secondary sort by createdAt for consistency
  if (sortBy !== "createdAt") {
    sortOptions.createdAt = -1;
  }

  // Execute query with population
  const [contents, total] = await Promise.all([
    RegularContent.find(filter)
      .populate("business", "businessName typeOfBusiness contactPerson")
      .populate("addedBy", "username roles")
      .populate("assignedCD", "username roles")
      .populate("assignedCW", "username roles")
      .populate("assignedVE", "username roles")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean() as Promise<any[]>,
    RegularContent.countDocuments(filter),
  ]);

  return {
    contents: contents as IRegularContent[],
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getRegularContentById = async (
  id: string
): Promise<IRegularContent | null> => {
  const content = await RegularContent.findById(id)
    .populate("business", "businessName typeOfBusiness contactPerson")
    .populate("addedBy", "username roles")
    .populate("assignedCD", "username roles")
    .populate("assignedCW", "username roles")
    .populate("assignedVE", "username roles");

  if (!content) {
    throw new AppError(StatusCodes.NOT_FOUND, "Regular content not found");
  }

  return content;
};

const updateRegularContent = async (
  id: string,
  payload: Partial<IRegularContent>,
  user: any
): Promise<IRegularContent | null> => {
  // Get the existing content to access business ID
  const existingContent = await RegularContent.findById(id);

  if (!existingContent) {
    throw new AppError(StatusCodes.NOT_FOUND, "Regular content not found");
  }

  // Check authorization: Only users assigned to the business can update
  // Super Admin and Admin can update any content
  if (!user.roles.includes(UserRole.SUPER_ADMIN) && !user.roles.includes(UserRole.ADMIN)) {
    // Get the business to check assignments
    const businessId = typeof existingContent.business === "string"
      ? existingContent.business
      : existingContent.business.toString();

    const business = await Business.findById(businessId);

    if (!business) {
      throw new AppError(StatusCodes.NOT_FOUND, "Business not found");
    }

    // Check if user is assigned to this business
    const isAssignedCW = business.assignedCW?.some((id) => id.toString() === user.id);
    const isAssignedCD = business.assignedCD?.some((id) => id.toString() === user.id);
    const isAssignedVE = business.assignedVE?.some((id) => id.toString() === user.id);

    if (!isAssignedCW && !isAssignedCD && !isAssignedVE) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to update content for this business"
      );
    }
  }

  // Update the content
  const content = await RegularContent.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("business", "businessName typeOfBusiness contactPerson")
    .populate("addedBy", "username roles")
    .populate("assignedCD", "username roles")
    .populate("assignedCW", "username roles")
    .populate("assignedVE", "username roles");

  if (!content) {
    throw new AppError(StatusCodes.NOT_FOUND, "Regular content not found");
  }

  // Sync tags to business if tags are being updated
  if (payload.tags) {
    const businessId = payload.business
      ? typeof payload.business === "string"
        ? payload.business
        : payload.business.toString()
      : typeof existingContent.business === "string"
      ? existingContent.business
      : existingContent.business.toString();

    await syncTagsToBusiness(businessId, payload.tags);
  }

  return content;
};

const deleteRegularContent = async (id: string, user: any): Promise<void> => {
  // First, get the content with populated fields before deleting
  const content = await RegularContent.findById(id)
    .populate("business", "businessName typeOfBusiness contactPerson")
    .populate("addedBy", "username roles")
    .populate("assignedCD", "username roles")
    .populate("assignedCW", "username roles")
    .populate("assignedVE", "username roles");

  if (!content) {
    throw new AppError(StatusCodes.NOT_FOUND, "Regular content not found");
  }

  // Check authorization: Only users assigned to the business can delete
  // Super Admin and Admin can delete any content
  if (!user.roles.includes(UserRole.SUPER_ADMIN) && !user.roles.includes(UserRole.ADMIN)) {
    // Get the business to check assignments
    const businessId = typeof content.business === "string"
      ? content.business
      : (content.business as any)._id
      ? (content.business as any)._id.toString()
      : content.business.toString();

    const business = await Business.findById(businessId);

    if (!business) {
      throw new AppError(StatusCodes.NOT_FOUND, "Business not found");
    }

    // Check if user is assigned to this business
    const isAssignedCW = business.assignedCW?.some((id) => id.toString() === user.id);
    const isAssignedCD = business.assignedCD?.some((id) => id.toString() === user.id);
    const isAssignedVE = business.assignedVE?.some((id) => id.toString() === user.id);

    if (!isAssignedCW && !isAssignedCD && !isAssignedVE) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to delete content for this business"
      );
    }
  }

  // Delete the content
  const result = await RegularContent.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Regular content not found");
  }
};

export const RegularContentServices = {
  createRegularContent,
  getAllRegularContents,
  getRegularContentById,
  updateRegularContent,
  deleteRegularContent,
};
