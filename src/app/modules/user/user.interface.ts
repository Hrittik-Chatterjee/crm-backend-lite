import { Document } from "mongoose";

export enum UserRole {
  SUPER_ADMIN = "superadmin",
  ADMIN = "admin",
  CONTENT_WRITER = "contentwriter",
  CONTENT_DESIGNER = "contentdesigner",
  VIDEO_EDITOR = "videoeditor",
}

export interface IUser extends Document {
  username: string;
  password: string;
  roles: UserRole[];
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
