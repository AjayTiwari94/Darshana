from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging
import os
from datetime import datetime
from dotenv import load_dotenv
from src.services.narad_ai import NaradAI

# Load environment variables
load_dotenv()

# Configure logging
log_level = os.getenv('LOG_LEVEL', 'INFO')
logging.basicConfig(level=getattr(logging, log_level.upper()), format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize Narad AI
narad_ai = NaradAI()

# =====================
# CONFIG
# =====================
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-gemini-api-key-here')  # Add your Gemini API key to .env
MODEL_NAME = os.getenv('MODEL_NAME', 'gemini-1.5-flash')  # Using a more commonly available Gemini model

app = Flask(__name__)
# Update CORS to allow requests from the frontend (port 3000)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://127.0.0.1:3000"])

# Log environment variables for debugging
logger.info("Environment variables:")
logger.info(f"GEMINI_API_KEY: {os.getenv('GEMINI_API_KEY', 'Not found')}")
logger.info(f"MODEL_NAME: {os.getenv('MODEL_NAME', 'Not found')}")
logger.info(f"FLASK_ENV: {os.getenv('FLASK_ENV', 'Not found')}")
logger.info(f"Narad AI is ready: {narad_ai.is_ready()}")


# =====================
# GENERATE RESPONSE
# =====================
def generate_response(user_message, session_id="default_session", context=None):
    """Generate response using Narad AI service"""
    try:
        logger.info(f"Processing message with Narad AI: {user_message}")
        logger.info(f"Session ID: {session_id}")
        logger.info(f"Context: {context}")
        logger.info(f"Narad AI instance: {narad_ai}")
        logger.info(f"Narad AI is ready: {narad_ai.is_ready()}")
        
        # Ensure context is a dictionary
        if context is None:
            context = {}
        elif not isinstance(context, dict):
            context = {}
        
        # Check if Narad AI is ready
        if not narad_ai.is_ready():
            logger.warning("Narad AI is not ready - using fallback response")
            return {
                'response': "I apologize, but I'm currently experiencing technical difficulties with my AI capabilities. You can still ask me about Indian culture, history, and mythology, and I'll do my best to help with my existing knowledge.",
                'intent': 'error',
                'suggestions': [
                    "Tell me about a historical monument",
                    "Share a mythological story",
                    "Recommend cultural experiences"
                ],
                'confidence': 0.1,
                'timestamp': datetime.now().isoformat()
            }
        
        logger.info("Narad AI is ready, processing message")
        # Use the full Narad AI implementation
        response = narad_ai.process_message(
            message=user_message,
            session_id=session_id,
            context=context
        )
        
        logger.info(f"Narad AI response: {response}")
        logger.info(f"Response type: {type(response)}")
        return response
    except Exception as e:
        logger.error(f"Error in Narad AI processing: {str(e)}", exc_info=True)
        return {
            'response': "I apologize, but I'm having trouble processing your request right now. Please try again!",
            'intent': 'error',
            'suggestions': [
                "Ask about a monument",
                "Request a cultural story",
                "Get travel recommendations"
            ],
            'confidence': 0.1,
            'timestamp': datetime.now().isoformat()
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
        logger.info("Received chat request")
        data = request.get_json()
        logger.info(f"Request data: {data}")
        if not data:
            logger.warning("No JSON data provided")
            return jsonify({'error': 'No JSON data provided'}), 400

        user_message = data.get('message', '').strip()
        session_id = data.get('session_id', 'default_session')
        context = data.get('context', {})
        user_id = data.get('user_id')
        
        # Ensure context is a dictionary
        if not isinstance(context, dict):
            context = {}
        
        if not user_message:
            logger.warning("No message provided")
            return jsonify({'error': 'No message provided'}), 400

        logger.info(f"Received chat request: {user_message}")
        logger.info(f"Session ID: {session_id}")
        logger.info(f"Context: {context}")
        logger.info(f"User ID: {user_id}")
        
        ai_response = generate_response(user_message, session_id, context)
        
        logger.info(f"AI Response: {ai_response}")
        logger.info(f"AI Response Type: {type(ai_response)}")

        # Return the full response structure that the frontend expects
        response_data = {
            'response': ai_response.get('response', 'I apologize, but I\'m having trouble formulating a response right now.'),
            'status': 'success',
            'suggestions': ai_response.get('suggestions', []),
            'intent': ai_response.get('intent', 'general_inquiry'),
            'metadata': {
                'confidence': ai_response.get('confidence', 0.8),
                'session_id': session_id,
                'timestamp': ai_response.get('timestamp', datetime.now().isoformat()),
                'context': context
            }
        }
        
        logger.info(f"Response data: {response_data}")
        return jsonify(response_data)

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}", exc_info=True)
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500

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

@app.route('/api/test/gemini', methods=['GET'])
def test_gemini():
    """Test endpoint to verify Gemini API connectivity"""
    try:
        # Use getattr to avoid linter issues
        import google.generativeai as genai
        from google.generativeai.types import GenerationConfig
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key or api_key == 'your-gemini-api-key-here':
            return jsonify({
                'status': 'error',
                'message': 'No valid GEMINI_API_KEY found in environment variables'
            }), 400
        
        # Try to configure the API using getattr to avoid linter issues
        configure_func = getattr(genai, 'configure')
        configure_func(api_key=api_key)
        
        # For older versions of google-generativeai, we'll try a simple model test instead
        try:
            # Try to list models to verify connectivity
            generative_model_class = getattr(genai, 'GenerativeModel')
            model = generative_model_class('gemini-pro')
            generation_config_class = GenerationConfig
            response = model.generate_content("Say 'hello' in one word", generation_config=generation_config_class(max_output_tokens=10))
            return jsonify({
                'status': 'success',
                'message': 'Gemini API is accessible',
                'api_key_valid': True,
                'test_response': response.text.strip() if response.text else 'No response'
            })
        except Exception as model_error:
            return jsonify({
                'status': 'error',
                'message': f'Gemini API key is invalid or model access failed: {str(model_error)}'
            }), 400
            
    except Exception as e:
        logger.error(f"Error testing Gemini API: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to test Gemini API: {str(e)}'
        }), 500

