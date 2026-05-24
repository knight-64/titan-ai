import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.js";
import { z } from "zod";
import { getProviderStatus, AIConfig, streamAIResponse } from "../services/aiRouter.js";
import { getAvailableModels } from "../services/ollama.js";

const updateAIModeSchema = z.object({
  aiMode: z.enum(["friendly", "professional", "mentor", "motivational", "funny", "coding"]),
});

const setPreferredProviderSchema = z.object({
  provider: z.enum(["groq", "ollama", "auto"]),
});

export default function aiRoutes(prisma: PrismaClient) {
  const router = Router();

  router.get("/modes", async (req: AuthRequest, res: Response) => {
    try {
      const modes = await prisma.aIMode.findMany();
      res.json(modes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch modes" });
    }
  });

  router.get("/current", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      res.json({ mode: user?.aiMode });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch current mode" });
    }
  });

  router.put("/mode", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const body = updateAIModeSchema.parse(req.body);

      const updated = await prisma.user.update({
        where: { id: userId },
        data: { aiMode: body.aiMode },
        select: { id: true, aiMode: true },
      });

      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to update mode" });
    }
  });

  router.get("/profile", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          aiMode: true,
          createdAt: true,
        },
      });

      const analytics = await prisma.analytics.findUnique({
        where: { userId },
      });

      res.json({
        user,
        analytics,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Hybrid AI System Endpoints
  router.get("/providers", async (req: AuthRequest, res: Response) => {
    try {
      const status = await getProviderStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch provider status" });
    }
  });

  router.get("/providers/models", async (req: AuthRequest, res: Response) => {
    try {
      const ollamaModels = await getAvailableModels();
      res.json({
        groq: ["llama3-70b-8192", "mixtral-8x7b-32768", "gemma-7b-it"],
        ollama: ollamaModels,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch available models" });
    }
  });

  router.post("/providers/set", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const body = setPreferredProviderSchema.parse(req.body);

      // Store user preference (can extend User model to include aiProvider preference)
      res.json({ success: true, provider: body.provider });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to set provider" });
    }
  });

  return router;
}
