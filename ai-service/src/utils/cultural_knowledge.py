"""
Cultural Knowledge Base for Narad AI
Manages cultural information, stories, and contextual knowledge
"""

import json
import os
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

class CulturalKnowledgeBase:
    """
    Knowledge base containing cultural information about Indian heritage
    """
    
    def __init__(self):
        """Initialize the cultural knowledge base"""
        self.monuments_db = {}
        self.stories_db = {}
        self.cultural_contexts = {}
        self.regional_knowledge = {}
        self.mythological_figures = {}
        self.historical_periods = {}
        
        # Load knowledge from files/database
        self._load_knowledge_base()
        
        logger.info("Cultural Knowledge Base initialized")
    
    def is_loaded(self) -> bool:
        """Check if knowledge base is properly loaded"""
        return bool(
            self.monuments_db or 
            self.stories_db or 
            self.cultural_contexts
        )
    
    def _load_knowledge_base(self):
        """Load cultural knowledge from various sources"""
        try:
            # In a real implementation, this would load from:
            # - Database
            # - JSON files
            # - External APIs
            # - Curated cultural datasets
            
            # For now, we'll populate with sample data
            self._load_sample_monuments()
            self._load_sample_stories()
            self._load_cultural_contexts()
            self._load_mythological_figures()
            self._load_historical_periods()
            
            logger.info("Knowledge base loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading knowledge base: {e}")
            # Initialize with empty databases for graceful degradation
            self._initialize_empty_databases()
    
    def _load_sample_monuments(self):
        """Load sample monument data"""
        self.monuments_db = {
            'taj_mahal': {
                'name': 'Taj Mahal',
                'location': 'Agra, Uttar Pradesh',
                'period': 'Mughal',
                'built_year': 1653,
                'significance': 'Symbol of eternal love, UNESCO World Heritage Site',
                'architecture': 'Indo-Islamic',
                'stories': ['shah_jahan_love', 'mumtaz_mahal_story', 'taj_mysteries'],
                'myths': ['black_taj_legend', 'architect_curse'],
                'cultural_importance': 'Symbol of Mughal grandeur and artistic achievement',
                'related_figures': ['Shah Jahan', 'Mumtaz Mahal', 'Ustad Ahmad Lahori']
            },
            'red_fort': {
                'name': 'Red Fort',
                'location': 'Delhi',
                'period': 'Mughal',
                'built_year': 1648,
                'significance': 'Seat of Mughal power, Independence Day venue',
                'architecture': 'Mughal',
                'stories': ['mughal_court_life', 'british_capture', 'independence_flag'],
                'myths': ['hidden_treasures', 'secret_passages'],
                'cultural_importance': 'Symbol of Indian independence and Mughal heritage',
                'related_figures': ['Shah Jahan', 'Aurangzeb', 'Bahadur Shah Zafar']
            },
            'hampi': {
                'name': 'Hampi',
                'location': 'Karnataka',
                'period': 'Vijayanagara Empire',
                'built_year': 1336,
                'significance': 'Capital of Vijayanagara Empire, ruins of ancient city',
                'architecture': 'Vijayanagara',
                'stories': ['krishnadevaraya_reign', 'vijayanagara_glory', 'battle_talikota'],
                'myths': ['hanuman_birthplace', 'rama_vali_fight', 'magical_boulders'],
                'cultural_importance': 'Testament to South Indian architectural brilliance',
                'related_figures': ['Krishnadevaraya', 'Harihar Bukka', 'Tenali Rama']
            },
            'kedarnath': {
                'name': 'Kedarnath Temple',
                'location': 'Uttarakhand',
                'period': 'Ancient',
                'built_year': 800,  # Traditionally attributed to Adi Shankaracharya
                'significance': 'One of the twelve Jyotirlingas of Lord Shiva, part of Char Dham',
                'architecture': 'North Indian Nagara style',
                'stories': ['kedarnath_pandavas', 'shiva_lingam_origin', 'kedarnath_floods'],
                'myths': ['shiva_bull_transformation', 'divine_protection'],
                'cultural_importance': 'Sacred pilgrimage site for Hindus, symbol of faith and devotion',
                'related_figures': ['Adi Shankaracharya', 'Pandavas', 'Lord Shiva']
            },
            'badrinath': {
                'name': 'Badrinath Temple',
                'location': 'Uttarakhand',
                'period': 'Ancient',
                'built_year': 800,  # Traditionally attributed to Adi Shankaracharya
                'significance': 'One of the four Char Dham pilgrimage sites, dedicated to Lord Vishnu',
                'architecture': 'North Indian Nagara style',
                'stories': ['badrinath_vishnu_tapasya', 'badri_tree_legend', 'adi_shankara_restoration'],
                'myths': ['vishnu_meditation', 'lakshmi_companionship'],
                'cultural_importance': 'Sacred pilgrimage site for Hindus, symbol of devotion to Vishnu',
                'related_figures': ['Adi Shankaracharya', 'Lord Vishnu', 'Goddess Lakshmi']
            }
        }
    
    def _load_sample_stories(self):
        """Load sample story data"""
        self.stories_db = {
            'shah_jahan_love': {
                'title': 'The Eternal Love of Shah Jahan',
                'type': 'historical_romance',
                'monument': 'taj_mahal',
                'content': 'The story of Shah Jahan\'s undying love for Mumtaz Mahal...',
                'themes': ['love', 'loss', 'devotion', 'architecture'],
                'cultural_significance': 'Represents the depth of Mughal royal emotions',
                'historical_accuracy': 'verified'
            },
            'hanuman_birthplace': {
                'title': 'Hanuman\'s Birthplace in Hampi',
                'type': 'mythology',
                'monument': 'hampi',
                'content': 'Legend says that Anjana gave birth to Hanuman in these hills...',
                'themes': ['devotion', 'strength', 'mythology', 'Ramayana'],
                'cultural_significance': 'Sacred site for Hanuman devotees',
                'historical_accuracy': 'mythological'
            },
            'red_fort_mysteries': {
                'title': 'Hidden Secrets of Red Fort',
                'type': 'mystery',
                'monument': 'red_fort',
                'content': 'The Red Fort holds many secrets within its walls...',
                'themes': ['mystery', 'history', 'architecture', 'secrets'],
                'cultural_significance': 'Adds intrigue to historical narratives',
                'historical_accuracy': 'folklore'
            },
            'kedarnath_pandavas': {
                'title': 'The Pandavas and Lord Shiva',
                'type': 'mythology',
                'monument': 'kedarnath',
                'content': 'The story of how the Pandavas sought Lord Shiva\'s blessings...',
                'themes': ['mahabharata', 'devotion', 'pilgrimage', 'atonement'],
                'cultural_significance': 'Foundation myth of Kedarnath pilgrimage',
                'historical_accuracy': 'mythological'
            },
            'shiva_bull_transformation': {
                'title': 'Shiva\'s Bull Transformation',
                'type': 'mythology',
                'monument': 'kedarnath',
                'content': 'The tale of how Lord Shiva transformed into a bull to test the Pandavas...',
                'themes': ['shiva', 'transformation', 'divine_play', 'devotion_testing'],
                'cultural_significance': 'Central myth explaining the lingam form at Kedarnath',
                'historical_accuracy': 'mythological'
            },
            'badrinath_vishnu_tapasya': {
                'title': 'Lord Vishnu\'s Meditation',
                'type': 'mythology',
                'monument': 'badrinath',
                'content': 'The story of Lord Vishnu meditating in the form of Badrinarayan...',
                'themes': ['vishnu', 'meditation', 'tapasya', 'divine_presence'],
                'cultural_significance': 'Foundation myth of Badrinath pilgrimage',
                'historical_accuracy': 'mythological'
            },
            'badri_tree_legend': {
                'title': 'The Badri Tree Legend',
                'type': 'mythology',
                'monument': 'badrinath',
                'content': 'The tale of how the place got its name from the badri (jujube) trees...',
                'themes': ['etymology', 'divine_provision', 'natural_abundance'],
                'cultural_significance': 'Cultural explanation for the site\'s name',
                'historical_accuracy': 'mythological'
            }
        }
    
    def _load_cultural_contexts(self):
        """Load cultural context information"""
        self.cultural_contexts = {
            'mughal_period': {
                'timeframe': '1526-1857',
                'characteristics': ['Indo-Islamic architecture', 'Persian influence', 'artistic patronage'],
                'key_figures': ['Babur', 'Akbar', 'Shah Jahan', 'Aurangzeb'],
                'cultural_aspects': ['religious tolerance', 'architectural innovation', 'court culture']
            },
            'vijayanagara_period': {
                'timeframe': '1336-1646',
                'characteristics': ['South Indian architecture', 'Hindu revival', 'trade prosperity'],
                'key_figures': ['Harihar Bukka', 'Krishnadevaraya', 'Achyuta Devaraya'],
                'cultural_aspects': ['temple architecture', 'literary patronage', 'military prowess']
            },
            'mythology_context': {
                'epics': ['Ramayana', 'Mahabharata', 'Puranas'],
                'themes': ['dharma', 'devotion', 'cosmic cycles', 'divine intervention'],
                'cultural_role': 'Provides moral and spiritual guidance through stories'
            }
        }
    
    def _load_mythological_figures(self):
        """Load mythological figures and their attributes"""
        self.mythological_figures = {
            'hanuman': {
                'attributes': ['strength', 'devotion', 'courage', 'wisdom'],
                'stories': ['meeting_rama', 'lanka_journey', 'mountain_lifting'],
                'significance': 'Symbol of devotion and strength',
                'worship_places': ['Hampi', 'Varanasi', 'Ayodhya']
            },
            'rama': {
                'attributes': ['righteousness', 'duty', 'ideal_king', 'virtue'],
                'stories': ['ramayana', 'exile', 'lanka_war', 'return_ayodhya'],
                'significance': 'Ideal of dharmic living',
                'worship_places': ['Ayodhya', 'Rameswaram', 'Hampi']
            },
            'krishna': {
                'attributes': ['love', 'wisdom', 'divine play', 'cosmic_dancer'],
                'stories': ['mahabharata', 'gita', 'childhood_leelas', 'vrindavan_tales'],
                'significance': 'Complete divine incarnation',
                'worship_places': ['Mathura', 'Vrindavan', 'Dwarka']
            }
        }
    
    def _load_historical_periods(self):
        """Load historical period information"""
        self.historical_periods = {
            'ancient': {
                'timeframe': 'Before 1200 CE',
                'characteristics': ['Vedic culture', 'early kingdoms', 'temple architecture'],
                'examples': ['Indus Valley', 'Mauryan Empire', 'Gupta Period']
            },
            'medieval': {
                'timeframe': '1200-1700 CE',
                'characteristics': ['Islamic influence', 'syncretic culture', 'architectural fusion'],
                'examples': ['Delhi Sultanate', 'Mughal Empire', 'Vijayanagara']
            },
            'colonial': {
                'timeframe': '1700-1947 CE',
                'characteristics': ['British rule', 'independence movement', 'cultural awakening'],
                'examples': ['East India Company', 'British Raj', 'Freedom Struggle']
            }
        }
    
    def _initialize_empty_databases(self):
        """Initialize empty databases for graceful degradation"""
        self.monuments_db = {}
        self.stories_db = {}
        self.cultural_contexts = {}
        self.regional_knowledge = {}
        self.mythological_figures = {}
        self.historical_periods = {}
    
    def get_monument_info(self, monument_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a monument"""
        monument = self.monuments_db.get(monument_id)
        if not monument:
            # Try to find by name (fuzzy matching could be added)
            for mid, mdata in self.monuments_db.items():
                if monument_id.lower() in mdata['name'].lower():
                    return mdata
        return monument
    
    def get_location_culture(self, location: str) -> Dict[str, Any]:
        """Get cultural information for a specific location"""
        # This would typically query regional knowledge
        # For now, return general cultural context
        return {
            'region': location,
            'cultural_aspects': ['local traditions', 'historical significance', 'architectural styles'],
            'famous_sites': ['monument1', 'monument2'],
            'cultural_practices': ['festivals', 'customs', 'arts']
        }
    
    def get_intent_knowledge(self, intent: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Get knowledge relevant to user intent"""
        intent_knowledge = {
            'history_inquiry': {
                'focus': 'historical facts and timeline',
                'sources': 'verified historical records',
                'style': 'factual and chronological'
            },
            'mythology_inquiry': {
                'focus': 'mythological stories and significance',
                'sources': 'ancient texts and oral traditions',
                'style': 'narrative and symbolic'
            },
            'folklore_inquiry': {
                'focus': 'local traditions and beliefs',
                'sources': 'community knowledge and practices',
                'style': 'cultural and experiential'
            },
            'horror_inquiry': {
                'focus': 'mysterious tales and legends',
                'sources': 'folklore and unexplained phenomena',
                'style': 'atmospheric and intriguing'
            }
        }
        
        return intent_knowledge.get(intent, {
            'focus': 'general cultural information',
            'sources': 'multiple cultural sources',
            'style': 'informative and engaging'
        })
    
    def search_stories(self, query: str, intent: str) -> List[Dict[str, Any]]:
        """Search for relevant stories based on query and intent"""
        relevant_stories = []
        query_lower = query.lower()
        
        for story_id, story in self.stories_db.items():
            # Check if story matches query terms
            matches_query = (
                query_lower in story['title'].lower() or
                query_lower in story['content'].lower() or
                any(theme in query_lower for theme in story['themes'])
            )
            
            # Check if story type aligns with intent
            intent_match = (
                (intent == 'mythology_inquiry' and story['type'] == 'mythology') or
                (intent == 'history_inquiry' and 'historical' in story['type']) or
                (intent == 'horror_inquiry' and story['type'] == 'mystery') or
                intent == 'general_inquiry'
            )
            
            if matches_query or intent_match:
                relevant_stories.append({
                    'id': story_id,
                    'title': story['title'],
                    'type': story['type'],
                    'relevance_score': 0.8 if matches_query and intent_match else 0.6
                })
        
        # Sort by relevance and return top results
        relevant_stories.sort(key=lambda x: x['relevance_score'], reverse=True)
        return relevant_stories[:3]  # Return top 3 stories
    
    def get_related_monuments(self, monument_id: str) -> List[Dict[str, Any]]:
        """Get monuments related to the given monument"""
        current_monument = self.get_monument_info(monument_id)
        if not current_monument:
            return []
        
        related = []
        current_period = current_monument.get('period')
        current_location_state = current_monument.get('location', '').split(',')[-1].strip()
        
        for mid, monument in self.monuments_db.items():
            if mid == monument_id:
                continue
            
            # Calculate relatedness based on period, location, architecture
            score = 0
            if monument.get('period') == current_period:
                score += 0.5
            if current_location_state in monument.get('location', ''):
                score += 0.3
            if monument.get('architecture') == current_monument.get('architecture'):
                score += 0.2
            
            if score > 0.3:  # Threshold for relatedness
                related.append({
                    'id': mid,
                    'name': monument['name'],
                    'location': monument['location'],
                    'relatedness_score': score
                })
        
        # Sort by relatedness and return top results
        related.sort(key=lambda x: x['relatedness_score'], reverse=True)
        return related[:5]
    
    def get_cultural_timeline(self, monument_id: str) -> List[Dict[str, Any]]:
        """Get historical timeline for a monument"""
        monument = self.get_monument_info(monument_id)
        if not monument:
            return []
        
        # This would typically build a comprehensive timeline
        # For now, return a sample timeline
        return [
            {
                'year': monument.get('built_year', 'Unknown'),
                'event': f"Construction of {monument['name']} began",
                'significance': 'Architectural milestone'
            },
            {
                'year': monument.get('built_year', 0) + 10,
                'event': f"Completion of {monument['name']}",
                'significance': 'Cultural landmark established'
            }
        ]
    
    def add_monument(self, monument_data: Dict[str, Any]) -> bool:
        """Add new monument to the knowledge base"""
        try:
            monument_id = monument_data['name'].lower().replace(' ', '_')
            self.monuments_db[monument_id] = monument_data
            logger.info(f"Added monument: {monument_data['name']}")
            return True
        except Exception as e:
            logger.error(f"Error adding monument: {e}")
            return False
    
    def add_story(self, story_data: Dict[str, Any]) -> bool:
        """Add new story to the knowledge base"""
        try:
            story_id = story_data['title'].lower().replace(' ', '_')
            self.stories_db[story_id] = story_data
            logger.info(f"Added story: {story_data['title']}")
            return True
        except Exception as e:
            logger.error(f"Error adding story: {e}")
            return False
    
    def get_knowledge_summary(self) -> Dict[str, int]:
        """Get summary of knowledge base contents"""
        return {
            'monuments': len(self.monuments_db),
            'stories': len(self.stories_db),
            'cultural_contexts': len(self.cultural_contexts),
            'mythological_figures': len(self.mythological_figures),
            'historical_periods': len(self.historical_periods)
        }