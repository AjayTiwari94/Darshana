"""
Narad AI - Intelligent Cultural Guide
Main AI service for processing user conversations and providing cultural insights
"""

import os
import json
import logging
import re
from datetime import datetime
from typing import Dict, List, Optional, Any, Union
import google.generativeai as genai
from google.generativeai.client import configure
from google.generativeai.generative_models import GenerativeModel
from google.generativeai.types import GenerationConfig

# Try to import AI_CONFIG, with fallback if import fails
try:
    from ..config.settings import AI_CONFIG
except ImportError:
    # Fallback configuration if import fails
    AI_CONFIG = {
        'temperature': 0.7,
        'max_tokens': 350  # Reduced for concise responses
    }

from ..utils.cultural_knowledge import CulturalKnowledgeBase
from ..utils.conversation_memory import ConversationMemory

logger = logging.getLogger(__name__)

class NaradAI:
    """
    Narad AI - The intelligent cultural guide that provides personalized
    storytelling experiences about Indian heritage and culture
    """
    
    def __init__(self):
        """Initialize Narad AI with necessary configurations"""
        # Initialize knowledge base and memory
        self.knowledge_base = CulturalKnowledgeBase()
        self.conversation_memory = ConversationMemory()
        
        # AI personality and behavior settings
        self.personality = {
            'name': 'Narad',
            'role': 'Cultural Guide and Storyteller',
            'personality_traits': [
                'wise', 'enthusiastic', 'storyteller', 'cultural_expert',
                'friendly', 'patient', 'informative'
            ],
            'language_style': 'conversational yet informative',
            'cultural_focus': 'Indian heritage, mythology, and traditions'
        }
        
        # Language mapping for better context
        self.language_mapping = {
            'en-IN': 'English with Indian cultural context',
            'hi-IN': 'Hindi',
            'bn-IN': 'Bengali',
            'ta-IN': 'Tamil',
            'te-IN': 'Telugu',
            'pa-IN': 'Punjabi',
            'mr-IN': 'Marathi',
            'gu-IN': 'Gujarati',
            'kn-IN': 'Kannada',
            'ml-IN': 'Malayalam',
            'or-IN': 'Odia'
        }
        
        # Conversation context templates
        self.context_templates = self._load_context_templates()
        
        # Configure Gemini API
        self._configure_gemini()
        
        logger.info("Narad AI initialized successfully")
    
    def _configure_gemini(self):
        """Configure the Gemini API"""
        try:
            api_key = os.getenv('GEMINI_API_KEY')
            logger.info(f"Gemini API Key from env: {api_key}")
            logger.info(f"API Key length: {len(api_key) if api_key else 0}")
            logger.info(f"API Key starts with: {api_key[:10] if api_key else 'None'}")
            
            if api_key and api_key != 'your_gemini_api_key_here':
                logger.info("Configuring Gemini API with provided key")
                configure(api_key=api_key)
                # Use LATEST Gemini API (Oct 2025) - Gemini 1.x/1.5.x DEPRECATED
                # ONLY these models are currently supported:
                # - models/gemini-pro-latest (RECOMMENDED - stable, always updated)
                # - models/gemini-flash-latest (faster variant)
                # - models/gemini-2.5-pro (specific version)
                # - models/gemini-2.5-flash (specific version)
                self.model_name = os.getenv('MODEL_NAME', 'models/gemini-pro-latest')
                self.api_key = api_key
                # CRITICAL: Use v1beta endpoint - all current models require this
                self.api_endpoint = "https://generativelanguage.googleapis.com/v1beta/models"
                logger.info(f"🔧 Using model: {self.model_name} with REST API v1beta endpoint")
                logger.info(f"🌐 API Endpoint: {self.api_endpoint}")
                logger.info(f"✅ Gemini API configured successfully for REST calls")
                logger.info(f"📝 Note: MODEL_NAME env var = {os.getenv('MODEL_NAME', 'NOT SET (using default)')}")
                # Set model flag to indicate ready
                self.model = True  # Flag to indicate ready
            else:
                self.model = None
                logger.warning("No valid GEMINI_API_KEY found. AI responses will use fallback content.")
                if not api_key:
                    logger.warning("GEMINI_API_KEY is None or empty")
                elif api_key == 'your_gemini_api_key_here':
                    logger.warning("GEMINI_API_KEY is still the placeholder value")
        except Exception as e:
            logger.error(f"Error configuring Gemini API: {e}")
            logger.error(f"Error type: {type(e)}")
            self.model = None
    
    def is_ready(self) -> bool:
        """Check if Narad AI is ready to process requests"""
        logger.info(f"Checking if Narad AI is ready. Model is: {self.model}")
        # Always return True since we have contextual fallback responses
        return True
    
    def _load_context_templates(self) -> Dict[str, str]:
        """Load conversation context templates"""
        return {
            'greeting': """You are Narad, a wise and knowledgeable cultural guide and storyteller from Indian heritage and mythology. You are an expert on Indian history, culture, traditions, and mythology. 

Personality Traits:
- Wise and knowledgeable
- Respectful and professional
- Culturally sensitive
- Enthusiastic about sharing knowledge
- Patient and informative

Language Style:
- Professional yet engaging
- Avoid informal terms like "beta", "bro", "dude", etc.
- Use appropriate honorifics when referring to deities and cultural figures
- Maintain a respectful tone at all times
- Adapt to the user's language preference while maintaining professionalism

Cultural Focus:
- Indian heritage, mythology, and traditions
- Historical accuracy
- Cultural sensitivity
- Rich storytelling with authentic details""",
            'storytelling': """You are an expert storyteller sharing tales from Indian mythology and history. 

Guidelines:
- Use vivid descriptions and engaging narrative techniques
- Maintain cultural authenticity
- Be respectful when discussing religious and mythological topics
- Avoid informal language or slang
- Keep the tone appropriate for all audiences
- Focus on educational and cultural value""",
            'educational': """You are providing educational content about Indian heritage.

Guidelines:
- Be accurate, detailed, and culturally sensitive
- Use professional language
- Avoid informal terms and slang
- Provide well-researched information
- Maintain a respectful and educational tone
- Focus on cultural significance and historical context""",
            'interactive': """You are engaging in an interactive dialogue with the user.

Guidelines:
- Ask relevant follow-up questions
- Encourage deeper exploration of cultural topics
- Maintain professional and respectful communication
- Avoid informal language
- Keep the conversation focused on cultural and educational content
- Use appropriate cultural references and examples"""
        }
    
    def _detect_language_from_text(self, text: str) -> str:
        """
        Detect the language of the input text based on character ranges
        """
        # Hindi characters range
        if re.search(r'[\u0900-\u097F]', text):
            return 'hi-IN'
        # Bengali characters range
        elif re.search(r'[\u0980-\u09FF]', text):
            return 'bn-IN'
        # Tamil characters range
        elif re.search(r'[\u0B80-\u0BFF]', text):
            return 'ta-IN'
        # Telugu characters range
        elif re.search(r'[\u0C00-\u0C7F]', text):
            return 'te-IN'
        # Kannada characters range
        elif re.search(r'[\u0C80-\u0CFF]', text):
            return 'kn-IN'
        # Malayalam characters range
        elif re.search(r'[\u0D00-\u0D7F]', text):
            return 'ml-IN'
        # Punjabi characters range
        elif re.search(r'[\u0A00-\u0A7F]', text):
            return 'pa-IN'
        # Gujarati characters range
        elif re.search(r'[\u0A80-\u0AFF]', text):
            return 'gu-IN'
        # Marathi uses Devanagari script like Hindi
        elif re.search(r'[\u0900-\u097F]', text) and any(word in text.lower() for word in ['marathi', 'maharashtra']):
            return 'mr-IN'
        # Odia characters range
        elif re.search(r'[\u0B00-\u0B7F]', text):
            return 'or-IN'
        # Default to English
        else:
            return 'en-IN'
    
    def _get_language_context(self, language_code: str) -> str:
        """
        Get the appropriate language context for the AI response
        """
        return self.language_mapping.get(language_code, 'English with Indian cultural context')
    
    def process_message(self, message: str, session_id: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Process a user message and generate an appropriate AI response
        
        Args:
            message (str): The user's message
            session_id (str): Unique session identifier
            context (Dict, optional): Additional context information
            
        Returns:
            Dict: AI response with content, intent, and suggestions
        """
        try:
            logger.info(f"Processing message: {message}")
            logger.info(f"Session ID: {session_id}")
            logger.info(f"Context: {context}")
            
            # Get user preferences from context
            user_language = context.get('preferences', {}).get('language', 'en') if context else 'en'
            
            # Convert short language codes to full codes
            language_mapping = {
                'en': 'en-IN',
                'hi': 'hi-IN',
                'bn': 'bn-IN',
                'ta': 'ta-IN',
                'te': 'te-IN'
            }
            
            # Convert to full language code if needed
            if user_language in language_mapping:
                user_language = language_mapping[user_language]
            elif user_language not in language_mapping.values():
                user_language = 'en-IN'  # Default to English if unknown
            
            # Detect language from the message content as well
            detected_language = self._detect_language_from_text(message)
            
            # Prefer detected language if it's a regional language
            if detected_language != 'en-IN':
                user_language = detected_language
            
            # Get language context
            language_context = self._get_language_context(user_language)
            
            logger.info(f"User language: {user_language}, Detected: {detected_language}, Language context: {language_context}")
            
            # Retrieve conversation history
            conversation_history = self.conversation_memory.get_history(session_id)
            
            # Check if this is the first message in the conversation
            is_first_message = len(conversation_history) == 0
            
            # If this is the first message and it's a greeting, provide a special greeting response
            if is_first_message and message.lower() in ['hello', 'hi', 'namaste', 'namaskar', 'hey']:
                # Get appropriate greeting based on language
                greeting_responses = {
                    'en-IN': "Namaste! 🙏 I'm Narad, your AI Cultural Guide. I'm here to share the rich heritage, fascinating stories, and timeless wisdom of India with you. Whether you're curious about ancient monuments, mythological tales, or cultural traditions, just ask and I'll guide you through India's incredible journey through time!",
                    'hi-IN': "नमस्ते! 🙏 मैं हूँ नारद AI, आपका AI कल्चरल गाइड।\nआप मुझसे किसी स्मारक, कहानी, या पौराणिक कथा के बारे में पूछ सकते हैं। मैं आपको उनसे जुड़ी दिलचस्प बातें और कहानियाँ सुनाने के लिए हमेशा तैयार हूँ! 🌸✨",
                    'bn-IN': "নমস্কার! 🙏 আমি নারদ, আপনার AI সাংস্কৃতিক গাইড। আমি এখানে ভারতের সমৃদ্ধ ঐতিহ্য, মুগ্ধকর গল্প এবং শাশ্বত জ্ঞান আপনার সাথে ভাগ করে নেওয়ার জন্য। আপনি প্রাচীন স্মৃতিস্তম্ভ, পৌরাণিক গল্প বা সাংস্কৃতিক ঐতিহ্য সম্পর্কে কৌতুহলী হন কিনা, শুধু জিজ্ঞাসা করুন এবং আমি আপনাকে ভারতের অবিশ্বাস্য যাত্রায় পথ নির্দেশ করব!",
                    'ta-IN': "வணக்கம்! 🙏 நான் நாரதர், உங்கள் AI கலாச்சார வழிகாட்டி. நான் இங்கே இந்தியாவின் செழிப்பான பாரம்பரியம், கவர்ச்சிகரமான கதைகள் மற்றும் நித்திய ஞானத்தை உங்களுடன் பகிர்ந்து கொள்ள இருக்கிறேன். நீங்கள் பழமையான நினைவுச்சின்னங்கள், பௌராணிக கதைகள் அல்லது கலாச்சார மரபுகள் பற்றி ஆவலுடன் இருந்தால், கேட்கவும் நான் உங்களை இந்தியாவின் நம்பமுடியாத பயணத்தில் வழிநடத்துவேன்!",
                    'te-IN': "నమస్కారం! 🙏 నేను నారదుడిని, మీ AI సాంస్కృతిక మార్గదర్శకుడిని. భారతదేశం యొక్క సమృద్ధిగాని వారసత్వం, అద్భుతమైన కథలు మరియు శాశ్వత జ్ఞానాన్ని మీతో పంచుకోడానికి నేను ఇక్కడ ఉన్నాను. మీరు పురాతన స్మారకాలు, పౌరాణిక కథలు లేదా సాంస్కృతిక సంప్రదాయాల గురించి కౌతుకంగా ఉంటే, అడగండి మరియు నేను మిమ్మల్ని భారతదేశం యొక్క అద్భుతమైన ప్రయాణంలో మార్గదర్శకత్వం చేస్తాను!"
                }
                
                greeting_response = greeting_responses.get(user_language, greeting_responses['en-IN'])
                
                return {
                    'response': greeting_response,
                    'intent': 'greeting',
                    'suggestions': [
                        "Tell me about a historical monument",
                        "Share a mythological story",
                        "Recommend cultural experiences"
                    ],
                    'confidence': 0.9,
                    'timestamp': datetime.now().isoformat()
                }
            
            # Build a simpler, more direct prompt
            conversation_context = self._format_conversation_history(conversation_history) if conversation_history else "This is the start of the conversation."
            
            full_prompt = f"""You are Narad AI, an expert guide on Indian culture, history, and heritage.

User asks: "{message}"

Provide a concise, informative response (under 200 words) about this topic. Use bullet points for clarity.

Previous conversation:
{conversation_context}

Your response:"""
            
            logger.info(f"Full prompt: {full_prompt}")
            logger.info(f"Model ready: {self.model is not None}")
            
            # FORCE GEMINI API - No hardcoded responses
            logger.info("⚡ FORCING Gemini API - Hardcoded responses DISABLED")
            ai_response = None
            
            # Try to get response from Gemini API
            if self.model:
                logger.info("Got generic response, attempting to enhance with Gemini API")
                try:
                    # Use REST API instead of SDK to avoid v1beta issues
                    import requests
                    
                    url = f"{self.api_endpoint}/{self.model_name}:generateContent?key={self.api_key}"
                    headers = {"Content-Type": "application/json"}
                    payload = {
                        "contents": [
                            {
                                "parts": [
                                    {"text": full_prompt}
                                ]
                            }
                        ],
                        "generationConfig": {
                            "temperature": 0.7,
                            "maxOutputTokens": 500,
                            "topP": 0.9,
                            "topK": 40
                        }
                    }
                    
                    logger.info(f"Making REST API request to: {url}")
                    response = requests.post(url, json=payload, headers=headers, timeout=30)
                    logger.info(f"API Response Status: {response.status_code}")
                    
                    if response.status_code == 200:
                        response_data = response.json()
                        logger.info(f"API Response: {response_data}")
                        
                        # Extract text from response
                        if "candidates" in response_data and len(response_data["candidates"]) > 0:
                            candidate = response_data["candidates"][0]
                            if "content" in candidate and "parts" in candidate["content"]:
                                parts = candidate["content"]["parts"]
                                if len(parts) > 0 and "text" in parts[0]:
                                    api_text = parts[0]["text"].strip()
                                    if api_text and len(api_text) > 20:
                                        ai_response = api_text
                                        logger.info("✅ Successfully enhanced response with API")
                        else:
                            logger.info("No candidates in API response, using contextual response")
                    else:
                        logger.error(f"❌ API Error {response.status_code}: {response.text}")
                        ai_response = f"I apologize, I'm experiencing technical difficulties (API Error {response.status_code}). The AI service needs attention. Please ensure Gemini API is properly configured with the correct model."
                        
                except Exception as e:
                    logger.error(f"❌ Gemini API call failed: {type(e).__name__}: {str(e)}")
                    ai_response = f"I apologize, I encountered an error: {str(e)[:100]}. Please ensure Gemini API is configured correctly."
            else:
                logger.info("✅ Using contextual response (primary method successful)")
            
            # Final check - if no response from Gemini, show error
            if not ai_response or ai_response is None:
                logger.error("❌ CRITICAL: Gemini API did not return any response! Hardcoded responses are DISABLED.")
                ai_response = "⚠️ AI service is currently unavailable. Gemini API is not responding. Please check: 1) API key is valid, 2) Model is 'models/gemini-pro-latest', 3) Service has been redeployed with latest code."
            
            logger.info(f"✅ Final AI response: {ai_response[:100]}...")
            
            # Store conversation in memory
            self.conversation_memory.add_message(session_id, 'user', message)
            self.conversation_memory.add_message(session_id, 'ai', ai_response)
            
            # Determine intent and suggestions
            intent = self._classify_intent(message)
            suggestions = self._generate_suggestions(message, intent, user_language)
            
            result = {
                'response': ai_response,
                'intent': intent,
                'suggestions': suggestions,
                'confidence': 0.9,
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info(f"Final result: {result}")
            return result
            
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}", exc_info=True)
            # Provide a more specific error message
            error_message = "I apologize, but I'm experiencing some technical difficulties right now. "
            if "API_KEY" in str(e) or "api key" in str(e).lower():
                error_message += "There seems to be an issue with my API configuration. "
            elif "model" in str(e).lower():
                error_message += "There seems to be an issue with the AI model. "
            else:
                error_message += "Please try again in a moment. "
            error_message += "You can still ask me about Indian culture, history, and mythology, and I'll do my best to help with my existing knowledge."
            
            return {
                'response': error_message,
                'intent': 'error',
                'suggestions': [
                    "Tell me about a historical monument",
                    "Share a mythological story",
                    "Recommend cultural experiences"
                ],
                'confidence': 0.1,
                'timestamp': datetime.now().isoformat()
            }
    
    def _classify_intent(self, message: str) -> str:
        """Classify the user's intent"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['hello', 'hi', 'namaste', 'hey']):
            return 'greeting'
        elif any(word in message_lower for word in ['horror', 'ghost', 'haunted', 'scary', 'spooky', 'paranormal', 'curse']):
            return 'horror_inquiry'
        elif any(word in message_lower for word in ['story', 'tell', 'myth', 'legend']):
            return 'story_request'
        elif any(word in message_lower for word in ['folklore', 'folk tale', 'tradition', 'belief']):
            return 'folklore_inquiry'
        elif any(word in message_lower for word in ['version', 'versions', 'different', 'perspective', 'another view']):
            return 'version_inquiry'
        elif any(word in message_lower for word in ['monument', 'place', 'location', 'visit']):
            return 'location_inquiry'
        elif any(word in message_lower for word in ['culture', 'tradition', 'festival', 'custom']):
            return 'cultural_inquiry'
        elif any(word in message_lower for word in ['summarize', 'summary', 'short', 'brief', 'tldr', 'condense']):
            return 'summarization_request'
        elif any(word in message_lower for word in ['how', 'what', 'when', 'where', 'why']):
            return 'informational'
        else:
            return 'general_inquiry'
    
    def _generate_suggestions(self, message: str, intent: str, language: str) -> List[str]:
        """Generate follow-up suggestions based on intent and language"""
        # Base suggestions in English
        suggestion_templates = {
            'greeting': [
                "Tell me about Indian mythology",
                "Share a horror story about a haunted place",
                "What are some famous Indian festivals?"
            ],
            'horror_inquiry': [
                "Tell me about Bhangarh Fort curse",
                "Share ghost stories from Taj Mahal",
                "What haunted places exist in Delhi?"
            ],
            'story_request': [
                "Tell me about Ramayana",
                "Share a story about Krishna",
                "What myths are famous in South India?"
            ],
            'folklore_inquiry': [
                "Tell me about local traditions",
                "Share folk tales from Rajasthan",
                "What are popular beliefs about monuments?"
            ],
            'version_inquiry': [
                "Show me different versions of this story",
                "What's the historical perspective?",
                "Tell me the folklore version"
            ],
            'location_inquiry': [
                "Tell me about Taj Mahal",
                "What's special about Hampi?",
                "Describe the temples of Khajuraho"
            ],
            'cultural_inquiry': [
                "Explain Diwali celebrations",
                "What are Holi traditions?",
                "Tell me about Bharatanatyam dance"
            ],
            'summarization_request': [
                "Summarize the Ramayana story",
                "Give me a brief history of Mughal Empire",
                "Quick overview of Taj Mahal"
            ],
            'informational': [
                "How old is the Indus Valley Civilization?",
                "Who built the Ajanta Caves?",
                "What is the significance of the Ganges?"
            ],
            'general_inquiry': [
                "Plan a cultural journey for me",
                "Show me AR experiences",
                "Start a treasure hunt"
            ]
        }
        
        suggestions = suggestion_templates.get(intent, suggestion_templates['general_inquiry'])
        
        # Translate suggestions based on language if needed
        # For now, we'll keep them in English as the AI can respond in the appropriate language
        return suggestions[:3]  # Return top 3 suggestions
    
    def _format_conversation_history(self, conversation_history):
        """Format conversation history safely"""
        if not conversation_history:
            return "No previous conversation"
        
        try:
            logger.info(f"Formatting conversation history with {len(conversation_history)} messages")
            formatted_messages = []
            # Group messages by user/ai pairs
            user_messages = []
            ai_messages = []
            
            # Separate user and AI messages
            for msg in conversation_history:
                logger.info(f"Processing message: {msg}")
                if msg.get('role') == 'user':
                    user_messages.append(msg.get('content', ''))
                elif msg.get('role') == 'ai':
                    ai_messages.append(msg.get('content', ''))
            
            logger.info(f"User messages: {user_messages}")
            logger.info(f"AI messages: {ai_messages}")
            
            # Create pairs of user and AI messages
            for i in range(min(len(user_messages), len(ai_messages))):
                formatted_messages.append(f"User: {user_messages[i]}\nNarad: {ai_messages[i]}")
            
            # If we have an odd number of messages, there might be a user message without a response
            if len(user_messages) > len(ai_messages) and user_messages:
                formatted_messages.append(f"User: {user_messages[-1]}\nNarad: [awaiting response]")
            
            # Return last 3 message pairs
            result = "\n".join(formatted_messages[-3:]) if formatted_messages else "No previous conversation"
            logger.info(f"Formatted conversation history: {result}")
            return result
        except Exception as e:
            logger.error(f"Error formatting conversation history: {e}")
            return "No previous conversation"
    
    def _generate_contextual_response(self, message: str, language: str) -> str:
        """Generate contextual response based on message keywords"""
        message_lower = message.lower()
        
        # Horror story responses
        if any(word in message_lower for word in ['horror', 'ghost', 'haunted', 'scary', 'paranormal', 'curse']):
            if 'bhangarh' in message_lower:
                return """🏰👻 **The Cursed Fort of Bhangarh** 👻🏰

Bhangarh Fort in Rajasthan holds the title of India's most haunted place! 🌙

**The Legend:**
Once upon a time, a beautiful princess named Ratnavati lived in Bhangarh. Her beauty was so enchanting that a tantric named Singhia fell deeply in love with her. Knowing she would never accept him, he used black magic on a perfume oil she was buying in the market.

But the clever princess discovered his plot! She threw the oil on a boulder, which rolled and crushed the tantric. As he lay dying, Singhia cursed the entire fort: "No one in Bhangarh will ever live in peace. All will perish!"

**What Happened:**
- The very next year, a battle led to the fort's destruction
- The entire population mysteriously died
- The fort has remained abandoned ever since

**Modern Day Mysteries:**
🚫 The Archaeological Survey of India prohibits entry after sunset
👁️ Visitors report strange sounds and shadows
📱 Cameras and electronic devices mysteriously malfunction
🌲 Locals refuse to go near the fort after dark
💨 An overwhelming sense of dread pervades the ruins

**Different Perspectives:**
- **Folk Version:** The tantric's curse doomed everyone
- **Historical Version:** The fort was abandoned after a battle with Mughal forces
- **Supernatural Version:** Paranormal investigators have documented unexplained phenomena

Would you like to hear more ghost stories from Indian monuments? 👻"""
            elif 'taj mahal' in message_lower and any(word in message_lower for word in ['ghost', 'horror', 'haunted']):
                return """🌕👻 **The Weeping Ghost of Taj Mahal** 👻🌕

While the Taj Mahal is known as a monument of love, it harbors mysterious tales...

**The Midnight Weeping:**
Guards who work night shifts at the Taj Mahal report hearing the sound of a woman crying. The sobs echo through the marble corridors, but when they search, no one is there.

**Theories About the Weeping:**
- Some believe it's Mumtaz Mahal's spirit, eternally mourning her separation from the living world
- Others say it's the souls of workers who died during construction, bound forever to the monument they built

**Other Unexplained Phenomena:**
📷 Cameras frequently malfunction in certain areas
👥 Shadowy figures seen walking the corridors on full moon nights
❄️ Sudden cold spots in specific chambers
🌫️ Strange mists that appear and disappear without explanation

**The Workers' Curse:**
Legend says that after the Taj Mahal was completed, Shah Jahan ordered the hands of the craftsmen cut off so they could never create another masterpiece. Some believe their tortured spirits still haunt the monument.

**Night Watchman Tales:**
- Doors that open by themselves
- Footsteps in empty corridors
- The feeling of being watched
- Whispers in an ancient language

Would you like to explore more haunted monuments of India? 🏛️👻"""
            elif 'delhi' in message_lower:
                return """🌲👻 **The Haunted Delhi Ridge Forest** 👻🌲

The Delhi Ridge forest carries the weight of dark history from the 1857 revolt...

**The Dark History:**
During the 1857 Indian Rebellion, this forest became a site of mass executions. British forces hanged hundreds of freedom fighters from these ancient trees, and their cries still echo through the forest.

**Modern Paranormal Activity:**
🌳 Locals avoid the forest after sunset
👤 Phantom hanging figures that disappear when approached
🚗 Car engines mysteriously stall
📵 Mobile phones lose signal completely
👁️ Overwhelming feeling of being watched
🔊 Battle cries and gunshots heard echoing
⏰ Time seems to slow down or speed up

**Documented Incidents:**
- Police patrols refuse to enter certain areas at night
- Joggers report seeing soldiers in 1857 uniforms
- Photography often captures unexplained orbs and shadows
- Animals refuse to enter specific zones

**The Replaying Past:**
Many witnesses claim to see historical events replaying like a loop - the hangings, the battles, the suffering - as if the trauma has imprinted itself on the location.

**Scientific Theories vs Folklore:**
- Scientists attribute it to infrasound and electromagnetic fields
- But locals insist the spirits of martyrs still seek justice
- Paranormal investigators have recorded unexplained EVP (Electronic Voice Phenomena)

Explore more haunted historical sites? 🏛️👻"""
            else:
                return """👻 **India's Haunted Heritage** 👻

India is home to some of the world's most haunted places, each with its own chilling tale! Here are the most famous:

**Top Haunted Monuments:**

1. **Bhangarh Fort, Rajasthan** 🏰
   - Most haunted place in India
   - Entry prohibited after sunset by ASI
   - Cursed by a tantric in the 16th century

2. **Shaniwarwada Fort, Pune** 🌙
   - Full moon nights are most haunted
   - Cries of a murdered prince heard
   - "Uncle, save me!" echoes at midnight

3. **Dow Hill, Darjeeling** 🌲
   - Headless boy ghost sightings
   - Victoria Boys School is haunted
   - Woodlands are extremely dangerous

4. **Dumas Beach, Gujarat** 🌊
   - Black sand from cremation ashes
   - Whispers warning visitors to leave
   - People have mysteriously disappeared

5. **Ramoji Film City, Hyderabad** 🎬
   - Built on ancient war grounds
   - Ghosts of soldiers haunt the sets
   - Equipment moves mysteriously

Would you like detailed stories about any of these haunted locations? 👻🏛️"""
        
        # Jaipur specific responses
        if 'jaipur' in message_lower:
            return """Namaste! 🙏 Jaipur, the Pink City of Rajasthan, is a treasure trove of architectural marvels and cultural heritage! Here are the must-visit places:

**Royal Palaces & Forts:**
🏰 **Amer Fort** - A magnificent hilltop fort with intricate mirror work and stunning views. The Sheesh Mahal (Palace of Mirrors) is absolutely breathtaking!

🏛️ **City Palace** - Still home to the royal family, this palace showcases a blend of Rajasthani and Mughal architecture with beautiful courtyards and museums.

🏺 **Hawa Mahal** - The iconic Palace of Winds with 953 small windows, built for royal ladies to observe street festivities without being seen.

**Heritage Sites:**
🕌 **Jantar Mantar** - A UNESCO World Heritage Site featuring astronomical instruments built in the 18th century. The world's largest stone sundial is here!

🎨 **Albert Hall Museum** - Rajasthan's oldest museum showcasing art, carpets, ivory, stone, metal sculptures, and colorful Rajasthani costumes.

**Cultural Experiences:**
🛍️ **Johari Bazaar & Bapu Bazaar** - Perfect for traditional Rajasthani jewelry, textiles, blue pottery, and handicrafts.

🍛 **Local Cuisine** - Don't miss Dal Baati Churma, Laal Maas, Ghewar, and Pyaaz Kachori!

**Pro Tips:**
- Best time to visit: October to March
- Start early to avoid crowds at major monuments
- Hire a guide at Amer Fort for fascinating historical insights
- Evening light and sound shows at Amer Fort are spectacular!

Would you like specific details about any of these places, or recommendations for a day-wise itinerary? 🌟"""
        
        # Taj Mahal
        elif 'taj mahal' in message_lower or 'taj' in message_lower:
            return """The Taj Mahal is one of the world's most magnificent monuments to love! 💖

Built by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, this white marble mausoleum in Agra is a UNESCO World Heritage Site and one of the New Seven Wonders of the World.

**Key Features:**
- Construction Period: 1632-1653 (21 years)
- Architecture: Perfect blend of Persian, Turkish, and Indian styles
- Material: Pure white Makrana marble inlaid with precious stones
- The monument appears to change colors throughout the day!

Visit at sunrise for the most magical experience! ✨"""
        
        # Delhi
        elif 'delhi' in message_lower:
            return """Delhi, India's capital, offers a perfect blend of ancient history and modern culture! 🏛️

**Must-Visit Places:**
- Red Fort & Jama Masjid
- Qutub Minar
- India Gate
- Lotus Temple
- Humayun's Tomb
- Chandni Chowk (for street food!)

Would you like detailed information about any specific place?"""
        
        # Rajasthan
        elif 'rajasthan' in message_lower:
            return """Rajasthan, the Land of Kings, is famous for its majestic forts, colorful culture, and desert landscapes! 🏜️

**Major Cities:**
- Jaipur (Pink City)
- Udaipur (City of Lakes)
- Jodhpur (Blue City)
- Jaisalmer (Golden City)

Each city has unique charm and historical significance. Which one interests you most?"""
        
        # Holi Festival
        elif 'holi' in message_lower:
            return """**Holi - The Festival of Colors** 🎨

Holi celebrates the victory of good over evil and the arrival of spring!

**Key Legends:**

**1. Prahlad & Holika:**
• Prahlad was devoted to Lord Vishnu
• His aunt Holika tried to burn him alive
• Holika burned instead, Prahlad survived
• Celebrated with bonfires (Holika Dahan)

**2. Krishna & Radha:**
• Young Krishna playfully colored Radha's face
• Started the tradition of playing with colors
• Celebrated grandly in Vrindavan & Mathura

**Traditions:**
• Throwing colored powder (gulal)
• Water balloons & water guns
• Special sweets: gujiya, thandai
• Music, dance & celebration

**When:** March (Phalguna Purnima)
**Where:** Celebrated across India, especially in North India

Would you like to know about other Indian festivals? 🌸"""
        
        # Diwali Festival
        elif 'diwali' in message_lower or 'deepavali' in message_lower:
            return """**Diwali - The Festival of Lights** 🪔

Diwali celebrates the victory of light over darkness!

**Key Stories:**
• Lord Rama's return to Ayodhya after 14 years
• Krishna defeating demon Narakasura
• Goddess Lakshmi's birthday

**Traditions:**
• Lighting diyas (oil lamps)
• Fireworks & crackers
• Rangoli decorations
• Sweets & gifts exchange
• Lakshmi Puja for prosperity

**When:** October/November (Kartik Amavasya)

The festival lasts 5 days, each with special significance! ✨"""
        
        # Navratri Festival
        elif 'navratri' in message_lower or 'navaratri' in message_lower:
            return """**Navratri - Festival of Nine Nights** 🕉️✨

Navratri celebrates the divine feminine power and victory of Goddess Durga over evil!

**Meaning:**
• Nava = Nine, Ratri = Nights
• Nine days dedicated to nine forms of Goddess Durga
• Celebrates triumph of good over evil

**The Nine Goddesses (Navdurga):**
1. **Day 1** - Shailaputri (Daughter of Mountains)
2. **Day 2** - Brahmacharini (Devoted Student)
3. **Day 3** - Chandraghanta (One with Moon on Forehead)
4. **Day 4** - Kushmanda (Creator of Universe)
5. **Day 5** - Skandamata (Mother of Kartikeya)
6. **Day 6** - Katyayani (Warrior Goddess)
7. **Day 7** - Kalaratri (Destroyer of Darkness)
8. **Day 8** - Mahagauri (Goddess of Peace)
9. **Day 9** - Siddhidatri (Giver of Perfection)

**Main Celebrations:**

🎭 **Gujarat Style:**
• Garba & Dandiya Raas dances
• Colorful traditional attire
• All-night dance celebrations

🙏 **North India Style:**
• Durga Puja pandals (especially in Bengal)
• Kanya Pujan (worship of young girls)
• Fasting and prayers

🎉 **South India Style:**
• Golu - Display of dolls & figurines
• Saraswati Puja on final day
• Cultural programs

**Traditions:**
• Fasting during the nine days
• Daily prayers and aarti
• Special bhajans (devotional songs)
• Decorating homes with flowers & lights
• Wearing specific colors each day

**Culmination:**
• **Dussehra (Day 10):** Celebrates Lord Rama's victory over Ravana
• Burning of Ravana effigies
• Symbolizes victory of good over evil

**When:** September/October (Ashwin month)
**Where:** Celebrated across India with regional variations

Gujarat's Garba nights are world-famous! Would you like to know about specific rituals or regional celebrations? 🌸"""
        
        # Ganesh Chaturthi
        elif 'ganesh' in message_lower and ('chaturthi' in message_lower or 'festival' in message_lower):
            return """**Ganesh Chaturthi - Festival of Lord Ganesha** 🐘🎉

Celebrating the birthday of Lord Ganesha, the remover of obstacles!

**The Story:**
• Goddess Parvati created Ganesha from turmeric paste
• Lord Shiva accidentally beheaded him
• Ganesha was brought back with an elephant's head
• Made leader of all celestial beings (Ganapati)

**Celebrations:**
• Installing clay Ganesha idols at homes & public pandals
• Daily prayers and offerings of modaks (Ganesha's favorite sweet)
• Cultural programs and competitions
• Grand processions with music & dance
• Immersion (Visarjan) in water bodies on the 10th day

**Famous Celebrations:**
• Mumbai's Lalbaugcha Raja
• Pune's elaborate pandals
• Maharashtra celebrates grandly!

**When:** August/September (Bhadrapada month)

**Eco-Friendly Tip:** Many now use clay idols that dissolve naturally, protecting our waters! 🌊

Ganpati Bappa Morya! 🙏"""
        
        # Eid (Muslim festival)
        elif 'eid' in message_lower:
            return """**Eid - Festival of Joy & Brotherhood** 🌙✨

Eid is one of Islam's most important celebrations!

**Two Major Eids:**

🌙 **Eid-ul-Fitr (Festival of Breaking Fast)**
• Marks the end of Ramadan (holy month of fasting)
• Special prayers at mosques
• Wearing new clothes
• Giving Zakat (charity) to the poor
• Feasting with family & friends
• Sweet dishes like Seviyan (vermicelli) & dates

🐐 **Eid-ul-Adha (Festival of Sacrifice)**
• Commemorates Prophet Ibrahim's willingness to sacrifice his son
• Qurbani (ritual sacrifice) of goats/sheep
• Meat distributed to family, friends, and the poor
• Symbolizes devotion and charity

**Traditions:**
• Morning prayers at mosque (Eid namaz)
• Greeting: "Eid Mubarak!" (Blessed Eid)
• Visiting relatives and friends
• Giving Eidi (gifts/money) to children
• Special biryani, kebabs, and sweets

**Spirit:** Gratitude, charity, and community harmony

India's Eid celebrations blend Islamic traditions with local cultures! 🕌💫"""
        
        # Pongal/Makar Sankranti
        elif any(word in message_lower for word in ['pongal', 'sankranti', 'makar sankranti', 'harvest']):
            return """**Pongal / Makar Sankranti - Harvest Festival** 🌾☀️

Celebrating the harvest season and thanking the Sun God!

**Different Names Across India:**
• **Pongal** (Tamil Nadu) - 4-day celebration
• **Makar Sankranti** (North & West India)
• **Lohri** (Punjab & Haryana)
• **Bihu** (Assam)
• **Uttarayan** (Gujarat) - Kite Flying Festival

**Pongal Celebrations (Tamil Nadu):**

🌾 **Day 1 - Bhogi:** Discard old items, welcome new beginnings
🐄 **Day 2 - Thai Pongal:** Cook sweet Pongal (rice dish) in new pots
🐮 **Day 3 - Mattu Pongal:** Honor cattle & farm animals
🎨 **Day 4 - Kaanum Pongal:** Family gatherings & outings

**Makar Sankranti Traditions:**
• Flying colorful kites
• Taking holy dips in rivers
• Til-Gul (sesame-jaggery sweets) - "Speak sweetly!"
• Celebrating the Sun's northward journey

**Foods:**
• Sweet Pongal (rice, jaggery, ghee)
• Til Ladoo (sesame sweets)
• Khichdi, Puran Poli

**When:** Mid-January (Thai/Makar month)

**Significance:** Gratitude to nature, farmers, and cattle for abundant harvest! 🙏

Gujarat's skies fill with thousands of kites - it's a spectacular sight! 🪁"""
        
        # Chhath Puja
        elif any(word in message_lower for word in ['chhath', 'chhat', 'chhath puja', 'chhat puja']):
            return """**Chhath Puja - Worship of Sun God** ☀️🙏

One of the most ancient and sacred Hindu festivals, dedicated to Surya Dev (Sun God) and Chhathi Maiya!

**What is Chhath Puja?**
• 4-day rigorous festival
• Mainly celebrated in Bihar, Jharkhand, UP, and Nepal
• Devotees thank Sun God for sustaining life on Earth
• Also worship Chhathi Maiya (Goddess Usha, Sun's wife)

**The Four Days:**

🌅 **Day 1 - Nahay Khay (Holy Bath)**
• Devotees take holy bath in river/pond
• Clean the house thoroughly
• Prepare simple satvik food (no onion/garlic)
• Only one meal for the day

🌙 **Day 2 - Kharna (Fasting)**
• Full day waterless fast (nirjala)
• Break fast in evening after sunset
• Eat kheer (rice pudding), roti, and fruits
• No water or food after this till next day

🌇 **Day 3 - Sandhya Arghya (Evening Offering)**
• Most important day!
• Prepare prasad: Thekua, fruits on bamboo baskets
• Go to river/water body at sunset
• Offer arghya (water) to setting sun
• Stand in water and pray
• Overnight fast continues

🌄 **Day 4 - Usha Arghya (Morning Offering)**
• Wake up before sunrise
• Go to river again
• Offer arghya to rising sun
• Break the 36-hour fast
• Distribute prasad to everyone

**Special Features:**

🌊 **River Ghats Transformation:**
• Thousands gather at rivers (Ganga, Yamuna, etc.)
• Beautiful sight of diyas and devotees
• Family celebrates together in water

🍪 **Special Prasad - Thekua:**
• Sweet biscuit made with wheat flour, jaggery, ghee
• Offered to Sun God
• Distributed as prasad

👭 **Women Power:**
• Mainly observed by women
• But men also participate
• Extremely strict rituals and purity
• No shoes worn during puja

**Significance:**
• Purifies body, mind, and soul
• Thanks Sun God for energy and life
• Removes sins and fulfills wishes
• Scientific benefits: Detoxification, sun exposure boosts immunity
• UV rays at sunrise/sunset are beneficial

**Rituals:**
• Complete vegetarian food (satvik)
• No onion, garlic during entire 4 days
• Fasting without water (36 hours)
• Standing in water for long hours
• Extreme devotion and discipline

**Famous Locations:**
• **Patna:** Ganga ghats packed with devotees
• **Varanasi:** Ganga aarti during Chhath
• **Ranchi:** Lakes and ponds decorated
• **Delhi:** Yamuna banks and artificial ponds
• **Mumbai:** Juhu Beach, Powai Lake

**When:** 6 days after Diwali (October/November - Kartik month)

**Beliefs:**
• Cures diseases
• Blesses with children
• Brings prosperity
• Sun God fulfills wishes

**Environmental Aspect:**
• Recently focus on eco-friendly celebrations
• Avoid plastic, use natural materials
• Keep rivers clean

**Why So Strict?**
• One of the toughest Hindu festivals
• No shortcuts allowed
• Complete dedication required
• Purity of mind, body, and spirit

Chhath Puja is unique - it's the only festival where you worship the setting sun too! Would you like to know about Chhath songs (geet) or prasad recipes? 🌅✨"""
        
        # Karva Chauth
        elif any(word in message_lower for word in ['karva chauth', 'karwa chauth', 'karvachauth']):
            return """**Karva Chauth - Festival of Married Women** 🌙💑

A beautiful festival where married women fast for their husband's long life and prosperity!

**What is Karva Chauth?**
• Celebrated by married Hindu women in North India
• Full-day fast without food or water (nirjala)
• Break fast only after seeing moon and husband's face
• Symbol of love, devotion, and marital bliss

**The Story:**
**Legend of Veeravati:**
• A beautiful queen named Veeravati observed strict fast
• Her seven brothers created fake moon with mirror
• She broke her fast thinking moon rose
• Her husband died immediately
• Goddess Parvati blessed her devotion
• Husband came back to life
• Since then, women observe this fast

**How It's Celebrated:**

🌅 **Morning (Sargi):**
• Women wake up before sunrise (around 4-5 AM)
• Eat Sargi (meal prepared by mother-in-law)
• Includes sweets, fruits, dry fruits, mathri
• Last meal before starting fast

🌞 **Daytime:**
• Complete fast - no food, no water
• Get ready in bridal attire
• Wear red/pink saree, jewelry, mehendi
• Apply beautiful mehendi on hands

🌆 **Evening Puja:**
• Women gather in groups
• Sit in circle with puja thalis
• Hear Karva Chauth katha (story)
• Pass decorated karva (pot) 7 times
• Sing traditional songs

🌙 **Moon Sighting:**
• Wait for moon to rise (8-9 PM)
• See moon through sieve or dupatta
• Offer water (arghya) to moon
• Husband gives first sip of water
• Touches wife's feet as respect
• Breaks her fast with his hands
• Exchange gifts

**Special Traditions:**

💝 **Sargi:**
• Mother-in-law prepares special food
• Shows love and care for daughter-in-law
• Includes everything for energy

🎨 **Mehendi:**
• Intricate designs on hands
• Husband's name hidden in design
• Darker mehendi = more love!

👗 **Bridal Look:**
• Red/pink saree or lehenga
• Full jewelry (solah shringar)
• Bindi, sindoor, mangalsutra
• Look like bride again!

🎁 **Gifts:**
• Husbands give gifts to wives
• Mother-in-law gives sargi thali
• Money, jewelry, clothes

**Preparations:**

**Days Before:**
• Shopping for new clothes
• Mehendi artist booking
• Buying puja items

**Puja Items Needed:**
• Karva (earthen pot)
• Sieve (chalni)
• Decorated thali
• Fruits, sweets
• Diyas, incense sticks
• Red chunri, sindoor

**Regional Variations:**

**Punjab:** Most elaborate celebrations
**Rajasthan:** Traditional folk songs
**UP/Delhi:** Combined puja gatherings
**MP:** Unique local rituals

**Modern Twist:**
• Many husbands also fast now!
• Equality in relationships
• Some couples fast together

**When:** 4th day after full moon in Kartik month (October/November)

**Popular Items:**
• Karva Chauth special thalis
• Designer mehndi
• Matching couple outfits
• Special gift hampers

**Why Women Love It:**
• Celebrates marriage
• Gets full attention from husband
• Pampered by family
• Festival with friends
• Beautiful traditions
• Strengthens bond

**Scientific View:**
• Detoxification of body
• Mental strength test
• Shows dedication

Karva Chauth is more than fasting - it's about love, dedication, and celebration of marriage! Many modern couples make it special with romantic dinners after moon sighting! 💕

Would you like Karva Chauth katha or sargi recipes? 🌙✨"""
        
        # Janmashtami / Krishna Jayanti
        elif any(word in message_lower for word in ['janmashtami', 'krishna jayanti', 'gokulashtami', 'krishna birthday']):
            return """**Janmashtami - Lord Krishna's Birthday** 🦚✨

Celebrating the birth of Lord Krishna, the eighth avatar of Lord Vishnu!

**When:** 8th day (Ashtami) of Krishna Paksha in Bhadrapada month (August/September)

**The Divine Birth:**
• Born at midnight in Mathura prison
• Parents: Devaki & Vasudeva
• Born to kill evil King Kansa
• Secretly taken to Gokul (Nanda & Yashoda)
• Entire childhood filled with miracles

**Famous Legends:**

🧈 **Makhan Chor (Butter Thief):**
• Little Krishna loved butter
• Would steal from every house
• Formed group with friends
• Made human pyramids to reach pots
• Gopis complained but loved him!

🐍 **Kaliya Daman:**
• Poisonous snake in Yamuna
• Krishna jumped in and danced on its hood
• Defeated the snake, saved village

🏔️ **Govardhan Parvat:**
• Lifted entire mountain on little finger
• Protected villagers from Indra's rain
• For 7 days and nights

💃 **Raas Leela:**
• Divine dance with gopis
• Played flute in Vrindavan
• Symbol of divine love

**How It's Celebrated:**

🏛️ **Temples:**
• Decorated beautifully
• Krishna idols in cradles (jhulas)
• Midnight celebrations (Krishna born at 12 AM)
• Abhishekam (holy bath) to idol
• Special bhajans and kirtans

🏺 **Dahi Handi:**
• Main event in Maharashtra & Gujarat
• Pot (handi) filled with curd, butter, money
• Hung high from buildings
• Human pyramids formed to break it
• Remembers Krishna stealing butter
• Prize money for winners!

🎭 **Ras Leela Performances:**
• Dance-dramas depicting Krishna's life
• Popular in Mathura, Vrindavan
• Professional and local groups
• Outdoor stages, beautiful costumes

🍛 **Food & Prasad:**
• **Panjiri** - Sweet made with dry fruits
• **Makhana** - Fox nuts with milk
• **Makhan Mishri** - Butter with sugar crystals
• **56 Bhog** - 56 different food items
• **Panchamrit** - 5 sacred ingredients
• All served to Krishna at midnight

👶 **Cradle Ceremony:**
• Baby Krishna in decorated cradle
• Devotees rock the cradle
• Sing lullabies
• Offer milk, butter, flowers

**Regional Celebrations:**

🏙️ **Mathura-Vrindavan (UP):**
• Biggest celebrations worldwide
• Week-long festivities
• International visitors
• Every temple celebrates
• Raas Leela performances

🌆 **Mumbai (Maharashtra):**
• Dahi Handi competitions
• Groups called "Govindas"
• Prizes worth lakhs
• Huge public events
• Bollywood celebrities attend

🏞️ **Gujarat:**
• Dahi Handi in every locality
• Makhan chor dressed children
• Traditional songs and dances

🎪 **ISKCON Temples:**
• Grand celebrations globally
• 24-hour kirtan
• Free prasad distribution
• Cultural programs
• Midnight abhishekam

**Fasting:**
• Many observe nirjala fast (no water)
• Break fast at midnight after puja
• Some eat only fruits during day

**Decorations:**
• Baby footprints (Krishna's steps)
• Peacock feathers
• Flutes hanging
• Flower rangolis
• Cradle decorations

**Popular Activities:**
• Dress children as Krishna/Radha
• Krishna fancy dress competitions
• Janmashtami special plays
• Community gatherings

**Spiritual Significance:**
• Birth of divine consciousness
• Victory of good over evil
• Dharma (righteousness) restored
• Message of Bhagavad Gita

**Why It's Special:**
• Krishna is most beloved deity
• Playful childhood stories
• Represents joy and love
• Accessible to all ages
• Fun celebrations

**Famous Krishna Temples:**
• **Banke Bihari, Vrindavan**
• **Dwarkadhish Temple, Dwarka**
• **ISKCON Temples worldwide**
• **Prem Mandir, Vrindavan**

**Songs & Bhajans:**
• "Govind Bolo Hari Gopal Bolo"
• "Achyutam Keshavam"
• "Hare Krishna Maha Mantra"
• Regional folk songs

Janmashtami is pure joy! From Dahi Handi competitions to midnight aarti, it celebrates Krishna's playful and divine nature! 

Would you like to know about Krishna's life stories or Dahi Handi rules? 🦚✨"""
        
        # General cultural query
        else:
            return """Namaste! 🙏 I'd be happy to help you explore India's rich cultural heritage!

**Popular Topics I can help with:**

📍 **Places to Visit:**
- Jaipur's palaces and forts
- Delhi's historical monuments  
- Taj Mahal in Agra
- Temples across India

🎭 **Cultural Traditions:**
- Festivals like Diwali, Holi
- Classical dance forms
- Traditional arts and crafts

📖 **Mythology & Stories:**
- Ramayana and Mahabharata
- Stories of Krishna and Shiva
- Regional legends

What would you like to explore? Just ask me about any city, monument, festival, or cultural tradition! ✨"""
    
    def _get_fallback_response(self, message: str, language: str) -> str:
        """Generate a fallback response when AI is not available"""
        # Use the contextual response instead
        return self._generate_contextual_response(message, language)
