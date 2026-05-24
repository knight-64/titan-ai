"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Sidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Chat", href: "/dashboard", icon: "💬" },
    { label: "Memory", href: "/memory", icon: "🧠" },
    { label: "Settings", href: "/settings", icon: "⚙️" },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-neon/10 border-r border-white/10 p-4 transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-gradient-neon rounded-lg"></div>
        {!collapsed && <span className="text-xl font-bold gradient-text">Titan</span>}
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition group"
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span className="group-hover:text-accent transition">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg hover:bg-white/10 transition"
        >
          {collapsed ? "→" : "←"}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition text-red-400"
        >
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
