import { model, Schema } from "mongoose";
import { IBusiness, ISocialMediaLinks } from "./business.interface";
import { encrypt, decrypt } from "../../utils/encryption";
import { PACKAGES, BUSINESS_TYPES } from "../../constants/business.constants";

// Sub-schema for social media platforms
const socialMediaPlatformSchema = new Schema(
  {
    url: { type: String, trim: true, default: "" },
    username: { type: String, trim: true, default: "" },
    password: { type: String, default: "" }, // Stored encrypted
  },
  { _id: false }
);

// Sub-schema for all social media links
const socialMediaLinksSchema = new Schema(
  {
    facebook: socialMediaPlatformSchema,
    instagram: socialMediaPlatformSchema,
    whatsApp: socialMediaPlatformSchema,
    youtube: socialMediaPlatformSchema,
    website: { type: String, trim: true, default: "" },
    tripAdvisor: { type: String, trim: true, default: "" },
    googleBusiness: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const businessSchema = new Schema<IBusiness>(
  {
    // Basic Information
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      index: true,
    },
    typeOfBusiness: {
      type: String,
      required: [true, "Type of business is required"],
      enum: {
        values: BUSINESS_TYPES,
        message: "{VALUE} is not a valid business type. Must be one of: " + BUSINESS_TYPES.join(", "),
      },
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    package: {
      type: String,
      required: [true, "Package is required"],
      enum: {
        values: PACKAGES,
        message: "{VALUE} is not a valid package. Must be one of: " + PACKAGES.join(", "),
      },
      trim: true,
    },
    entryDate: {
      type: String,
      required: [true, "Entry date is required"],
      trim: true,
    },

    // Contact Information
    contactDetails: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },

    // Social Media
    socialMediaLinks: {
      type: socialMediaLinksSchema,
      default: {},
    },

    // Additional Information
    note: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: String,
      trim: true,
      default: "",
    },

    // Assignment (Multiple users per role)
    assignedCW: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    assignedCD: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    assignedVE: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],

    // Status
    status: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook: Encrypt passwords before saving
businessSchema.pre("save", async function (next) {
  try {
    if (this.socialMediaLinks) {
      const platforms = ["facebook", "instagram", "whatsApp", "youtube"];

      for (const platform of platforms) {
        const socialPlatform = (this.socialMediaLinks as any)[platform];
        if (socialPlatform && socialPlatform.password) {
          // Only encrypt if password is not already encrypted (doesn't contain ':')
          if (!socialPlatform.password.includes(":")) {
            socialPlatform.password = encrypt(socialPlatform.password);
          }
        }
      }
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to get decrypted social media data
businessSchema.methods.getDecryptedSocialMedia = function (): ISocialMediaLinks {
  if (!this.socialMediaLinks) {
    return {};
  }

  const decrypted: any = { ...this.socialMediaLinks.toObject() };
  const platforms = ["facebook", "instagram", "whatsApp", "youtube"];

  for (const platform of platforms) {
    if (decrypted[platform] && decrypted[platform].password) {
      decrypted[platform].password = decrypt(decrypted[platform].password);
    }
  }

  return decrypted;
};

// Indexes for common queries
businessSchema.index({ businessName: 1, status: 1 });
businessSchema.index({ assignedCW: 1, status: 1 });
businessSchema.index({ assignedCD: 1, status: 1 });
businessSchema.index({ assignedVE: 1, status: 1 });

export const Business = model<IBusiness>("Business", businessSchema);
