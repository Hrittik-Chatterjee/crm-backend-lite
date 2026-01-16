import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { Business } from "../business/business.model";

const createUser = async (payload: Partial<IUser>): Promise<IUser> => {
  const existingUser = await User.findOne({ username: payload.username });

  if (existingUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Username already exists");
  }

  // Note: Password is stored as plain text as per original implementation
  // In production, you should hash the password
  const user = await User.create(payload);
  return user;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 10, sortBy, sortOrder, search, role } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const sort: any = {};
  if (sortBy && sortOrder) {
    sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;
    // Add _id as secondary sort to ensure consistent ordering
    sort._id = sortOrder === "desc" ? -1 : 1;
  } else {
    // Default sort by _id to ensure consistent ordering
    sort._id = -1;
  }

  const filter: any = {};

  // Add role filter
  if (role && typeof role === "string" && role.trim() !== "") {
    filter.roles = role;
  }

  // Add search functionality
  if (search && typeof search === "string" && search.trim() !== "") {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [
      { username: searchRegex },
      { roles: searchRegex },
    ];
  }

  const users = await User.find(filter)
    .select("-password") // Exclude password field for security
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));
  const total = await User.countDocuments(filter);

  return {
    data: users,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
  };
};

const getUserById = async (id: string): Promise<IUser | null> => {
  const user = await User.findById(id).select("-password"); // Exclude password field for security

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Update fields
  Object.assign(user, payload);

  // Save will trigger the pre-save hook to hash password if modified
  await user.save();

  return user;
};

const deleteUser = async (id: string): Promise<void> => {
  const result = await User.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Remove deleted user from all business assignments
  await Business.updateMany(
    { assignedCW: id },
    { $pull: { assignedCW: id } }
  );
  await Business.updateMany(
    { assignedCD: id },
    { $pull: { assignedCD: id } }
  );
  await Business.updateMany(
    { assignedVE: id },
    { $pull: { assignedVE: id } }
  );
};

const getUserProfile = async (userId: string): Promise<IUser | null> => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
};
