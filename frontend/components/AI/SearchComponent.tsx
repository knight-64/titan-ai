"use client";

import { useState } from "react";
import axios from "axios";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  summary: string;
  sources: string[];
}

export function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"search" | "research">("search");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const endpoint = mode === "research" ? "/api/search/research" : "/api/search/search";
      const response = await axios.post(endpoint, {
        [mode === "research" ? "topic" : "query"]: query
      });
      setResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setMode("search")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
              mode === "search"
                ? "bg-cyan-500 text-black"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            🔍 Quick Search
          </button>
          <button
            type="button"
            onClick={() => setMode("research")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
              mode === "research"
                ? "bg-purple-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            🧠 Deep Research
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === "research" ? "Research a topic..." : "Search the web..."}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {results && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2 text-white">Summary</h3>
            <p className="text-gray-300">{results.summary}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-white">Results ({results.results.length})</h3>
            {results.results.map((result, i) => (
              <a
                key={i}
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-cyan-500 transition group"
              >
                <div className="font-semibold text-cyan-400 group-hover:text-cyan-300 transition line-clamp-2">
                  {result.title}
                </div>
                <div className="text-xs text-gray-500 mb-1">{result.source}</div>
                <div className="text-sm text-gray-400 line-clamp-2">{result.snippet}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
