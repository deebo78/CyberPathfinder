import bcrypt from "bcryptjs";
import { db } from "../server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function createInitialAdmin() {
  const adminEmail = process.argv[2] || "admin@cyberpathfinder.com";
  const adminPassword = process.argv[3] || generateTempPassword();
  
  console.log("Creating initial admin account...\n");
  
  const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
  
  if (existingAdmin.length > 0) {
    console.log(`Admin user with email ${adminEmail} already exists.`);
    console.log("If you need to reset the password, use the reset password functionality in the app.");
    process.exit(0);
  }
  
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  
  const [newAdmin] = await db.insert(users).values({
    email: adminEmail,
    passwordHash,
    role: "admin",
    displayName: "Administrator",
    mustChangePassword: true,
    isActive: true,
  }).returning();
  
  console.log("✅ Initial admin account created successfully!\n");
  console.log("----------------------------------------");
  console.log(`Email:     ${adminEmail}`);
  console.log(`Password:  ${adminPassword}`);
  console.log("----------------------------------------\n");
  console.log("⚠️  IMPORTANT: Save this password now!");
  console.log("The user will be prompted to change it on first login.\n");
  
  process.exit(0);
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

createInitialAdmin().catch((error) => {
  console.error("Failed to create admin:", error);
  process.exit(1);
});
