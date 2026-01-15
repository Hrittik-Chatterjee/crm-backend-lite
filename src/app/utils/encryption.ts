import crypto from "crypto";
import envVars from "../config/env";

// AES-256 encryption algorithm
const ALGORITHM = "aes-256-cbc";
const ENCRYPTION_KEY = envVars.ENCRYPTION_KEY; // Must be 32 bytes (256 bits)
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypt sensitive data (like passwords)
 * @param text - Plain text to encrypt
 * @returns Encrypted string in format: iv:encryptedData
 */
export function encrypt(text: string): string {
  if (!text) return "";

  // Generate random initialization vector
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create cipher
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );

  // Encrypt the text
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return iv and encrypted data separated by ':'
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt sensitive data
 * @param encryptedText - Encrypted string in format: iv:encryptedData
 * @returns Decrypted plain text
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return "";

  try {
    // Split iv and encrypted data
    const parts = encryptedText.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted format");
    }

    const iv = Buffer.from(parts[0], "hex");
    const encryptedData = parts[1];

    // Create decipher
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, "hex"),
      iv
    );

    // Decrypt the text
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return "";
  }
}

/**
 * Generate a random encryption key (32 bytes = 64 hex characters)
 * Use this to generate a key for your .env file
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Example usage:
// const encrypted = encrypt("myPassword123");
// console.log("Encrypted:", encrypted);
// const decrypted = decrypt(encrypted);
// console.log("Decrypted:", decrypted);
