import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePasswords, generateToken } from "../utils/auth.js";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function authRoutes(prisma: PrismaClient) {
  const router = Router();

  router.post("/signup", async (req: Request, res: Response) => {
    try {
      const body = signupSchema.parse(req.body);

      const existing = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await hashPassword(body.password);

      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
          analytics: {
            create: {},
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      const token = generateToken(user.id);

      res.json({
        user,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Signup failed" });
    }
  });

  router.post("/login", async (req: Request, res: Response) => {
    try {
      const body = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: body.email },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
        },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const passwordMatch = await comparePasswords(
        body.password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user.id);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  return router;
}