@app.route('/api/test/gemini-list', methods=['GET'])
def test_gemini_list():
    """Test endpoint to list all available Gemini models"""
    try:
        # Use getattr to avoid linter issues
        import google.generativeai as genai
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key or api_key == 'your-gemini-api-key-here':
            return jsonify({
                'status': 'error',
                'message': 'No valid GEMINI_API_KEY found in environment variables'
            }), 400
        
        # Try to configure the API using getattr to avoid linter issues
        configure_func = getattr(genai, 'configure')
        configure_func(api_key=api_key)
        
        # Try to list all available models
        try:
            list_models_func = getattr(genai, 'list_models', None)
            if list_models_func:
                models = list_models_func()
                model_info = []
                for model in models:
                    model_info.append({
                        'name': getattr(model, 'name', 'N/A'),
                        'display_name': getattr(model, 'display_name', 'N/A'),
                        'description': getattr(model, 'description', 'N/A'),
                        'supported_generation_methods': getattr(model, 'supported_generation_methods', [])
                    })
                
                # Filter for Gemini models only
                gemini_models = [m for m in model_info if 'gemini' in m['name'].lower()]
                
                return jsonify({
                    'status': 'success',
                    'message': 'Available models retrieved successfully',
                    'total_models': len(model_info),
                    'gemini_models': gemini_models[:20],  # Limit to first 20 Gemini models
                    'all_models_sample': model_info[:10]  # Sample of all models
                })
            else:
                # Fallback for older versions
                known_models = [
                    {'name': 'gemini-pro', 'display_name': 'Gemini Pro', 'description': 'Good for text-based tasks'},
                    {'name': 'gemini-pro-vision', 'display_name': 'Gemini Pro Vision', 'description': 'Good for image and text-based tasks'}
                ]
                
                return jsonify({
                    'status': 'success',
                    'message': 'Known models retrieved successfully (list_models not available in this version)',
                    'total_models': len(known_models),
                    'gemini_models': known_models,
                    'all_models_sample': known_models
                })
        except Exception as model_error:
            # Fallback for older versions
            known_models = [
                {'name': 'gemini-pro', 'display_name': 'Gemini Pro', 'description': 'Good for text-based tasks'},
                {'name': 'gemini-pro-vision', 'display_name': 'Gemini Pro Vision', 'description': 'Good for image and text-based tasks'}
            ]
            
            return jsonify({
                'status': 'success',
                'message': f'Using fallback models due to error: {str(model_error)}',
                'total_models': len(known_models),
                'gemini_models': known_models,
                'all_models_sample': known_models
            })
            
    except Exception as e:
        logger.error(f"Error testing Gemini API: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to test Gemini API: {str(e)}'
        }), 500

