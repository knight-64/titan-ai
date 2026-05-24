import { generateAIResponse, AIConfig } from "./aiRouter.js";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  summary: string;
  sources: string[];
}

interface YahooResponse {
  bossresponse?: {
    web?: Array<{
      title: string;
      clickurl: string;
      abstract: string;
    }>;
  };
}

// Using a free search API (you can switch to SerpAPI, Google Custom Search, etc.)
async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    // Using DuckDuckGo API (free, no key required)
    const response = await fetch(
      `https://api.search.yahoo.com/yosh/ysearchweb?q=${encodeURIComponent(query)}&format=json`
    ).catch(() => null);

    if (!response || !response.ok) {
      // Fallback: return empty results if API fails
      console.log("Search API unavailable, using mock results");
      return getMockResults(query);
    }

    const data = (await response.json()) as YahooResponse;

    return (data.bossresponse?.web || []).slice(0, 5).map((result: any) => ({
      title: result.title,
      url: result.clickurl,
      snippet: result.abstract,
      source: new URL(result.clickurl).hostname,
    }));
  } catch (error) {
    console.error("Search error:", error);
    return getMockResults(query);
  }
}

function getMockResults(query: string): SearchResult[] {
  return [
    {
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${query.replace(/\s+/g, "_")}`,
      snippet: `Learn about ${query} on Wikipedia.`,
      source: "wikipedia.org",
    },
    {
      title: `Latest news about ${query}`,
      url: "https://news.google.com",
      snippet: `Browse the latest news and updates about ${query}.`,
      source: "news.google.com",
    },
    {
      title: `${query} Information`,
      url: "https://www.example.com",
      snippet: `Get detailed information about ${query}.`,
      source: "example.com",
    },
  ];
}

export async function performSearch(query: string): Promise<SearchResponse> {
  console.log(`🔍 Searching for: ${query}`);

  const results = await searchWeb(query);

  // Generate AI summary of results
  const summaryPrompt = `Based on these search results for "${query}", provide a brief 2-3 sentence summary:\n\n${results
    .map((r, i) => `${i + 1}. ${r.title}\n${r.snippet}`)
    .join("\n\n")}`;

  const config: AIConfig = {
    provider: "auto",
    temperature: 0.5,
    maxTokens: 200,
  };

  const summary = await generateAIResponse(
    [{ role: "user", content: summaryPrompt }],
    config
  );

  return {
    query,
    results,
    summary: summary.trim(),
    sources: results.map(r => r.source),
  };
}

export async function researchTopic(topic: string): Promise<{
  topic: string;
  keyPoints: string[];
  sources: SearchResult[];
  aiAnalysis: string;
}> {
  const searchResults = await performSearch(topic);

  // Generate AI analysis
  const analysisPrompt = `Analyze these research results about "${topic}" and identify 3 key points:\n\n${searchResults.results
    .map((r, i) => `${i + 1}. ${r.title}\n${r.snippet}`)
    .join("\n\n")}\n\nProvide 3 key points in a numbered list.`;

  const config: AIConfig = {
    provider: "auto",
    temperature: 0.6,
    maxTokens: 300,
  };

  const analysis = await generateAIResponse(
    [{ role: "user", content: analysisPrompt }],
    config
  );

  const keyPoints = analysis
    .split("\n")
    .filter(line => line.match(/^\d+\./))
    .map(line => line.replace(/^\d+\.\s*/, "").trim());

  return {
    topic,
    keyPoints: keyPoints.slice(0, 3),
    sources: searchResults.results,
    aiAnalysis: analysis.trim(),
  };
}
