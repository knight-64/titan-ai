"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supportsTTS, setSupportsTTS] = useState(false);

  useEffect(() => {
    setSupportsTTS(typeof window !== "undefined" && !!window.speechSynthesis);
  }, []);

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
          isUser
            ? "bg-gradient-neon text-black rounded-br-none"
            : "glassmorphism rounded-bl-none"
        }`}
      >
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={dracula}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-white/10 px-2 py-1 rounded" {...props}>
                    {children}
                  </code>
                );
              },
              h1: ({ node, ...props }: any) => <h1 className="text-xl font-bold my-2" {...props} />,
              h2: ({ node, ...props }: any) => <h2 className="text-lg font-bold my-2" {...props} />,
              h3: ({ node, ...props }: any) => <h3 className="text-base font-bold my-2" {...props} />,
              p: ({ node, ...props }: any) => <p className="my-1" {...props} />,
              ul: ({ node, ...props }: any) => <ul className="list-disc list-inside my-2" {...props} />,
              ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside my-2" {...props} />,
              li: ({ node, ...props }: any) => <li className="my-1" {...props} />,
              a: ({ node, ...props }: any) => (
                <a className="text-accent hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {!isUser && supportsTTS && (
          <button
            onClick={handleSpeak}
            className={`mt-2 text-xs px-2 py-1 rounded transition ${
              isSpeaking
                ? "bg-red-500/30 text-red-300 border border-red-500/50"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {isSpeaking ? "🔊 Stop" : "🔊 Speak"}
          </button>
        )}
      </div>
    </div>
  );
}
