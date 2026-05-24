"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface ProviderStatus {
  groq: boolean;
  ollama: boolean;
  activeProvider: string;
}

export function AIProviderSelector() {
  const [status, setStatus] = useState<ProviderStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderStatus();
    const interval = setInterval(fetchProviderStatus, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchProviderStatus = async () => {
    try {
      const response = await axios.get("/api/ai/providers");
      setStatus(response.data);
    } catch (error) {
      console.error("Failed to fetch provider status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;
  if (!status) return null;

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="text-xs font-semibold text-gray-300">AI Provider:</div>

        {/* Groq Status */}
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              status.groq ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-gray-400">Groq</span>
        </div>

        {/* Ollama Status */}
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              status.ollama ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-gray-400">Ollama</span>
        </div>

        {/* Active Provider Badge */}
        <div className="ml-auto">
          <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
            {status.activeProvider === "ollama" ? "📡 Local" : "☁️ Cloud"}
          </span>
        </div>
      </div>
    </div>
  );
}
