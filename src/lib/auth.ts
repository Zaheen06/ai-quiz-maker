import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./db";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(pw: string) { return bcrypt.hash(pw, 10); }
export async function verifyPassword(pw: string, hash: string) { return bcrypt.compare(pw, hash); }

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
export function verifyJwt<T = any>(token: string): T | null {
  try { return jwt.verify(token, JWT_SECRET) as T; } catch { return null; }
}

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  // Check for 'session' cookie first (new auth), then 'token' (legacy)
  const token = cookieStore.get("session")?.value || cookieStore.get("token")?.value;

  if (!token) return null;

  // Try verifying
  const decoded = verifyJwt<{ id?: number; email?: string }>(token);
  if (!decoded) return null;

  // If we have an ID (legacy or database ID), use it
  if (decoded.id) {
    return prisma.user.findUnique({ where: { id: decoded.id } });
  }

  // If we have an email (OAuth flow), use it
  if (decoded.email) {
    return prisma.user.findUnique({ where: { email: decoded.email } });
  }

  return null;
}
