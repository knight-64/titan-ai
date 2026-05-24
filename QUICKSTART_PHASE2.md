# 🚀 Titan AI - Phase 2 Quick Start

## Phase 2 Complete! 🎉

Phase 2 adds advanced AI features:
- **Hybrid AI System** (Groq Cloud + Ollama Local)
- **Internet Search** (Web search + deep research)
- **Document Analysis** (PDF, images, text)
- **Voice Assistant** (STT + TTS)

## 5-Minute Setup

### Step 1: Install & Configure

```bash
# Backend
cd backend
npm install
npx prisma generate

# Frontend
cd frontend
npm install
```

### Step 2: Set Environment

Create or update `.env.local` in the root:

```bash
# Backend
GROQ_API_KEY=your_groq_key_here
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=any_random_secret
JWT_EXPIRE=7d
NODE_ENV=development
BACKEND_PORT=5000

# Ollama (optional - for offline AI)
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Titan AI
```

### Step 3: Run Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Output should show:
```
🚀 Titan Backend running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Output should show:
```
- Local: http://localhost:3000
```

### Step 4: Test the App

1. Go to `http://localhost:3000`
2. Sign up with test credentials
3. Go to `/tools` to access Phase 2 features

## Phase 2 Features

### 1. AI Provider Status (Top of page)

Shows which AI provider is active:
- 📡 **Local Mode** = Ollama running
- ☁️ **Cloud Mode** = Groq running

### 2. 🔍 Search Tab

**Quick Search:**
- Search the web instantly
- Get AI-powered summaries
- View clickable results

**Deep Research:**
- Multi-source research
- AI key points extraction
- Comprehensive analysis

```javascript
// Example: Search for "React hooks"
Result:
- Query: "React hooks"
- Summary: "AI-generated 2-3 sentence overview"
- Results: [5 search results with titles, URLs, snippets]
- Sources: ["react.dev", "mdn.org", ...]
```

### 3. 📄 Documents Tab

**Upload Files:**
- Drag & drop or click to select
- Supported: PDF, TXT, JPG, PNG
- Max size: 50MB

**Get Analysis:**
- Automatic summary
- Key points extraction
- File type detection
- Size display

**Ask Questions:**
- Question the document
- Get AI-powered answers
- Contextual responses

```javascript
// Example Flow:
1. Upload "my_document.pdf"
2. See summary + key points
3. Ask: "What is this about?"
4. Get AI response based on document
```

### 4. 🎤 Voice Tab

**Start Voice Chat:**
- Browser records your speech
- AI processes and responds
- AI speaks the answer

**Browser Support:**
- ✅ Chrome (best support)
- ✅ Edge  
- ✅ Safari (macOS/iOS)
- ⚠️ Firefox (limited)

**How it works:**
1. Click "Start Voice Chat"
2. You'll hear "Listening..."
3. Speak your request (5 second limit)
4. AI processes your speech
5. AI speaks response back

```
You: "What is React?"
Titan: [listens] → [processes] → [speaks answer]
```

## Optional: Setup Ollama (Offline AI)

For local/offline AI support:

### 1. Download Ollama
- Go to https://ollama.ai
- Download for your OS
- Install and open

### 2. Pull a Model
```bash
ollama pull llama2
# Or: ollama pull mistral
```

### 3. Start Ollama
```bash
ollama serve
```

### 4. Test in App

Go to `/tools` and check provider status:
- If Ollama running: Shows "📡 Local"
- If Ollama offline: Falls back to "☁️ Cloud"

## API Endpoints Added (Phase 2)

### AI Providers
```
GET  /api/ai/providers           → { groq: true, ollama: false, activeProvider: "groq" }
GET  /api/ai/providers/models    → { groq: [...], ollama: [...] }
POST /api/ai/providers/set       → Set preferred provider
```

### Search
```
POST /api/search/search          → Quick web search
POST /api/search/research        → Deep topic research
```

### Documents
```
POST /api/documents/upload       → Upload & analyze document
POST /api/documents/question/:id → Ask questions
DELETE /api/documents/:id        → Delete document
GET /api/documents/list          → List user's documents
```

