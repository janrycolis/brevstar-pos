import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source.js";
import { Staff } from "../entities/Staff.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      staff?: Staff;
    }
  }
}

export function signToken(staff: Staff): string {
  const payload: AuthPayload = {
    id: staff.id,
    email: staff.email,
    role: staff.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    const staff = await AppDataSource.getRepository(Staff).findOneBy({
      id: payload.id,
    });

    if (!staff || !staff.isActive) {
      res.status(401).json({ error: "Invalid or inactive account" });
      return;
    }

    req.staff = staff;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
