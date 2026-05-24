# 🚀 Titan AI Assistant Project

## Project Vision
Build a production-level AI assistant platform inspired by Jarvis from Iron Man, featuring advanced memory, voice interaction, and intelligent AI routing between cloud (Groq) and local (Ollama) models.

## Current Status: Phase 1 - MVP

### ✅ Phase 1 Complete
- [x] Project structure and monorepo setup
- [x] Backend infrastructure (Express + Prisma + SQLite)
- [x] Frontend setup (Next.js + TypeScript + Tailwind)
- [x] Authentication system (JWT + bcrypt)
- [x] Groq API integration with streaming
- [x] Chat system with message history
- [x] Memory system (CRUD operations)
- [x] AI personality modes (6 modes)
- [x] Dashboard with analytics
- [x] Cinematic UI/UX (glassmorphism, animations)

### 📋 Phase 2 Planning (Next)
1. Ollama integration for offline AI
2. Hybrid AI routing system
3. Voice assistant (STT + TTS)
4. Internet search integration
5. File upload and document analysis

## Tech Stack

### Frontend
- Next.js 14+ with App Router
- React 18+ with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Shadcn UI components
- Axios for API calls

### Backend
- Express.js with TypeScript
- Prisma ORM
- SQLite for MVP (PostgreSQL ready)
- JWT for authentication
- bcryptjs for password hashing
- Groq SDK for AI

### Database Schema
```
User
├── id (primary key)
├── email (unique)
├── password (hashed)
├── name
├── aiMode (default: friendly)
├── chats (relationship)
├── memories (relationship)
└── analytics (relationship)

Chat
├── id (primary key)
├── userId (foreign key)
├── title
├── messages (relationship)
└── timestamps

Message
├── id (primary key)
├── chatId (foreign key)
├── role (user/assistant)
├── content
└── createdAt

Memory
├── id (primary key)
├── userId (foreign key)
├── category (personal/work/learning/projects/tasks)
├── title
├── content
└── timestamps

AIMode
├── mode (unique)
├── systemPrompt
├── temperature
└── maxTokens

Analytics
├── userId (unique)
├── messageCount
├── chatCount
├── memoryCount
└── lastActive
```

## File Structure

```
titan-ai/
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── memory/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AI/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatInput.tsx
│   │   ├── Layout/
│   │   │   └── Sidebar.tsx
│   │   ├── UI/
│   │   │   └── PersonalitySelector.tsx
│   │   ├── Effects/
│   │   │   ├── GlassmorphismCard.tsx
│   │   │   ├── FloatingParticles.tsx
│   │   │   └── AIOrb.tsx
│   │   └── Dashboard/
│   │       ├── UsageStats.tsx
│   │       └── RecentChats.tsx
│   ├── hooks/
│   │   ├── useChat.ts
│   │   ├── useMemory.ts
│   │   └── usePersonality.ts
│   ├── services/
│   │   └── api.ts
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       └── index.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── chat.ts
│   │   │   ├── memory.ts
│   │   │   └── ai.ts
│   │   ├── services/
│   │   │   ├── groq.ts
│   │   │   ├── chatService.ts
│   │   │   └── memoryService.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── utils/
│   │   │   └── auth.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── dev.db
│   └── Dockerfile
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── SETUP.md
├── README.md
├── docker-compose.yml
├── .env.local
├── .env.example
└── .gitignore
```

## Key Features

### AI Personality Modes
1. **Friendly** - Warm, approachable, conversational
2. **Professional** - Business-focused, concise
3. **Mentor** - Educational, guiding approach
4. **Motivational** - Inspiring, supportive
5. **Funny** - Witty, entertaining
6. **Coding** - Expert programmer mode

### UI/UX Design System
- **Color Scheme**: Black (#0f0f1e) + Deep Blue + Purple Neon + Cyan Accents
- **Effects**: Glassmorphism, blur, gradients, animations
- **Animations**: Float, pulse, typewriter effects
- **Typography**: Bold gradient text, smooth transitions
- **Responsive**: Mobile-first design

## API Endpoints

### Authentication
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Chat
- `POST /api/chat/send` (streams SSE)
- `GET /api/chat/list`
- `GET /api/chat/history/:chatId`

### Memory
- `POST /api/memory/create`
- `GET /api/memory/list`
- `GET /api/memory/:id`
- `PUT /api/memory/:id`
- `DELETE /api/memory/:id`
- `GET /api/memory/search/query?q=`

### AI Settings
- `GET /api/ai/modes`
- `GET /api/ai/current`
- `PUT /api/ai/mode`
- `GET /api/ai/profile`

## Environment Variables

```
# Backend
GROQ_API_KEY=your_key_here
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
BACKEND_PORT=5000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Titan AI
```

## Development Workflow

### Local Setup
```bash
# Backend
cd backend && npm install && npx prisma migrate dev && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

### Testing
1. Sign up at http://localhost:3000/auth/signup
2. Chat on dashboard
3. Test memory creation in /memory
4. Change AI mode in /settings

### Building
```bash
# Backend
npm run build  # Creates dist/

# Frontend
npm run build  # Creates .next/
```

## Important Notes

### Security Considerations
- JWT tokens expire in 7 days
- Passwords hashed with bcryptjs (cost: 10)
- Environment variables never committed
- Input validation with Zod
- Protected API routes with auth middleware

### Performance
- SSE streaming for real-time chat
- Lazy loading components
- Optimized images
- Minimal dependencies

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name add_feature

# Reset database (dev only!)
npx prisma migrate reset

# View data in GUI
npx prisma studio
```

## Deployment Targets

### Frontend
- Vercel (recommended)
- Netlify
- AWS Amplify

### Backend
- Render
- Railway
- Heroku
- AWS EC2 + Docker

## Troubleshooting

### Backend won't start
1. Delete `backend/prisma/dev.db`
2. Run `npx prisma migrate dev --name init`
3. Check GROQ_API_KEY is set

### Frontend errors
1. Clear `.next` folder
2. Delete `node_modules`
3. Run `npm install` and `npm run dev`

### Auth failing
1. Check JWT_SECRET is set
2. Verify token in localStorage
3. Check API URL matches in .env

## Next Steps (Phase 2)

1. **Ollama Integration**
   - Install Ollama locally
   - Create ollama service wrapper
   - Add model management UI

2. **Voice Features**
   - Web Speech API for STT
   - TTS integration
   - Wake word detection

3. **Search Integration**
   - SerpAPI or similar
   - Summarization pipeline
   - Citation tracking

4. **File Upload**
   - PDF parsing
   - OCR support
   - Document QA

## Resources

- [Groq API Docs](https://console.groq.com/docs)
- [Prisma ORM](https://www.prisma.io/docs)
- [Next.js](https://nextjs.org/docs)
- [Express.js](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)

## Team Notes

- Keep components small and reusable
- Use TypeScript for type safety
- Follow existing code patterns
- Test features before merging
- Document API changes in API.md
- Keep animations performant
- Mobile-first responsive design

---

**Built with ❤️ for AI enthusiasts**
