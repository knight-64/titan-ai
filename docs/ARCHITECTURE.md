# Titan AI - Architecture Documentation

## System Overview

Titan is a full-stack AI assistant platform built with a clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│              (Next.js 3000 Frontend)                    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
                       │ WebSocket (Phase 2)
┌──────────────────────▼──────────────────────────────────┐
│                EXPRESS BACKEND (5000)                   │
├──────────────────────────────────────────────────────────┤
│  Routes: /api/auth, /api/chat, /api/memory, /api/ai    │
│  Middleware: Auth JWT, Validation, Error Handler        │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    ┌───▼───┐      ┌───▼────┐    ┌──▼────┐
    │ Groq  │      │Prisma  │    │Memory │
    │ API   │      │ ORM     │    │ Svc   │
    │Cloud  │      │SQLite  │    │Vector │
    └───────┘      └────────┘    └───────┘
```

## Frontend Architecture

### Page Structure (Next.js App Router)
```
app/
├── page.tsx                 # Landing page
├── layout.tsx               # Root layout
├── auth/
│   ├── login/page.tsx      # Login page
│   └── signup/page.tsx     # Signup page
├── dashboard/page.tsx       # Main chat hub
├── memory/page.tsx          # Memory management
└── settings/page.tsx        # User settings
```

### Component Hierarchy
```
Dashboard
├── Sidebar (Navigation)
│   ├── Menu Items
│   └── User Controls
└── Main Content
    ├── ChatInterface
    │   ├── Header (PersonalitySelector)
    │   ├── MessageList
    │   │   └── ChatMessage[] (streaming)
    │   └── ChatInput
    ├── MemoryPage
    │   ├── CategoryFilter
    │   └── MemoryCard[]
    └── SettingsPage
        ├── ProfileInfo
        ├── AIPersonalitySelector
        └── AnalyticsDisplay
```

### State Management
- **Local State**: React useState for component-level state
- **Auth State**: localStorage for JWT token
- **User State**: localStorage for user profile
- **Real-time**: SSE (Server-Sent Events) for chat streaming

### Data Flow
```
User Input
    ↓
ChatInterface Component
    ↓
API Call (axios)
    ↓
Backend Route Handler
    ↓
Groq API / Database Query
    ↓
Response Stream / JSON
    ↓
Component State Update
    ↓
UI Re-render (React)
```

## Backend Architecture

### Request Flow
```
HTTP Request
    ↓
Express Router
    ↓
Auth Middleware (verify JWT)
    ↓
Route Handler
    ↓
Service Layer (business logic)
    ↓
Prisma ORM / Groq API
    ↓
Database / External API
    ↓
Response Builder
    ↓
JSON / SSE Stream Response
```

### Route Organization

#### Auth Routes (`/api/auth`)
- **POST /signup** → Create user, generate token
- **POST /login** → Verify credentials, generate token

#### Chat Routes (`/api/chat`)
- **POST /send** → Stream AI response via SSE
  - Build conversation context
  - Call Groq API
  - Stream chunks to client
  - Save to database
- **GET /list** → List user's chats
- **GET /history/:id** → Get chat messages

#### Memory Routes (`/api/memory`)
- **POST /create** → Create memory
- **GET /list** → List memories (with filter)
- **GET /:id** → Get single memory
- **PUT /:id** → Update memory
- **DELETE /:id** → Delete memory
- **GET /search** → Search memories

#### AI Routes (`/api/ai`)
- **GET /modes** → List personality modes
- **GET /current** → Get user's current mode
- **PUT /mode** → Change personality
- **GET /profile** → Get user profile + analytics

### Service Layer

#### ChatService
- Build message context from history
- Inject memories for context awareness
- Format system prompt based on mode
- Handle error cases

#### GroqService
- Initialize Groq client
- Stream generation with backpressure
- Token counting and limits
- Model selection logic

#### AuthService
- Password hashing (bcrypt)
- Token generation (JWT)
- Token verification
- Session management

#### MemoryService
- CRUD operations
- Categorization
- Search/filtering
- Context injection

## Database Schema

### User
- Primary key: `id` (CUID)
- Unique: `email`
- Fields: `password`, `name`, `avatar`, `aiMode`
- Relations: chats, memories, analytics

### Chat
- Primary key: `id`
- Foreign key: `userId`
- Fields: `title`, `createdAt`, `updatedAt`
- Relations: user, messages

### Message
- Primary key: `id`
- Foreign key: `chatId`
- Fields: `role`, `content`, `createdAt`
- Relations: chat

### Memory
- Primary key: `id`
- Foreign key: `userId`
- Fields: `category`, `title`, `content`, `createdAt`, `updatedAt`
- Relations: user
- Indexes: userId + category (for filtering)

### AIMode
- Primary key: `id`
- Unique: `mode`
- Fields: `systemPrompt`, `temperature`, `maxTokens`

### Analytics
- Primary key: `id`
- Unique: `userId`
- Fields: `messageCount`, `chatCount`, `memoryCount`, `lastActive`

## Security Architecture

### Authentication Flow
```
User Password
    ↓
