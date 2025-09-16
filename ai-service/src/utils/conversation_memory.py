"""
Conversation Memory Management for Narad AI
Handles session storage, conversation history, and context management
"""

import json
import time
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from collections import defaultdict, deque

logger = logging.getLogger(__name__)

class ConversationMemory:
    """
    Manages conversation history and context for AI sessions
    """
    
    def __init__(self, max_history_per_session: int = 50, session_timeout: int = 3600):
        """
        Initialize conversation memory
        
        Args:
            max_history_per_session: Maximum messages to keep per session
            session_timeout: Session timeout in seconds (default: 1 hour)
        """
        self.sessions: Dict[str, Dict] = {}
        self.max_history = max_history_per_session
        self.session_timeout = session_timeout
        
        # Statistics tracking
        self.stats = {
            'total_sessions': 0,
            'total_messages': 0,
            'active_sessions': 0
        }
        
        logger.info(f"Conversation Memory initialized with timeout: {session_timeout}s")
    
    def is_active(self) -> bool:
        """Check if conversation memory is active"""
        return True  # Memory is always active
    
    def create_session(self, session_id: str, user_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Create a new conversation session
        
        Args:
            session_id: Unique session identifier
            user_id: Optional user identifier
            
        Returns:
            Session metadata
        """
        session_data = {
            'session_id': session_id,
            'user_id': user_id,
            'created_at': datetime.utcnow().isoformat(),
            'last_activity': datetime.utcnow().isoformat(),
            'message_history': deque(maxlen=self.max_history),
            'context': {
                'topics': set(),
                'monuments_discussed': set(),
                'story_types_requested': set(),
                'user_preferences': {},
                'current_location': None,
                'current_monument': None
            },
            'session_stats': {
                'message_count': 0,
                'intent_distribution': defaultdict(int),
                'response_ratings': [],
                'topics_covered': 0
            }
        }
        
        self.sessions[session_id] = session_data
        self.stats['total_sessions'] += 1
        self.stats['active_sessions'] += 1
        
        logger.info(f"Created new session: {session_id}")
        return session_data
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Get session data by ID
        
        Args:
            session_id: Session identifier
            
        Returns:
            Session data or None if not found/expired
        """
        if session_id not in self.sessions:
            return None
        
        session = self.sessions[session_id]
        
        # Check if session has expired
        last_activity = datetime.fromisoformat(session['last_activity'])
        if datetime.utcnow() - last_activity > timedelta(seconds=self.session_timeout):
            self._expire_session(session_id)
            return None
        
        return session
    
    def add_message(
        self,
        session_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict] = None
    ) -> bool:
        """
        Add a message to session history
        
        Args:
            session_id: Session identifier
            role: Message role ('user' or 'ai')
            content: Message content
            metadata: Optional message metadata
            
        Returns:
            Success status
        """
        try:
            session = self.get_session(session_id)
            if not session:
                # Create session if it doesn't exist
                session = self.create_session(session_id)
            
            # Create message object
            message = {
                'role': role,
                'content': content,
                'timestamp': datetime.utcnow().isoformat(),
                'metadata': metadata or {}
            }
            
            # Add to history
            session['message_history'].append(message)
            
            # Update session metadata
            session['last_activity'] = datetime.utcnow().isoformat()
            session['session_stats']['message_count'] += 1
            
            # Update context based on message
            self._update_session_context(session, role, content, metadata)
            
            # Update global stats
            self.stats['total_messages'] += 1
            
            logger.debug(f"Added message to session {session_id}: {role}")
            return True
            
        except Exception as e:
            logger.error(f"Error adding message to session {session_id}: {e}")
            return False
    
    def get_history(self, session_id: str, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Get conversation history for a session
        
        Args:
            session_id: Session identifier
            limit: Optional limit on number of messages
            
        Returns:
            List of messages
        """
        session = self.get_session(session_id)
        if not session:
            return []
        
        history = list(session['message_history'])
        
        if limit:
            history = history[-limit:]
        
        return history
    
    def get_context(self, session_id: str) -> Dict[str, Any]:
        """
        Get conversation context for a session
        
        Args:
            session_id: Session identifier
            
        Returns:
            Context dictionary
        """
        session = self.get_session(session_id)
        if not session:
            return {}
        
        context = session['context'].copy()
        
        # Convert sets to lists for JSON serialization
        context['topics'] = list(context['topics'])
        context['monuments_discussed'] = list(context['monuments_discussed'])
        context['story_types_requested'] = list(context['story_types_requested'])
        
        return context
    
    def update_context(
        self,
        session_id: str,
        context_updates: Dict[str, Any]
    ) -> bool:
        """
        Update session context
        
        Args:
            session_id: Session identifier
            context_updates: Dictionary of context updates
            
        Returns:
            Success status
        """
        try:
            session = self.get_session(session_id)
            if not session:
                return False
            
            # Update context fields
            for key, value in context_updates.items():
                if key in session['context']:
                    if isinstance(session['context'][key], set):
                        if isinstance(value, (list, set)):
                            session['context'][key].update(value)
                        else:
                            session['context'][key].add(value)
                    else:
                        session['context'][key] = value
            
            session['last_activity'] = datetime.utcnow().isoformat()
            
            logger.debug(f"Updated context for session {session_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating context for session {session_id}: {e}")
            return False
    
    def get_session_duration(self, session_id: str) -> Optional[float]:
        """
        Get session duration in minutes
        
        Args:
            session_id: Session identifier
            
        Returns:
            Duration in minutes or None if session not found
        """
        session = self.get_session(session_id)
        if not session:
            return None
        
        created_at = datetime.fromisoformat(session['created_at'])
        last_activity = datetime.fromisoformat(session['last_activity'])
        
        duration = (last_activity - created_at).total_seconds() / 60  # Convert to minutes
        return round(duration, 2)
    
    def get_session_stats(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Get session statistics
        
        Args:
            session_id: Session identifier
            
        Returns:
            Session statistics or None if session not found
        """
        session = self.get_session(session_id)
        if not session:
            return None
        
        stats = session['session_stats'].copy()
        stats['duration_minutes'] = self.get_session_duration(session_id)
        stats['context_topics'] = len(session['context']['topics'])
        stats['monuments_discussed'] = len(session['context']['monuments_discussed'])
        
        return stats
    
    def _update_session_context(
        self,
        session: Dict[str, Any],
        role: str,
        content: str,
        metadata: Optional[Dict] = None
    ):
        """
        Update session context based on message content
        
        Args:
            session: Session data
            role: Message role
            content: Message content
            metadata: Message metadata
        """
        try:
            context = session['context']
            
            if role == 'user':
                # Extract topics from user messages
                content_lower = content.lower()
                
                # Detect monument mentions
                monuments = ['taj mahal', 'red fort', 'hampi', 'qutub minar', 'gateway of india']
                for monument in monuments:
                    if monument in content_lower:
                        context['monuments_discussed'].add(monument)
                
                # Detect story type requests
                story_types = ['history', 'mythology', 'folklore', 'horror', 'legend', 'ghost']
                for story_type in story_types:
                    if story_type in content_lower:
                        context['story_types_requested'].add(story_type)
                
                # Extract general topics
                topics = ['architecture', 'culture', 'tradition', 'festival', 'religion', 'art']
                for topic in topics:
                    if topic in content_lower:
                        context['topics'].add(topic)
            
            # Update from metadata
            if metadata:
                if 'intent' in metadata:
                    session['session_stats']['intent_distribution'][metadata['intent']] += 1
                
                if 'monument_id' in metadata:
                    context['current_monument'] = metadata['monument_id']
                
                if 'location' in metadata:
                    context['current_location'] = metadata['location']
                
                if 'user_rating' in metadata:
                    session['session_stats']['response_ratings'].append(metadata['user_rating'])
        
        except Exception as e:
            logger.error(f"Error updating session context: {e}")
    
    def _expire_session(self, session_id: str):
        """
        Expire and remove a session
        
        Args:
            session_id: Session identifier
        """
        if session_id in self.sessions:
            del self.sessions[session_id]
            self.stats['active_sessions'] -= 1
            logger.info(f"Expired session: {session_id}")
    
    def cleanup_expired_sessions(self):
        """
        Clean up expired sessions
        """
        current_time = datetime.utcnow()
        expired_sessions = []
        
        for session_id, session in self.sessions.items():
            last_activity = datetime.fromisoformat(session['last_activity'])
            if current_time - last_activity > timedelta(seconds=self.session_timeout):
                expired_sessions.append(session_id)
        
        for session_id in expired_sessions:
            self._expire_session(session_id)
        
        if expired_sessions:
            logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")
    
    def get_memory_stats(self) -> Dict[str, Any]:
        """
        Get memory usage statistics
        
        Returns:
            Memory statistics
        """
        # Clean up expired sessions first
        self.cleanup_expired_sessions()
        
        total_messages_in_memory = sum(
            len(session['message_history']) 
            for session in self.sessions.values()
        )
        
        return {
            'total_sessions_created': self.stats['total_sessions'],
            'active_sessions': len(self.sessions),
            'total_messages_processed': self.stats['total_messages'],
            'messages_in_memory': total_messages_in_memory,
            'average_messages_per_session': (
                total_messages_in_memory / len(self.sessions) 
                if self.sessions else 0
            ),
            'memory_efficiency': f"{total_messages_in_memory}/{self.max_history * len(self.sessions)}"
        }
    
    def export_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Export session data for analysis or backup
        
        Args:
            session_id: Session identifier
            
        Returns:
            Exportable session data
        """
        session = self.get_session(session_id)
        if not session:
            return None
        
        # Convert to serializable format
        export_data = {
            'session_id': session['session_id'],
            'user_id': session['user_id'],
            'created_at': session['created_at'],
            'last_activity': session['last_activity'],
            'duration_minutes': self.get_session_duration(session_id),
            'message_history': list(session['message_history']),
            'context': self.get_context(session_id),
            'stats': self.get_session_stats(session_id)
        }
        
        return export_data
    
    def clear_session(self, session_id: str) -> bool:
        """
        Clear a specific session
        
        Args:
            session_id: Session identifier
            
        Returns:
            Success status
        """
        if session_id in self.sessions:
            self._expire_session(session_id)
            return True
        return False
    
    def clear_all_sessions(self) -> int:
        """
        Clear all sessions
        
        Returns:
            Number of sessions cleared
        """
        count = len(self.sessions)
        self.sessions.clear()
        self.stats['active_sessions'] = 0
        
        logger.info(f"Cleared all {count} sessions")
        return count