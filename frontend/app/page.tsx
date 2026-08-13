"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-titan overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-float-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-float-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-8 py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-neon rounded-lg"></div>
            <span className="text-2xl font-bold neon-text">Titan</span>
          </div>
          <div className="flex gap-6">
            <Link href="/dashboard" className="bg-gradient-neon text-black px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition">
              Start Chatting
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-8 py-20 text-center">
          <h1 className="text-6xl font-bold mb-6 gradient-text">
            Meet Titan
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your advanced AI assistant with memory, voice interaction, and intelligent features. Powered by cutting-edge AI models with Jarvis-level sophistication.
          </p>

          {/* Animated AI Orb */}
          <div className="relative w-32 h-32 mx-auto mb-12">
            <div className="absolute inset-0 bg-gradient-neon rounded-full opacity-20 blur-2xl animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-neon rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute w-16 h-16 bg-gradient-neon rounded-full blur-lg animate-glow-pulse"></div>
            </div>
          </div>

          <div className="flex gap-6 justify-center">
            <Link href="/dashboard" className="bg-accent text-black px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition">
              Start Chatting
            </Link>
            <button className="border border-accent px-8 py-3 rounded-lg font-semibold hover:bg-accent hover:text-black transition">
              Learn More
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
            Powered by AI Excellence
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Smart Memory", desc: "Remember context across conversations" },
              { title: "Voice Ready", desc: "Speak naturally with AI voice support" },
              { title: "Fast AI", desc: "Powered by Groq's ultra-fast inference" },
              { title: "Multiple Modes", desc: "Friendly, professional, mentor, and more" },
              { title: "Web Search", desc: "Real-time information integration" },
              { title: "Offline Ready", desc: "Works with local AI models" },
            ].map((feature, i) => (
              <div
                key={i}
                className="glassmorphism p-6 rounded-xl hover:border-accent transition"
              >
                <h3 className="text-xl font-bold mb-2 text-accent">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
