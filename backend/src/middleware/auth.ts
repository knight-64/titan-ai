import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (prisma: PrismaClient) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret"
          ) as { userId: string };

          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
          });

          if (user) {
            req.userId = decoded.userId;
            return next();
          }
        } catch (e) {
          // invalid token — fall through to guest handling
        }
      }

      // No token or invalid token: provide a guest user so unauthenticated users
      // can still access features like chat without signing up.
      const guestEmail = process.env.GUEST_EMAIL || "guest@titan.local";
      let guest = await prisma.user.findUnique({ where: { email: guestEmail } });
      if (!guest) {
        const randomPassword = `guest-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
        const hashed = await bcryptjs.hash(randomPassword, 10);
        guest = await prisma.user.create({
          data: {
            email: guestEmail,
            password: hashed,
            name: "Guest",
            analytics: { create: {} },
          },
        });
      }

      req.userId = guest.id;
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  };
};
