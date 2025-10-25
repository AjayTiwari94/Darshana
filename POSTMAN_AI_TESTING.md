# 🧪 Postman Testing Guide - Narad AI API

## 🎯 Base URLs

**Local:** `http://localhost:8000`  
**Railway:** `https://your-service.up.railway.app`

---

## 📋 Complete Postman Collection

### 1. 🏥 Health Check

**Method:** `GET`  
**URL:** `{{base_url}}/health`

**Response (Success):**
```json
{
  "status": "healthy",
  "service": "Narad AI",
  "version": "1.0.0",
  "gemini_configured": true,
  "model": "models/gemini-pro-latest",
  "api_endpoint": "v1beta",
  "timestamp": "2024-10-25T10:30:00"
}
```

**Check:** 
- ✅ `model` should be `models/gemini-pro-latest` (NOT `gemini-1.5-flash`)
- ✅ `gemini_configured` should be `true`

---

### 2. 💬 Test Chat - Chhath Puja (Main Test)

**Method:** `POST`  
**URL:** `{{base_url}}/api/chat`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "message": "what is chhath puja",
  "session_id": "test-session-123",
  "context": {
    "preferences": {
      "language": "en"
    }
  }
}
```

**Expected Response (if Gemini working):**
```json
{
  "response": "Chhath Puja is a four-day Hindu festival...",
  "status": "success",
  "intent": "cultural_inquiry",
  "suggestions": [
    "Tell me about Diwali",
    "What is Navratri",
    "Explain Holi festival"
  ],
  "metadata": {
    "confidence": 0.9,
    "session_id": "test-session-123",
    "timestamp": "2024-10-25T10:30:00.123456"
  }
}
```

**Wrong Response (if hardcoded fallback):**
```json
{
  "response": "Namaste! 🙏 I'd be happy to help you explore...",
  "status": "success"
}
```

**🚨 If you see "Namaste! I'd be happy to help..." → Gemini API NOT working!**

---

### 3. 🎭 Test Navratri (Known Festival)

**Method:** `POST`  
**URL:** `{{base_url}}/api/chat`

**Body:**
```json
{
  "message": "tell me about navratri",
  "session_id": "test-session-456",
  "context": {
    "preferences": {
      "language": "en"
    }
  }
}
```

**Expected:** Detailed Navratri response (hardcoded available, so will work either way)

---

### 4. 🕉️ Test Holi

**Method:** `POST`  
**URL:** `{{base_url}}/api/chat`

**Body:**
```json
{
  "message": "what is holi",
  "session_id": "test-session-789"
}
```

**Expected:** Detailed Holi response

---

### 5. 🌙 Test Generic Query (Forces Gemini)

**Method:** `POST`  
**URL:** `{{base_url}}/api/chat`

**Body:**
```json
{
  "message": "explain the significance of fasting during festivals",
  "session_id": "test-generic",
  "context": {
    "preferences": {
      "language": "en"
    }
  }
}
```

**Expected:** 
- If Gemini working: Detailed AI-generated response about fasting
- If Gemini NOT working: Generic "I'd be happy to help..." response

**This is the BEST test to check if Gemini is actually working!**

---

### 6. 🏛️ Test Monument Query

**Method:** `POST`  
**URL:** `{{base_url}}/api/chat`

**Body:**
```json
{
  "message": "tell me about konark sun temple",
  "session_id": "test-monument"
}
```

**Expected:** Either hardcoded or Gemini-generated response

---

### 7. 🌍 Test in Hindi

**Method:** `POST`  
**URL:** `{{base_url}}/api/chat`

**Body:**
```json
{
  "message": "छठ पूजा क्या है",
  "session_id": "test-hindi",
  "context": {
    "preferences": {
      "language": "hi"
    }
  }
}
```

**Expected:** Response in Hindi (if Gemini working)

---

### 8. 🔄 Test Conversation Memory

**Step 1 - First Message:**
```json
{
  "message": "tell me about holi",
  "session_id": "memory-test"
}
```

**Step 2 - Follow-up (same session):**
```json
{
  "message": "when is it celebrated",
  "session_id": "memory-test"
}
```

**Expected:** AI should understand "it" refers to Holi from previous message

---

### 9. ⚡ Stress Test - Multiple Requests

Send same request 5 times quickly to test:
- Response consistency
- Performance
- Rate limiting

---

### 10. 🚨 Error Handling Test

**Invalid Request:**
```json
{
  "message": "",
  "session_id": "error-test"
}
```

**Expected:**
```json
{
  "error": "Message is required",
  "status": "error"
}
```

---

## 📊 Postman Environment Variables

Create environment in Postman:

```
base_url_local = http://localhost:8000
base_url_railway = https://vivacious-upliftment-production.up.railway.app
```

Use: `{{base_url_local}}` or `{{base_url_railway}}`

---

## 🧪 Testing Checklist

### ✅ Gemini API is Working If:

1. **Health Check:** Shows `model: models/gemini-pro-latest`
2. **Chhath Puja Query:** Gets detailed response (not generic)
3. **Generic Query:** Gets AI-generated response
4. **Railway Logs:** Show "API Response Status: 200"
5. **Response Time:** < 3 seconds
6. **No "I'd be happy to help..." for unknown topics**

### ❌ Gemini API NOT Working If:

1. **Health Check:** Shows `gemini-1.5-flash` or error
2. **Chhath Puja:** Returns "Namaste! I'd be happy to help..."
3. **Railway Logs:** Show "API Error 404"
4. **All Unknown Topics:** Return generic response

---

## 🔍 How to Interpret Responses

### ✅ GOOD Response (Gemini Working):
```json
{
  "response": "Chhath Puja is a four-day Hindu festival dedicated to...",
  "status": "success",
  "intent": "cultural_inquiry"
}
```
**Length:** 100-500 characters  
**Quality:** Specific, detailed, contextual

### ❌ BAD Response (Fallback):
```json
{
  "response": "Namaste! 🙏 I'd be happy to help you explore India's rich cultural heritage!...",
  "status": "success"
}
```
**Length:** Same generic template  
**Quality:** Non-specific, asks what to explore

---

## 📋 Quick Test Script

Copy-paste in Postman **Tests** tab:

```javascript
// Test 1: Check status
pm.test("Status is success", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("success");
});

