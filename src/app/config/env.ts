import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

interface EnvConfig {
  PORT: string;
  NODE_ENV: "development" | "production";
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_COOKIE_EXPIRES_IN: number;
  BCRYPT_SALT_ROUNDS: number;
  ENCRYPTION_KEY: string;
}

const envVars: EnvConfig = {
  PORT: process.env.PORT || "3000",
  NODE_ENV: (process.env.NODE_ENV as "development" | "production") || "development",
  MONGO_URI: process.env.DB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "2d",
  JWT_COOKIE_EXPIRES_IN: Number(process.env.JWT_COOKIE_EXPIRES_IN) || 2, // days
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
};

// Validate required environment variables
const requiredEnvVars: (keyof EnvConfig)[] = ["MONGO_URI"];

for (const envVar of requiredEnvVars) {
  if (!envVars[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default envVars;
