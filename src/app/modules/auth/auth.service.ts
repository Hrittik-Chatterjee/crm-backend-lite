import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { generateToken } from "../../utils/jwt";
import { User } from "../user/user.model";

interface ILoginPayload {
  username: string;
  password: string;
}

interface ILoginResponse {
  token: string;
  user: {
    _id: string;
    username: string;
    roles: string[];
  };
}

const login = async (payload: ILoginPayload): Promise<ILoginResponse> => {
  const { username, password } = payload;

  // Find user with password field
  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "Invalid username or password");
  }

  // Compare password using bcrypt
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid username or password");
  }

  // Generate JWT token
  const userId = String(user._id);
  const jwtPayload = {
    id: userId,
    username: user.username,
    roles: user.roles,
  };

  const token = generateToken(jwtPayload);

  return {
    token,
    user: {
      _id: userId,
      username: user.username,
      roles: user.roles,
    },
  };
};

export const AuthServices = {
  login,
};
