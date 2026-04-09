import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "myschool_salt").digest("hex");
}

export function generateToken(userId: number, role: string, schoolId?: number | null): string {
  const payload = { userId, role, schoolId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function verifyToken(token: string): { userId: number; role: string; schoolId?: number | null } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Bad request", message: "identifier and password required" });
    }
    const hashedPassword = hashPassword(password);
    const [user] = await db.select().from(usersTable).where(
      or(eq(usersTable.email, identifier), eq(usersTable.phone, identifier))
    ).limit(1);

    if (!user || user.passwordHash !== hashedPassword) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    }
    if (!user.isActive) {
      return res.status(401).json({ error: "Unauthorized", message: "Account is inactive" });
    }
    const token = generateToken(user.id, user.role, user.schoolId);
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        schoolId: user.schoolId,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Login failed" });
  }
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized", message: "No token" });
  }
  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId)).limit(1);
    if (!user) return res.status(404).json({ error: "Not found", message: "User not found" });
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      schoolId: user.schoolId,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    });
  } catch {
    return res.status(500).json({ error: "Internal server error", message: "Failed to get user" });
  }
});

router.post("/logout", (_req, res) => {
  return res.json({ success: true, message: "Logged out" });
});

export default router;
