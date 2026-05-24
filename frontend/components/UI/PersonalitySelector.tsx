"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PersonalitySelectorProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
}

const modes = [
  { id: "friendly", label: "Friendly", emoji: "😊" },
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "mentor", label: "Mentor", emoji: "🎓" },
  { id: "motivational", label: "Motivational", emoji: "🚀" },
  { id: "funny", label: "Funny", emoji: "😂" },
  { id: "coding", label: "Coding", emoji: "💻" },
];

export default function PersonalitySelector({
  currentMode,
  onModeChange,
}: PersonalitySelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 glassmorphism px-4 py-2 rounded-lg hover:border-accent transition"
      >
        <span className="text-lg">
          {modes.find((m) => m.id === currentMode)?.emoji || "🤖"}
        </span>
        <span className="text-sm font-medium capitalize hidden sm:inline">
          {currentMode}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 glassmorphism rounded-lg p-3 space-y-2 z-50 min-w-max"
          >
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  onModeChange(mode.id);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg transition ${
                  currentMode === mode.id
                    ? "bg-gradient-neon text-black"
                    : "hover:bg-white/10"
                }`}
              >
                <span className="text-lg">{mode.emoji}</span>
                <span className="font-medium">{mode.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
