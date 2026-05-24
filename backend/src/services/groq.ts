import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function streamGroqResponse(
  messages: ChatMessage[],
  model: string = "llama-3.3-70b-versatile"
): Promise<AsyncIterable<string>> {
  const stream = await groq.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2048,
    stream: true,
  });

  return (async function* () {
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        yield content;
      }
    }
  })();
}

export async function generateGroqResponse(
  messages: ChatMessage[],
  model: string = "llama-3.3-70b-versatile"
): Promise<string> {
  const response = await groq.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2048,
  });

  return response.choices[0]?.message?.content || "";
}

export const GROQ_MODELS = {
  llama3_3_70b: "llama-3.3-70b-versatile",
  llama3_1_8b: "llama-3.1-8b-instant",
  mixtral: "mixtral-8x7b-32768",
};
