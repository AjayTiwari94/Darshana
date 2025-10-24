# Railway Environment Configuration for Narad AI

## Required Environment Variables

Add these in Railway Dashboard → Your Service → Variables:

### 1. GEMINI_API_KEY (REQUIRED)
```
GEMINI_API_KEY=AIzaSyCA3pzBHIdU98AieH3vcF7xILqvVcKt7ak
```

### 2. MODEL_NAME (OPTIONAL - Use only if you want to override default)
```
MODEL_NAME=gemini-1.5-pro
```

**Available Models (October 2025):**
- `gemini-1.5-pro` (Default - Recommended)
- `gemini-1.5-flash` (Faster, lighter)
- `gemini-2.0-flash-exp` (Experimental, latest)

### 3. FLASK_ENV
```
FLASK_ENV=production
```

### 4. PORT (Auto-set by Railway)
```
PORT=8080
```

---

## Critical API Endpoint Information

### ✅ CORRECT Endpoint (October 2025):
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent
```

### ❌ DEPRECATED Endpoint (DO NOT USE):
```
https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
```

**Why v1beta?**
- Google has deprecated the `/v1/` endpoint as of October 2025
- All current models now require `/v1beta/`
- Models like `gemini-pro` (without version) are deprecated

---

## Testing After Deployment

### Method 1: Test via Railway Shell
```bash
# SSH into Railway container
railway shell

# Test API call
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=$GEMINI_API_KEY" \
-H "Content-Type: application/json" \
-d '{"contents":[{"parts":[{"text":"Hello Gemini"}]}]}'

# Expected: 200 OK with JSON response
```

### Method 2: Check Logs
Look for these success indicators:
```
[INFO] Using model: gemini-1.5-pro with REST API v1beta endpoint
[INFO] API Endpoint: https://generativelanguage.googleapis.com/v1beta/models
[INFO] Making REST API request to: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIza...
[INFO] API Response Status: 200
[INFO] ✅ Successfully enhanced response with API
```

### Method 3: Test the Deployed API
```bash
curl -X POST "https://your-railway-app.up.railway.app/api/chat" \
-H "Content-Type: application/json" \
-d '{
  "message": "what is holi",
  "session_id": "test-session",
  "context": {"preferences": {"language": "en"}}
}'
```

---

## Common Issues & Solutions

### Issue 1: 404 Model Not Found
```
ERROR: models/gemini-pro is not found for API version v1
```

**Solution:** Model name is deprecated. Update to `gemini-1.5-pro`

### Issue 2: Wrong API Endpoint
```
ERROR: 404 models/gemini-1.5-pro is not found for API version v1
```

**Solution:** Using `/v1/` instead of `/v1beta/`. Check code uses correct endpoint.

### Issue 3: API Key Not Loading
```
WARNING: No valid GEMINI_API_KEY found
```

**Solution:** 
1. Go to Railway Dashboard
2. Select your service
3. Go to Variables tab
4. Add `GEMINI_API_KEY` with your actual key
5. Redeploy

### Issue 4: Model Name Not Recognized
```
INFO: MODEL_NAME: Not found
```

**This is NORMAL!** It means using the default model (`gemini-1.5-pro`). Only add `MODEL_NAME` variable if you want to override.

---

## Deployment Checklist

- [ ] `GEMINI_API_KEY` added to Railway environment variables
- [ ] Latest code deployed (with v1beta endpoint)
- [ ] Check logs show: "Using model: gemini-1.5-pro with REST API v1beta endpoint"
- [ ] Test API call returns 200 status
- [ ] Chat endpoint returns proper responses (not errors)

---

## Rollback Plan

If the new deployment fails:

1. **Check logs first:**
   ```bash
   railway logs
   ```

2. **Verify environment:**
   ```bash
   railway variables
   ```

3. **Manual test:**
   ```bash
   railway shell
   curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=$GEMINI_API_KEY" \
   -H "Content-Type: application/json" \
   -d '{"contents":[{"parts":[{"text":"test"}]}]}'
   ```

4. **Contextual responses will always work** even if API fails (graceful degradation built-in)

---

## Success Indicators

✅ **Working correctly when you see:**
```
2025-10-24 19:XX:XX - INFO - Using model: gemini-1.5-pro with REST API v1beta endpoint
2025-10-24 19:XX:XX - INFO - API Response Status: 200
2025-10-24 19:XX:XX - INFO - ✅ Successfully enhanced response with API
```

❌ **Still broken if you see:**
```
2025-10-24 19:XX:XX - ERROR - API Error 404
2025-10-24 19:XX:XX - ERROR - models/gemini-pro is not found
```

---

## Contact & Support

If issues persist after following this guide:
1. Check Google AI Studio for API key status: https://makersuite.google.com/app/apikey
2. Verify your API key has Generative Language API enabled
3. Check Railway logs for any SSL/networking errors
4. Ensure Railway region has access to Google APIs

**Note:** The system has graceful degradation - even if Gemini API fails, contextual responses will work for common queries (Holi, Diwali, monuments, etc.)

