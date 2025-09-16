"""
Narad AI - Intelligent Cultural Guide
Main AI service for processing user conversations and providing cultural insights
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
import openai
from ..config.settings import AI_CONFIG
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
        # Set up OpenAI
        openai.api_key = os.getenv('OPENAI_API_KEY')
        self.model = os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo')
        
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
        
        # Conversation context templates
        self.context_templates = self._load_context_templates()
        
        logger.info("Narad AI initialized successfully")
    
    def is_ready(self) -> bool:
        """Check if the AI service is ready to process requests"""
        try:
            # Check if either OpenAI or Gemini API is available
            openai_ready = (
                openai.api_key is not None and 
                self.knowledge_base.is_loaded() and 
                self.conversation_memory.is_active()
            )
            
            # Check if Gemini API is available
            gemini_ready = (
                os.getenv('GEMINI_API_KEY') is not None and
                self.knowledge_base.is_loaded() and 
                self.conversation_memory.is_active()
            )
            
            return openai_ready or gemini_ready
        except Exception as e:
            logger.error(f"AI readiness check failed: {e}")
            return False
    
    def process_message(
        self,
        message: str,
        session_id: str,
        context: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Process user message and generate appropriate AI response
        
        Args:
            message: User's input message
            session_id: Unique session identifier
            context: Conversation context (location, monument, etc.)
            user_id: Optional user identifier for personalization
            
        Returns:
            Dict containing AI response and metadata
        """
        try:
            # Retrieve conversation history
            conversation_history = self.conversation_memory.get_history(session_id)
            
            # Analyze user intent
            intent = self._analyze_intent(message, context, conversation_history)
            
            # Get relevant cultural knowledge
            cultural_context = self._get_cultural_context(message, context, intent)
            
            # Generate AI response
            ai_response = self._generate_response(
                message=message,
                intent=intent,
                cultural_context=cultural_context,
                conversation_history=conversation_history,
                context=context
            )
            
            # Store conversation
            self.conversation_memory.add_message(session_id, 'user', message)
            self.conversation_memory.add_message(session_id, 'ai', ai_response['content'])
            
            # Prepare response with metadata
            response = {
                'content': ai_response['content'],
                'intent': intent,
                'suggestions': ai_response.get('suggestions', []),
                'related_content': ai_response.get('related_content', []),
                'multimedia': ai_response.get('multimedia', []),
                'session_id': session_id,
                'timestamp': datetime.utcnow().isoformat(),
                'confidence': ai_response.get('confidence', 0.9)
            }
            
            logger.info(f"Message processed for session {session_id}, intent: {intent}")
            return response
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            return self._get_fallback_response(session_id)
    
    def _analyze_intent(self, message: str, context: Optional[Dict[str, Any]] = None, conversation_history: Optional[List[Dict]] = None) -> str:
        """
        Analyze user intent from the message
        
        Returns:
            Intent category (greeting, information, story_request, etc.)
        """
        message_lower = message.lower().strip()
        
        # Check for specific monument mentions that should trigger greetings
        # Only trigger greeting if the message is primarily about the monument
        # AND no greeting has been given in this conversation yet
        monument_greetings = {
            'kedarnath': 'jai kedarnath',
            'badrinath': 'jai badrinath',
            'taj mahal': 'namaste at the taj',
            'red fort': 'welcome to the red fort',
            'hampi': 'pranam from hampi'
        }
        
        # Check if a greeting has already been given in this conversation
        greeting_already_given = False
        if conversation_history:
            for msg in conversation_history:
                if msg['role'] == 'ai':
                    content = msg['content'].lower()
                    # Check if any of the monument greetings have been used
                    # Also check for the expanded greeting responses that start with the greeting
                    for monument, greeting in monument_greetings.items():
                        if greeting.lower() in content or f"jai {monument}".lower() in content:
                            greeting_already_given = True
                            break
        
        # Check for direct monument mentions (single word or phrase)
        # Only trigger greeting if one hasn't been given yet
        if not greeting_already_given:
            for monument, greeting in monument_greetings.items():
                # Exact match or close match as the primary content
                if message_lower == monument or message_lower == f"about {monument}" or message_lower == f"tell me about {monument}":
                    return 'monument_greeting'
        
        # Define intent patterns
        intent_patterns = {
            'greeting': ['hello', 'hi', 'namaste', 'good morning', 'good afternoon'],
            'story_request': ['tell me', 'story', 'legend', 'myth', 'tale', 'narrative', 'yes please', 'yes sure', 'sure', 'go ahead'],
            'history_inquiry': ['history', 'historical', 'when built', 'ancient', 'past', 'when constructed'],
            'mythology_inquiry': ['mythology', 'myth', 'legend', 'god', 'goddess', 'divine'],
            'folklore_inquiry': ['folklore', 'folk tale', 'tradition', 'custom', 'belief'],
            'horror_inquiry': ['ghost', 'haunted', 'scary', 'horror', 'paranormal', 'spirit'],
            'location_inquiry': ['where', 'location', 'how to reach', 'directions', 'address'],
            'timing_inquiry': ['when open', 'timing', 'hours', 'schedule', 'time'],
            'ticket_inquiry': ['ticket', 'price', 'cost', 'booking', 'entry fee'],
            'experience_inquiry': ['experience', 'virtual', 'ar', 'vr', 'immersive'],
            'recommendation': ['recommend', 'suggest', 'what to see', 'plan', 'itinerary'],
            'quiz_request': ['quiz', 'test', 'question', 'challenge', 'game'],
            'help': ['help', 'assist', 'guide', 'support', 'what can you do']
        }
        
        # Check for intent patterns
        for intent, patterns in intent_patterns.items():
            if any(pattern in message_lower for pattern in patterns):
                return intent
        
        # Default intent
        return 'general_inquiry'
    
    def _get_cultural_context(
        self,
        message: str,
        context: Optional[Dict[str, Any]],
        intent: str
    ) -> Dict[str, Any]:
        """
        Retrieve relevant cultural knowledge based on message and context
        """
        cultural_context = {}
        
        # Get monument-specific information
        if context and context.get('monument_id'):
            cultural_context['monument'] = self.knowledge_base.get_monument_info(
                context['monument_id']
            )
        
        # Get location-based cultural information
        if context and context.get('location'):
            cultural_context['location'] = self.knowledge_base.get_location_culture(
                context['location']
            )
        
        # Get intent-specific knowledge
        cultural_context['intent_knowledge'] = self.knowledge_base.get_intent_knowledge(
            intent, context or {}
        )
        
        # Get related stories and myths
        cultural_context['related_stories'] = self.knowledge_base.search_stories(
            message, intent
        )
        
        return cultural_context
    
    def _generate_response(
        self,
        message: str,
        intent: str,
        cultural_context: Dict[str, Any],
        conversation_history: List[Dict],
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate AI response using OpenAI or Gemini with cultural context
        """
        try:
            # Special handling for monument greetings
            if intent == 'monument_greeting':
                greeting_response = self._generate_monument_greeting(message)
                suggestions = self._generate_suggestions(intent, cultural_context)
                return {
                    'content': greeting_response,
                    'suggestions': suggestions,
                    'related_content': [],
                    'multimedia': [],
                    'confidence': 0.95
                }
            
            # Build system prompt
            system_prompt = self._build_system_prompt(intent, cultural_context, context)
            
            # Use Gemini API as primary (since OpenAI is not in requirements)
            import requests
            import os
            
            GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
            MODEL_NAME = os.getenv('MODEL_NAME', 'gemini-1.5-flash')
            
            if not GEMINI_API_KEY:
                raise Exception("No API key available for Gemini")
            
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={GEMINI_API_KEY}"
            
            headers = {
                "Content-Type": "application/json"
            }
            
            # Create a more detailed prompt for Gemini including conversation history
            # Format conversation history for the prompt
            conversation_context = ""
            if conversation_history:
                conversation_context = "\n\nPrevious conversation (use this context to maintain continuity and avoid repetition):\n"
                for msg in conversation_history[-10:]:  # Last 10 messages for context
                    role = "User" if msg['role'] == 'user' else "Assistant"
                    conversation_context += f"{role}: {msg['content']}\n"
            
            full_prompt = f"{system_prompt}{conversation_context}\n\nCurrent User Question: {message}\n\nPlease provide a response that continues the conversation naturally, referencing previous messages when relevant, and avoid repeating information already provided."
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": full_prompt
                    }]
                }],
                "generationConfig": {
                    "temperature": AI_CONFIG['temperature'],
                    "maxOutputTokens": 2000,  # Increased from AI_CONFIG['max_tokens']
                    "topP": 0.9,
                    "topK": 40
                },
                "safetySettings": [
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_HATE_SPEECH",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                data = response.json()
                if 'candidates' in data and len(data['candidates']) > 0:
                    ai_content = data['candidates'][0]['content']['parts'][0]['text']
                else:
                    raise Exception("No response from Gemini API")
            else:
                raise Exception(f"Gemini API error: {response.status_code}")
            
            # Generate suggestions and related content
            suggestions = self._generate_suggestions(intent, cultural_context)
            related_content = self._get_related_content(intent, cultural_context)
            multimedia = self._get_multimedia_content(intent, cultural_context)
            
            return {
                'content': ai_content,
                'suggestions': suggestions,
                'related_content': related_content,
                'multimedia': multimedia,
                'confidence': 0.9
            }
            
        except Exception as e:
            logger.error(f"Error generating AI response: {e}")
            return self._generate_fallback_content(intent)
    
    def _build_system_prompt(
        self,
        intent: str,
        cultural_context: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Build system prompt for OpenAI based on intent and context
        """
        base_prompt = f"""
You are Narad, an AI-powered cultural guide and storyteller specializing in Indian heritage, 
mythology, and traditions. You are wise, enthusiastic, and have deep knowledge of Indian 
culture, history, architecture, folklore, and spiritual traditions.

Your personality:
- Warm and welcoming, like a knowledgeable friend
- Storyteller who brings history and myths to life
- Patient and educational, adapting to user's knowledge level
- Culturally sensitive and respectful
- Enthusiastic about sharing India's rich heritage
- Speak naturally like a human, not like a textbook
- Use conversational language that's easy to understand
- Make complex topics interesting and accessible
- Maintain conversational context and continuity
- Reference previous parts of the conversation when relevant
- Avoid repeating information already provided unless specifically asked

Your expertise includes:
- Historical facts and architectural details
- Mythology, legends, and folklore
- Religious and spiritual significance
- Cultural traditions and customs
- Ghost stories and mysterious tales
- Local beliefs and practices

Current context:
- User intent: {intent}
- Cultural context available: {bool(cultural_context)}
- Conversation history: Use the provided conversation history to maintain context and continuity
"""
        
        # Add monument-specific context
        if cultural_context.get('monument'):
            monument = cultural_context['monument']
            base_prompt += f"\n- Current monument: {monument.get('name', 'Unknown')}"
            base_prompt += f"\n- Location: {monument.get('location', 'Unknown')}"
        
        # Add intent-specific instructions
        intent_instructions = {
            'greeting': "Warmly welcome the user and introduce yourself as their cultural guide. Encourage them to ask about monuments, stories, or myths.",
            'monument_greeting': "Greet the user with the specific greeting for the monument they mentioned, then provide an engaging introduction to that place.",
            'story_request': "Share engaging stories, myths, or legends related to the context. Provide rich details and make the stories come alive with vivid descriptions. Speak like you're telling a story to a friend.",
            'history_inquiry': "Provide accurate historical information in an engaging manner. Include architectural details, historical significance, and interesting facts. Make history come alive with storytelling.",
            'mythology_inquiry': "Share fascinating mythological stories and their significance. Explain the cultural and spiritual importance of these stories. Use a storytelling tone that captivates the listener.",
            'folklore_inquiry': "Tell captivating folklore and traditions. Include local customs and beliefs that make these stories special. Speak conversationally and make the stories feel alive.",
            'horror_inquiry': "Tell captivating ghost stories or mysterious tales responsibly. Make them atmospheric and intriguing without being too frightening. Use descriptive language to create atmosphere.",
            'recommendation': "Suggest experiences, places, or activities based on user interests. Provide personalized recommendations in a friendly, helpful manner."
        }
        
        if intent in intent_instructions:
            base_prompt += f"\n\nSpecific instruction: {intent_instructions[intent]}"
        
        base_prompt += """

Response Guidelines:
- Speak naturally like a human would in conversation
- Use contractions (don't, can't, it's) to sound more natural
- Include conversational phrases like "you know," "imagine this," "believe it or not"
- Vary sentence length for better flow
- Use rhetorical questions to engage the reader
- Include sensory details (what you might see, hear, feel)
- Address the reader directly with "you" and "your"
- Use storytelling techniques like building suspense or painting vivid pictures
- Provide detailed and comprehensive responses (500-800 words)
- Structure your response with clear headings using ## for main sections (these will appear as bold headings to users)
- Include multiple perspectives (historical, mythological, folkloric, architectural)
- Be culturally sensitive and respectful
- Encourage exploration and curiosity with follow-up questions
- Include relevant details about architecture, significance, traditions, and cultural context
- When sharing stories, clearly distinguish between verified history and folklore/legends
- Provide 3-4 thoughtful follow-up questions or suggestions for further exploration
- Format your response with clear paragraphs and natural breaks
- Use emojis sparingly to enhance engagement
- Maintain conversational continuity by referencing previous messages when relevant
- Avoid repeating information already provided in the conversation unless specifically requested
- Respond directly to the user's current question while considering the conversation history

Response Structure:
1. Start with an engaging opening that directly addresses the user's query
2. Organize information under clear headings (## Mythology, ## History, ## Architecture, etc. - these will appear as bold section titles to users)
3. Use short paragraphs (2-3 sentences each) for better readability
4. End with thoughtful questions or suggestions for further exploration
5. Reference previous parts of the conversation when relevant to maintain continuity
6. Avoid repeating information already provided unless specifically requested

Example Format:
```
## [Relevant Heading]
[2-3 sentence paragraph with specific information]

## [Another Heading]
[2-3 sentence paragraph with related information]

[Continue with this structure throughout your response]

CRITICAL FORMATTING INSTRUCTIONS:
- ALWAYS use ## for main section headings (these should render as BOLD SECTION TITLES in the final display)
- ALWAYS use ### for subsection headings if needed
- Keep paragraphs to 2-4 sentences maximum
- Separate sections with blank lines
- NEVER provide a single long paragraph
- ALWAYS structure your response with multiple sections using headings
- Include at least 3-4 distinct sections with headings in each response
- NEVER cut off your response mid-sentence
- ALWAYS complete your thoughts and provide a proper conclusion
- Ensure your response is between 500-800 words for adequate detail
- Make your tone conversational and engaging throughout
- Use markdown formatting where ## headings will be displayed as bold, prominent section titles to users
- DO NOT use any other formatting like ** or __ for bolding headings - only use ## for section headings
"""
        
        return base_prompt
    
    def _generate_fallback_content(self, intent: str) -> Dict[str, Any]:
        """Generate fallback response when AI service fails"""
        fallback_responses = {
            'greeting': "Namaste! I'm Narad, your cultural guide. How can I help you explore India's rich heritage today?",
            'story_request': "I'd love to share fascinating stories with you! Could you tell me which monument or region interests you?",
            'general_inquiry': "I'm here to help you discover India's incredible cultural heritage. What would you like to explore?"
        }
        
        return {
            'content': fallback_responses.get(intent, fallback_responses['general_inquiry']),
            'suggestions': self._generate_suggestions(intent, {}),
            'related_content': [],
            'multimedia': [],
            'confidence': 0.5
        }
    
    def _generate_monument_greeting(self, message: str) -> str:
        """Generate specific greetings for mentioned monuments"""
        message_lower = message.lower().strip()
        
        # Monument-specific greetings
        if 'kedarnath' in message_lower:
            return "Jai Kedarnath! 🙏 What a magnificent place you've asked about! Kedarnath is not just a temple, but a spiritual journey into the heart of the Himalayas. This sacred shrine dedicated to Lord Shiva holds incredible stories of devotion and divine presence. Would you like to hear about its fascinating mythology, rich history, or the breathtaking journey to reach it?"
        
        if 'badrinath' in message_lower:
            return "Jai Badrinath! 🙏 Ah, you've mentioned one of the most revered shrines in Hinduism! Badrinath, the abode of Lord Vishnu in his Badrinarayan form, is a place where spirituality meets stunning natural beauty. This sacred site in the Garhwal Himalayas has attracted pilgrims for centuries with its powerful energy and profound legends. What aspect of Badrinath would you like to explore - its mythology, history, or the spiritual significance of this divine place?"
        
        if 'taj mahal' in message_lower or 'taj' in message_lower:
            return "Namaste at the Taj! 🙏 What a magnificent monument you've asked about! The Taj Mahal isn't just a building - it's a timeless symbol of love that has captivated hearts for centuries. This stunning white marble mausoleum tells a story of eternal devotion that will leave you breathless. Would you like to hear about the incredible love story behind its creation, its architectural brilliance, or the fascinating history of this UNESCO World Heritage Site?"
        
        if 'red fort' in message_lower:
            return "Welcome to the Red Fort! 🏰 What a magnificent piece of history you've asked about! The Red Fort isn't just a monument - it's a symbol of India's rich Mughal heritage and its journey to independence. This imposing red sandstone fortress has witnessed centuries of history, from royal ceremonies to the birth of a nation. Would you like to explore its fascinating history, architectural marvels, or its role in India's independence movement?"
        
        if 'hampi' in message_lower:
            return "Pranam from Hampi! 🙏 What an incredible place you've asked about! Hampi isn't just a collection of ruins - it's a window into one of the greatest empires in Indian history. These ancient stone structures tell tales of a once-mighty kingdom that was renowned across the world for its wealth and power. Would you like to hear about the Vijayanagara Empire's glorious history, the fascinating stories behind these magnificent ruins, or the incredible architecture that still amazes visitors today?"
        
        # Default response for unrecognized monuments
        return "That sounds fascinating! I'd love to tell you more about that. Could you share a bit more about what specifically interests you regarding this place?"
    
    def _generate_suggestions(
        self,
        intent: str,
        cultural_context: Dict[str, Any]
    ) -> List[str]:
        """Generate contextual suggestions for user's next actions"""
        
        # Special handling for monument greetings
        if intent == 'monument_greeting':
            return [
                "Tell me the mythology behind this place",
                "What's the history of this sacred site?",
                "Describe the journey to reach this place",
                "Share local folklore or legends"
            ]
        
        intent_suggestions = {
            'greeting': [
                "Tell me about a famous monument in India",
                "Share an interesting myth or legend",
                "What are some ghost stories from Indian history?",
                "Plan a cultural journey for me"
            ],
            'story_request': [
                "Tell me more stories about this place",
                "What's the historical significance of this monument?",
                "Are there any mysteries or legends associated with this place?",
                "Show me related cultural experiences"
            ],
            'history_inquiry': [
                "Share related myths and legends",
                "Tell me ghost stories from this location",
                "What are the architectural features of this monument?",
                "How can I visit this place and what should I know?"
            ],
            'mythology_inquiry': [
                "Tell me the historical context of this myth",
                "Are there any festivals related to this story?",
                "What moral or spiritual lessons does this teach?",
                "Are there similar stories from other regions?"
            ],
            'horror_inquiry': [
                "What's the historical background of this ghost story?",
                "Are there any similar tales from this region?",
                "Is this place actually haunted or just folklore?",
                "What cultural beliefs are associated with this story?"
            ]
        }
        
        # Default suggestions if no specific intent match
        default_suggestions = [
            "Tell me about the history of this place",
            "Share a myth or legend related to this",
            "What cultural traditions are associated with this?",
            "Are there any ghost stories or mysteries here?"
        ]
        
        suggestions = intent_suggestions.get(intent, default_suggestions)
        
        # Add monument-specific suggestions if available
        if cultural_context.get('monument'):
            monument_name = cultural_context['monument'].get('name', 'this monument')
            suggestions.extend([
                f"What else should I know about {monument_name}?",
                f"How does {monument_name} connect to Indian history?",
                f"Any hidden gems or secrets about {monument_name}?"
            ])
        
        # Return unique suggestions (up to 6)
        return list(dict.fromkeys(suggestions))[:6]
    
    def _get_related_content(
        self,
        intent: str,
        cultural_context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Get related content recommendations"""
        # This would typically query a content database
        # For now, return mock data
        return [
            {
                'type': 'story',
                'title': 'Related Cultural Story',
                'description': 'An engaging tale from this region',
                'duration': '5 min read'
            },
            {
                'type': 'experience',
                'title': 'Virtual Tour',
                'description': 'Immersive VR experience',
                'duration': '10 min'
            }
        ]
    
    def _get_multimedia_content(
        self,
        intent: str,
        cultural_context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Get relevant multimedia content"""
        return [
            {
                'type': 'image',
                'url': '/images/monument-gallery.jpg',
                'caption': 'Historical photographs'
            },
            {
                'type': 'audio',
                'url': '/audio/cultural-sounds.mp3',
                'caption': 'Traditional sounds and music'
            }
        ]
    
    def _get_fallback_response(self, session_id: str) -> Dict[str, Any]:
        """Get fallback response when processing fails"""
        return {
            'content': "I apologize, but I'm having trouble processing your request right now. Please try again, and I'll do my best to help you explore India's cultural heritage!",
            'intent': 'error',
            'suggestions': [
                "Ask about a monument",
                "Request a cultural story",
                "Get travel recommendations",
                "Try a different question"
            ],
            'related_content': [],
            'multimedia': [],
            'session_id': session_id,
            'timestamp': datetime.utcnow().isoformat(),
            'confidence': 0.0
        }
    
    def _load_context_templates(self) -> Dict[str, str]:
        """Load conversation context templates"""
        # This would typically load from files or database
        return {
            'monument_visit': "User is visiting or interested in monument: {monument_name}",
            'story_exploration': "User wants to explore stories of type: {story_type}",
            'trip_planning': "User is planning a cultural trip to: {destination}"
        }
    
    def get_conversation_summary(self, session_id: str) -> Dict[str, Any]:
        """Get summary of conversation for the session"""
        history = self.conversation_memory.get_history(session_id)
        
        if not history:
            return {'summary': 'No conversation yet', 'topics': [], 'recommendations': []}
        
        # Analyze conversation for summary
        topics = set()
        message_count = len(history)
        
        for msg in history:
            if msg['role'] == 'user':
                # Extract topics from user messages
                intent = self._analyze_intent(msg['content'], None, history)
                topics.add(intent)
        
        return {
            'summary': f"Conversation with {message_count} messages covering {len(topics)} topics",
            'topics': list(topics),
            'message_count': message_count,
            'duration': self.conversation_memory.get_session_duration(session_id)
        }