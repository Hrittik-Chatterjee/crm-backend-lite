import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IBusiness } from "./business.interface";
import { Business } from "./business.model";
import { UserRole } from "../user/user.interface";
import { Types } from "mongoose";

const createBusiness = async (
  payload: Partial<IBusiness>
): Promise<IBusiness> => {
  const business = await Business.create(payload);
  return business;
};

const getAllBusinesses = async (user: any, query: Record<string, unknown>) => {
  const { page = 1, limit = 10, sortBy, sortOrder, search } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const sort: any = {};
  if (sortBy && sortOrder) {
    sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;
    // Add _id as secondary sort to ensure consistent ordering when primary field has duplicates
    sort._id = sortOrder === "desc" ? -1 : 1;
  } else {
    // Default sort by _id to ensure consistent ordering
    sort._id = -1;
  }

  const filter = { status: true } as any;

  // Add search functionality
  if (search && typeof search === "string" && search.trim() !== "") {
    const searchRegex = new RegExp(search, "i");
    filter.$and = [
      {
        $or: [
          { businessName: searchRegex },
          { typeOfBusiness: searchRegex },
          { country: searchRegex },
          { package: searchRegex },
        ],
      },
    ];
  }

  if (
    user &&
    !user.roles.includes(UserRole.SUPER_ADMIN) &&
    !user.roles.includes(UserRole.ADMIN)
  ) {
    const userId = new Types.ObjectId(user.id);
    const userFilter = {
      $or: [
        { assignedCW: userId },
        { assignedCD: userId },
        { assignedVE: userId },
      ],
    };

    if (filter.$and) {
      filter.$and.push(userFilter);
    } else {
      filter.$and = [userFilter];
    }
  }

  const businesses = await Business.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));
  const total = await Business.countDocuments(filter);

  // Decrypt passwords before returning
  const decryptedBusinesses = businesses.map((business) => {
    const businessObj = business.toObject();
    businessObj.socialMediaLinks = business.getDecryptedSocialMedia();
    return businessObj;
  });

  return {
    data: decryptedBusinesses,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
  };
};

const getBusinessById = async (id: string): Promise<any> => {
  const business = await Business.findById(id);

  if (!business) {
    throw new AppError(StatusCodes.NOT_FOUND, "Business not found");
  }

  // Decrypt passwords before returning
  const businessObj = business.toObject();
  businessObj.socialMediaLinks = business.getDecryptedSocialMedia();

  return businessObj;
};

const updateBusiness = async (
  id: string,
  payload: Partial<IBusiness>
): Promise<any> => {
  const business = await Business.findById(id);

  if (!business) {
    throw new AppError(StatusCodes.NOT_FOUND, "Business not found");
  }

  // Update fields
  Object.assign(business, payload);

  // Save (this triggers pre-save hook for encryption)
  await business.save();

  // Decrypt passwords before returning
  const businessObj = business.toObject();
  businessObj.socialMediaLinks = business.getDecryptedSocialMedia();

  return businessObj;
};

const deleteBusiness = async (id: string): Promise<void> => {
  const result = await Business.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Business not found");
  }
};

export const BusinessServices = {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
};