bcrypt Hash
    ↓
Store in Database
    ↓
Login: Compare Hashes
    ↓
JWT Token Generation
    ↓
Token Expiry: 7 days
    ↓
Auth Middleware: Verify Token
```

### Protected Routes
All API routes (except /auth) require valid JWT token in Authorization header:
```
Authorization: Bearer eyJhbGc...
```

### Input Validation
- Zod schema validation on all endpoints
- Type checking at compile time (TypeScript)
- Runtime validation on incoming data

### Environment Secrets
- `GROQ_API_KEY` - Never exposed to frontend
- `JWT_SECRET` - Server-side only
- `.env.local` - Never committed

## Data Flow Examples

### Chat Message Flow
```
1. User types message in ChatInterface
2. onClick/onSubmit → handleSendMessage()
3. POST /api/chat/send with message content
4. Backend receives, creates Message record
5. Groq API called with context + user message
6. Stream response as SSE back to client
7. Client accumulates chunks in state
8. UI re-renders with each chunk (typewriter effect)
9. On completion, save assistant message
10. Update analytics
```

### Memory Creation Flow
```
1. User fills memory form (category, title, content)
2. POST /api/memory/create
3. Backend validates with Zod
4. Prisma creates record
5. Analytics incremented
6. Return created memory
7. Frontend adds to local list
8. UI updates with new memory card
```

### AI Mode Change Flow
```
1. User clicks personality selector
2. onModeChange() → setCurrentMode(mode)
3. PUT /api/ai/mode with new mode
4. Backend updates user.aiMode
5. Return confirmation
6. Next chat message uses new system prompt
7. Groq API called with new personality
```

## Groq Integration

### Streaming Implementation
```
POST /api/chat/send
    ↓
Build messages array
    ↓
Call groq.chat.completions.create({
  model: 'mixtral-8x7b-32768',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: previousMessages },
    { role: 'user', content: currentMessage }
  ],
  stream: true
})
    ↓
For await chunk in stream
    ↓
res.write(`data: ${JSON.stringify({ content: chunk })}`)
    ↓
Client receives SSE events
    ↓
Parse and display in real-time
```

### Error Handling
- Rate limiting: Check Groq quota
- Connection errors: Fallback to error message
- Token limits: Truncate old messages if needed
- Invalid input: Return validation error

## Performance Optimizations

### Frontend
- Lazy loading pages with Next.js dynamic imports
- Image optimization
- CSS-in-JS only when needed (Tailwind static)
- Message virtualization (if list gets long)

### Backend
- Database indexes on frequently queried fields
- Pagination for list endpoints (Phase 2)
- Response streaming for large content
- Connection pooling via Prisma

### Network
- HTTP compression (gzip)
- Minified assets
- CDN for static files (frontend deployment)

## Scalability Considerations

### Phase 1 (Current)
- Single server backend
- SQLite local database
- No caching layer
- Direct API calls

### Phase 2+
- PostgreSQL for production
- Redis for caching
- Message queue (Bull/RabbitMQ)
- Load balancing
- Horizontal scaling

### Future Improvements
- Vector database for semantic search
- WebSocket for real-time multiplayer
- File storage (S3/blob)
- Analytics dashboard
- Admin panel

## Development Workflow

### Local Development
```
Backend: npm run dev (tsx watch on src/)
Frontend: npm run dev (Next.js hot reload)
Database: Prisma Studio at http://localhost:5555
```

### Testing (Phase 2)
```
Backend: Jest unit tests + API integration tests
Frontend: Vitest + React Testing Library
E2E: Playwright or Cypress
```

### Deployment Pipeline (Phase 2)
```
git push → GitHub Actions → Build → Test → Deploy
```

## Error Handling Strategy

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad request (validation)
- **401**: Unauthorized (no/invalid token)
- **404**: Not found
- **500**: Server error

### Error Response Format
```json
{
  "error": "Human readable error message"
}
```

### Logging
- Development: Console logs
- Production: Centralized logging (Sentry, LogRocket)

## Next Steps for Phase 2

1. **Ollama Integration**
   - Add ollama.ts service
   - Create AI router logic
   - Add local model selection UI

2. **Vector Database**
   - Implement embeddings
   - Semantic memory search
   - Context relevance scoring

3. **Voice Support**
   - Web Audio API for recording
   - Speech-to-text (Web Speech API or external service)
   - Text-to-speech (browser API or Eleven Labs)

4. **File Handling**
   - File upload endpoint
   - PDF parsing
   - OCR support
   - Document Q&A

5. **Real-time Features**
   - WebSocket implementation
   - Live collaboration
   - Multiplayer editing

---

For implementation details, see `backend/src/` and `frontend/components/`
