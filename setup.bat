@echo off
REM Titan AI - Quick Setup Script (Windows)

echo 🚀 Titan AI Platform - Setup Script
echo ====================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org/
    exit /b 1
)

echo ✅ Node.js found:
node --version
echo.

REM Setup Backend
echo 📦 Setting up Backend...
cd backend
call npm install
call npx prisma migrate dev --name init
call npx prisma db seed
cd ..
echo ✅ Backend ready!
echo.

REM Setup Frontend
echo 📦 Setting up Frontend...
cd frontend
call npm install
cd ..
echo ✅ Frontend ready!
echo.

echo 🎉 Setup complete!
echo.
echo To start the development servers:
echo.
echo Terminal 1 (Backend):
echo   cd backend ^&^& npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend ^&^& npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
echo Don't forget to:
echo 1. Copy .env.example to .env.local
echo 2. Add your Groq API key to .env.local
echo.
echo Happy building! 🎈
pause
