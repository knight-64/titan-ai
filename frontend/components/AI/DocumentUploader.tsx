"use client";

import { useState } from "react";
import axios from "axios";

interface DocumentAnalysis {
  fileName: string;
  fileType: string;
  size: number;
  summary: string;
  keyPoints: string[];
  extractedText: string;
  documentId?: string;
}

export function DocumentUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [answering, setAnswering] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysis(null);
      setAnswer("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysis(response.data);
      setQuestion("");
      setAnswer("");
    } catch (error: any) {
      alert(error.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestion = async () => {
    if (!question.trim() || !analysis?.documentId) return;

    setAnswering(true);
    try {
      const response = await axios.post(
        `/api/documents/question/${analysis.documentId}`,
        { question }
      );
      setAnswer(response.data.answer);
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to answer question");
    } finally {
      setAnswering(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* File Upload Section */}
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4 text-white">📄 Document Upload</h3>

        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-cyan-500 transition">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.txt,.jpg,.jpeg,.png"
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="text-gray-400">
              {file ? (
                <div>
                  <p className="font-semibold text-white mb-1">{file.name}</p>
                  <p className="text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold mb-1">Click to select file</p>
                  <p className="text-sm">PDF, TXT, or Images</p>
                </div>
              )}
            </div>
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 transition"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-white">{analysis.fileName}</h4>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                {analysis.fileType.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-4">{analysis.summary}</p>

            <div>
              <h5 className="font-semibold text-white mb-2">Key Points</h5>
              <ul className="space-y-1">
                {analysis.keyPoints.map((point, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-cyan-500">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Q&A Section */}
          {analysis.documentId && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Ask Questions</h4>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about the document..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleQuestion}
                  disabled={!question.trim() || answering}
                  className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 transition"
                >
                  {answering ? "..." : "Ask"}
                </button>
              </div>

              {answer && (
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-sm text-gray-300">
                  {answer}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
