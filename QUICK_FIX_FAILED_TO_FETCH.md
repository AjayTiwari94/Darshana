# 🚨 QUICK FIX: "Failed to fetch" Error on Registration Page

## The Problem
Your Vercel deployment at `https://darshana-dun.vercel.app/auth/register` shows "Failed to fetch" error because:
1. The frontend is trying to call `http://localhost:5000` (local backend)
2. `NEXT_PUBLIC_API_URL` environment variable is NOT set in Vercel
3. Backend is not deployed or accessible from the internet

## ⚡ IMMEDIATE SOLUTION (Choose One)

### Option A: Deploy Backend to Railway (Recommended - 10 minutes)

1. **Go to Railway.app**
   - Visit https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Root Directory: `backend` (IMPORTANT!)
   - Start Command: `npm start` (should auto-detect)

4. **Add Environment Variables**
   Click "Variables" tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your_secret_key_here_minimum_32_characters_long
   CORS_ORIGIN=https://darshana-dun.vercel.app
   MONGODB_URI=mongodb+srv://ajay:okGoogle936@darshanadb.bxanviv.mongodb.net/darshana?retryWrites=true&w=majority&appName=darshanaDB
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 3-5 minutes
   - Copy the generated URL (e.g., `https://darshana-backend.up.railway.app`)

6. **Update Vercel**
   - Go to Vercel Dashboard
   - Your Project → Settings → Environment Variables
   - Add new variable:
     - Name: `NEXT_PUBLIC_API_URL`
     - Value: `https://darshana-backend.up.railway.app` (your Railway URL)
   - Click "Save"
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment

7. **Test**
   - Wait for Vercel to finish redeploying (2-3 minutes)
   - Visit `https://darshana-dun.vercel.app/auth/register`
   - Try registering - should work now! ✅

---

### Option B: Use Render (Alternative to Railway)

1. **Go to Render.com**
   - Visit https://render.com
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository

3. **Configure**
   - Name: `darshana-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables**
   Same as Railway (see Option A step 4)

5. **Deploy & Update Vercel**
   - Same as Railway (see Option A steps 5-7)

---

### Option C: Quick Test with ngrok (Temporary - 5 minutes)

⚠️ **Only for immediate testing. Not suitable for production!**

1. **Start Backend Locally**
   ```bash
   cd Darshana/backend
   npm install
   npm start
   ```

2. **Expose with ngrok**
   ```bash
   # Install ngrok: https://ngrok.com/download
   ngrok http 5000
   ```

3. **Copy ngrok URL**
   - You'll see: `Forwarding https://abc123.ngrok.io -> http://localhost:5000`
   - Copy the HTTPS URL: `https://abc123.ngrok.io`

4. **Update Vercel Environment Variable**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://abc123.ngrok.io`
   - Redeploy

⚠️ **Important**: ngrok URLs expire! This is ONLY for testing.

---

## 🎯 What Gets Fixed

After following any option above:

✅ Registration page will work  
✅ Login will work  
✅ Backend API calls will succeed  
✅ No more "Failed to fetch" errors  

---

## 🔍 Verification Steps

1. **Check Backend is Running**
   ```bash
   curl https://your-backend-url.com/health
   ```
   Should return:
   ```json
   {"status":"OK","timestamp":"2024-...","uptime":123}
   ```

2. **Check Frontend Can Reach Backend**
   - Open `https://darshana-dun.vercel.app`
   - Press F12 (Developer Tools)
   - Go to Console tab
   - Run:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_API_URL)
   ```
   Should show your backend URL (not localhost!)

3. **Test Registration**
   - Go to registration page
   - Fill in the form
   - Submit
   - Should successfully register (no errors)

---

## 📝 Important Notes

### MongoDB Setup
If you haven't set up MongoDB yet:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create FREE cluster (M0)
3. Database Access → Add user (save username/password)
4. Network Access → Add IP: `0.0.0.0/0` (allow all)
5. Get connection string → Add to backend env vars as `MONGODB_URI`

### JWT Secret
Generate a secure random string:
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use online generator:
# https://www.random.org/strings/
```

### Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Add to backend env vars as `GEMINI_API_KEY`

### ⚠️ IMPORTANT: Gemini Model Configuration
When setting up the AI service, use the LATEST model:
```env
MODEL_NAME=models/gemini-pro-latest
```

**DO NOT USE** these deprecated models:
- ❌ `gemini-1.5-flash` (causes 404 errors)
- ❌ `gemini-1.5-pro` (deprecated)
- ❌ `gemini-pro` (old version)

See `ai-service/README_DEPLOYMENT.md` for full AI service deployment guide.

---

## ❓ Still Not Working?

### Check These:

1. **Environment Variable Not Applied?**
   - After adding env vars in Vercel, you MUST redeploy
   - Don't just refresh the page - trigger a new deployment

2. **Backend Not Accessible?**
   ```bash
   curl https://your-backend-url.com/health
   ```
   If this fails, backend isn't running properly

3. **CORS Error?**
   - Check backend logs for "CORS blocked origin" messages
   - Verify `CORS_ORIGIN` in backend matches your Vercel URL exactly
   - No trailing slashes!

4. **Check Browser Console**
   - F12 → Console tab
   - Look for error messages
   - Check Network tab → Failed requests → Response

---

## 🆘 Emergency Contact

If you're completely stuck:

1. **Check Logs**
   - Vercel: Deployments → Click on deployment → View Function Logs
   - Railway/Render: Dashboard → Logs tab

2. **Common Mistakes**
   - Forgetting to redeploy Vercel after adding env vars ❌
   - Using `http://` instead of `https://` for backend URL ❌
   - Trailing slash in URLs: `https://backend.com/` ❌ (should be `https://backend.com`)
   - Wrong environment variable name (must be `NEXT_PUBLIC_API_URL` exactly)

---

## ✅ Success Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Backend health check returns OK
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] Vercel redeployed after adding env var
- [ ] Registration page loads without errors
- [ ] Can successfully register a new user
- [ ] No errors in browser console

---

**Follow these steps and your registration will work! 🎉**

