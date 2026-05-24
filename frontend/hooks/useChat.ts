"use client";

import { useState, useCallback } from "react";
import axios from "axios";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string, chatId?: string, aiMode?: string) => {
      if (!content.trim()) return;

      setError(null);
      const userMessage: Message = {
        id: Math.random().toString(),
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await fetch(`${API_URL}/api/chat/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatId,
            message: content,
            aiMode,
          }),
        });

        if (!response.ok) throw new Error("Failed to send message");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        let assistantMessage = "";
        const decoder = new TextDecoder();

        const assistantMsg: Message = {
          id: Math.random().toString(),
          role: "assistant",
          content: "",
        };

        setMessages((prev) => [...prev, assistantMsg]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  assistantMessage += data.content;
                  setMessages((prev) => [
                    ...prev.slice(0, -1),
                    { ...assistantMsg, content: assistantMessage },
                  ]);
                }
              } catch (e) {
                // Parse error
              }
            }
          }
        }

        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to send message");
        setLoading(false);
      }
    },
    []
  );

  return { messages, loading, error, sendMessage, setMessages };
}
