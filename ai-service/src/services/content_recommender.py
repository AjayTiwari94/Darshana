"""
Content Recommender Service for Darshana AI
Provides personalized content recommendations based on user preferences and context
"""

import logging
from typing import Dict, List, Any, Optional, Tuple
from collections import defaultdict
import random
from ..config.settings import RECOMMENDATION_CONFIG

logger = logging.getLogger(__name__)

class ContentRecommender:
    """
    AI-powered content recommendation system for cultural experiences
    """
    
    def __init__(self):
        """Initialize the content recommender"""
        self.recommendation_algorithms = RECOMMENDATION_CONFIG['algorithms']
        self.factor_weights = RECOMMENDATION_CONFIG['factors']
        
        # Mock content database - in real implementation, this would connect to actual database
        self.content_database = self._initialize_content_database()
        self.user_profiles = {}  # Store user interaction patterns
        self.trending_content = self._initialize_trending_content()
        
        logger.info("Content Recommender initialized")
    
    def is_ready(self) -> bool:
        """Check if the recommender is ready"""
        return bool(self.content_database)
    
    def get_recommendations(
        self,
        user_message: str,
        context: Dict[str, Any],
        user_id: Optional[str] = None,
        recommendation_types: List[str] = None,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get content recommendations based on user message and context
        
        Args:
            user_message: User's current message
            context: Conversation context
            user_id: Optional user identifier for personalization
            recommendation_types: Types of content to recommend
            limit: Maximum number of recommendations
            
        Returns:
            List of recommended content items
        """
        try:
            # Extract intent and interests from message
            user_interests = self._extract_interests_from_message(user_message)
            
            # Get user profile for personalization
            user_profile = self._get_user_profile(user_id) if user_id else {}
            
            # Generate recommendations using different algorithms
            recommendations = []
            
            # Content-based filtering
            content_based = self._content_based_recommendations(
                user_interests, context, limit
            )
            recommendations.extend(content_based)
            
            # Collaborative filtering (if user profile exists)
            if user_profile:
                collaborative = self._collaborative_filtering_recommendations(
                    user_profile, limit
                )
                recommendations.extend(collaborative)
            
            # Trending content
            trending = self._trending_recommendations(context, limit // 2)
            recommendations.extend(trending)
            
            # Cultural similarity recommendations
            cultural = self._cultural_similarity_recommendations(
                user_interests, context, limit
            )
            recommendations.extend(cultural)
            
            # Score and rank recommendations
            scored_recommendations = self._score_and_rank_recommendations(
                recommendations, user_interests, context, user_profile
            )
            
            # Diversify recommendations
            final_recommendations = self._diversify_recommendations(
                scored_recommendations, limit
            )
            
            # Update user profile if user_id provided
            if user_id:
                self._update_user_profile(user_id, user_interests, context)
            
            logger.debug(f"Generated {len(final_recommendations)} recommendations")
            return final_recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
            return self._get_fallback_recommendations(context, limit)
    
    def get_personalized_recommendations(
        self,
        user_id: str,
        context: Dict[str, Any] = None,
        content_types: List[str] = None,
        limit: int = 10
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Get personalized recommendations for a specific user
        
        Args:
            user_id: User identifier
            context: Optional context information
            content_types: Types of content to include
            limit: Maximum recommendations per category
            
        Returns:
            Dictionary of categorized recommendations
        """
        try:
            user_profile = self._get_user_profile(user_id)
            context = context or {}
            content_types = content_types or ['story', 'experience', 'monument', 'hunt']
            
            categorized_recommendations = {}
            
            for content_type in content_types:
                recommendations = self._get_type_specific_recommendations(
                    content_type, user_profile, context, limit
                )
                categorized_recommendations[content_type] = recommendations
            
            logger.info(f"Generated personalized recommendations for user {user_id}")
            return categorized_recommendations
            
        except Exception as e:
            logger.error(f"Error generating personalized recommendations: {e}")
            return {content_type: [] for content_type in (content_types or [])}
    
    def _initialize_content_database(self) -> Dict[str, List[Dict[str, Any]]]:
        """Initialize mock content database"""
        return {
            'stories': [
                {
                    'id': 'story_1',
                    'title': 'The Legend of Taj Mahal',
                    'type': 'mythology',
                    'monument': 'taj_mahal',
                    'themes': ['love', 'architecture', 'mughal'],
                    'difficulty': 'easy',
                    'duration': 8,  # minutes
                    'popularity': 0.9,
                    'cultural_significance': 0.95
                },
                {
                    'id': 'story_2',
                    'title': 'Hanuman\'s Adventures in Hampi',
                    'type': 'mythology',
                    'monument': 'hampi',
                    'themes': ['devotion', 'strength', 'ramayana'],
                    'difficulty': 'medium',
                    'duration': 12,
                    'popularity': 0.85,
                    'cultural_significance': 0.9
                },
                {
                    'id': 'story_3',
                    'title': 'Ghost Stories of Red Fort',
                    'type': 'horror',
                    'monument': 'red_fort',
                    'themes': ['mystery', 'paranormal', 'history'],
                    'difficulty': 'medium',
                    'duration': 10,
                    'popularity': 0.75,
                    'cultural_significance': 0.7
                }
            ],
            'experiences': [
                {
                    'id': 'exp_1',
                    'title': 'Virtual Tour of Taj Mahal',
                    'type': 'vr_experience',
                    'monument': 'taj_mahal',
                    'themes': ['architecture', 'immersive', 'educational'],
                    'difficulty': 'easy',
                    'duration': 15,
                    'popularity': 0.88,
                    'cultural_significance': 0.85
                },
                {
                    'id': 'exp_2',
                    'title': 'AR Reconstruction of Hampi',
                    'type': 'ar_experience',
                    'monument': 'hampi',
                    'themes': ['history', 'reconstruction', 'interactive'],
                    'difficulty': 'medium',
                    'duration': 20,
                    'popularity': 0.82,
                    'cultural_significance': 0.9
                }
            ],
            'monuments': [
                {
                    'id': 'mon_1',
                    'name': 'Taj Mahal',
                    'location': 'Agra',
                    'type': 'monument',
                    'themes': ['architecture', 'love', 'mughal', 'unesco'],
                    'difficulty': 'easy',  # to visit/understand
                    'popularity': 0.95,
                    'cultural_significance': 0.98
                },
                {
                    'id': 'mon_2',
                    'name': 'Hampi Ruins',
                    'location': 'Karnataka',
                    'type': 'monument',
                    'themes': ['history', 'ruins', 'vijayanagara', 'unesco'],
                    'difficulty': 'medium',
                    'popularity': 0.8,
                    'cultural_significance': 0.95
                }
            ],
            'treasure_hunts': [
                {
                    'id': 'hunt_1',
                    'title': 'Mysteries of Taj Mahal',
                    'type': 'treasure_hunt',
                    'monument': 'taj_mahal',
                    'themes': ['puzzle', 'history', 'architecture'],
                    'difficulty': 'medium',
                    'duration': 30,
                    'popularity': 0.75,
                    'cultural_significance': 0.8
                },
                {
                    'id': 'hunt_2',
                    'title': 'Hanuman\'s Trail in Hampi',
                    'type': 'treasure_hunt',
                    'monument': 'hampi',
                    'themes': ['mythology', 'adventure', 'exploration'],
                    'difficulty': 'hard',
                    'duration': 45,
                    'popularity': 0.7,
                    'cultural_significance': 0.85
                }
            ]
        }
    
    def _initialize_trending_content(self) -> List[Dict[str, Any]]:
        """Initialize trending content list"""
        return [
            {'content_id': 'story_1', 'content_type': 'story', 'trend_score': 0.9},
            {'content_id': 'exp_1', 'content_type': 'experience', 'trend_score': 0.85},
            {'content_id': 'hunt_1', 'content_type': 'treasure_hunt', 'trend_score': 0.8}
        ]
    
    def _extract_interests_from_message(self, message: str) -> Dict[str, float]:
        """Extract user interests from their message"""
        interests = defaultdict(float)
        message_lower = message.lower()
        
        # Theme detection
        theme_keywords = {
            'mythology': ['myth', 'legend', 'god', 'goddess', 'divine', 'epic'],
            'history': ['history', 'historical', 'ancient', 'past', 'built', 'emperor'],
            'architecture': ['architecture', 'design', 'building', 'construction', 'style'],
            'mystery': ['mystery', 'secret', 'hidden', 'ghost', 'haunted', 'paranormal'],
            'culture': ['culture', 'tradition', 'custom', 'festival', 'ritual'],
            'adventure': ['adventure', 'explore', 'journey', 'quest', 'discovery'],
            'art': ['art', 'sculpture', 'painting', 'craft', 'artistic'],
            'religion': ['religious', 'spiritual', 'temple', 'worship', 'sacred']
        }
        
        for theme, keywords in theme_keywords.items():
            for keyword in keywords:
                if keyword in message_lower:
                    interests[theme] += 0.5
        
        # Content type preferences
        content_preferences = {
            'story': ['story', 'tell', 'narrative', 'tale'],
            'experience': ['experience', 'virtual', 'immersive', 'see', 'tour'],
            'hunt': ['game', 'puzzle', 'challenge', 'treasure', 'hunt', 'quiz'],
            'monument': ['monument', 'place', 'visit', 'location', 'site']
        }
        
        for content_type, keywords in content_preferences.items():
            for keyword in keywords:
                if keyword in message_lower:
                    interests[f'prefers_{content_type}'] += 0.3
        
        # Difficulty preferences
        if any(word in message_lower for word in ['easy', 'simple', 'basic']):
            interests['difficulty_preference'] = 0.3  # Easy
        elif any(word in message_lower for word in ['challenging', 'complex', 'advanced']):
            interests['difficulty_preference'] = 0.9  # Hard
        else:
            interests['difficulty_preference'] = 0.6  # Medium
        
        return dict(interests)
    
    def _get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Get or create user profile"""
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {
                'interests': defaultdict(float),
                'visited_monuments': set(),
                'completed_hunts': set(),
                'preferred_content_types': defaultdict(float),
                'interaction_history': [],
                'cultural_preferences': defaultdict(float)
            }
        return self.user_profiles[user_id]
    
    def _content_based_recommendations(
        self,
        user_interests: Dict[str, float],
        context: Dict[str, Any],
        limit: int
    ) -> List[Dict[str, Any]]:
        """Generate content-based recommendations"""
        recommendations = []
        
        for content_type, items in self.content_database.items():
            for item in items:
                # Calculate similarity score based on themes
                similarity_score = self._calculate_content_similarity(
                    user_interests, item
                )
                
                if similarity_score > 0.3:  # Threshold for relevance
                    recommendation = {
                        'content_id': item['id'],
                        'content_type': content_type[:-1],  # Remove 's' from plural
                        'title': item.get('title', item.get('name', 'Unknown')),
                        'score': similarity_score,
                        'reason': 'Based on your interests',
                        'algorithm': 'content_based',
                        'metadata': item
                    }
                    recommendations.append(recommendation)
        
        return sorted(recommendations, key=lambda x: x['score'], reverse=True)[:limit]
    
    def _collaborative_filtering_recommendations(
        self,
        user_profile: Dict[str, Any],
        limit: int
    ) -> List[Dict[str, Any]]:
        """Generate collaborative filtering recommendations"""
        # In a real system, this would find similar users and recommend content they liked
        # For now, we'll simulate based on user's interaction history
        recommendations = []
        
        # Mock collaborative filtering based on user's past preferences
        if user_profile['preferred_content_types']:
            preferred_type = max(
                user_profile['preferred_content_types'].items(),
                key=lambda x: x[1]
            )[0]
            
            # Recommend popular content of preferred type
            if preferred_type in self.content_database:
                for item in self.content_database[preferred_type]:
                    if item['id'] not in user_profile.get('seen_content', set()):
                        recommendation = {
                            'content_id': item['id'],
                            'content_type': preferred_type[:-1],
                            'title': item.get('title', item.get('name', 'Unknown')),
                            'score': item.get('popularity', 0.5) * 0.8,
                            'reason': 'Similar users also liked this',
                            'algorithm': 'collaborative',
                            'metadata': item
                        }
                        recommendations.append(recommendation)
        
        return sorted(recommendations, key=lambda x: x['score'], reverse=True)[:limit]
    
    def _trending_recommendations(
        self,
        context: Dict[str, Any],
        limit: int
    ) -> List[Dict[str, Any]]:
        """Generate trending content recommendations"""
        recommendations = []
        
        for trending_item in self.trending_content[:limit]:
            content_type = trending_item['content_type']
            content_id = trending_item['content_id']
            
            # Find the actual content item
            content_items = self.content_database.get(f"{content_type}s", [])
            item = next((item for item in content_items if item['id'] == content_id), None)
            
            if item:
                recommendation = {
                    'content_id': content_id,
                    'content_type': content_type,
                    'title': item.get('title', item.get('name', 'Unknown')),
                    'score': trending_item['trend_score'],
                    'reason': 'Trending now',
                    'algorithm': 'trending',
                    'metadata': item
                }
                recommendations.append(recommendation)
        
        return recommendations
    
    def _cultural_similarity_recommendations(
        self,
        user_interests: Dict[str, float],
        context: Dict[str, Any],
        limit: int
    ) -> List[Dict[str, Any]]:
        """Generate recommendations based on cultural similarity"""
        recommendations = []
        
        # If user is interested in a specific monument or region
        current_monument = context.get('monument_id') or context.get('current_monument')
        
        if current_monument:
            # Find content related to the same monument or cultural period
            for content_type, items in self.content_database.items():
                for item in items:
                    if item.get('monument') == current_monument:
                        cultural_score = item.get('cultural_significance', 0.5)
                        
                        recommendation = {
                            'content_id': item['id'],
                            'content_type': content_type[:-1],
                            'title': item.get('title', item.get('name', 'Unknown')),
                            'score': cultural_score,
                            'reason': f'Related to {current_monument}',
                            'algorithm': 'cultural_similarity',
                            'metadata': item
                        }
                        recommendations.append(recommendation)
        
        return sorted(recommendations, key=lambda x: x['score'], reverse=True)[:limit]
    
    def _calculate_content_similarity(
        self,
        user_interests: Dict[str, float],
        content_item: Dict[str, Any]
    ) -> float:
        """Calculate similarity between user interests and content item"""
        similarity_score = 0.0
        
        # Theme similarity
        item_themes = content_item.get('themes', [])
        for theme in item_themes:
            if theme in user_interests:
                similarity_score += user_interests[theme] * 0.3
        
        # Content type preference
        content_type = content_item.get('type', '')
        type_preference_key = f'prefers_{content_type}'
        if type_preference_key in user_interests:
            similarity_score += user_interests[type_preference_key] * 0.4
        
        # Difficulty match
        item_difficulty = content_item.get('difficulty', 'medium')
        difficulty_scores = {'easy': 0.3, 'medium': 0.6, 'hard': 0.9}
        user_difficulty_pref = user_interests.get('difficulty_preference', 0.6)
        
        difficulty_diff = abs(difficulty_scores.get(item_difficulty, 0.6) - user_difficulty_pref)
        difficulty_match = 1.0 - difficulty_diff
        similarity_score += difficulty_match * 0.2
        
        # Popularity bonus (weighted less for personalization)
        popularity = content_item.get('popularity', 0.5)
        similarity_score += popularity * 0.1
        
        return min(similarity_score, 1.0)  # Cap at 1.0
    
    def _score_and_rank_recommendations(
        self,
        recommendations: List[Dict[str, Any]],
        user_interests: Dict[str, float],
        context: Dict[str, Any],
        user_profile: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Score and rank all recommendations"""
        scored_recommendations = []
        seen_content = set()
        
        for rec in recommendations:
            content_id = rec['content_id']
            
            # Avoid duplicates
            if content_id in seen_content:
                continue
            seen_content.add(content_id)
            
            # Apply algorithm weights
            algorithm_weights = {
                'content_based': self.factor_weights['cultural_interest'],
                'collaborative': self.factor_weights['user_history'],
                'trending': self.factor_weights['trending_content'],
                'cultural_similarity': self.factor_weights['location_proximity']
            }
            
            algorithm = rec.get('algorithm', 'content_based')
            weight = algorithm_weights.get(algorithm, 0.25)
            
            # Calculate final score
            final_score = rec['score'] * weight
            
            # Apply diversity and freshness factors
            freshness_bonus = 0.1  # Assume newer content gets small bonus
            final_score += freshness_bonus
            
            rec['final_score'] = final_score
            scored_recommendations.append(rec)
        
        return sorted(scored_recommendations, key=lambda x: x['final_score'], reverse=True)
    
    def _diversify_recommendations(
        self,
        recommendations: List[Dict[str, Any]],
        limit: int
    ) -> List[Dict[str, Any]]:
        """Diversify recommendations to include variety"""
        if len(recommendations) <= limit:
            return recommendations
        
        diversified = []
        content_type_counts = defaultdict(int)
        max_per_type = max(1, limit // 4)  # Ensure variety across types
        
        for rec in recommendations:
            content_type = rec['content_type']
            
            if (len(diversified) < limit and 
                content_type_counts[content_type] < max_per_type):
                diversified.append(rec)
                content_type_counts[content_type] += 1
        
        # Fill remaining slots if any
        remaining_slots = limit - len(diversified)
        for rec in recommendations:
            if len(diversified) >= limit:
                break
            if rec not in diversified:
                diversified.append(rec)
        
        return diversified[:limit]
    
    def _get_type_specific_recommendations(
        self,
        content_type: str,
        user_profile: Dict[str, Any],
        context: Dict[str, Any],
        limit: int
    ) -> List[Dict[str, Any]]:
        """Get recommendations for a specific content type"""
        content_items = self.content_database.get(f"{content_type}s", [])
        recommendations = []
        
        for item in content_items:
            # Calculate personalized score
            score = self._calculate_personalized_score(item, user_profile, context)
            
            recommendation = {
                'content_id': item['id'],
                'title': item.get('title', item.get('name', 'Unknown')),
                'score': score,
                'reason': f'Personalized {content_type} recommendation',
                'metadata': item
            }
            recommendations.append(recommendation)
        
        return sorted(recommendations, key=lambda x: x['score'], reverse=True)[:limit]
    
    def _calculate_personalized_score(
        self,
        item: Dict[str, Any],
        user_profile: Dict[str, Any],
        context: Dict[str, Any]
    ) -> float:
        """Calculate personalized score for an item"""
        score = 0.0
        
        # User interest alignment
        user_interests = user_profile.get('interests', {})
        item_themes = item.get('themes', [])
        
        for theme in item_themes:
            if theme in user_interests:
                score += user_interests[theme] * 0.4
        
        # Cultural preferences
        cultural_prefs = user_profile.get('cultural_preferences', {})
        item_cultural_sig = item.get('cultural_significance', 0.5)
        score += item_cultural_sig * 0.3
        
        # Base popularity
        score += item.get('popularity', 0.5) * 0.2
        
        # Context relevance
        if context.get('current_monument') == item.get('monument'):
            score += 0.3
        
        return min(score, 1.0)
    
    def _update_user_profile(
        self,
        user_id: str,
        interests: Dict[str, float],
        context: Dict[str, Any]
    ):
        """Update user profile based on current interaction"""
        profile = self.user_profiles[user_id]
        
        # Update interests with decay factor
        decay_factor = 0.9
        for interest, weight in interests.items():
            profile['interests'][interest] = (
                profile['interests'][interest] * decay_factor + weight * 0.1
            )
        
        # Update context information
        if context.get('current_monument'):
            profile['visited_monuments'].add(context['current_monument'])
        
        # Add to interaction history
        profile['interaction_history'].append({
            'timestamp': 'now',  # In real implementation, use actual timestamp
            'interests': interests,
            'context': context
        })
        
        # Keep history limited
        if len(profile['interaction_history']) > 100:
            profile['interaction_history'] = profile['interaction_history'][-100:]
    
    def _get_fallback_recommendations(
        self,
        context: Dict[str, Any],
        limit: int
    ) -> List[Dict[str, Any]]:
        """Provide fallback recommendations when main algorithms fail"""
        fallback_recommendations = []
        
        # Return most popular content as fallback
        all_content = []
        for content_type, items in self.content_database.items():
            for item in items:
                all_content.append({
                    'content_id': item['id'],
                    'content_type': content_type[:-1],
                    'title': item.get('title', item.get('name', 'Unknown')),
                    'score': item.get('popularity', 0.5),
                    'reason': 'Popular content',
                    'algorithm': 'fallback',
                    'metadata': item
                })
        
        # Sort by popularity and return top items
        all_content.sort(key=lambda x: x['score'], reverse=True)
        return all_content[:limit]
    
    def get_recommender_stats(self) -> Dict[str, Any]:
        """Get recommendation system statistics"""
        total_content = sum(len(items) for items in self.content_database.values())
        
        return {
            'total_content_items': total_content,
            'content_by_type': {
                content_type: len(items) 
                for content_type, items in self.content_database.items()
            },
            'active_users': len(self.user_profiles),
            'trending_items': len(self.trending_content),
            'algorithms_enabled': self.recommendation_algorithms
        }