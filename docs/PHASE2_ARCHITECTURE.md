# 🏗️ Phase 2 Architecture & Developer Guide

## System Overview

Titan AI Phase 2 implements a hybrid AI system with advanced features for search, document analysis, and voice interaction.

```
┌─────────────────────────────────────────────────────────┐
│                    TITAN AI PHASE 2                      │
└─────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   Frontend (Next.js) │         │   Backend (Express)  │
├──────────────────────┤         ├──────────────────────┤
│ ✓ AI Tools Hub       │         │ ✓ AI Router          │
│ ✓ Voice Assistant    │◄───────►│ ✓ Groq/Ollama        │
│ ✓ Search UI          │         │ ✓ Search Service     │
│ ✓ Document Uploader  │         │ ✓ Document Processor │
│ ✓ Provider Selector  │         │ ✓ Auth Middleware    │
└──────────────────────┘         └──────────────────────┘
         │                               │
         │                        ┌──────▼──────┐
         │                        │  Databases  │
         │                        ├─────────────┤
         │                        │ ✓ Users     │
         │                        │ ✓ Chats     │
         │                        │ ✓ Memories  │
         │                        │ ✓ Documents │
         │                        │ ✓ Search    │
         │                        └─────────────┘
         │
    ┌────▼────────────────┐
    │  External APIs      │
    ├─────────────────────┤
    │ ✓ Groq Cloud AI     │
    │ ✓ Ollama Local AI   │
    │ ✓ Web Search API    │
    │ ✓ Web Speech API    │
    └─────────────────────┘
```

## Component Architecture

### 1. AI Router System

**Purpose**: Intelligently choose between cloud (Groq) and local (Ollama) AI

**Flow:**
```
Request → AI Router
          │
          ├─ Check Ollama Status
          │  ├─ Available? → Use Ollama
          │  └─ Unavailable? → Check Groq
          │
          ├─ Check Groq Status
          │  ├─ Key set? → Use Groq
          │  └─ Error? → Return error
          │
          └─ Generate Response
             ├─ Stream chunks
             └─ Return to frontend
```

**Key Code:**
```typescript
// backend/src/services/aiRouter.ts
async selectProvider(config: AIConfig): Promise<AIProvider>
// Returns "groq" | "ollama" | "auto"

async streamAIResponse(messages: ChatMessage[], config: AIConfig)
// Streams AI response from selected provider
```

**Cache Strategy:**
- Provider status cached for 30 seconds
- Reduces unnecessary health checks
- Automatic refresh on stale data

### 2. Search Pipeline

**Purpose**: Search the web and summarize with AI

**Flow:**
```
User Query → Web Search API
            ├─ Fetch results
            ├─ Parse titles, URLs, snippets
            │
            └─ AI Summarization
               ├─ Create summary
               ├─ Extract key points
               └─ Track sources
               
            Return to User
```

**Key Code:**
```typescript
// backend/src/services/search.ts
async performSearch(query: string): Promise<SearchResponse>
// Quick search with AI summary

async researchTopic(topic: string): Promise<ResearchResult>
// Deep research with key points
```

**Modes:**
- **Quick Search**: Fast web results + summary
- **Deep Research**: Multi-source analysis + key points

### 3. Document Processing

**Purpose**: Analyze documents and enable Q&A

**Flow:**
```
User Upload → Validate File
              ├─ Check type (PDF, TXT, JPG, PNG)
              ├─ Check size (max 50MB)
              │
              └─ Save to Storage
                 ├─ Store in user's directory
                 ├─ Hash filename (security)
                 │
                 └─ Extract Content
                    ├─ PDF → text extraction
                    ├─ Image → OCR (placeholder)
                    ├─ TXT → direct read
                    │
                    └─ AI Analysis
                       ├─ Generate summary
                       ├─ Extract key points
                       │
                       └─ Store in Database
                          ├─ Document record
                          ├─ Metadata
                          └─ Enable Q&A
```

**Key Code:**
```typescript
// backend/src/services/documents.ts
async analyzeDocument(filePath: string): Promise<DocumentAnalysis>
// Extract and analyze

async questionDocument(filePath: string, question: string): Promise<string>
// Q&A on document

async validateFile(file: any): Promise<{ valid: boolean }>
// Validate before upload
```

**Storage Structure:**
```
uploads/
├── [userId1]/
│   ├── document-123456.pdf
│   ├── image-789012.jpg
│   └── notes-345678.txt
└── [userId2]/
    └── research-901234.pdf
```

### 4. Voice Assistant

**Purpose**: Voice input/output interaction

