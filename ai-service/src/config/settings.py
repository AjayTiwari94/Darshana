"""
Configuration settings for AI services
"""

import os
from dotenv import load_dotenv
from typing import Dict, Any

# Load environment variables
load_dotenv()

# AI Model configurations
AI_CONFIG: Dict[str, Any] = {
    # OpenAI settings
    'model': os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo'),
    'max_tokens': int(os.getenv('AI_MAX_TOKENS', '800')),
    'temperature': float(os.getenv('AI_TEMPERATURE', '0.7')),
    'top_p': float(os.getenv('AI_TOP_P', '0.9')),
    
    # Response settings
    'max_response_length': int(os.getenv('MAX_RESPONSE_LENGTH', '800')),
    'summary_max_length': int(os.getenv('SUMMARY_MAX_LENGTH', '200')),
    'min_response_length': int(os.getenv('MIN_RESPONSE_LENGTH', '500')),
    
    # Conversation settings
    'max_conversation_history': int(os.getenv('MAX_CONVERSATION_HISTORY', '20')),
    'session_timeout': int(os.getenv('SESSION_TIMEOUT', '3600')),  # 1 hour
    
    # Cultural knowledge settings
    'cultural_context_limit': int(os.getenv('CULTURAL_CONTEXT_LIMIT', '5')),
    'story_search_limit': int(os.getenv('STORY_SEARCH_LIMIT', '3')),
    
    # Content generation settings
    'suggestion_count': int(os.getenv('SUGGESTION_COUNT', '4')),
    'related_content_limit': int(os.getenv('RELATED_CONTENT_LIMIT', '3')),
    
    # Quality thresholds
    'confidence_threshold': float(os.getenv('CONFIDENCE_THRESHOLD', '0.7')),
    'similarity_threshold': float(os.getenv('SIMILARITY_THRESHOLD', '0.6')),
}

# Cultural categories and their priorities
CULTURAL_CATEGORIES = {
    'history': {
        'priority': 1,
        'keywords': ['historical', 'ancient', 'period', 'dynasty', 'empire', 'ruler'],
        'response_style': 'factual and detailed'
    },
    'mythology': {
        'priority': 2,
        'keywords': ['myth', 'legend', 'god', 'goddess', 'divine', 'epic', 'purana'],
        'response_style': 'narrative and engaging'
    },
    'folklore': {
        'priority': 3,
        'keywords': ['folk', 'tradition', 'custom', 'belief', 'ritual', 'festival'],
        'response_style': 'storytelling and cultural'
    },
    'horror': {
        'priority': 4,
        'keywords': ['ghost', 'haunted', 'spirit', 'paranormal', 'mystery', 'curse'],
        'response_style': 'atmospheric and mysterious'
    },
    'architecture': {
        'priority': 2,
        'keywords': ['architecture', 'design', 'construction', 'style', 'structure'],
        'response_style': 'technical yet accessible'
    },
    'spiritual': {
        'priority': 3,
        'keywords': ['spiritual', 'religious', 'sacred', 'temple', 'worship', 'pilgrimage'],
        'response_style': 'respectful and informative'
    }
}

# Language and localization settings
LANGUAGE_CONFIG = {
    'default_language': 'en',
    'supported_languages': ['en', 'hi', 'regional'],
    'translation_enabled': True,
    'cultural_adaptations': {
        'en': 'international_friendly',
        'hi': 'culturally_immersive',
        'regional': 'locally_authentic'
    }
}

# Voice and audio settings
VOICE_CONFIG = {
    'default_voice': 'neutral',
    'voice_options': {
        'male': {
            'style': 'wise_storyteller',
            'pitch': 'medium',
            'speed': 'moderate'
        },
        'female': {
            'style': 'engaging_guide',
            'pitch': 'warm',
            'speed': 'moderate'
        },
        'ai': {
            'style': 'friendly_assistant',
            'pitch': 'adaptive',
            'speed': 'user_preference'
        }
    },
    'audio_quality': 'high',
    'format': 'mp3'
}

# Content recommendation settings
RECOMMENDATION_CONFIG = {
    'algorithms': ['collaborative', 'content_based', 'cultural_similarity'],
    'factors': {
        'user_history': 0.3,
        'cultural_interest': 0.4,
        'location_proximity': 0.2,
        'trending_content': 0.1
    },
    'diversity_factor': 0.3,  # Ensure diverse recommendations
    'freshness_factor': 0.2   # Include newer content
}

# Error handling and fallback settings
ERROR_CONFIG = {
    'max_retries': 3,
    'fallback_responses': True,
    'error_logging': True,
    'graceful_degradation': True,
    'timeout_duration': 30  # seconds
}

# Performance and caching settings
PERFORMANCE_CONFIG = {
    'cache_enabled': True,
    'cache_duration': 3600,  # 1 hour
    'response_caching': True,
    'knowledge_base_cache': True,
    'conversation_memory_cleanup': 86400  # 24 hours
}

# Security and privacy settings
SECURITY_CONFIG = {
    'user_data_retention': 30,  # days
    'conversation_logging': True,
    'personal_info_filtering': True,
    'content_moderation': True,
    'rate_limiting': {
        'requests_per_minute': 60,
        'requests_per_hour': 1000
    }
}