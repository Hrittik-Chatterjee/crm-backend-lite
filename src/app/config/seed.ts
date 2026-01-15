import { User } from "../modules/user/user.model";
import { UserRole } from "../modules/user/user.interface";

export async function seedSuperAdmin() {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({
      roles: { $in: [UserRole.SUPER_ADMIN] },
    });

    if (existingSuperAdmin) {
      console.log("ℹ️  Super Admin already exists. Skipping creation.");
      return;
    }

    // Create super admin
    await User.create({
      username: "superadmin",
      password: "Super123", // Will be automatically hashed by pre-save hook
      roles: [UserRole.SUPER_ADMIN],
    });

    console.log("✅ Super Admin created successfully");
    console.log("📝 Username: superadmin");
    console.log("🔑 Password: Super123");
    console.log("⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("❌ Error creating Super Admin:", error);
    throw error;
  }
}
