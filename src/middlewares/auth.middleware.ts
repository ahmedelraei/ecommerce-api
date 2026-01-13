import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { env } from "src/config/env.js";
import { UserRole } from "src/enums/user.enums.js";

export interface AuthenticatedUserPayload extends JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUserPayload;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  console.log(req.cookies);
  const token = req.cookies?.accessToken ?? null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      env.jwt.secret
    ) as AuthenticatedUserPayload;
    req.user = decoded;
    return next();
  } catch (error) {
    console.error("JWT verification failed", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
