# Titan AI - Quick Launch Guide

## ✅ Status: READY TO USE

Your Groq API key has been configured and tested. The system is ready to launch!

## 🚀 Launch in 3 Steps

### Step 1: Terminal 1 - Start Backend

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Titan Backend running on http://localhost:5000
📊 Health check: http://localhost:5000/health
```

### Step 2: Terminal 2 - Start Frontend

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
> next dev

  ▲ Next.js 14.x.x
  - ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 3: Open in Browser

Visit: **http://localhost:3000**

## 🧪 First Test

1. **Sign Up** - Create a test account
   - Email: test@example.com
   - Password: TestPassword123

2. **Send a Message** - Try: "Hello Titan! How are you?"

3. **Change Personality** - Click personality selector, try "Mentor" mode

4. **Create Memory** - Add a memory in the Memory section

5. **Check Stats** - View analytics in Settings

## 📊 Monitoring Logs

**Backend Logs** (Terminal 1):
- Look for API requests and responses
- Watch for any errors in red

**Frontend Logs** (Terminal 2):
- Check for build warnings
- Monitor console output

**Browser Console** (F12):
- Check for any JavaScript errors
- Monitor network requests (Network tab)

## 🔧 Environment Configuration

Your configuration is ready:

```env
✅ GROQ_API_KEY=your_groq_api_key_here
✅ DATABASE_URL=file:./prisma/dev.db
✅ JWT_SECRET=configured
✅ BACKEND_PORT=5000
✅ NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📱 Features to Try

### Chat Features
- ✅ Real-time AI responses with streaming
- ✅ Message history saved automatically
- ✅ Markdown rendering in responses
- ✅ Code syntax highlighting

### AI Personalities
1. **Friendly** - Warm and conversational
2. **Professional** - Business-focused
3. **Mentor** - Educational mode
4. **Motivational** - Inspiring tone
5. **Funny** - Witty responses
6. **Coding** - Expert programmer

### Memory System
- ✅ Create memories in 5 categories
- ✅ Search your memories
- ✅ Edit and delete memories
- ✅ Auto-inject into chat context

### Analytics
- ✅ Message count tracking
- ✅ Chat count
- ✅ Memory count
- ✅ Usage statistics

## 🐛 Troubleshooting

### Port 5000 Already in Use
```bash
# Change backend port in .env.local
BACKEND_PORT=5001
```

### Frontend Can't Connect to Backend
1. Check backend is running: http://localhost:5000/health
2. Check browser console (F12) for CORS errors
3. Verify NEXT_PUBLIC_API_URL matches

### Groq API Errors
1. Verify API key is correct
2. Check https://console.groq.com/ for quota
3. Try a simple message first

### Database Errors
```bash
# Reset database
cd backend
rm prisma/dev.db
DATABASE_URL="file:./prisma/dev.db" npx prisma migrate dev --name init
DATABASE_URL="file:./prisma/dev.db" npx ts-node prisma/seed.ts
```

## 📚 Important Files

- `README.md` - Full documentation
- `CLAUDE.md` - Project overview
- `docs/API.md` - All API endpoints
- `docs/SETUP.md` - Installation guide
- `docs/ARCHITECTURE.md` - System design
- `PROJECT_STATUS.md` - Feature checklist

## 🎯 Next Steps After Launch

1. **Explore the Interface**
   - Try all personality modes
   - Test memory creation
   - Check analytics

2. **Review the Code**
   - Backend routes in `backend/src/routes/`
   - Frontend components in `frontend/components/`
   - API integration in `frontend/services/`

3. **Test the API**
   - Use http://localhost:5000/health for health check
   - Try API endpoints with Postman or curl

4. **Plan Phase 2**
   - Ollama integration notes
   - Voice assistant ideas
   - Additional features

## ⚡ Performance Tips

- Keep browser DevTools closed while testing (saves resources)
- Use incognito/private mode to avoid cache issues
- Monitor both terminal windows for errors
- Check network tab if experiencing slowness

## 🔐 Security Notes

- API key is configured in .env.local
- JWT tokens expire in 7 days
- Passwords are hashed with bcrypt
- Never commit .env.local to git

## 💡 Testing Ideas

1. **Test streaming** - Send a long request and watch response appear character by character
2. **Test memory injection** - Create a memory, then ask Titan to recall it
3. **Test personality switching** - Send same message with different modes
4. **Test search** - Create multiple memories, then search
5. **Test authentication** - Sign up, sign out, log back in

## 📞 Support Resources

All documentation is in the repository:
- `/docs/` folder - Detailed guides
- `/README.md` - Quick reference
- `/PROJECT_STATUS.md` - Feature list

---

**You're all set!** 🎉

Run the 3 launch steps above to start Titan. Have fun exploring!

If you encounter any issues, check the troubleshooting section or review the detailed documentation.

**Happy Building!** 🚀
