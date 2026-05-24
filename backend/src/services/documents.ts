import fs from "fs";
import path from "path";
import { generateAIResponse, AIConfig } from "./aiRouter.js";

export interface DocumentAnalysis {
  fileName: string;
  fileType: string;
  size: number;
  summary: string;
  keyPoints: string[];
  extractedText: string;
}

const UPLOAD_DIR = "uploads";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "text/plain"];

export async function initializeUploadDir(): Promise<void> {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function validateFile(
  file: any,
  fileName: string
): Promise<{ valid: boolean; error?: string }> {
  if (!fileName) {
    return { valid: false, error: "File name is required" };
  }

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return { valid: false, error: `File type ${file.mimetype} not supported` };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size exceeds 50MB limit" };
  }

  return { valid: true };
}

export async function saveFile(
  file: any,
  fileName: string,
  userId: string
): Promise<string> {
  const userDir = path.join(UPLOAD_DIR, userId);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  const timestamp = Date.now();
  const ext = path.extname(fileName);
  const name = path.basename(fileName, ext);
  const filePath = path.join(userDir, `${name}-${timestamp}${ext}`);

  fs.writeFileSync(filePath, file.data);

  return filePath;
}

async function extractTextFromFile(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".txt") {
    return fs.readFileSync(filePath, "utf-8");
  }

  if ([".jpg", ".jpeg", ".png"].includes(ext)) {
    // For MVP, return placeholder
    // In production, use OCR library like Tesseract.js
    return `[Image file: ${path.basename(filePath)}]\nNote: Image OCR requires additional setup`;
  }

  if (ext === ".pdf") {
    // For MVP, return placeholder
    // In production, use PDF parser like pdfkit or pdf-parse
    return `[PDF file: ${path.basename(filePath)}]\nNote: PDF parsing requires additional setup`;
  }

  return "";
}

export async function analyzeDocument(
  filePath: string,
  fileName: string
): Promise<DocumentAnalysis> {
  const fileStats = fs.statSync(filePath);
  const extractedText = await extractTextFromFile(filePath);

  // Generate summary and key points using AI
  const summaryPrompt = `Analyze this document and provide a brief summary and 3 key points:\n\n${extractedText.substring(0, 2000)}`;

  const config: AIConfig = {
    provider: "auto",
    temperature: 0.6,
    maxTokens: 400,
  };

  const analysis = await generateAIResponse(
    [{ role: "user", content: summaryPrompt }],
    config
  );

  const keyPoints = analysis
    .split("\n")
    .filter(line => line.match(/^\d+\.|^-|^•/))
    .map(line => line.replace(/^[\d+.•-]\s*/, "").trim())
    .slice(0, 3);

  return {
    fileName,
    fileType: path.extname(fileName).toLowerCase().substring(1),
    size: fileStats.size,
    summary: analysis.split("\n").slice(0, 3).join("\n").trim(),
    keyPoints,
    extractedText: extractedText.substring(0, 1000),
  };
}

export async function questionDocument(
  filePath: string,
  question: string
): Promise<string> {
  const extractedText = await extractTextFromFile(filePath);

  const qaPrompt = `Based on this document:\n\n${extractedText.substring(0, 3000)}\n\nAnswer this question: ${question}`;

  const config: AIConfig = {
    provider: "auto",
    temperature: 0.7,
    maxTokens: 500,
  };

  const answer = await generateAIResponse(
    [{ role: "user", content: qaPrompt }],
    config
  );

  return answer;
}

export function deleteFile(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}
