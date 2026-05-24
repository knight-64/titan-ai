"use client";

import { useState } from "react";
import { AIProviderSelector } from "@/components/AI/AIProviderSelector";
import { SearchComponent } from "@/components/AI/SearchComponent";
import { DocumentUploader } from "@/components/AI/DocumentUploader";
import { VoiceAssistant } from "@/components/AI/VoiceAssistant";

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState<"provider" | "search" | "documents" | "voice">(
    "provider"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <div className="bg-black/50 border-b border-purple-500/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🚀 Titan AI Tools
          </h1>
          <p className="text-gray-400">Advanced AI features powered by cloud & local models</p>
        </div>
      </div>

      {/* AI Provider Status */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <AIProviderSelector />
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: "search", label: "🔍 Search", icon: "search" },
            { key: "documents", label: "📄 Documents", icon: "documents" },
            { key: "voice", label: "🎤 Voice", icon: "voice" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/50"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="pb-12">
          {/* Search */}
          {activeTab === "search" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">🔍 Internet Search & Research</h2>
              <SearchComponent />
            </div>
          )}

          {/* Documents */}
          {activeTab === "documents" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">📄 Document Analysis</h2>
              <DocumentUploader />
            </div>
          )}

          {/* Voice */}
          {activeTab === "voice" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">🎤 Voice Assistant</h2>
              <VoiceAssistant />
            </div>
          )}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-4 py-12 border-t border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-white">Available Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: "🔍",
              title: "Web Search",
              description: "Search the internet with AI-powered summaries",
            },
            {
              icon: "🧠",
              title: "Deep Research",
              description: "Multi-source research with AI analysis",
            },
            {
              icon: "📄",
              title: "Document Analysis",
              description: "Upload PDFs, images, or text for analysis",
            },
            {
              icon: "❓",
              title: "Document Q&A",
              description: "Ask questions about your documents",
            },
            {
              icon: "🎤",
              title: "Voice Input",
              description: "Speak commands naturally to the AI",
            },
            {
              icon: "🔊",
              title: "Voice Output",
              description: "Hear responses from the AI assistant",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg hover:border-cyan-500/50 transition"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
