// src/utils/password.ts
import crypto from "crypto";

export function generateOnetimePassword(): string {
  // Generate a 12-character random password
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  const randomBytes = crypto.randomBytes(12);
  
  for (let i = 0; i < 12; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  
  return password;
}