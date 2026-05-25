import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import memoryRoutes from "./routes/memory.js";
import aiRoutes from "./routes/ai.js";
import searchRoutes from "./routes/search.js";
import documentRoutes from "./routes/documents.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow any localhost port
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes(prisma));
app.use("/api/chat", authMiddleware(prisma), chatRoutes(prisma));
app.use("/api/memory", authMiddleware(prisma), memoryRoutes(prisma));
app.use("/api/ai", authMiddleware(prisma), aiRoutes(prisma));
app.use("/api/search", authMiddleware(prisma), searchRoutes(prisma));
app.use("/api/documents", authMiddleware(prisma), documentRoutes(prisma));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Titan Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export { app, prisma };
