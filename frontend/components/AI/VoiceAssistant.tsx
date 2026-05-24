"use client";

import { useState, useCallback } from "react";
import { useVoiceAssistant } from "@/hooks/useVoice";
import axios from "axios";

export function VoiceAssistant() {
  const voice = useVoiceAssistant();
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [status, setStatus] = useState<string>("");

  const handleVoiceCommand = useCallback(async () => {
    if (!voice.browserSupportsSpeechRecognition) {
      setStatus("🎤 Speech Recognition not supported");
      return;
    }

    setStatus("🎤 Listening...");
    voice.resetTranscript();

    // Start listening
    voice.startListening();

    // Wait for speech
    await new Promise(resolve => setTimeout(resolve, 5000));

    voice.stopListening();

    if (voice.transcript) {
      const userInput = voice.transcript;
      setStatus("⏳ Processing...");

      try {
        // Send to chat API
        const response = await axios.post("/api/chat/send", {
          message: userInput,
          chatId: "voice-chat",
        });

        let assistantMessage = "";
        for await (const chunk of response.data) {
          assistantMessage += chunk;
        }

        setChatHistory(prev => [
          ...prev,
          { role: "user", content: userInput },
          { role: "assistant", content: assistantMessage },
        ]);

        // Speak response
        voice.speak(assistantMessage);
        setStatus("✅ Listening for next command");
      } catch (error) {
        setStatus("❌ Error processing command");
      }
    } else {
      setStatus("🎙️ Speak now...");
    }
  }, [voice]);

  const stopVoiceSession = useCallback(() => {
    voice.stopListening();
    voice.stop();
    setStatus("Stopped");
  }, [voice]);

  if (!voice.browserSupportsSpeechRecognition) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300">
        Voice assistant is not supported in your browser
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4 text-white">🎤 Voice Assistant</h3>

        {/* Status Indicator */}
        <div className="mb-4 text-center">
          <div
            className={`inline-block w-3 h-3 rounded-full mr-2 ${
              voice.isListening
                ? "bg-red-500 animate-pulse"
                : "bg-green-500"
            }`}
          />
          <span className="text-gray-300">{status || "Ready"}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleVoiceCommand}
            disabled={voice.isListening || voice.isSpeaking}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 transition"
          >
            {voice.isListening ? "🎙️ Listening..." : "Start Voice Chat"}
          </button>

          <button
            onClick={stopVoiceSession}
            disabled={!voice.isListening && !voice.isSpeaking}
            className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/30 disabled:opacity-50 transition"
          >
            Stop
          </button>
        </div>

        {/* Transcript Display */}
        {voice.transcript && (
          <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">You said:</p>
            <p className="text-white">{voice.transcript}</p>
          </div>
        )}

        {voice.interimTranscript && (
          <div className="mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Currently listening:</p>
            <p className="text-gray-300 italic">{voice.interimTranscript}</p>
          </div>
        )}
      </div>

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div className="space-y-2">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-100"
                  : "bg-purple-500/20 border border-purple-500/30 text-purple-100"
              }`}
            >
              <p className="font-semibold text-xs mb-1">
                {msg.role === "user" ? "👤 You" : "🤖 Titan"}
              </p>
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
