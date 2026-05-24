export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const OLLAMA_BASE_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "llama2";
const HEALTH_CHECK_TIMEOUT = 5000;

export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return response.ok;
  } catch (error) {
    console.log("Ollama not available:", error);
    return false;
  }
}

export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) throw new Error("Failed to fetch models");
    const data = (await response.json()) as any;
    return data.models?.map((m: any) => m.name) || [];
  } catch (error) {
    console.error("Error fetching Ollama models:", error);
    return [];
  }
}

export async function streamOllamaResponse(
  messages: ChatMessage[],
  model: string = DEFAULT_MODEL
): Promise<AsyncIterable<string>> {
  const systemPrompt = messages.find(m => m.role === "system")?.content || "";
  const userMessages = messages.filter(m => m.role !== "system");

  const prompt = userMessages
    .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  return (async function* () {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt: `${systemPrompt}\n\n${prompt}\n\nAssistant:`,
          stream: true,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        for (let i = 0; i < lines.length - 1; i++) {
          try {
            const json = JSON.parse(lines[i]) as any;
            if (json.response) {
              yield json.response;
            }
          } catch (e) {
            // Invalid JSON, skip
          }
        }

        buffer = lines[lines.length - 1];
      }

      if (buffer) {
        try {
          const json = JSON.parse(buffer) as any;
          if (json.response) {
            yield json.response;
          }
        } catch (e) {
          // Invalid JSON, skip
        }
      }
    } catch (error) {
      throw new Error(`Ollama streaming error: ${error}`);
    }
  })();
}

export async function generateOllamaResponse(
  messages: ChatMessage[],
  model: string = DEFAULT_MODEL
): Promise<string> {
  let result = "";
  const stream = await streamOllamaResponse(messages, model);

  for await (const chunk of stream) {
    result += chunk;
  }

  return result;
}

export const OLLAMA_MODELS = {
  llama2: "llama2",
  mistral: "mistral",
  neural_chat: "neural-chat",
  starling_lm: "starling-lm",
  zephyr: "zephyr",
  dolphin_mixtral: "dolphin-mixtral",
  openchat: "openchat",
  orca_mini: "orca-mini",
};
