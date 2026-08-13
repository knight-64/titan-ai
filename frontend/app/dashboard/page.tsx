"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Layout/Sidebar";
import ChatInterface from "@/components/AI/ChatInterface";

export default function DashboardPage() {
 
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  setAuthenticated(true);
  setLoading(false);
}, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-titan flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-titan flex">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center p-4">
        <ChatInterface />
      </main>
    </div>
  );
}
