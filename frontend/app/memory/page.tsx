"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "@/components/Layout/Sidebar";

interface Memory {
  id: string;
  category: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function MemoryPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [newMemory, setNewMemory] = useState({
    category: "personal",
    title: "",
    content: "",
  });
  const [showForm, setShowForm] = useState(false);

  const categories = ["personal", "work", "learning", "projects", "tasks"];

  const fetchMemories = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const params = selectedCategory ? `?category=${selectedCategory}` : "";

      const response = await axios.get(`${API_URL}/api/memory/list${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMemories(response.data);
    } catch (error) {
      console.error("Error fetching memories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, selectedCategory]);

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      await axios.post(`${API_URL}/api/memory/create`, newMemory, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewMemory({ category: "personal", title: "", content: "" });
      setShowForm(false);
      fetchMemories();
    } catch (error) {
      console.error("Error creating memory:", error);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      await axios.delete(`${API_URL}/api/memory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchMemories();
    } catch (error) {
      console.error("Error deleting memory:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-titan flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Memory Hub</h1>
              <p className="text-gray-400">Store and organize your memories</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-neon text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              {showForm ? "Cancel" : "New Memory"}
            </button>
          </div>

          {showForm && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleCreateMemory}
              className="glassmorphism p-6 rounded-lg mb-8 space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newMemory.category}
                    onChange={(e) =>
                      setNewMemory({ ...newMemory, category: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={newMemory.title}
                    onChange={(e) =>
                      setNewMemory({ ...newMemory, title: e.target.value })
                    }
                    placeholder="Memory title..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={newMemory.content}
                  onChange={(e) =>
                    setNewMemory({ ...newMemory, content: e.target.value })
                  }
                  placeholder="Enter memory details..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent h-32"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-neon text-black px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Save Memory
              </button>
            </motion.form>
          )}

          {/* Category Filter */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                selectedCategory === undefined
                  ? "bg-gradient-neon text-black"
                  : "glassmorphism hover:border-accent"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap capitalize transition ${
                  selectedCategory === cat
                    ? "bg-gradient-neon text-black"
                    : "glassmorphism hover:border-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Memories Grid */}
          {loading ? (
            <div className="text-center py-12">Loading memories...</div>
          ) : memories.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No memories yet. Create one to get started!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {memories.map((memory, i) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glassmorphism p-6 rounded-lg group hover:border-accent transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full capitalize">
                      {memory.category}
                    </span>
                    <button
                      onClick={() => handleDeleteMemory(memory.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition"
                    >
                      ✕
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{memory.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3">{memory.content}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
