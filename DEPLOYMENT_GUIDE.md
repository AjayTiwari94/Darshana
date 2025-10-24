# 🚀 VERCEL DEPLOYMENT GUIDE

## 📋 DEPLOYMENT OVERVIEW

Darshana has 3 services that need separate deployment:

1. **Frontend (Next.js)** → Vercel ✅
2. **Backend (Node.js)** → Railway, Render, or Fly.io
3. **AI Service (Python Flask)** → Railway, Render, or Google Cloud Run

---

## 🌐 STEP 1: DEPLOY FRONTEND TO VERCEL

### A. Prepare Your Repository

1. **Initialize Git (if not already done):**
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Push to GitHub:**
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/your-username/darshana.git
git branch -M main
git push -u origin main
```

### B. Deploy to Vercel

1. **Go to Vercel:** https://vercel.com
2. **Sign in** with GitHub
3. **Click "New Project"**
4. **Import your repository**
5. **Configure Project:**
   - Framework Preset: **Next.js**
   - Root Directory: **`./`** (leave empty)
   - Build Command: **`npm run build`** (auto-detected)
   - Output Directory: **`.next`** (auto-detected)
   - Install Command: **`npm install`** (auto-detected)

### C. Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```env
# Required
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service-url.com

# Optional
NEXT_PUBLIC_APP_NAME=Darshana
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**Note:** You'll update these URLs after deploying backend and AI service.

### D. Deploy

Click **"Deploy"** and wait ~2-3 minutes.

Your frontend will be live at: `https://your-project.vercel.app`

---

## 🔧 STEP 2: DEPLOY BACKEND (NODE.JS)

### Option A: Railway (Recommended)

1. **Go to Railway:** https://railway.app
2. **Sign in** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select your repository**
5. **Add Service** → **GitHub**
6. **Configure:**
   - Root Directory: **`backend`**
   - Start Command: **`npm run start`** or **`node src/server.js`**
   - Port: **5000** (Railway will auto-detect)

7. **Add Environment Variables:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/darshana
JWT_SECRET=your_super_secret_jwt_key_change_this
CORS_ORIGIN=https://your-project.vercel.app
NODE_ENV=production
```

8. **Deploy** and get your backend URL (e.g., `https://your-backend.up.railway.app`)

### Option B: Render

1. **Go to Render:** https://render.com
2. **New Web Service**
3. **Connect your repository**
4. **Configure:**
   - Root Directory: **`backend`**
   - Build Command: **`npm install`**
   - Start Command: **`npm run start`**

5. **Add Environment Variables** (same as above)
6. **Deploy**

### Backend package.json Scripts

Make sure `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

---

## 🤖 STEP 3: DEPLOY AI SERVICE (PYTHON FLASK)

### Option A: Railway (Recommended)

1. **Railway** → **New Project** → **Deploy from GitHub repo**
2. **Add another service** from the same repo
3. **Configure:**
   - Root Directory: **`ai-service`**
   - Start Command: **`gunicorn -w 4 -b 0.0.0.0:$PORT app:app`**
   - Install Command: **`pip install -r requirements.txt`**

4. **Add Environment Variables:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
MODEL_NAME=gemini-2.5-flash
FLASK_ENV=production
LOG_LEVEL=INFO
PORT=8000
```

5. **Add to `requirements.txt`:**
```txt
gunicorn==21.2.0
```

6. **Deploy** and get your AI service URL

### Option B: Google Cloud Run

1. **Create `Dockerfile` in `ai-service/`:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8080
ENV PYTHONUNBUFFERED=1

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app
```

2. **Deploy to Cloud Run:**
```bash
gcloud run deploy darshana-ai \
  --source ./ai-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🗄️ STEP 4: SETUP MONGODB ATLAS

1. **Go to MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
2. **Create a cluster** (free tier available)
3. **Database Access:** Create a user with password
4. **Network Access:** Add IP `0.0.0.0/0` (allow from anywhere)
5. **Get Connection String:**
```
mongodb+srv://username:password@cluster.mongodb.net/darshana?retryWrites=true&w=majority
```
6. **Update backend environment variables** with this connection string

---

