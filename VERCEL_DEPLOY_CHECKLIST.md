# ✅ VERCEL DEPLOYMENT CHECKLIST

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. Git Repository
- [ ] Project is in a Git repository
- [ ] All changes are committed
- [ ] Pushed to GitHub/GitLab/Bitbucket

### 2. Environment Variables Ready
- [ ] GEMINI_API_KEY obtained from Google AI Studio
- [ ] JWT_SECRET generated (strong random string)
- [ ] MongoDB Atlas cluster created and connection string ready

### 3. Configuration Files
- [ ] `vercel.json` exists in root
- [ ] `.vercelignore` exists in root
- [ ] `ai-service/Procfile` exists
- [ ] `ai-service/runtime.txt` exists
- [ ] `gunicorn` added to `ai-service/requirements.txt`

---

## 🚀 DEPLOYMENT STEPS

### STEP 1: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Framework Preset: **Next.js** (auto-detected)
5. Click "Deploy"

**Time:** ~2-3 minutes

### STEP 2: Deploy Backend to Railway

1. Go to https://railway.app and sign in
2. "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. **Root Directory:** `backend`
5. **Start Command:** `npm run start`
6. Add environment variables (see below)
7. Deploy

**Time:** ~3-5 minutes

### STEP 3: Deploy AI Service to Railway

1. In same Railway project, click "+ New"
2. "GitHub Repo" → Select same repository
3. **Root Directory:** `ai-service`
4. **Start Command:** `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
5. Add environment variables (see below)
6. Deploy

**Time:** ~5-7 minutes (first build takes longer)

### STEP 4: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Database Access → Add user
4. Network Access → Add IP `0.0.0.0/0`
5. Get connection string

**Time:** ~5 minutes

### STEP 5: Update Frontend Environment Variables

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add backend and AI service URLs
3. Redeploy

**Time:** ~2 minutes

---

## 🔑 ENVIRONMENT VARIABLES

### Vercel (Frontend)
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.up.railway.app
NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service.up.railway.app
```

### Railway - Backend
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/darshana
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
CORS_ORIGIN=https://your-project.vercel.app
NODE_ENV=production
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Railway - AI Service
```
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
MODEL_NAME=gemini-2.5-flash
FLASK_ENV=production
LOG_LEVEL=INFO
PORT=8000
```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### 1. Frontend Check
```
✓ Visit https://your-project.vercel.app
✓ Page loads without errors
✓ Check browser console (F12) for errors
```

### 2. Backend Check
```
✓ Visit https://your-backend.up.railway.app/health
✓ Should return: {"status":"ok"}
```

### 3. AI Service Check
```
✓ Visit https://your-ai-service.up.railway.app/health
✓ Should return: {"status":"healthy","service":"Narad AI"}
```

### 4. Full Integration Test
```
✓ Open frontend
✓ Click Narad AI chat icon
✓ Send message: "Tell me about Taj Mahal"
✓ Receive proper response
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Frontend build fails on Vercel
**Fix:** 
- Check `package.json` has all dependencies
- Verify no TypeScript errors
- Check build logs in Vercel

### Issue: Backend doesn't start on Railway
**Fix:**
- Verify `package.json` has `"start": "node src/server.js"`
- Check environment variables are set
- Review Railway logs

### Issue: AI Service crashes on Railway
**Fix:**
- Ensure `gunicorn` is in `requirements.txt`
- Check `Procfile` exists
- Verify `GEMINI_API_KEY` is valid
- Check Railway logs for Python errors

### Issue: CORS errors in browser
**Fix:**
- Update `CORS_ORIGIN` in backend to match Vercel URL
- Ensure no trailing slash in URLs
- Redeploy backend after changes

### Issue: Narad AI not responding
**Fix:**
- Check AI service is running
- Verify `GEMINI_API_KEY` is correct
- Check frontend has correct `NEXT_PUBLIC_AI_SERVICE_URL`
- Test AI service health endpoint directly

---

## 📊 ESTIMATED DEPLOYMENT TIME

| Task | Time |
|------|------|
| Frontend to Vercel | 2-3 min |
| Backend to Railway | 3-5 min |
| AI Service to Railway | 5-7 min |
| MongoDB Atlas setup | 5 min |
| Configuration & testing | 5-10 min |
| **TOTAL** | **20-30 minutes** |

---

## 💰 COST BREAKDOWN

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| Vercel | ✅ Unlimited for personal | $0 |
| Railway | $5 credit/month | $0-5 |
| MongoDB Atlas | 512MB storage | $0 |
| Google Gemini API | Free tier | $0 |
| **TOTAL** | | **$0-5/month** |

---

## 🎉 SUCCESS CRITERIA

Your deployment is successful when:

- ✅ Frontend loads at your Vercel URL
- ✅ Backend health check returns OK
- ✅ AI service health check returns OK
- ✅ User can register and login
- ✅ Narad AI responds to messages
- ✅ All features work correctly
- ✅ No console errors in browser
- ✅ Mobile responsive design works

---

## 📞 SUPPORT RESOURCES

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **MongoDB Atlas:** https://docs.atlas.mongodb.com
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

## 🔄 CONTINUOUS DEPLOYMENT

After initial setup:
- ✅ Push to `main` branch → Auto-deploys to Vercel (frontend)
- ✅ Push to `main` branch → Auto-deploys to Railway (backend + AI)
- ✅ No manual deployment needed!

---

**Ready to deploy? Follow the steps above and you'll be live in 20-30 minutes! 🚀**

