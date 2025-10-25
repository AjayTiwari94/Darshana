# Railway Environment Configuration for Narad AI

## Required Environment Variables

Add these in Railway Dashboard → Your Service → Variables:

### 1. GEMINI_API_KEY (REQUIRED)
```
GEMINI_API_KEY=AIzaSyCA3pzBHIdU98AieH3vcF7xILqvVcKt7ak
```

### 2. MODEL_NAME (OPTIONAL - Use only if you want to override default)
```
MODEL_NAME=models/gemini-pro-latest
```

**Available Models (October 2025) - Gemini 1.x/1.5.x DEPRECATED:**
- `models/gemini-pro-latest` (Default - RECOMMENDED - always updated)
- `models/gemini-flash-latest` (Faster variant - auto-updated)
- `models/gemini-2.5-pro` (Specific stable version)
- `models/gemini-2.5-flash` (Specific fast version)

**⚠️ DEPRECATED Models (Don't Use):**
- ❌ `gemini-1.5-pro` - Removed from API
- ❌ `gemini-1.5-flash` - Removed from API
- ❌ `gemini-pro` (without version) - Removed from API

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
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent
```

### ❌ DEPRECATED Endpoints (DO NOT USE):
```
https://generativelanguage.googleapis.com/v1/models/...  (v1 deprecated)
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:...  (model removed)
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:...  (old naming)
```

**Critical Changes:**
- Google deprecated `/v1/` endpoint → Use `/v1beta/`
- All Gemini 1.x and 1.5.x models removed → Use `models/gemini-pro-latest` or `models/gemini-2.5-pro`
- Model names must include `models/` prefix
- Use `-latest` suffix for auto-updates

---

## Testing After Deployment

### Method 1: Test via Railway Shell
```bash
# SSH into Railway container
railway shell

# Test API call with current model
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=$GEMINI_API_KEY" \
-H "Content-Type: application/json" \
-d '{"contents":[{"parts":[{"text":"Hello Gemini"}]}]}'

# Expected: 200 OK with JSON response
```

### Method 2: List Available Models (Verify Model Exists)
```bash
railway shell

# Python test to list models
python3 << EOF
import google.generativeai as genai
import os
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
print("Available models:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"  ✅ {m.name}")
EOF

# Should show: models/gemini-pro-latest, models/gemini-2.5-pro, etc.
```

### Method 3: Check Logs
Look for these success indicators:
```
[INFO] 🔧 Using model: models/gemini-pro-latest with REST API v1beta endpoint
[INFO] 🌐 API Endpoint: https://generativelanguage.googleapis.com/v1beta/models
[INFO] 📝 Note: MODEL_NAME env var = models/gemini-pro-latest
[INFO] Making REST API request to: ...gemini-pro-latest:generateContent?key=AIza...
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
ERROR: models/gemini-1.5-pro is not found for API version v1beta
ERROR: models/gemini-pro is not found for API version v1
```

**Solution:** ALL Gemini 1.x/1.5.x models are deprecated. Update to:
```python
MODEL_NAME=models/gemini-pro-latest
```

### Issue 2: Wrong API Endpoint
```
ERROR: 404 ...is not found for API version v1
```

**Solution:** Using `/v1/` instead of `/v1beta/`. Code must use:
```
https://generativelanguage.googleapis.com/v1beta/models
```

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

**This is NORMAL!** It means using the default model (`models/gemini-pro-latest`). Only add `MODEL_NAME` variable if you want to override.

---

## Deployment Checklist

- [ ] `GEMINI_API_KEY` added to Railway environment variables
- [ ] Latest code deployed (with v1beta endpoint)
- [ ] Check logs show: "Using model: models/gemini-pro-latest with REST API v1beta endpoint"
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
   curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=$GEMINI_API_KEY" \
   -H "Content-Type: application/json" \
   -d '{"contents":[{"parts":[{"text":"test"}]}]}'
   ```

4. **Contextual responses will always work** even if API fails (graceful degradation built-in)

---

## Success Indicators

✅ **Working correctly when you see:**
```
2025-10-24 19:XX:XX - INFO - 🔧 Using model: models/gemini-pro-latest with REST API v1beta endpoint
2025-10-24 19:XX:XX - INFO - 📝 Note: MODEL_NAME env var = models/gemini-pro-latest
2025-10-24 19:XX:XX - INFO - API Response Status: 200
2025-10-24 19:XX:XX - INFO - ✅ Successfully enhanced response with API
```

❌ **Still broken if you see:**
```
2025-10-24 19:XX:XX - ERROR - API Error 404
2025-10-24 19:XX:XX - ERROR - models/gemini-1.5-pro is not found
2025-10-24 19:XX:XX - ERROR - models/gemini-pro is not found
```

**If still 404:** Model is deprecated. Use `models/gemini-pro-latest` or `models/gemini-2.5-pro`

---

## Contact & Support

If issues persist after following this guide:
1. Check Google AI Studio for API key status: https://makersuite.google.com/app/apikey
2. Verify your API key has Generative Language API enabled
3. Check Railway logs for any SSL/networking errors
4. Ensure Railway region has access to Google APIs

**Note:** The system has graceful degradation - even if Gemini API fails, contextual responses will work for common queries (Holi, Diwali, monuments, etc.)

