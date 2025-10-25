# AI Service Deployment Guide

## ⚠️ IMPORTANT: Gemini API Model Update (October 2024)

### Deprecated Models (DO NOT USE)
- ❌ `gemini-1.5-flash` - Returns 404 error
- ❌ `gemini-1.5-pro` - Returns 404 error  
- ❌ `gemini-pro` - Deprecated
- ❌ Any model with v1 API endpoint

### ✅ Supported Models (USE THESE)
- ✅ `models/gemini-pro-latest` (RECOMMENDED - always updated, stable)
- ✅ `models/gemini-flash-latest` (faster, good for quick responses)
- ✅ `models/gemini-2.5-pro` (specific version, for Gemini 2.x)
- ✅ `models/gemini-2.5-flash` (specific version, faster variant)

### Required API Endpoint
- ✅ Use: `v1beta` endpoint
- ❌ Don't use: `v1` endpoint (deprecated for these models)

## Environment Variables for Deployment

### Railway/Render
```env
# Required
GEMINI_API_KEY=your_actual_api_key_from_google_ai_studio
PORT=8080

# Recommended (use latest models)
MODEL_NAME=models/gemini-pro-latest

# Optional
FLASK_ENV=production
LOG_LEVEL=INFO
```

### Important Notes
1. **DO NOT set MODEL_NAME to gemini-1.5-flash** - it will cause 404 errors
2. **Use the full model path** with `models/` prefix
3. **Get API key from**: https://makersuite.google.com/app/apikey
4. If MODEL_NAME is not set, defaults to `models/gemini-pro-latest` (recommended)

## Deployment Steps

### Option 1: Railway (Recommended)

1. **Create New Service**
   ```
   - Go to railway.app
   - New Project → Deploy from GitHub
   - Select your repository
   ```

2. **Configure Service**
   ```
   Root Directory: ai-service
   Build Command: (auto-detected)
   Start Command: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
   ```

3. **Add Environment Variables**
   ```env
   GEMINI_API_KEY=AIza...your_key_here
   MODEL_NAME=models/gemini-pro-latest
   PORT=8080
   FLASK_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 5-7 minutes (first build)
   - Copy the generated URL

### Option 2: Render

1. **Create Web Service**
   ```
   - Go to render.com
   - New → Web Service
   - Connect GitHub repo
   ```

2. **Configure**
   ```
   Name: darshana-ai-service
   Root Directory: ai-service
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
   ```

3. **Environment Variables**
   Same as Railway (see above)

4. **Deploy**

## Testing Deployment

### 1. Health Check
```bash
curl https://your-ai-service-url.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Narad AI",
  "version": "1.0.0",
  "gemini_configured": true,
  "model": "models/gemini-pro-latest",
  "api_endpoint": "v1beta"
}
```

### 2. Test Chat Endpoint
```bash
curl -X POST https://your-ai-service-url.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about Taj Mahal",
    "session_id": "test-session",
    "context": {"preferences": {"language": "en"}}
  }'
```

Expected response:
```json
{
  "response": "The Taj Mahal is...",
  "status": "success",
  "suggestions": ["...", "...", "..."],
  ...
}
```

## Common Errors and Fixes

### Error: 404 - Model not found

**Error Message:**
```
models/gemini-1.5-flash is not found for API version v1
```

**Solution:**
1. Check MODEL_NAME environment variable
2. Make sure it's set to: `models/gemini-pro-latest`
3. Redeploy the service
4. Test health endpoint to verify

### Error: API Key Invalid

**Error Message:**
```
API key not valid. Please pass a valid API key.
```

**Solution:**
1. Get a new API key from https://makersuite.google.com/app/apikey
2. Update GEMINI_API_KEY in Railway/Render
3. Redeploy

### Error: Service Crashes on Startup

**Check:**
1. Logs show Python errors?
2. gunicorn installed? (check requirements.txt)
3. Procfile exists?
4. Python version correct? (3.9-3.11 recommended)

## Updating Existing Deployment

If you already deployed with old model names:

1. **Update Environment Variables**
   - Railway/Render Dashboard
   - Change `MODEL_NAME` to `models/gemini-pro-latest`
   - Or remove it (will use default)

2. **Redeploy**
   - Push new changes to GitHub
   - Or click "Redeploy" in dashboard

3. **Verify**
   ```bash
   curl https://your-ai-service-url.com/health
   # Check "model" field shows correct model
   ```

## Production Checklist

- [ ] GEMINI_API_KEY is set and valid
- [ ] MODEL_NAME is `models/gemini-pro-latest` (or not set)
- [ ] Health endpoint returns 200 OK
- [ ] Chat endpoint returns proper responses
- [ ] No 404 errors in logs
- [ ] Service doesn't crash under load

## Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | **Yes** | None | Google AI Studio API key |
| `MODEL_NAME` | No | `models/gemini-pro-latest` | Gemini model to use |
| `PORT` | No | 8080 | Port for the service |
| `FLASK_ENV` | No | production | Flask environment |
| `LOG_LEVEL` | No | INFO | Logging level |

## Support

- **Google AI Studio**: https://makersuite.google.com
- **Gemini API Docs**: https://ai.google.dev/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs

---

**Last Updated**: October 2024  
**Model Version**: Gemini 2.x (via v1beta API)



