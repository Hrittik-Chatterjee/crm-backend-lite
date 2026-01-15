import { Document, Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { IBusiness } from "../business/business.interface";

// Content type classification enum
export enum ContentType {
  VIDEO = "video",   // Only for Video Editor
  POSTER = "poster", // Only for Content Designer
  BOTH = "both",     // For both CD and VE
}

export interface IRegularContent extends Document {
  // Business Information
  business: Types.ObjectId | IBusiness; // Reference to Business/Client
  date: string; // Content date (format: MM/DD/YYYY)

  // Content Type Classification
  contentType: ContentType; // Type of content: video, poster, or both

  // Content Details
  postMaterial?: string; // Main social media post content/caption
  tags?: string; // Social media tags and hashtags

  // Video-Specific Content
  videoMaterial?: string; // Video script/content for video editor

  // Design Instructions
  vision?: string; // Design vision/instructions for content designer
  posterMaterial?: string; // Poster/graphic content text

  // Internal Notes
  comments?: string; // Additional comments/notes from team

  // Assignment & Status
  addedBy: Types.ObjectId | IUser; // User who created this content
  assignedCD: Types.ObjectId | IUser; // Assigned Content Designer
  assignedCW: Types.ObjectId | IUser; // Assigned Content Writer
  assignedVE?: Types.ObjectId | IUser; // Assigned Video Editor (optional)
  status: boolean; // Active/Inactive status

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Query parameters interface for filtering regular contents
export interface IRegularContentQueryParams {
  date?: string; // Filter by specific date (format: MM/DD/YYYY)
  todayOnly?: string; // Filter for today's content only ('true'/'false')
  business?: string; // Filter by business ID
  assignedCD?: string; // Filter by assigned Content Designer
  assignedCW?: string; // Filter by assigned Content Writer
  assignedVE?: string; // Filter by assigned Video Editor
  addedBy?: string; // Filter by user who added the content
  status?: string; // Filter by status ('true'/'false')
  contentType?: string; // Filter by content type (video/poster/both)
  page?: string; // Page number for pagination
  limit?: string; // Number of items per page
  sortBy?: string; // Sort field (default: 'date')
  sortOrder?: string; // Sort order ('asc'/'desc', default: 'desc')
}

// Response interface for paginated results
export interface IRegularContentPaginatedResponse {
  contents: IRegularContent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