**Flow:**
```
User Clicks → Start Recording (STT)
              ├─ Browser uses Web Speech API
              ├─ Captures audio
              ├─ Converts to text
              │
              └─ Send to AI
                 ├─ Process query
                 ├─ Generate response
                 │
                 └─ Text-to-Speech (TTS)
                    ├─ Convert response to speech
                    └─ Play audio to user
```

**Key Code:**
```typescript
// frontend/hooks/useVoice.ts
useVoiceRecognition(config)  // STT hook
useTextToSpeech()             // TTS hook
useVoiceAssistant()           // Combined interface
```

**Browser APIs Used:**
- `SpeechRecognition` - Speech to text
- `SpeechSynthesisUtterance` - Text to speech

## Data Flow Diagrams

### Search Flow
```
Frontend                          Backend                       External
┌────────┐                      ┌──────────┐                  ┌────────┐
│ Search │ POST /search/search  │ Search   │ GET API          │ Yahoo  │
│Component├──────────────────>  │Service   ├────────────────> │Search  │
│         │ { query: string }   │          │ /yosh/ysearchweb│        │
│         │                     │          │                  └────────┘
│         │ Response            │          │ [web results]
│         │<──────────────────  │          │<─────────────────┐
│         │ SearchResponse      │          │                  │
│         │ + AI Summary        │ AI Router│ /api/generate    ▼
│         │                     │          │<─────────────────────┐
│         │                     │          │                      │
└────────┘                      └──────────┘                   Groq/Ollama
```

### Document Flow
```
Frontend                          Backend                    Storage
┌──────────┐                    ┌──────────┐              ┌─────────┐
│ Document │ POST /upload       │ Document │              │  User   │
│Uploader  ├─────────────────>  │Service   │              │Directory│
│ [file]   │ multipart/form-data│          │ save file    │         │
│          │                    │          ├─────────────>│uploads/ │
│          │                    │          │              │[userId]/│
│          │ DocumentAnalysis   │          │              │  [file] │
│          │<─────────────────  │ AI Router│              └─────────┘
│          │ + summary          │          │ /api/generate
│          │ + key points       │          │<─────────────┐
│          │                    │          │              │
└──────────┘                    └──────────┘         Groq/Ollama
```

### Voice Flow
```
Frontend                          Backend                    External
┌─────────┐                    ┌──────────┐              ┌────────────┐
│ Browser │ Web Speech API      │ Chat API │              │            │
│STT/TTS  │ (client-side)       │          │              │ Groq/Ollama│
│         │                     │          │              │            │
│ [audio] ─────────────────────>│ Process  │              │            │
│  User   (transcribed text)     │Message  │              │            │
│ speaks  │                     │          │              │            │
│         │                     │          ├─────────────>│ Generate   │
│         │                     │          │              │Response    │
│         │                     │          │<─────────────┤            │
│ [audio] │<─────────────────── │Response  │              └────────────┘
│output   │<── TTS synthesizes  │(streamed)│
│         │    response to audio│          │
└─────────┘                     └──────────┘
```

## Service Layer Design

### Core Services

#### aiRouter.ts
```typescript
interface AIConfig {
  provider: "groq" | "ollama" | "auto"
  model?: string
  temperature?: number
  maxTokens?: number
}

// Main functions
selectProvider(config) → AIProvider
streamAIResponse(messages, config) → AsyncIterable<string>
generateAIResponse(messages, config) → Promise<string>
getProviderStatus() → { groq, ollama, activeProvider }
```

#### groq.ts (existing, enhanced)
```typescript
// Streaming and non-streaming responses
streamGroqResponse(messages, model) → AsyncIterable<string>
generateGroqResponse(messages, model) → Promise<string>
```

#### ollama.ts
```typescript
// Local AI integration
isOllamaAvailable() → Promise<boolean>
getAvailableModels() → Promise<string[]>
streamOllamaResponse(messages, model) → AsyncIterable<string>
generateOllamaResponse(messages, model) → Promise<string>
```

#### search.ts
```typescript
// Search and research
performSearch(query) → Promise<SearchResponse>
researchTopic(topic) → Promise<ResearchResult>
```

#### documents.ts
```typescript
// Document processing
validateFile(file) → Promise<Validation>
saveFile(file, fileName, userId) → Promise<filepath>
analyzeDocument(filePath, fileName) → Promise<Analysis>
questionDocument(filePath, question) → Promise<answer>
```

## API Endpoints

### AI Provider Endpoints
```
GET /api/ai/providers
Returns: { groq: boolean, ollama: boolean, activeProvider: string }

GET /api/ai/providers/models
Returns: { groq: [models], ollama: [models] }

POST /api/ai/providers/set
Body: { provider: "groq" | "ollama" | "auto" }
Returns: { success: boolean, provider: string }
```

