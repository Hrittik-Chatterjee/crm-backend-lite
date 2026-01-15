import { model, Schema } from "mongoose";
import { IRegularContent } from "./regularContent.interface";

const regularContentSchema = new Schema<IRegularContent>(
  {
    // Business Information
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business", // Reference to Business model
      required: [true, "Business/Client is required"],
      index: true, // Index for faster queries by business
    },
    date: {
      type: String,
      required: [true, "Content date is required"],
      trim: true,
      index: true, // Index for date-based queries
    },

    // Content Type Classification
    contentType: {
      type: String,
      enum: ["video", "poster", "both"],
      required: [true, "Content type is required"],
      index: true, // Index for filtering by content type
    },

    // Content Details
    postMaterial: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: String,
      trim: true,
      default: "",
    },

    // Video-Specific Content
    videoMaterial: {
      type: String,
      trim: true,
      default: "",
    },

    // Design Instructions
    vision: {
      type: String,
      trim: true,
      default: "",
    },
    posterMaterial: {
      type: String,
      trim: true,
      default: "",
    },

    // Internal Notes
    comments: {
      type: String,
      trim: true,
      default: "",
    },

    // Assignment & Status
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: [true, "Added by user is required"],
      index: true,
    },
    assignedCD: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User model (Content Designer)
      required: false, // Optional - allows admin to create content without assigned designer
      index: true,
    },
    assignedCW: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User model (Content Writer)
      required: false, // Optional - allows admin to create content without assigned writer
      index: true,
    },
    assignedVE: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User model (Video Editor)
      required: false,
      index: true,
    },
    status: {
      type: Boolean,
      default: false,
      index: true, // Index for filtering by status
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound indexes for common queries
regularContentSchema.index({ date: 1 }); // Fast date-only queries for dashboard
regularContentSchema.index({ business: 1, status: 1 }); // Content by business + status
regularContentSchema.index({ status: 1, createdAt: -1 }); // Active content, newest first
regularContentSchema.index({ assignedCD: 1, status: 1 }); // Content by designer + status
regularContentSchema.index({ assignedCW: 1, status: 1 }); // Content by writer + status
regularContentSchema.index({ assignedVE: 1, status: 1 }); // Content by video editor + status
regularContentSchema.index({ date: 1, business: 1 }); // Date-based queries per business
regularContentSchema.index({ assignedCD: 1, contentType: 1, status: 1 }); // Designer content by type
regularContentSchema.index({ assignedVE: 1, contentType: 1, status: 1 }); // Video editor content by type
regularContentSchema.index({ contentType: 1, status: 1, createdAt: -1 }); // Content type filtering

export const RegularContent = model<IRegularContent>(
  "RegularContent",
  regularContentSchema
);
