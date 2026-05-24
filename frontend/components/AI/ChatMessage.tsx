"use client";

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
      </div>
    </div>
  );
}
