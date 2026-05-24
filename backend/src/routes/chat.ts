import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.js";
import { streamGroqResponse, generateGroqResponse, GROQ_MODELS, ChatMessage } from "../services/groq.js";
import { z } from "zod";

const sendMessageSchema = z.object({
  chatId: z.string().optional(),
  message: z.string().min(1),
  aiMode: z.string().optional(),
});

export default function chatRoutes(prisma: PrismaClient) {
  const router = Router();

  router.post("/send", async (req: AuthRequest, res: Response) => {
    try {
      const body = sendMessageSchema.parse(req.body);
      const userId = req.userId!;

      let chatId = body.chatId;

      // Create chat if needed
      if (!chatId) {
        const chat = await prisma.chat.create({
          data: {
            userId,
            title: body.message.substring(0, 50) + "...",
          },
        });
        chatId = chat.id;
      }

      // Verify ownership
      const chat = await prisma.chat.findFirst({
        where: { id: chatId, userId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });

      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      // Save user message
      await prisma.message.create({
        data: {
          chatId,
          role: "user",
          content: body.message,
        },
      });

      // Get AI mode
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      const aiMode = body.aiMode || user?.aiMode || "friendly";

      // Build messages for Groq
      const systemPrompt = await getSystemPrompt(prisma, aiMode);
      const conversationMessages: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...chat.messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user", content: body.message },
      ];

      // Stream response
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let fullResponse = "";

      try {
        const stream = await streamGroqResponse(conversationMessages);

        for await (const chunk of stream) {
          fullResponse += chunk;
          res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        }

        // Save assistant message
        await prisma.message.create({
          data: {
            chatId,
            role: "assistant",
            content: fullResponse,
          },
        });

        // Update analytics
        await prisma.analytics.updateMany({
          where: { userId },
          data: {
            messageCount: { increment: 2 },
            lastActive: new Date(),
          },
        });

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } catch (streamError) {
        console.error("Stream error:", streamError);
        res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
        res.end();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  router.get("/history/:chatId", async (req: AuthRequest, res: Response) => {
    try {
      const { chatId } = req.params;
      const userId = req.userId!;

      const chat = await prisma.chat.findFirst({
        where: { id: chatId, userId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });

      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  router.get("/list", async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;

      const chats = await prisma.chat.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { messages: true } },
        },
        orderBy: { updatedAt: "desc" },
      });

      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chats" });
    }
  });

  return router;
}

async function getSystemPrompt(prisma: PrismaClient, mode: string): Promise<string> {
  const modeRecord = await prisma.aIMode.findUnique({
    where: { mode },
  });

  if (modeRecord) {
    return modeRecord.systemPrompt;
  }

  // Default prompts
  const prompts: Record<string, string> = {
    friendly:
      "You are Titan, a friendly and helpful AI assistant. Be warm, approachable, and conversational. Help users with their questions while being genuinely interested in their well-being.",
    professional:
      "You are Titan, a professional AI assistant. Be concise, formal, and business-focused. Provide clear, structured information suitable for professional environments.",
    mentor:
      "You are Titan, an expert mentor. Guide users through learning with thoughtful questions, insights, and encouragement. Help them grow and understand concepts deeply.",
    motivational:
      "You are Titan, an inspiring motivational assistant. Be energetic and positive. Help users overcome challenges and achieve their goals with enthusiasm and support.",
    funny:
      "You are Titan, a witty and humorous AI assistant. Use humor appropriately, make clever observations, and keep conversations light and entertaining while still being helpful.",
    coding:
      "You are Titan, an expert coding assistant. Provide clean, efficient code solutions. Explain concepts clearly and offer best practices for software development.",
  };

  return prompts[mode] || prompts.friendly;
}
