import { Router, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.js";
import { z } from "zod";
import {
  initializeUploadDir,
  validateFile,
  saveFile,
  analyzeDocument,
  questionDocument,
  deleteFile,
} from "../services/documents.js";

const questionSchema = z.object({
  question: z.string().min(1).max(1000),
});

export default function documentRoutes(prisma: PrismaClient) {
  const router = Router();

  // Initialize upload directory
  initializeUploadDir().catch(console.error);

  router.post("/upload", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const files = req.files as any;

      if (!files || !files.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      const fileName = file.name as string;

      // Validate file
      const validation = await validateFile(file, fileName);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      // Save file
      const filePath = await saveFile(file, fileName, userId);

      // Analyze document
      const analysis = await analyzeDocument(filePath, fileName);

      // Optionally save to database
      const savedDoc = await prisma.document
        .create({
          data: {
            userId,
            fileName: analysis.fileName,
            fileType: analysis.fileType,
            size: analysis.size,
            filePath,
            summary: analysis.summary,
          },
        })
        .catch(() => {
          // Table may not exist
          return null;
        });

      res.json({
        ...analysis,
        documentId: savedDoc?.id,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "File upload failed" });
    }
  });

  router.post("/question/:documentId", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { documentId } = req.params;
      const body = questionSchema.parse(req.body);

      // Get document
      const doc = await prisma.document
        .findFirst({
          where: { id: documentId, userId },
        })
        .catch(() => null);

      if (!doc) {
        return res.status(404).json({ error: "Document not found" });
      }

      // Get answer
      const answer = await questionDocument(doc.filePath, body.question);

      res.json({ question: body.question, answer });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Question error:", error);
      res.status(500).json({ error: "Failed to answer question" });
    }
  });

  router.delete("/:documentId", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { documentId } = req.params;

      // Get and delete document
      const doc = await prisma.document
        .findFirst({
          where: { id: documentId, userId },
        })
        .catch(() => null);

      if (!doc) {
        return res.status(404).json({ error: "Document not found" });
      }

      deleteFile(doc.filePath);

      await prisma.document
        .delete({
          where: { id: documentId },
        })
        .catch(() => {});

      res.json({ success: true });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  router.get("/list", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;

      const documents = await prisma.document
        .findMany({
          where: { userId },
          select: {
            id: true,
            fileName: true,
            fileType: true,
            size: true,
            summary: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        })
        .catch(() => []);

      res.json(documents);
    } catch (error) {
      console.error("List error:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  return router;
}
