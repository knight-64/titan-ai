"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useVoiceRecognition } from "@/hooks/useVoice";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const voice = useVoiceRecognition({ continuous: false });
  const [supportsVoice, setSupportsVoice] = useState(false);

  useEffect(() => {
    setSupportsVoice(voice.browserSupportsSpeechRecognition);
  }, [voice.browserSupportsSpeechRecognition]);

  const handleVoiceInput = () => {
    if (!voice.isListening) {
      voice.resetTranscript();
      voice.startListening();
    } else {
      voice.stopListening();
      if (voice.transcript) {
        setInput(prev => (prev ? prev + " " + voice.transcript : voice.transcript));
        voice.resetTranscript();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {voice.transcript && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm text-cyan-300"
        >
          Recognized: {voice.transcript}
          {voice.interimTranscript && <span className="text-gray-400 italic"> {voice.interimTranscript}</span>}
        </motion.div>
      )}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder="Type or speak your message..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent disabled:opacity-50"
        />
        {supportsVoice && (
          <motion.button
            type="button"
            onClick={handleVoiceInput}
            disabled={disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-3 rounded-lg font-semibold transition ${
              voice.isListening
                ? "bg-red-500/30 text-red-300 border border-red-500/50 hover:shadow-lg hover:shadow-red-500/50"
                : "bg-purple-500/30 text-purple-300 border border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/50"
            }`}
          >
            {voice.isListening ? "🎤 Listening..." : "🎤"}
          </motion.button>
        )}
        <motion.button
          type="submit"
          disabled={disabled || !input.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-neon text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition disabled:opacity-50"
        >
          Send
        </motion.button>
      </div>
    </form>
  );
}