## Troubleshooting

### "AI Provider shows offline"
- Check Groq API key is set
- Verify internet connection
- If Ollama should be on: `ollama serve` in terminal

### "Search returns mock results"
- Yahoo Search API may be region-blocked
- App automatically uses fallback results
- Use SerpAPI in production (requires key)

### "Voice not working"
- Use Chrome (best support)
- Check microphone permissions
- Must be HTTPS in production
- Desktop Chrome works best

### "File upload fails"
- Check file size (max 50MB)
- Verify file type (.pdf, .txt, .jpg, .png)
- Check disk space

### "TypeScript errors on build"
- Run: `npx prisma generate`
- Restart dev server
- Clear `.next` folder: `rm -rf .next`

## Next Steps

### Try These Commands:

**Search Mode:**
1. Go to `/tools`
2. Click "Search" tab
3. Search: "Claude AI assistant"
4. See AI summary + results

**Document Mode:**
1. Create a test file `example.txt`
2. Add some text content
3. Upload to `/tools` → Documents
4. See auto-analysis
5. Ask: "What is this?"

**Voice Mode:**
1. Go to `/tools` → Voice
2. Click "Start Voice Chat"
3. Wait for "Listening..."
4. Say: "What's the weather like?"
5. Hear AI response

## File Structure Summary

```
titan-ai/
├── backend/src/
│   ├── services/
│   │   ├── groq.ts (existing)
│   │   ├── ollama.ts ✨ NEW
│   │   ├── aiRouter.ts ✨ NEW
│   │   ├── search.ts ✨ NEW
│   │   └── documents.ts ✨ NEW
│   ├── routes/
│   │   ├── ai.ts (updated)
│   │   ├── search.ts ✨ NEW
│   │   └── documents.ts ✨ NEW
│   └── server.ts (updated)
│
├── frontend/
│   ├── app/tools/page.tsx ✨ NEW
│   ├── components/AI/
│   │   ├── AIProviderSelector.tsx ✨ NEW
│   │   ├── SearchComponent.tsx ✨ NEW
│   │   ├── DocumentUploader.tsx ✨ NEW
│   │   └── VoiceAssistant.tsx ✨ NEW
│   └── hooks/useVoice.ts ✨ NEW
│
└── docs/
    └── PHASE2_SETUP.md (comprehensive guide)
```

## Key Technologies

- **Express.js** - Backend API server
- **Next.js 14** - Frontend framework
- **Prisma** - Database ORM
- **Groq SDK** - Cloud AI API
- **Ollama** - Local AI runtime
- **Web Speech API** - Browser voice
- **Framer Motion** - Animations

## Performance Tips

1. **Caching**: Provider status checked every 30 sec
2. **Streaming**: Responses stream for faster display
3. **Lazy Loading**: Components load on demand
4. **Optimized Queries**: DB queries use indexes

## Security Notes

- JWT tokens expire in 7 days
- Passwords hashed with bcryptjs
- File uploads validated by type + size
- All Phase 2 endpoints require auth
- Environment variables in `.env.local` (not committed)

## Ready to Deploy?

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Push to GitHub
# Connect to Vercel
```

### Backend (Render/Railway)
```bash
cd backend
npm run build
# Push to GitHub
# Connect to Render/Railway
```

## Full Documentation

For detailed information, see:
- `docs/PHASE2_SETUP.md` - Complete Phase 2 guide
- `CLAUDE.md` - Project overview
- `docs/API.md` - API reference

## Support

- **Ollama Help**: https://ollama.ai
- **Groq Docs**: https://console.groq.com/docs
- **Next.js Guide**: https://nextjs.org/docs
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

---

**🎉 Congratulations! You're running Phase 2 of Titan AI!**

### What's Next?

Phase 3 features in development:
- Multi-agent architecture
- Advanced memory with embeddings
- Productivity tools (notes, tasks, reminders)
- Calendar integration
- Browser extension

Happy coding! 🚀