@app.route('/api/test/gemini-models', methods=['GET'])
def test_gemini_models():
    """Test endpoint to verify specific model availability"""
    try:
        # Use getattr to avoid linter issues
        import google.generativeai as genai
        from google.generativeai.types import GenerationConfig
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key or api_key == 'your-gemini-api-key-here':
            return jsonify({
                'status': 'error',
                'message': 'No valid GEMINI_API_KEY found in environment variables'
            }), 400
        
        # Try to configure the API using getattr to avoid linter issues
        configure_func = getattr(genai, 'configure')
        configure_func(api_key=api_key)
        
        # Test specific models with proper cleaning
        test_models = ['gemini-pro', 'gemini-1.0-pro', 'gemini-1.5-pro-latest']
        available_models = []
        unavailable_models = []
        
        generative_model_class = getattr(genai, 'GenerativeModel')
        generation_config_class = GenerationConfig
        
        for model_name in test_models:
            try:
                # Ensure the model name doesn't have the models/ prefix
                clean_model_name = model_name.replace('models/', '').strip()
                logger.info(f"Testing model: {model_name} (cleaned: {clean_model_name})")
                
                model = generative_model_class(clean_model_name)
                # Try a simple generation to test if model is accessible
                response = model.generate_content("Say 'hello' in one word", generation_config=generation_config_class(max_output_tokens=10))
                available_models.append({
                    'name': model_name,
                    'clean_name': clean_model_name,
                    'status': 'available',
                    'test_response': response.text.strip() if response.text else 'No response'
                })
            except Exception as model_error:
                unavailable_models.append({
                    'name': model_name,
                    'clean_name': model_name.replace('models/', '').strip(),
                    'status': 'unavailable',
                    'error': str(model_error)
                })
        
        return jsonify({
            'status': 'success',
            'available_models': available_models,
            'unavailable_models': unavailable_models
        })
            
    except Exception as e:
        logger.error(f"Error testing Gemini models: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to test Gemini models: {str(e)}'
        }), 500

@app.route('/api/test/conversation-memory', methods=['GET'])
def test_conversation_memory():
    """Test endpoint to verify conversation memory functionality"""
    try:
        # Create a test NaradAI instance
        test_narad = NaradAI()
        session_id = "test_memory_endpoint_001"
        
        # Test the conversation memory directly
        memory = test_narad.conversation_memory
        
        # Clear any existing session data
        memory.clear_session(session_id)
        
        # Add some test messages
        memory.add_message(session_id, "user", "Hello Narad, I'd like to learn about Indian history.")
        memory.add_message(session_id, "ai", "Namaste! I'd be happy to help you learn about Indian history. India has a rich and diverse history spanning thousands of years. Would you like to know about a specific period or dynasty?")
        memory.add_message(session_id, "user", "Can you tell me about the Maurya Empire?")
        memory.add_message(session_id, "ai", "Certainly! The Maurya Empire was one of the largest and most powerful empires in ancient India, existing from 322-185 BCE. It was founded by Chandragupta Maurya and reached its peak under Emperor Ashoka the Great.")
        
        # Get the conversation history
        history = memory.get_history(session_id)
        
        # Test the _format_conversation_history method
        formatted_history = test_narad._format_conversation_history(history)
        
        # Verify the format is correct
        is_working = "User:" in formatted_history and "Narad:" in formatted_history
        
        return jsonify({
            'status': 'success',
            'is_working': is_working,
            'history_count': len(history),
            'formatted_history': formatted_history,
            'raw_history': history
        })
    except Exception as e:
        logger.error(f"Error in conversation memory test: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# =====================
# RUN APP
# =====================
if __name__ == '__main__':
    logger.info("Starting Narad AI Service on port 8000")
    logger.info(f"Narad AI service ready: {narad_ai.is_ready()}")
    app.run(host='0.0.0.0', port=8000, debug=True)