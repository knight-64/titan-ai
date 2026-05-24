"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "@/components/Layout/Sidebar";

interface UserProfile {
  user: {
    id: string;
    email: string;
    name: string;
    aiMode: string;
  };
  analytics: {
    messageCount: number;
    chatCount: number;
    memoryCount: number;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMode, setCurrentMode] = useState("friendly");

  const modes = ["friendly", "professional", "mentor", "motivational", "funny", "coding"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await axios.get(`${API_URL}/api/ai/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(response.data);
      setCurrentMode(response.data.user.aiMode);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMode = async (mode: string) => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await axios.put(
        `${API_URL}/api/ai/mode`,
        { aiMode: mode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCurrentMode(mode);
    } catch (error) {
      console.error("Error updating mode:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-titan flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-titan flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-bold gradient-text mb-8">Settings</h1>

          {/* Profile Section */}
          <div className="glassmorphism p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-6">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <p className="text-lg">{profile?.user.name}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <p className="text-lg">{profile?.user.email}</p>
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="glassmorphism p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-6">AI Personality</h2>
            <p className="text-gray-400 mb-4">Choose your preferred AI personality</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {modes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleUpdateMode(mode)}
                  className={`px-4 py-2 rounded-lg capitalize font-medium transition ${
                    currentMode === mode
                      ? "bg-gradient-neon text-black"
                      : "glassmorphism hover:border-accent"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div className="glassmorphism p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Usage Statistics</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">
                  {profile?.analytics.messageCount || 0}
                </p>
                <p className="text-gray-400 text-sm">Total Messages</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">
                  {profile?.analytics.chatCount || 0}
                </p>
                <p className="text-gray-400 text-sm">Conversations</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">
                  {profile?.analytics.memoryCount || 0}
                </p>
                <p className="text-gray-400 text-sm">Memories</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
