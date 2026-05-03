import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../routes/auth.js";

export interface AuthRequest extends Request {
  user?: { userId: number; role: string; schoolId?: number | null };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized", message: "Authentication required" });
  }
  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid or expired token" });
  }
  req.user = payload;
  return next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden", message: "Insufficient permissions" });
    }
    return next();
  };
}
