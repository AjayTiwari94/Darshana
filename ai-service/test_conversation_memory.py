import requests
import json

# Test conversation memory with multiple messages in the same session
session_id = "memory-test-session-123"

# First message - ask about Kedarnath Temple
print("Sending first message...")
data1 = {
    "message": "Hello, tell me about Kedarnath Temple in Uttarakhand", 
    "session_id": session_id
}
response1 = requests.post('http://localhost:8000/api/ai/chat', json=data1)
print(f"First response status: {response1.status_code}")
print(f"First response preview: {response1.json()['response'][:150]}...")

# Second message - ask a follow-up question
print("\nSending second message...")
data2 = {
    "message": "What is the significance of this temple in Hindu mythology?", 
    "session_id": session_id
}
response2 = requests.post('http://localhost:8000/api/ai/chat', json=data2)
print(f"Second response status: {response2.status_code}")
print(f"Second response preview: {response2.json()['response'][:150]}...")

# Third message - ask another follow-up question
print("\nSending third message...")
data3 = {
    "message": "When is the best time to visit this temple?", 
    "session_id": session_id
}
response3 = requests.post('http://localhost:8000/api/ai/chat', json=data3)
print(f"Third response status: {response3.status_code}")
print(f"Third response preview: {response3.json()['response'][:150]}...")

print("\nTest completed!")