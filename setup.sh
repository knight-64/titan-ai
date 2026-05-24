#!/bin/bash

# Titan AI - Quick Setup Script

echo "🚀 Titan AI Platform - Setup Script"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
cd ..
echo "✅ Backend ready!"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend
npm install
cd ..
echo "✅ Frontend ready!"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To start the development servers:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
echo "Don't forget to:"
echo "1. Copy .env.example to .env.local"
echo "2. Add your Groq API key to .env.local"
echo ""
echo "Happy building! 🎈"
