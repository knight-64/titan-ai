# API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Authentication Endpoints

### POST /auth/signup
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGc..."
}
```

### POST /auth/login
Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGc..."
}
```

## Chat Endpoints

### POST /chat/send
Send a message and get streaming AI response.

**Request:**
```json
{
  "chatId": "optional-chat-id",
  "message": "Hello Titan!",
  "aiMode": "friendly"
}
```

**Response:** Server-Sent Events (SSE) stream
```
data: {"content": "Hello! How "}
data: {"content": "can I help"}
data: {"content": " you today?"}
data: {"done": true}
```

### GET /chat/list
Get list of all user chats.

**Response (200):**
```json
[
  {
    "id": "clxxx...",
    "title": "How to learn React...",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:05:00Z",
    "_count": { "messages": 5 }
  }
]
```

### GET /chat/history/:chatId
Get full chat history with all messages.

**Response (200):**
```json
{
  "id": "clxxx...",
  "title": "How to learn React",
  "messages": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "How do I learn React?",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "msg-2",
      "role": "assistant",
      "content": "Here are some great resources...",
      "createdAt": "2024-01-01T00:00:05Z"
    }
  ]
}
```

## Memory Endpoints

### POST /memory/create
Create a new memory item.

**Request:**
```json
{
  "category": "work",
  "title": "Project Alpha Notes",
  "content": "Key points about the project..."
}
```

**Response (201):**
```json
{
  "id": "mem-xxx",
  "userId": "user-xxx",
  "category": "work",
  "title": "Project Alpha Notes",
  "content": "Key points about the project...",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### GET /memory/list
Get all memories, optionally filtered by category.

**Query Parameters:**
- `category` (optional): Filter by category (personal, work, learning, projects, tasks)

**Response (200):**
```json
[
  {
    "id": "mem-1",
    "category": "work",
    "title": "Project Notes",
    "content": "...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET /memory/:id
Get a specific memory.

**Response (200):**
```json
{
  "id": "mem-xxx",
  "category": "work",
  "title": "Project Alpha Notes",
  "content": "...",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### PUT /memory/:id
Update a memory.

**Request:** (any fields to update)
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Response (200):** Updated memory object

### DELETE /memory/:id
Delete a memory.

**Response (200):**
```json
{ "success": true }
```

### GET /memory/search/query?q=search
Search memories by title or content.

**Query Parameters:**
- `q` (required): Search query string

**Response (200):** Array of matching memories

## AI Settings Endpoints

### GET /ai/modes
Get all available AI personality modes.

**Response (200):**
```json
[
  {
    "id": "mode-1",
    "mode": "friendly",
    "systemPrompt": "You are Titan, a friendly...",
    "temperature": 0.8,
    "maxTokens": 2000
  }
]
```

### GET /ai/current
Get current user's AI mode.

**Response (200):**
```json
{
  "mode": "friendly"
}
```

### PUT /ai/mode
Update user's AI personality mode.

**Request:**
```json
{
  "aiMode": "professional"
}
```

**Response (200):**
```json
{
  "id": "user-xxx",
  "aiMode": "professional"
}
```

### GET /ai/profile
Get full user profile with analytics.

**Response (200):**
```json
{
  "user": {
    "id": "user-xxx",
    "email": "user@example.com",
    "name": "John Doe",
    "aiMode": "friendly",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "analytics": {
    "messageCount": 42,
    "chatCount": 8,
    "memoryCount": 15,
    "lastActive": "2024-01-02T10:30:00Z"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input: title is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Chat not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- Groq API: Free tier has rate limits - check your account
- Backend: No explicit rate limiting in MVP (add in production)

## WebSocket Support (Phase 2)

Real-time updates coming in Phase 2:
- Live streaming improvements
- Real-time notifications
- Collaborative features

## Pagination (Future)

```
GET /api/chat/list?page=1&limit=10
GET /api/memory/list?page=1&limit=20
```

---

For more details, check the source code in `backend/src/routes/`
