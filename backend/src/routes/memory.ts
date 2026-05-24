import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.js";
import { z } from "zod";

const createMemorySchema = z.object({
  category: z.enum(["personal", "work", "learning", "projects", "tasks"]),
  title: z.string().min(1),
  content: z.string().min(1),
});

const updateMemorySchema = createMemorySchema.partial();

export default function memoryRoutes(prisma: PrismaClient) {
  const router = Router();

  router.post("/create", async (req: AuthRequest, res: Response) => {
    try {
      const body = createMemorySchema.parse(req.body);
      const userId = req.userId!;

      const memory = await prisma.memory.create({
        data: {
          userId,
          ...body,
        },
      });

      await prisma.analytics.updateMany({
        where: { userId },
        data: { memoryCount: { increment: 1 } },
      });

      res.json(memory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to create memory" });
    }
  });

  router.get("/list", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { category } = req.query;

      const memories = await prisma.memory.findMany({
        where: {
          userId,
          ...(category && { category: category as string }),
        },
        orderBy: { updatedAt: "desc" },
      });

      res.json(memories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch memories" });
    }
  });

  router.get("/:id", async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const memory = await prisma.memory.findFirst({
        where: { id, userId },
      });

      if (!memory) {
        return res.status(404).json({ error: "Memory not found" });
      }

      res.json(memory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch memory" });
    }
  });

  router.put("/:id", async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const body = updateMemorySchema.parse(req.body);

      const memory = await prisma.memory.findFirst({
        where: { id, userId },
      });

      if (!memory) {
        return res.status(404).json({ error: "Memory not found" });
      }

      const updated = await prisma.memory.update({
        where: { id },
        data: body,
      });

      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to update memory" });
    }
  });

  router.delete("/:id", async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const memory = await prisma.memory.findFirst({
        where: { id, userId },
      });

      if (!memory) {
        return res.status(404).json({ error: "Memory not found" });
      }

      await prisma.memory.delete({ where: { id } });

      await prisma.analytics.updateMany({
        where: { userId },
        data: { memoryCount: { decrement: 1 } },
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete memory" });
    }
  });

  router.get("/search/query", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { q } = req.query;

      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Query required" });
      }

      const memories = await prisma.memory.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
          ],
        },
      });

      res.json(memories);
    } catch (error) {
      res.status(500).json({ error: "Failed to search memories" });
    }
  });

  return router;
}