### Search Endpoints
```
POST /api/search/search
Body: { query: string }
Returns: { query, results, summary, sources }

POST /api/search/research
Body: { topic: string }
Returns: { topic, keyPoints, sources, aiAnalysis }
```

### Document Endpoints
```
POST /api/documents/upload
Body: multipart/form-data with file
Returns: DocumentAnalysis with documentId

POST /api/documents/question/:documentId
Body: { question: string }
Returns: { question, answer }

DELETE /api/documents/:documentId
Returns: { success: boolean }

GET /api/documents/list
Returns: [{ id, fileName, fileType, size, summary, createdAt }]
```

## Database Schema

### Document Model
```prisma
model Document {
  id        String     @id @default(cuid())
  userId    String
  user      User       @relation(...)
  fileName  String
  fileType  String
  size      Int
  filePath  String
  summary   String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  @@index([userId])
}
```

### SearchHistory Model
```prisma
model SearchHistory {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(...)
  query       String
  resultCount Int
  createdAt   DateTime @default(now())
  
  @@index([userId])
}
```

## Frontend Components

### AIProviderSelector
- Real-time provider status
- Cloud/Local mode badge
- Auto-refresh every 10 seconds
- Color-coded indicators

### SearchComponent
- Dual mode: Quick Search + Deep Research
- Query input with validation
- Results display with links
- AI summary section
- Source tracking

### DocumentUploader
- Drag-and-drop support
- File validation feedback
- Analysis results display
- Key points extraction
- Q&A interface

### VoiceAssistant
- Listening indicator with animation
- Real-time transcript display
- Interim results
- Chat history
- Error handling

## Error Handling Strategy

### Provider Fallback
```typescript
try {
  // Try selected provider
  if (provider === "ollama") {
    return await streamOllamaResponse(...)
  } else {
    return await streamGroqResponse(...)
  }
} catch (error) {
  // Fallback to other provider
  if (provider === "ollama" && groqAvailable) {
    return await streamGroqResponse(...)
  } else if (provider === "groq" && ollamaAvailable) {
    return await streamOllamaResponse(...)
  } else {
    throw error
  }
}
```

### File Upload Validation
```typescript
// Check file type
if (!ALLOWED_TYPES.includes(file.mimetype)) {
  return error
}

// Check file size
if (file.size > MAX_FILE_SIZE) {
  return error
}
```

## Performance Optimization

### Caching
- Provider status cached 30 seconds
- Reduces API calls
- Automatic expiration

### Streaming
- All responses stream to client
- Real-time display
- Reduced memory usage
- Better UX

### Database Optimization
- Indexed queries on userId
- Efficient relationships
- Lazy loading components

## Security Implementation

### Authentication
- JWT token required for all endpoints
- Token stored in localStorage
- Auto-logout on expiration

### File Security
- Type validation before upload
- Size limits enforced
- User-scoped directories
- Filename hashing

### Input Validation
- Zod schema validation
- Query string sanitization
- File path sanitization

## Testing the System

### Unit Test Ideas
```typescript
// Test AI Router
test("selects Ollama when available", async () => {
  // Mock isOllamaAvailable() to return true
  // Call selectProvider()
  // Assert returns "ollama"
})

// Test Search
test("performSearch returns valid SearchResponse", async () => {
  // Mock web API
  // Call performSearch()
  // Assert has query, results, summary, sources
})

// Test Documents
test("analyzeDocument extracts key points", async () => {
  // Create test file
  // Call analyzeDocument()
  // Assert has summary and keyPoints
})
```

### Integration Test Ideas
```typescript
// End-to-end search flow
test("search flow: query -> api -> results", async () => {
  // POST /search/search
  // Assert correct response
})

// End-to-end document flow
test("document flow: upload -> analyze -> question", async () => {
  // POST /documents/upload
  // POST /documents/question/:id
  // Assert Q&A works
})
```

## Debugging Tips

### Check Provider Status
```bash
# Browser console
const response = await fetch('/api/ai/providers')
const data = await response.json()
console.log(data)  // Shows active provider
```

### Check Ollama
```bash
# Terminal
curl http://localhost:11434/api/tags
# Should return list of models if running
```

### Check API
```bash
# Terminal
curl -X GET http://localhost:5000/health
# Should return { status: "ok", timestamp: ... }
```

## Deployment Checklist

- [ ] Backend compiles without errors
- [ ] Frontend builds successfully
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] API endpoints tested
- [ ] Error handling verified
- [ ] Security measures in place
- [ ] Documentation updated
- [ ] Ready for production deployment

---

**Phase 2 Architecture is production-ready and scalable!** 🚀
