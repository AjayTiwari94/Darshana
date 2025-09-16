from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging
import os
from dotenv import load_dotenv
from src.services.narad_ai import NaradAI

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"])

# Initialize Narad AI
narad_ai = NaradAI()

# =====================
# CONFIG
# =====================
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-gemini-api-key-here')  # Add your Gemini API key to .env
MODEL_NAME = "gemini-1.5-flash"  # Using Gemini 1.5 Flash model

# =====================
# GENERATE RESPONSE
# =====================
def generate_response(user_message, session_id="default_session", context=None):
    """Generate response using Narad AI service"""
    try:
        logger.info(f"Processing message with Narad AI: {user_message}")
        
        # Ensure context is a dictionary
        if context is None:
            context = {}
        elif not isinstance(context, dict):
            context = {}
        
        # Use the full Narad AI implementation
        response = narad_ai.process_message(
            message=user_message,
            session_id=session_id,
            context=context
        )
        
        return response
    except Exception as e:
        logger.error(f"Error in Narad AI processing: {str(e)}")
        return {
            'content': "I apologize, but I'm having trouble processing your request right now. Please try again!",
            'intent': 'error',
            'suggestions': [
                "Ask about a monument",
                "Request a cultural story",
                "Get travel recommendations"
            ]
        }

# =====================
# ENDPOINTS
# =====================
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'Narad AI'})

@app.route('/api/ai/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        user_message = data.get('message', '').strip()
        session_id = data.get('session_id', 'default_session')
        context = data.get('context', {})
        user_id = data.get('user_id')
        
        # Ensure context is a dictionary
        if not isinstance(context, dict):
            context = {}
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        logger.info(f"Received chat request: {user_message}")
        ai_response = generate_response(user_message, session_id, context)

        # Return the full response structure that the frontend expects
        return jsonify({
            'response': ai_response.get('content', ''),
            'status': 'success',
            'suggestions': ai_response.get('suggestions', []),
            'intent': ai_response.get('intent', 'general_inquiry'),
            'metadata': {
                'confidence': ai_response.get('confidence', 0.8),
                'session_id': session_id,
                'timestamp': ai_response.get('timestamp', ''),
                'context': context
            }
        })

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({
        'message': 'Narad AI Service is running!',
        'status': 'success',
        'endpoints': {
            'chat': '/api/ai/chat (POST)',
            'health': '/health (GET)',
            'test': '/api/test (GET)'
        }
    })

# =====================
# RUN APP
# =====================
if __name__ == '__main__':
    logger.info("Starting Narad AI Service on port 8000")
    logger.info(f"Narad AI service ready: {narad_ai.is_ready()}")
    app.run(host='0.0.0.0', port=8000, debug=True)