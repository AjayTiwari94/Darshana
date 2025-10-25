# Vercel Environment Variables Setup

## Required Environment Variables for Vercel

To fix the "Failed to fetch" error and ensure your Darshana app works correctly on Vercel, you need to set the following environment variables:

### 1. Frontend Environment Variables (Vercel Project Settings)

Go to your Vercel project → Settings → Environment Variables and add:

#### **NEXT_PUBLIC_API_URL** (CRITICAL - Required)
- **Variable Name**: `NEXT_PUBLIC_API_URL`
- **Value**: Your backend API URL
  - **Option A (Recommended)**: Deploy backend on Railway/Render/Heroku
    - Example: `https://darshana-backend.railway.app`
    - Example: `https://darshana-api.onrender.com`
  - **Option B**: Use Vercel Serverless Functions (requires backend migration)
  - **Option C (NOT RECOMMENDED for production)**: Use ngrok/tunneling service temporarily for testing

#### **Example Setup**:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### 2. Backend Deployment (Separate Service)

Your Node.js backend needs to be deployed separately. Here are your options:

#### Option A: Railway (Recommended - Free Tier Available)
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repo
4. Set the root directory to `Darshana/backend`
5. Add environment variables:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key_minimum_32_characters
   CORS_ORIGIN=https://darshana-dun.vercel.app
   GEMINI_API_KEY=your_gemini_api_key
   AI_SERVICE_URL=your_ai_service_url
   ```
6. Deploy
7. Copy the generated URL (e.g., `https://darshana-backend.up.railway.app`)
8. Add this URL as `NEXT_PUBLIC_API_URL` in Vercel

#### Option B: Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repo
4. Set root directory to `Darshana/backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables (same as Railway)
8. Deploy and copy the URL

#### Option C: Heroku
1. Install Heroku CLI
2. Create a new Heroku app
3. Deploy the backend folder
4. Add environment variables via Heroku dashboard
5. Copy the app URL

### 3. AI Service Deployment (Python Service)

Deploy the AI service separately:

#### Railway/Render for Python:
1. Create another service/project
2. Set root directory to `Darshana/ai-service`
3. Add environment variables:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   PORT=8080
   FLASK_ENV=production
   ```
4. Deploy
5. Copy the URL and add it to backend environment variables as `AI_SERVICE_URL`

## Complete Environment Variables Checklist

### Vercel (Frontend)
- [x] `NEXT_PUBLIC_API_URL` - Backend API URL

### Railway/Render (Backend)
- [x] `NODE_ENV=production`
- [x] `PORT=5000`
- [x] `MONGODB_URI` - MongoDB connection string
- [x] `JWT_SECRET` - Secret key for JWT tokens (minimum 32 characters)
- [x] `CORS_ORIGIN=https://darshana-dun.vercel.app`
- [x] `GEMINI_API_KEY` - Your Google Gemini API key
- [x] `AI_SERVICE_URL` - URL of your deployed AI service

### Railway/Render (AI Service)
- [x] `GEMINI_API_KEY` - Your Google Gemini API key
- [x] `PORT=8080`
- [x] `FLASK_ENV=production`

## Testing After Setup

1. **Test Backend Health**:
   ```bash
   curl https://your-backend-url.com/health
   ```
   Should return: `{"status": "OK", ...}`

2. **Test AI Service Health**:
   ```bash
   curl https://your-ai-service-url.com/health
   ```
   Should return: `{"status": "healthy", ...}`

3. **Test Frontend**:
   - Visit `https://darshana-dun.vercel.app/auth/register`
   - Try registering a new user
   - Check browser console (F12) for any errors

## Troubleshooting

### "Failed to fetch" Error
- ✅ Make sure `NEXT_PUBLIC_API_URL` is set in Vercel
- ✅ Make sure backend is deployed and accessible
- ✅ Check backend CORS settings (should allow your Vercel domain)
- ✅ Redeploy Vercel after adding environment variables

### CORS Errors
- ✅ Update `CORS_ORIGIN` in backend to include your Vercel URL
- ✅ Make sure backend server.js has updated CORS configuration
- ✅ Check browser console for specific CORS error messages

### Backend Connection Timeout
- ✅ Make sure backend service is running (not sleeping/paused)
- ✅ Check if backend requires API keys or authentication
- ✅ Verify MongoDB connection is working

## Quick Fix for Immediate Testing

If you need to test immediately without backend deployment:

1. Run backend locally:
   ```bash
   cd Darshana/backend
   npm install
   npm start
   ```

2. Use ngrok to expose it:
   ```bash
   ngrok http 5000
   ```

3. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

4. Add to Vercel environment variables:
   ```env
   NEXT_PUBLIC_API_URL=https://abc123.ngrok.io
   ```

5. Redeploy Vercel

**Note**: This is ONLY for testing. ngrok URLs expire and are not suitable for production.

## After Setting Environment Variables

1. Go to Vercel → Deployments
2. Click "Redeploy" on your latest deployment
3. Wait for the new build to complete
4. Test your registration page again

## Need Help?

If you're still experiencing issues:
1. Check Vercel deployment logs
2. Check backend service logs
3. Check browser console (F12 → Console tab)
4. Ensure all environment variables are set correctly

