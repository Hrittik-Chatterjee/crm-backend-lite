import { Document, Types } from "mongoose";
import { IUser } from "../user/user.interface";

// Social Media Platform Interface
export interface ISocialMediaPlatform {
  url?: string;
  username?: string;
  password?: string; // Will be encrypted in database
}

export interface ISocialMediaLinks {
  facebook?: ISocialMediaPlatform;
  instagram?: ISocialMediaPlatform;
  whatsApp?: ISocialMediaPlatform;
  youtube?: ISocialMediaPlatform;
  website?: string;
  tripAdvisor?: string;
  googleBusiness?: string;
}

export interface IBusiness extends Document {
  // Basic Information
  businessName: string;
  typeOfBusiness: string;
  country: string;
  package: string;
  entryDate: string;

  // Contact Information
  contactDetails?: string;
  email?: string;
  address?: string;

  // Social Media
  socialMediaLinks?: ISocialMediaLinks;

  // Additional Information
  note?: string;
  tags?: string;

  // Assignment (Multiple users per role)
  assignedCW?: (Types.ObjectId | IUser)[]; // Assigned Content Writers
  assignedCD?: (Types.ObjectId | IUser)[]; // Assigned Content Designers
  assignedVE?: (Types.ObjectId | IUser)[]; // Assigned Video Editors

  // Status
  status: boolean;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;

  // Method to decrypt passwords for viewing
  getDecryptedSocialMedia(): ISocialMediaLinks;
}
