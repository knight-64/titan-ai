# 🚀 Titan AI Assistant - Complete Setup Guide

Titan is a production-level AI assistant platform inspired by Jarvis, featuring advanced memory, voice support, and intelligent AI routing between Groq cloud and Ollama local models.

## 📋 Prerequisites

- **Node.js** 18+ (Download from [nodejs.org](https://nodejs.org/))
- **npm** or **yarn**
- **Git**
- **Groq API Key** (Get free at [console.groq.com](https://console.groq.com))
- **SQLite3** (usually included with Node.js)

## 🎯 Quick Start (5 minutes)

### 1. Clone and Setup

```bash
# Navigate to project directory
cd d:\titan_AI

# Initialize frontend
cd frontend
npm install

# Initialize backend
cd ../backend
npm install
```

### 2. Configure Environment

Create `.env.local` in the root directory with:

```env
# Backend
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
BACKEND_PORT=5000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Titan AI
```

### 3. Setup Database

```bash
# In backend directory
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## 🔑 Get Your Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up or login
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste into `.env.local`

## 📁 Project Structure

```
titan-ai/
├── frontend/              # Next.js app
│   ├── app/              # App router pages
│   ├── components/       # Reusable components
│   ├── styles/           # Global styles
│   └── services/         # API calls
├── backend/              # Express server
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Auth, validation
│   │   └── utils/        # Helpers
│   └── prisma/           # Database config
└── docs/                 # Documentation
```

## 🎨 Features Included in Phase 1

### ✅ Authentication
- User registration and login
- JWT-based security
- Secure password hashing with bcrypt

### ✅ AI Chat
- Real-time streaming responses from Groq
- Multi-model support (Llama 3, Mixtral, Gemma)
- Markdown and code syntax highlighting
- Message history

### ✅ Memory System
- Create, read, update, delete memories
- Categorize: personal, work, learning, projects, tasks
- Semantic search
- Automatic context injection

### ✅ AI Personality Modes
- **Friendly**: Warm and approachable
- **Professional**: Business-focused
- **Mentor**: Educational and guiding
- **Motivational**: Inspiring and supportive
- **Funny**: Witty and entertaining
- **Coding**: Expert programmer mode

### ✅ Modern UI/UX
- Glassmorphism design
- Animated gradient backgrounds
- Smooth transitions and micro-interactions
- Responsive design
- Futuristic Jarvis-inspired aesthetics

### ✅ Dashboard
- Usage analytics
- Recent conversations
- Memory visualization
- System status

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Chat
- `POST /api/chat/send` - Send message (streams response)
- `GET /api/chat/history/:chatId` - Get chat history
- `GET /api/chat/list` - List all chats

### Memory
- `POST /api/memory/create` - Create memory
- `GET /api/memory/list` - List memories
- `GET /api/memory/:id` - Get single memory
- `PUT /api/memory/:id` - Update memory
- `DELETE /api/memory/:id` - Delete memory
- `GET /api/memory/search/query?q=search` - Search memories

### AI Settings
- `GET /api/ai/modes` - List all modes
- `GET /api/ai/current` - Get current mode
- `PUT /api/ai/mode` - Update mode
- `GET /api/ai/profile` - Get user profile with analytics

## 🧪 Testing the Application

### 1. Sign Up
1. Go to http://localhost:3000/auth/signup
2. Create an account with test credentials
3. You'll be redirected to dashboard

### 2. Chat with Titan
1. Type a message: "Hello Titan!"
2. Watch streaming response appear
3. Try different personality modes
4. See messages saved in history

### 3. Memory Management
1. Click Memory in sidebar
2. Create a new memory
3. Organize by category
4. Search and retrieve

### 4. Settings
1. Change AI personality
2. View usage analytics
3. Check profile info

## 📦 Groq API Models Available

- **Llama 3** (`llama3-70b-8192`) - Advanced reasoning
- **Mixtral** (`mixtral-8x7b-32768`) - Fast and efficient
- **Gemma** (`gemma-7b-it`) - Lightweight option

## 🚀 Production Deployment

### Frontend (Vercel)
```bash
# Build frontend
cd frontend
npm run build

# Deploy to Vercel
vercel
```

### Backend (Render/Railway)
```bash
# Create docker image and push to registry
docker build -t titan-backend .
# Deploy to Render or Railway
```

## 🔄 Phase 2 Roadmap

After Phase 1 is stable:
1. **Ollama Integration** - Local AI support
2. **Hybrid AI Router** - Auto-switch between cloud/local
3. **Voice Assistant** - Speech-to-text and text-to-speech
4. **Internet Search** - Real-time web research
5. **File Upload** - PDF and document analysis

## 🐛 Troubleshooting

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cache and restart

### Database errors
- Delete `backend/prisma/dev.db`
- Run `npx prisma migrate dev --name init`
- Run `npx prisma db seed`

### Groq API errors
- Verify API key is correct
- Check you have API quota remaining
- Review Groq API status page

### Messages not streaming
- Check browser console for errors
- Verify network tab shows SSE connection
- Check backend logs for errors

## 📚 Documentation

- **API**: See `docs/API.md`
- **Architecture**: See `docs/ARCHITECTURE.md`
- **Database**: See `docs/DATABASE.md`

## 🛠️ Development Commands

### Backend
```bash
npm run dev              # Start dev server
npm run build            # Build TypeScript
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
```

### Frontend
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run ESLint
npm start                # Start production server
```

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Groq API Docs](https://console.groq.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

MIT License - Feel free to use this for your projects

## 🤝 Contributing

Contributions welcome! Please open issues and PRs.

## 🌟 Credits

Built with love for AI enthusiasts. Inspired by Jarvis, ChatGPT, and modern AI operating systems.

---

**Ready to chat with your AI assistant?** 🚀
1. Get your Groq API key
2. Run the setup commands
3. Start the servers
4. Visit http://localhost:3000

Happy building! 🎉
