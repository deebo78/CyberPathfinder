import { db } from "./db";
import { users, userSessions, type User, type InsertUser } from "@shared/schema";
import { eq, and, gt, lt, ne } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 12;
const SESSION_DURATION_DAYS = 7;
const IDLE_TIMEOUT_MINUTES = 30; // Logout after 30 minutes of inactivity

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

function generateTempPassword(): string {
  return crypto.randomBytes(8).toString('base64').slice(0, 12);
}

export async function createUser(email: string, role: string = 'user', displayName?: string): Promise<{ user: User; tempPassword: string }> {
  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);
  
  const [user] = await db.insert(users).values({
    email: email.toLowerCase().trim(),
    passwordHash,
    role,
    displayName: displayName || email.split('@')[0],
    mustChangePassword: true,
    isActive: true,
  }).returning();
  
  return { user, tempPassword };
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
  return user || undefined;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user || undefined;
}

export async function getAllUsers(): Promise<User[]> {
  return db.select().from(users).orderBy(users.createdAt);
}

export async function updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
  const [updated] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
  return updated || undefined;
}

export async function deleteUser(id: number): Promise<boolean> {
  await db.delete(userSessions).where(eq(userSessions.userId, id));
  const result = await db.delete(users).where(eq(users.id, id)).returning();
  return result.length > 0;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  
  if (!user || !user.isActive) {
    return null;
  }
  
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }
  
  await db.update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));
  
  return user;
}

export async function changePassword(userId: number, newPassword: string, currentSessionId?: string): Promise<boolean> {
  const passwordHash = await hashPassword(newPassword);
  
  const [updated] = await db.update(users)
    .set({ 
      passwordHash, 
      mustChangePassword: false 
    })
    .where(eq(users.id, userId))
    .returning();
  
  if (updated) {
    // Invalidate all sessions for security (except current session if provided)
    if (currentSessionId) {
      // Delete all sessions except the current one
      await db.delete(userSessions)
        .where(
          and(
            eq(userSessions.userId, userId),
            ne(userSessions.sessionId, currentSessionId)
          )
        );
    } else {
      // No current session specified, invalidate all
      await deleteAllUserSessions(userId);
    }
  }
  
  return !!updated;
}

export async function resetUserPassword(userId: number): Promise<string | null> {
  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);
  
  const [updated] = await db.update(users)
    .set({ 
      passwordHash, 
      mustChangePassword: true 
    })
    .where(eq(users.id, userId))
    .returning();
  
  return updated ? tempPassword : null;
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = generateSessionId();
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);
  
  await db.insert(userSessions).values({
    sessionId,
    userId,
    expiresAt,
    lastActiveAt: now, // Initialize for idle timeout tracking
  });
  
  return sessionId;
}

export async function validateSession(sessionId: string): Promise<User | null> {
  const now = new Date();
  
  const [session] = await db.select()
    .from(userSessions)
    .where(
      and(
        eq(userSessions.sessionId, sessionId),
        gt(userSessions.expiresAt, now)
      )
    );
  
  if (!session) {
    return null;
  }
  
  // Check idle timeout - if no activity for 30 minutes, session is invalid
  if (session.lastActiveAt) {
    const idleThreshold = new Date(now.getTime() - IDLE_TIMEOUT_MINUTES * 60 * 1000);
    if (session.lastActiveAt < idleThreshold) {
      // Session has been idle too long, delete it
      await deleteSession(sessionId);
      return null;
    }
  }
  
  const user = await getUserById(session.userId);
  if (!user || !user.isActive) {
    return null;
  }
  
  return user;
}

export async function updateSessionActivity(sessionId: string): Promise<void> {
  await db.update(userSessions)
    .set({ lastActiveAt: new Date() })
    .where(eq(userSessions.sessionId, sessionId));
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  const result = await db.delete(userSessions)
    .where(eq(userSessions.sessionId, sessionId))
    .returning();
  return result.length > 0;
}

export async function deleteAllUserSessions(userId: number): Promise<void> {
  await db.delete(userSessions).where(eq(userSessions.userId, userId));
}

export async function cleanupExpiredSessions(): Promise<void> {
  const now = new Date();
  await db.delete(userSessions).where(lt(userSessions.expiresAt, now));
}

export function sanitizeUser(user: User): Omit<User, 'passwordHash'> {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
