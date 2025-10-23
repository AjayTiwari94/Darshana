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
        'max_tokens': 800
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
                self.model_name = os.getenv('MODEL_NAME', 'gemini-pro')
                logger.info(f"Using model: {self.model_name}")
                try:
                    logger.info("Initializing Gemini model")
                    self.model = GenerativeModel(self.model_name)
                    logger.info(f"Gemini API configured successfully with model: {self.model_name}")
                    logger.info(f"Model info: {self.model}")
                except Exception as model_error:
                    logger.error(f"Error initializing Gemini model {self.model_name}: {model_error}")
                    logger.error(f"Model error type: {type(model_error)}")
                    self.model = None
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
        return self.model is not None
    
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
            
            # Build context-aware prompt
            system_prompt = f"""
{self.context_templates['greeting']}

Current conversation context:
- Language: {language_context}
- User Language Preference: {user_language}

IMPORTANT INSTRUCTIONS:
1. Respond in the same language as the user's input when possible, maintaining Indian cultural context
2. For example, if the user writes in Hindi script, respond in Hindi script
3. If the user writes in English but with Indian context, respond in English with Indian cultural references
4. CRITICAL: If the user writes entirely in English, respond entirely in English without mixing Hindi words
5. NEVER use informal terms like "beta", "bro", "dude", "yaar", etc.
6. Maintain a professional, respectful, and educational tone at all times
7. Use appropriate honorifics when referring to deities and cultural figures
8. Avoid slang, colloquialisms, and casual expressions

Conversation History:
{self._format_conversation_history(conversation_history)}
"""
            
            # Create the full prompt
            full_prompt = f"""
{system_prompt}

User Message: "{message}"

Narad's Response:
"""
            
            logger.info(f"Full prompt: {full_prompt}")
            logger.info(f"Model ready: {self.model is not None}")
            
            # Generate response using Gemini
            if self.model:
                logger.info("Generating response with Gemini API")
                try:
                    response = self.model.generate_content(
                        full_prompt,
                        generation_config=GenerationConfig(
                            temperature=AI_CONFIG.get('temperature', 0.7),
                            max_output_tokens=AI_CONFIG.get('max_tokens', 800)
                        )
                    )
                    
                    logger.info(f"Gemini response received: {response}")
                    ai_response = response.text.strip() if response.text else "I apologize, but I'm having trouble formulating a response right now. Could you please ask me something else?"
                except Exception as e:
                    logger.error(f"Error generating response with Gemini API: {e}")
                    # Fallback response
                    ai_response = self._get_fallback_response(message, user_language)
            else:
                logger.info("Using fallback response")
                # Fallback response
                ai_response = self._get_fallback_response(message, user_language)
            
            logger.info(f"AI response: {ai_response}")
            
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
        elif any(word in message_lower for word in ['story', 'tell', 'myth', 'legend']):
            return 'story_request'
        elif any(word in message_lower for word in ['monument', 'place', 'location', 'visit']):
            return 'location_inquiry'
        elif any(word in message_lower for word in ['culture', 'tradition', 'festival', 'custom']):
            return 'cultural_inquiry'
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
                "Share a story about Lord Shiva",
                "What are some famous Indian festivals?"
            ],
            'story_request': [
                "Tell me about Ramayana",
                "Share a story about Krishna",
                "What myths are famous in South India?"
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
    
    def _get_fallback_response(self, message: str, language: str) -> str:
        """Generate a fallback response when AI is not available"""
        responses = {
            'en-IN': "Namaste! 🙏 I'm Narad, your AI Cultural Guide. I'm currently experiencing technical difficulties with my knowledge base, but I'm here to help with general cultural questions about India. Here are some things you can ask me about:\n\n## Indian Culture & Traditions\n- Festivals like Diwali, Holi, Eid, and Christmas in India\n- Traditional arts like Bharatanatyam, Kathak, and Bhangra\n- Indian cuisine and regional specialties\n\n## Historical Monuments\n- The Taj Mahal and its history\n- Ancient temples and their architectural significance\n- Forts and palaces of Rajasthan\n\n## Mythological Stories\n- Tales from the Ramayana and Mahabharata\n- Stories of Lord Krishna's childhood\n- Legends of the Devi Mahatmya\n\nPlease ask me anything about these topics and I'll do my best to help!",
            'hi-IN': "नमस्ते! 🙏 मैं हूँ नारद, आपका AI कल्चरल गाइड। मुझे अभी अपने ज्ञान के पूर्ण बैंडार तक पहुँच में कुछ तकनीकी समस्या है, लेकिन मैं भारत के सांस्कृतिक प्रश्नों में आपकी सहायता करने के लिए यहाँ हूँ।\n\n## भारतीय संस्कृति और परंपराएं\n- दीपावली, होली, ईद और भारत में क्रिसमस जैसे त्योहार\n- भरतनाट्यम, कथक और भंगड़ा जैसे पारंपरिक कला रूप\n- भारतीय खाना और क्षेत्रीय विशेषताएं\n\n## ऐतिहासिक स्मारक\n- ताजमहल और उसका इतिहास\n- प्राचीन मंदिर और उनके वास्तुकला का महत्व\n- राजस्थान के किले और महल\n\n## पौराणिक कहानियां\n- रामायण और महाभारत की कहानियां\n- भगवान कृष्ण के बचपन की कहानियां\n- देवी माहात्म्य के किंवदंतियां\n\nकृपया इन विषयों पर मुझसे कुछ भी पूछें और मैं आपकी पूरी कोशिश करूंगा!",
            'bn-IN': "নমস্কার! 🙏 আমি নারদ, আপনার AI সাংস্কৃতিক গাইড। আমি এখন আমার সম্পূর্ণ জ্ঞানের ভাণ্ডার অ্যাক্সেস করতে কিছু প্রযুক্তিগত সমস্যার সম্মুখীন হচ্ছি, কিন্তু ভারতের সাংস্কৃতিক প্রশ্নগুলিতে সহায়তা করতে আমি এখানে উপস্থিত।\n\n## ভারতীয় সংস্কৃতি ও ঐতিহ্য\n- দীপাবলি, হোলি, ঈদ এবং ভারতে বড়দিনের মতো উৎসব\n- ভরতনাট্যম, কথক এবং ভাঙড়ার মতো ঐতিহাসিক শিল্পরূপ\n- ভারতীয় খাবার এবং আঞ্চলিক বিশেষত্ব\n\n## ঐতিহাসিক স্মৃতিস্তম্ভ\n- তাজমহল এবং এর ইতিহাস\n- প্রাচীন মন্দির এবং তাদের স্থাপত্যের গুরুত্ব\n- রাজস্থানের দুর্গ এবং মহল\n\n## পৌরাণিক গল্প\n- রামায়ণ এবং মহাভারতের গল্প\n- ভগবান কৃষ্ণের শৈশবের গল্প\n- দেবী মাহাত্ম্যের কিংবদন্তি\n\nদয়া করে এই বিষয়গুলি সম্পর্কে আমাকে যেকোনো কিছু জিজ্ঞাসা করুন এবং আমি আপনার সাহায্য করার চেষ্টা করব!",
            'ta-IN': "வணக்கம்! 🙏 நான் நாரதர், உங்கள் AI கலாச்சார வழிகாட்டி. எனது முழு அறிவுத்தளத்தை அணுகுவதில் நான் தற்போது சில தொழில்நுட்ப சிக்கல்களை சந்திக்கிறேன், ஆனால் இந்தியாவின் கலாச்சார கேள்விகளுக்கு உதவ நான் இங்கே உள்ளேன்.\n\n## இந்திய கலாச்சாரம் மற்றும் மரபு\n- தீபாவளி, ஹோலி, ஈத் மற்றும் இந்தியாவில் கிறிஸ்துமஸ் போன்ற விழாக்கள்\n- பரதநாட்டியம், கதக் மற்றும் பங்காரா போன்ற பாரம்பரிய கலை வடிவங்கள்\n- இந்திய உணவு மற்றும் பிராந்திய சிறப்புகள்\n\n## வரலாற்று நினைவுச்சின்னங்கள்\n- தாஜ்மஹல் மற்றும் அதன் வரலாறு\n- பழமையான கோவில்கள் மற்றும் அவற்றின் கட்டடக்கலை முக்கியத்துவம்\n- ராஜஸ்தானின் கோட்டைகள் மற்றும் அரண்மனைகள்\n\n## பௌராணிக கதைகள்\n- ராமாயணம் மற்றும் மகாபாரதம் கதைகள்\n- பகவான் கிருஷ்ணரின் குழந்தைப் பருவ கதைகள்\n- தேவி மகாத்ம்யத்தின் புராண கதைகள்\n\nஇந்த தலைப்புகள் பற்றி என்னிடம் எதையும் எடுக்கவும், நான் உங்களுக்கு உதவ முயற்சிப்பேன்!",
            'te-IN': "నమస్కారం! 🙏 నేను నారదుడిని, మీ AI సాంస్కృతిక మార్గదర్శకుడిని. నేను ప్రస్తుతం నా పూర్తి జ్ఞాన సంచయాన్ని యాక్సెస్ చేయడంలో కొంత సాంకేతిక సమస్యలను ఎదుర్కొంటున్నాను, కానీ భారతదేశం యొక్క సాంస్కృతిక ప్రశ్నలకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను.\n\n## భారతీయ సంస్కృతి & సంప్రదాయాలు\n- దీపావళి, హోలి, ఈద్ మరియు భారతదేశంలో క్రిస్మస్ వంటి పండుగలు\n- భరతనాట్యం, కథక్ మరియు భంగ్రా వంటి సాంప్రదాయిక కళా రూపాలు\n- భారతీయ వంటకాలు మరియు ప్రాంతీయ ప్రత్యేకతలు\n\n## చారిత్రక స్మారకాలు\n- తాజ్ మహల్ మరియు దాని చరిత్ర\n- పురాతన ఆలయాలు మరియు వాటి ఆర్చిటెక్చర్ ప్రాముఖ్యత\n- రాజస్థాన్ కోటలు మరియు మహల్\n\n## పౌరాణిక కథలు\n- రామాయణ మరియు మహాభారత కథలు\n- భగవంతుని బాల్య కథలు\n- దేవీ మహాత్మ్యం యొక్క సంస్కరణలు\n\nఈ అంశాలపై నాకు ఏదైనా అడగండి మరియు నేను మీకు సహాయం చేయడానికి ప్రయత్నిస్తాను!"
        }
        
        return responses.get(language, responses['en-IN'])
