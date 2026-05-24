"use client";

import { useState, useCallback } from "react";
import axios from "axios";

interface Memory {
  id: string;
  category: string;
  title: string;
  content: string;
  createdAt: string;
}

export function useMemory() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchMemories = useCallback(
    async (category?: string) => {
      setLoading(true);
      setError(null);

      try {
        const params = category ? `?category=${category}` : "";
        const response = await axios.get(`${API_URL}/api/memory/list${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMemories(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch memories");
      } finally {
        setLoading(false);
      }
    },
    [API_URL, token]
  );

  const createMemory = useCallback(
    async (data: Omit<Memory, "id" | "createdAt">) => {
      try {
        const response = await axios.post(`${API_URL}/api/memory/create`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMemories((prev) => [response.data, ...prev]);
        return response.data;
      } catch (err: any) {
        setError(err.message || "Failed to create memory");
        throw err;
      }
    },
    [API_URL, token]
  );

  const updateMemory = useCallback(
    async (id: string, data: Partial<Memory>) => {
      try {
        const response = await axios.put(
          `${API_URL}/api/memory/${id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMemories((prev) =>
          prev.map((mem) => (mem.id === id ? response.data : mem))
        );
        return response.data;
      } catch (err: any) {
        setError(err.message || "Failed to update memory");
        throw err;
      }
    },
    [API_URL, token]
  );

  const deleteMemory = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`${API_URL}/api/memory/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMemories((prev) => prev.filter((mem) => mem.id !== id));
      } catch (err: any) {
        setError(err.message || "Failed to delete memory");
        throw err;
      }
    },
    [API_URL, token]
  );

  const searchMemories = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_URL}/api/memory/search/query?q=${query}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMemories(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to search memories");
      } finally {
        setLoading(false);
      }
    },
    [API_URL, token]
  );

  return {
    memories,
    loading,
    error,
    fetchMemories,
    createMemory,
    updateMemory,
    deleteMemory,
    searchMemories,
  };
}
