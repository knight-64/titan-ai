import { generateGroqResponse, streamGroqResponse, ChatMessage as GroqMessage } from "./groq.js";
import { generateOllamaResponse, streamOllamaResponse, isOllamaAvailable, ChatMessage as OllamaMessage } from "./ollama.js";

export type AIProvider = "groq" | "ollama" | "auto";

export interface AIConfig {
  provider: AIProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

let cachedOllamaStatus: { available: boolean; lastCheck: number } = {
  available: false,
  lastCheck: 0,
};

const OLLAMA_CHECK_INTERVAL = 30000; // Check every 30 seconds

async function checkOllamaAvailability(): Promise<boolean> {
  const now = Date.now();

  // Use cached status if recent
  if (now - cachedOllamaStatus.lastCheck < OLLAMA_CHECK_INTERVAL) {
    return cachedOllamaStatus.available;
  }

  const available = await isOllamaAvailable();
  cachedOllamaStatus = { available, lastCheck: now };

  return available;
}

export async function selectProvider(config: AIConfig): Promise<AIProvider> {
  if (config.provider === "groq") return "groq";
  if (config.provider === "ollama") return "ollama";

  // Auto mode: try Ollama first (offline), fallback to Groq
  const ollamaAvailable = await checkOllamaAvailability();

  if (ollamaAvailable) {
    console.log("📡 Using Ollama (offline mode)");
    return "ollama";
  }

  console.log("☁️ Using Groq (cloud mode)");
  return "groq";
}

export async function streamAIResponse(
  messages: ChatMessage[],
  config: AIConfig
): Promise<AsyncIterable<string>> {
  const provider = await selectProvider(config);

  try {
    if (provider === "ollama") {
      return await streamOllamaResponse(messages as OllamaMessage[], config.model);
    } else {
      return await streamGroqResponse(messages as GroqMessage[], config.model);
    }
  } catch (error) {
    console.error(`Error with ${provider}:`, error);

    // Fallback to opposite provider
    if (provider === "ollama") {
      console.log("⚠️ Ollama failed, falling back to Groq");
      return await streamGroqResponse(messages as GroqMessage[], config.model);
    } else {
      const ollamaAvailable = await isOllamaAvailable();
      if (ollamaAvailable) {
        console.log("⚠️ Groq failed, falling back to Ollama");
        return await streamOllamaResponse(messages as OllamaMessage[], config.model);
      }
      throw error;
    }
  }
}

export async function generateAIResponse(
  messages: ChatMessage[],
  config: AIConfig
): Promise<string> {
  let result = "";
  const stream = await streamAIResponse(messages, config);

  for await (const chunk of stream) {
    result += chunk;
  }

  return result;
}

export async function getProviderStatus(): Promise<{
  groq: boolean;
  ollama: boolean;
  activeProvider: AIProvider;
}> {
  // Groq is always available if API key is set
  const groqAvailable = !!process.env.GROQ_API_KEY;
  const ollamaAvailable = await isOllamaAvailable();

  const activeProvider = ollamaAvailable ? "ollama" : groqAvailable ? "groq" : "none" as any;

  return {
    groq: groqAvailable,
    ollama: ollamaAvailable,
    activeProvider,
  };
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
