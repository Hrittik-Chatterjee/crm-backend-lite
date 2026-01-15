import jwt from "jsonwebtoken";
import envVars from "../config/env";

export const generateToken = (payload: object, expiresIn?: string): string => {
  return jwt.sign(payload, envVars.JWT_SECRET, {
    expiresIn: expiresIn || envVars.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, envVars.JWT_SECRET);
};