// Test 2: Response not generic
pm.test("Response is not generic fallback", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.response).to.not.include("I'd be happy to help");
});

// Test 3: Response has content
pm.test("Response has substantial content", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.response.length).to.be.above(50);
});

// Test 4: Response time is acceptable
pm.test("Response time is less than 5s", function () {
    pm.expect(pm.response.responseTime).to.be.below(5000);
});
```

---

## 🎯 Critical Test Cases

### Test Case 1: Unknown Festival (Forces Gemini)
```json
{
  "message": "what is onam festival",
  "session_id": "test-onam"
}
```
**Pass:** Detailed response about Onam  
**Fail:** Generic "I'd be happy to help..."

### Test Case 2: Complex Query
```json
{
  "message": "compare holi and diwali celebrations",
  "session_id": "test-compare"
}
```
**Pass:** Comparative analysis  
**Fail:** Generic response

### Test Case 3: Historical Query
```json
{
  "message": "who built red fort and when",
  "session_id": "test-history"
}
```
**Pass:** Specific historical details  
**Fail:** Generic monument template

---

## 📱 cURL Commands (Alternative to Postman)

### Health Check:
```bash
curl https://your-service.railway.app/health
```

### Chat Test:
```bash
curl -X POST https://your-service.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "what is chhath puja",
    "session_id": "curl-test"
  }'
```

### With Full Context:
```bash
curl -X POST https://your-service.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "explain the significance of sun worship in hinduism",
    "session_id": "curl-test-2",
    "context": {
      "preferences": {
        "language": "en"
      }
    }
  }' | jq .
```

---

## 🐛 Debugging Tips

### If Getting Generic Responses:

1. **Check Railway Logs:**
   ```
   Look for: "Got generic response, attempting to enhance with Gemini API"
   Then: "API Response Status: ???"
   ```

2. **Check Model in Health:**
   ```bash
   curl https://your-service.railway.app/health | jq .model
   ```
   Should return: `"models/gemini-pro-latest"`

3. **Test Gemini Directly:**
   ```bash
   curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Say hello in 5 words"}]}]}'
   ```

4. **Check Environment Variables in Railway:**
   - GEMINI_API_KEY set?
   - MODEL_NAME = models/gemini-pro-latest?

---

## ✅ Success Indicators

| Indicator | Expected Value |
|-----------|---------------|
| Health status | "healthy" |
| Model name | "models/gemini-pro-latest" |
| API endpoint | "v1beta" |
| Gemini configured | true |
| Unknown topic response | Detailed, not generic |
| Response time | < 3 seconds |
| Railway logs | "API Response Status: 200" |

---

## 🚀 Import to Postman

1. Create new Collection: "Narad AI Testing"
2. Add requests as shown above
3. Set environment variable: `base_url`
4. Run entire collection
5. Check test results

---

## 📊 Expected Results Summary

| Query | If Gemini Works | If Fallback |
|-------|----------------|-------------|
| "what is chhath puja" | Detailed 4-day festival info | Generic "I'd be happy..." |
| "what is navratri" | Detailed 9-day festival info | Detailed (hardcoded) |
| "what is holi" | Detailed festival info | Detailed (hardcoded) |
| "compare holi diwali" | AI comparison | Generic response |
| "who built taj mahal" | "Shah Jahan in 1632..." | Generic monument info |

---

**Test karke batao kya response aa raha hai! Agar "I'd be happy to help..." aa raha to Gemini nahi chal raha! 🧪**

