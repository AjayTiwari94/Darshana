# Deployment Guide - Gemini AI Fix

## Issues Found and Solutions

### 1. Environment Variables Missing in Railway

**Problem**: `GEMINI_API_KEY` is not set in Railway deployment.

**Solution**: 
1. Go to your Railway project dashboard
2. Navigate to Variables tab
3. Add these environment variables:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   MODEL_NAME=gemini-1.5-pro
   FLASK_ENV=production
   LOG_LEVEL=INFO
   ```

### 2. CORS Configuration Fixed

**Problem**: Vercel frontend domain was not allowed in CORS.

**Solution**: Updated `ai-service/app.py` to include Vercel domains:
```python
CORS(app, origins=[
    "http://localhost:3000", 
    "http://localhost:3001", 
    "http://localhost:3002", 
    "http://localhost:3003", 
    "http://127.0.0.1:3000",
    "https://*.vercel.app",  # Allow all Vercel deployments
    "https://darshana-heritage.vercel.app"  # Your specific Vercel domain
])
```

### 3. Frontend AI Service URL Configuration

**Problem**: Frontend doesn't know where the AI service is deployed.

**Solution**: Set environment variable in Vercel:
1. Go to Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add:
   ```
   NEXT_PUBLIC_AI_SERVICE_URL=https://your-railway-ai-service-url.railway.app
   ```

### 4. Backend AI Service URL Configuration

**Problem**: Backend doesn't know where the AI service is deployed.

**Solution**: Set environment variable in Railway:
```
AI_SERVICE_URL=https://your-railway-ai-service-url.railway.app
```

## Step-by-Step Fix

### Step 1: Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the API key

### Step 2: Update Railway Environment Variables
1. Go to Railway dashboard
2. Select your AI service project
3. Go to Variables tab
4. Add/Update:
   - `GEMINI_API_KEY` = your actual API key
   - `MODEL_NAME` = `gemini-1.5-pro`
   - `FLASK_ENV` = `production`
   - `LOG_LEVEL` = `INFO`

### Step 3: Update Vercel Environment Variables
1. Go to Vercel dashboard
2. Select your frontend project
3. Go to Settings > Environment Variables
4. Add:
   - `NEXT_PUBLIC_AI_SERVICE_URL` = your Railway AI service URL

### Step 4: Redeploy Both Services
1. Redeploy AI service on Railway (it will pick up new env vars)
2. Redeploy frontend on Vercel (it will pick up new env vars)

## Testing

After deployment, test the AI chat:
1. Open your Vercel frontend
2. Click on the Narad AI chat button
3. Send a test message
4. Check browser console for any errors
5. Check Railway logs for AI service errors

## Common Issues

1. **CORS Error**: Make sure Vercel domain is in CORS origins
2. **API Key Error**: Verify GEMINI_API_KEY is set correctly
3. **Connection Error**: Check AI_SERVICE_URL is correct
4. **Model Error**: Ensure MODEL_NAME is `gemini-1.5-pro`

## Debugging

Check logs in:
- Railway: AI service logs
- Vercel: Function logs
- Browser: Console logs

The AI service will log detailed information about API calls and responses.
