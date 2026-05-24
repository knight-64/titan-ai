import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.js";
import { z } from "zod";
import { performSearch, researchTopic } from "../services/search.js";

const searchSchema = z.object({
  query: z.string().min(1).max(500),
});

const researchSchema = z.object({
  topic: z.string().min(1).max(500),
});

export default function searchRoutes(prisma: PrismaClient) {
  const router = Router();

  router.post("/search", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const body = searchSchema.parse(req.body);

      const results = await performSearch(body.query);

      // Optionally save search to database for analytics
      await prisma.searchHistory.create({
        data: {
          userId,
          query: body.query,
          resultCount: results.results.length,
        },
      }).catch(() => {
        // Table may not exist, ignore
      });

      res.json(results);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Search error:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  router.post("/research", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const body = researchSchema.parse(req.body);

      res.setHeader("Content-Type", "application/json");

      const research = await researchTopic(body.topic);
      res.json(research);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Research error:", error);
      res.status(500).json({ error: "Research failed" });
    }
  });

  return router;
}
