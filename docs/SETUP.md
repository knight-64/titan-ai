# Titan AI - Installation & Setup Guide

## System Requirements

- **Node.js** 18+ (Download: https://nodejs.org/)
- **npm** 9+ (Included with Node.js)
- **Git** (Download: https://git-scm.com/)
- **Text Editor** (VS Code recommended: https://code.visualstudio.com/)

## Quick Start (5-10 minutes)

### 1. Clone and Navigate

```bash
cd d:\titan_AI
```

### 2. Get Groq API Key

1. Visit https://console.groq.com/
2. Sign up or login
3. Go to API Keys section
4. Create a new API key
5. Copy the key (keep it safe!)

### 3. Setup Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Groq API key:

```env
GROQ_API_KEY=gsk_your_actual_key_here
```

### 4. Install Dependencies

**Option A - Automated (Windows):**
```bash
setup.bat
```

**Option B - Automated (macOS/Linux):**
```bash
bash setup.sh
```

**Option C - Manual:**
```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 5. Setup Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
cd ..
```

This will:
- Create SQLite database (`prisma/dev.db`)
- Run migrations
- Seed AI modes

### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### 7. Access the App

Open http://localhost:3000 in your browser

## First Time Setup Checklist

- [ ] Node.js installed (`node --version`)
- [ ] Groq API key obtained
- [ ] `.env.local` created with API key
- [ ] `npm install` completed for both backend and frontend
- [ ] Database migrations ran successfully
- [ ] Backend starts without errors
- [ ] Frontend builds without errors
- [ ] Can access http://localhost:3000

## Testing the Setup

### Test Sign Up
1. Go to http://localhost:3000/auth/signup
2. Create test account
3. Verify redirected to dashboard

### Test Chat
1. Type: "Hello Titan!"
2. Wait for response
3. Verify message appears

### Test Personality Mode
1. Click personality selector
2. Choose "Mentor"
3. Send new message
4. Verify different response style

### Test Memory
1. Click "Memory" in sidebar
2. Create new memory
3. Test search
4. Delete memory

## Troubleshooting

### Node.js Not Found
```
Error: command not found: node
```
**Solution:** Install Node.js from https://nodejs.org/

### npm install Fails
```
npm error code ETARGET
npm error notarget No matching version found
```
**Solution:** 
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

### Database Error
```
Error: ENOENT: no such file or directory
```
**Solution:**
```bash
# Reset database
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
npx prisma db seed
```

### Groq API Error
```
Error: Invalid API Key
```
**Solution:**
1. Verify API key in `.env.local`
2. Check key format (should start with `gsk_`)
3. Visit https://console.groq.com/ to verify key is active

### Frontend Can't Connect to Backend
```
Failed to fetch (CORS error)
```
**Solution:**
1. Verify backend is running: http://localhost:5000/health
2. Check `NEXT_PUBLIC_API_URL=http://localhost:5000`
3. Restart both servers

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Kill process using port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

## Development Commands

### Backend
```bash
cd backend

# Start dev server (auto-reload)
npm run dev

# Build for production
npm run build

# Run TypeScript compiler
npm run tsc

# Database
npx prisma migrate dev      # Create migration
npx prisma migrate reset    # Reset database
npx prisma db seed          # Seed data
npx prisma studio           # GUI database viewer
```

### Frontend
```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

### Backend (.env.local)
```
# Required
GROQ_API_KEY=gsk_xxxxx

# Database
DATABASE_URL=file:./prisma/dev.db

# Auth
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Server
NODE_ENV=development
BACKEND_PORT=5000
```

### Frontend (.env.local)
```
# API
NEXT_PUBLIC_API_URL=http://localhost:5000

# App
NEXT_PUBLIC_APP_NAME=Titan AI
```

## Git Workflow

### Make Changes
```bash
git status
git add .
git commit -m "feat: description of changes"
```

### View History
```bash
git log --oneline
git diff
```

## Next Steps

### After Setup Works
1. Explore the codebase
2. Try all features
3. Read API documentation
4. Plan Phase 2 features

### Before Production Deployment
1. Change JWT_SECRET to random value
2. Set NODE_ENV=production
3. Use PostgreSQL instead of SQLite
4. Set up error logging
5. Enable CORS properly
6. Add rate limiting

## Resources

- **Backend API**: See `/docs/API.md`
- **Architecture**: See `/docs/ARCHITECTURE.md`
- **Groq Docs**: https://console.groq.com/docs/
- **Prisma**: https://www.prisma.io/docs/
- **Next.js**: https://nextjs.org/docs
- **Express**: https://expressjs.com/

## Support & Debugging

### Check Server Health
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### View Backend Logs
- Watch terminal where `npm run dev` is running
- Look for errors or warnings

### View Frontend Errors
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Enable Debug Mode
Backend:
```env
DEBUG=titan:*
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Blank dashboard | Check auth token in localStorage |
| No AI response | Verify Groq API key is valid |
| Memory not saving | Check database is initialized |
| Styles not loading | Clear `.next` folder and rebuild |
| CORS errors | Ensure backend URL matches in .env |

## Performance Tips

- Close browser tabs you're not using
- Use Chrome/Firefox DevTools Performance tab
- Monitor Network tab for large requests
- Check memory usage of Node processes

---

**You're all set!** Start chatting with Titan. 🚀
