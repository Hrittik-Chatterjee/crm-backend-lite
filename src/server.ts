import mongoose from "mongoose";
import app from "./app/app";
import envVars from "./app/config/env";
import { seedSuperAdmin } from "./app/config/seed";

let server: ReturnType<typeof app.listen>;

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(envVars.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully");

    // Seed super admin user
    await seedSuperAdmin();

    // Start the server
    server = app.listen(envVars.PORT, () => {
      console.log(`🚀 Server is running on port ${envVars.PORT}`);
      console.log(`🌍 Environment: ${envVars.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("❌ Unhandled Rejection! Shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("❌ Uncaught Exception! Shutting down...", err);
  process.exit(1);
});

// Graceful shutdown on SIGTERM
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("✅ Process terminated");
    });
  }
});

startServer();
