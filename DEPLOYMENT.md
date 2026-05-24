# 🚀 Titan AI - Production Deployment Guide

## Frontend Deployment (Vercel) - 1 Click

**Fastest way to deploy:**

1. Go to: https://vercel.com/new
2. Select "Other" → Import Git Repository
3. Paste: `https://github.com/knight-64/titan-ai-v2`
4. Click "Import"
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./frontend
6. Click "Deploy"
7. Vercel will give you a URL (e.g., `https://titan-ai-v2.vercel.app`)

**Note down this URL** - you'll need it for backend configuration.

---

## Backend Deployment (Railway)

### Step 1: Create Railway Project
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select repository: `knight-64/titan-ai-v2`
4. Click "Deploy"

### Step 2: Add Environment Variables
In Railway dashboard, go to Variables tab and add:

```
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_super_secret_jwt_key_change_in_production
DATABASE_URL=file:./prisma/dev.db
NODE_ENV=production
BACKEND_PORT=5000
```

### Step 3: Configure Deploy Settings
1. Click "Settings" tab
2. Set:
   - **Start Command:** `cd backend && npm run build && npm start`
   - **Root Directory:** `backend`

### Step 4: Deploy
1. Go to "Deployments" tab
2. Click "Redeploy"
3. Wait for green checkmark
4. Click "View" to get your backend URL

**Note:** Railway will give you a URL like `https://your-app.railway.app`

---

## Connect Frontend to Backend

1. Go to Vercel dashboard → Your project
2. Go to "Settings" → "Environment Variables"
3. Add:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-app.railway.app` (your Railway backend URL)
4. Click "Save"
5. Click "Redeploy" to update frontend

---

## Verify Everything Works

✅ Frontend: Visit your Vercel URL  
✅ Chat works - send a message  
✅ Voice input (🎤) - click mic button  
✅ Voice output (🔊) - click speak button  
✅ Backend health: `https://your-app.railway.app/health`

---

## Troubleshooting

### Frontend blank screen?
- Clear cache: Ctrl+Shift+Del, clear all
- Hard refresh: Ctrl+Shift+R
- Check console for errors: F12 → Console

### Chat not responding?
- Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify backend is deployed (check Railway dashboard)
- Check `/health` endpoint responds

### Voice not working?
- Browser must support Web Speech API (Chrome, Edge, Safari)
- Check browser console for errors
- Try different browser

---

## Need Help?

- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app
- GitHub Issues: https://github.com/knight-64/titan-ai-v2/issues

---

**Deployment complete! Your Titan AI is now live! 🎉**