## 🔄 STEP 5: UPDATE FRONTEND WITH DEPLOYED URLS

### In Vercel Dashboard:

1. **Settings** → **Environment Variables**
2. **Update:**
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.up.railway.app
NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service.up.railway.app
```
3. **Redeploy** the frontend (Vercel → Deployments → Redeploy)

---

## ✅ STEP 6: VERIFY DEPLOYMENT

### Test Each Service:

1. **Frontend:**
```
https://your-project.vercel.app
```
Should load the homepage

2. **Backend Health:**
```
https://your-backend.up.railway.app/health
```
Should return: `{"status":"ok"}`

3. **AI Service Health:**
```
https://your-ai-service.up.railway.app/health
```
Should return: `{"status":"healthy","service":"Narad AI"}`

4. **Test Narad AI:**
- Open frontend
- Click Narad AI icon
- Send a message
- Should get a response!

---

## 🔐 SECURITY CHECKLIST

Before going live:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use MongoDB Atlas with authentication
- [ ] Set CORS_ORIGIN to your actual Vercel URL
- [ ] Never commit `.env` files
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set up rate limiting in backend
- [ ] Review API keys and secrets
- [ ] Test all features in production

---

## 💰 COST ESTIMATE

**Free Tier Limits:**
- **Vercel:** Unlimited for personal projects
- **Railway:** $5 credit/month (enough for 2 services)
- **MongoDB Atlas:** 512MB storage (free forever)
- **Google Gemini API:** Free tier available

**Total:** ~$0-5/month for hobby use

---

## 🔄 CONTINUOUS DEPLOYMENT

Once set up, any push to `main` branch will:
- ✅ Auto-deploy frontend to Vercel
- ✅ Auto-deploy backend to Railway
- ✅ Auto-deploy AI service to Railway

---

## 🐛 TROUBLESHOOTING

### Frontend shows CORS errors:
- Update `CORS_ORIGIN` in backend to Vercel URL

### Narad AI not responding:
- Check AI service environment variables
- Verify GEMINI_API_KEY is set correctly
- Check AI service logs in Railway

### Database connection failed:
- Verify MongoDB Atlas connection string
- Check Network Access whitelist
- Ensure user has proper permissions

### Build fails on Vercel:
- Check `package.json` has all dependencies
- Verify Node.js version compatibility
- Check build logs for errors

---

## 📊 MONITORING

### Vercel:
- Analytics: Built-in
- Logs: Vercel Dashboard → Deployments → Logs

### Railway:
- Logs: Railway Dashboard → Service → Logs
- Metrics: CPU, Memory, Network usage

### MongoDB Atlas:
- Monitoring: Atlas Dashboard → Metrics
- Alerts: Set up email alerts

---

## 🚀 DEPLOYMENT COMMANDS SUMMARY

```bash
# 1. Frontend (Vercel CLI - optional)
npm i -g vercel
vercel login
vercel --prod

# 2. Backend (Railway CLI - optional)
npm i -g @railway/cli
railway login
railway up

# 3. AI Service (Railway)
railway link
railway up

# Or use GitHub integration (recommended)
```

---

## 📝 ENVIRONMENT VARIABLES REFERENCE

### Frontend (.env on Vercel)
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.up.railway.app
NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service.up.railway.app
```

### Backend (.env on Railway)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super_secret_key
CORS_ORIGIN=https://your-project.vercel.app
NODE_ENV=production
```

### AI Service (.env on Railway)
```env
GEMINI_API_KEY=your_api_key
MODEL_NAME=gemini-2.5-flash
FLASK_ENV=production
LOG_LEVEL=INFO
```

---

## 🎉 SUCCESS!

Your Darshana platform is now live on:
- **Frontend:** https://your-project.vercel.app
- **Backend:** https://your-backend.up.railway.app
- **AI Service:** https://your-ai-service.up.railway.app

**Share your project with the world! 🌍✨**

---

## 📞 NEED HELP?

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**Deployed:** Ready for Production ✅
**Monitored:** Yes (Vercel + Railway)
**Scalable:** Auto-scaling enabled
**Secure:** HTTPS + Environment variables

