/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f0f1e",
        secondary: "#1a1a2e",
        accent: "#00d4ff",
        neon: "#ff006e",
        purple: "#8b5cf6",
      },
      backgroundImage: {
        "gradient-titan": "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)",
        "gradient-neon": "linear-gradient(90deg, #00d4ff 0%, #8b5cf6 50%, #ff006e 100%)",
      },
      backdropBlur: {
        glass: "10px",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "typewriter": "typewriter 0.8s steps(40, end)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 212, 255, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.8)" },
        },
        typewriter: {
          "0%": { width: "0" },
          "1%": { visibility: "visible" },
          "100%": { width: "100%" },
        },
      },
    },
  },
  plugins: [],
}
