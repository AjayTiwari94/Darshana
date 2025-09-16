"""
Story Summarizer Service for Darshana AI
Provides intelligent summarization of cultural stories and myths
"""

import re
import logging
from typing import Dict, List, Any, Optional
from ..config.settings import AI_CONFIG

logger = logging.getLogger(__name__)

class StorySummarizer:
    """
    AI-powered story summarization service for cultural content
    """
    
    def __init__(self):
        """Initialize the story summarizer"""
        self.max_length = AI_CONFIG['summary_max_length']
        self.extraction_patterns = self._initialize_patterns()
        self.cultural_keywords = self._load_cultural_keywords()
        
        logger.info("Story Summarizer initialized")
    
    def is_ready(self) -> bool:
        """Check if the summarizer is ready"""
        return True  # Always ready for basic summarization
    
    def summarize(
        self,
        content: str,
        max_length: Optional[int] = None,
        story_type: str = 'general',
        preserve_cultural_elements: bool = True
    ) -> str:
        """
        Summarize a story while preserving cultural significance
        
        Args:
            content: Original story content
            max_length: Maximum length for summary
            story_type: Type of story (mythology, history, folklore, etc.)
            preserve_cultural_elements: Whether to preserve cultural keywords
            
        Returns:
            Summarized story
        """
        try:
            if not content or not content.strip():
                return "No content provided for summarization."
            
            max_len = max_length or self.max_length
            
            # If content is already short enough, return as is
            if len(content) <= max_len:
                return content.strip()
            
            # Clean and preprocess the content
            cleaned_content = self._preprocess_content(content)
            
            # Extract key elements based on story type
            key_elements = self._extract_key_elements(cleaned_content, story_type)
            
            # Perform summarization
            if story_type == 'mythology':
                summary = self._summarize_mythology(cleaned_content, key_elements, max_len)
            elif story_type == 'history':
                summary = self._summarize_history(cleaned_content, key_elements, max_len)
            elif story_type == 'folklore':
                summary = self._summarize_folklore(cleaned_content, key_elements, max_len)
            elif story_type == 'horror':
                summary = self._summarize_horror(cleaned_content, key_elements, max_len)
            else:
                summary = self._summarize_general(cleaned_content, key_elements, max_len)
            
            # Preserve cultural elements if requested
            if preserve_cultural_elements:
                summary = self._preserve_cultural_keywords(summary, cleaned_content)
            
            # Final cleanup and validation
            summary = self._finalize_summary(summary, max_len)
            
            logger.debug(f"Summarized {len(content)} chars to {len(summary)} chars")
            return summary
            
        except Exception as e:
            logger.error(f"Error in summarization: {e}")
            return self._get_fallback_summary(content, max_len)
    
    def _initialize_patterns(self) -> Dict[str, List[str]]:
        """Initialize regex patterns for content extraction"""
        return {
            'mythology': [
                r'((?:Lord|Goddess|God)\s+\w+)',  # Divine figures
                r'((?:demon|asura|rakshasa)\s+\w+)',  # Negative figures
                r'(\w+\s+(?:blessed|cursed|granted))',  # Divine actions
                r'(in\s+(?:ancient|olden)\s+times)',  # Time markers
            ],
            'history': [
                r'((?:Emperor|King|Queen|Sultan)\s+\w+)',  # Historical figures
                r'(\d{3,4}\s*(?:CE|BCE|AD))',  # Dates
                r'((?:built|constructed|established)\s+in)',  # Construction
                r'((?:battle|war|siege)\s+of\s+\w+)',  # Conflicts
            ],
            'folklore': [
                r'(once\s+upon\s+a\s+time)',  # Folk tale openings
                r'((?:village|town|kingdom)\s+of\s+\w+)',  # Places
                r'((?:wise|brave|beautiful)\s+\w+)',  # Character traits
                r'(moral\s+of\s+the\s+story)',  # Lessons
            ],
            'horror': [
                r'((?:ghost|spirit|phantom)\s+of\s+\w+)',  # Supernatural entities
                r'((?:haunted|cursed|possessed))',  # Supernatural states
                r'((?:midnight|darkness|shadow))',  # Atmospheric elements
                r'((?:disappeared|vanished|never\s+seen))',  # Mystery elements
            ]
        }
    
    def _load_cultural_keywords(self) -> Dict[str, List[str]]:
        """Load important cultural keywords to preserve"""
        return {
            'sanskrit_terms': [
                'dharma', 'karma', 'moksha', 'ahimsa', 'guru', 'ashram',
                'yajna', 'mantra', 'yantra', 'mudra', 'pranayama'
            ],
            'religious_terms': [
                'temple', 'mosque', 'church', 'gurudwara', 'monastery',
                'shrine', 'altar', 'meditation', 'prayer', 'worship'
            ],
            'architectural_terms': [
                'gopuram', 'minaret', 'dome', 'arch', 'pillar', 'mandapa',
                'shikhara', 'torana', 'stupa', 'chaitya'
            ],
            'cultural_practices': [
                'festival', 'celebration', 'ritual', 'ceremony', 'tradition',
                'custom', 'dance', 'music', 'art', 'craft'
            ],
            'geographical': [
                'Himalayas', 'Ganges', 'Yamuna', 'Narmada', 'Godavari',
                'Deccan', 'Punjab', 'Gujarat', 'Bengal', 'Tamil Nadu'
            ]
        }
    
    def _preprocess_content(self, content: str) -> str:
        """Clean and preprocess content for summarization"""
        # Remove extra whitespace
        content = re.sub(r'\s+', ' ', content.strip())
        
        # Remove URLs and special characters that don't add value
        content = re.sub(r'http[s]?://\S+', '', content)
        content = re.sub(r'[^\w\s.,!?;:()\-\'""]', '', content)
        
        # Fix common punctuation issues
        content = re.sub(r'\s+([,.!?;:])', r'\1', content)
        content = re.sub(r'([.!?])\s*([A-Z])', r'\1 \2', content)
        
        return content
    
    def _extract_key_elements(self, content: str, story_type: str) -> Dict[str, List[str]]:
        """Extract key elements from content based on story type"""
        key_elements = {
            'characters': [],
            'places': [],
            'events': [],
            'dates': [],
            'cultural_terms': [],
            'main_themes': []
        }
        
        # Extract using story-specific patterns
        if story_type in self.extraction_patterns:
            for pattern in self.extraction_patterns[story_type]:
                matches = re.findall(pattern, content, re.IGNORECASE)
                if matches:
                    if 'lord' in pattern.lower() or 'god' in pattern.lower():
                        key_elements['characters'].extend(matches)
                    elif 'battle' in pattern.lower() or 'war' in pattern.lower():
                        key_elements['events'].extend(matches)
                    elif r'\d' in pattern:  # Date patterns
                        key_elements['dates'].extend(matches)
                    else:
                        key_elements['cultural_terms'].extend(matches)
        
        # Extract sentences that seem most important
        sentences = re.split(r'[.!?]+', content)
        important_sentences = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) > 20:  # Ignore very short sentences
                importance_score = self._calculate_sentence_importance(sentence, story_type)
                if importance_score > 0.6:  # Threshold for importance
                    important_sentences.append((sentence, importance_score))
        
        # Sort by importance and take top sentences
        important_sentences.sort(key=lambda x: x[1], reverse=True)
        key_elements['main_themes'] = [sent[0] for sent in important_sentences[:3]]
        
        return key_elements
    
    def _calculate_sentence_importance(self, sentence: str, story_type: str) -> float:
        """Calculate the importance score of a sentence"""
        score = 0.0
        sentence_lower = sentence.lower()
        
        # Cultural keyword bonus
        for category, keywords in self.cultural_keywords.items():
            for keyword in keywords:
                if keyword.lower() in sentence_lower:
                    score += 0.2
        
        # Story type specific scoring
        if story_type == 'mythology':
            mythological_terms = ['god', 'goddess', 'divine', 'blessed', 'curse', 'power']
            score += sum(0.15 for term in mythological_terms if term in sentence_lower)
        
        elif story_type == 'history':
            historical_terms = ['built', 'constructed', 'emperor', 'king', 'established', 'founded']
            score += sum(0.15 for term in historical_terms if term in sentence_lower)
        
        elif story_type == 'folklore':
            folklore_terms = ['tradition', 'belief', 'custom', 'village', 'people', 'story']
            score += sum(0.15 for term in folklore_terms if term in sentence_lower)
        
        # Length penalty for very long sentences
        if len(sentence) > 200:
            score *= 0.8
        
        # Bonus for sentences with specific structures
        if re.search(r'^(according to|legend says|it is believed)', sentence_lower):
            score += 0.3
        
        return min(score, 1.0)  # Cap at 1.0
    
    def _summarize_mythology(self, content: str, key_elements: Dict, max_length: int) -> str:
        """Summarize mythological content"""
        # Start with the most important themes
        summary_parts = []
        
        # Add character introductions
        if key_elements['characters']:
            main_char = key_elements['characters'][0]
            summary_parts.append(f"This is the story of {main_char}")
        
        # Add key narrative elements
        for theme in key_elements['main_themes'][:2]:  # Top 2 themes
            if len(' '.join(summary_parts + [theme])) < max_length * 0.8:
                summary_parts.append(theme)
        
        # Add cultural significance
        if key_elements['cultural_terms']:
            cultural_note = f"This story highlights {', '.join(key_elements['cultural_terms'][:2])}"
            if len(' '.join(summary_parts + [cultural_note])) < max_length:
                summary_parts.append(cultural_note)
        
        return '. '.join(summary_parts) + '.'
    
    def _summarize_history(self, content: str, key_elements: Dict, max_length: int) -> str:
        """Summarize historical content"""
        summary_parts = []
        
        # Add dates if available
        if key_elements['dates']:
            date_info = f"Built in {key_elements['dates'][0]}"
            summary_parts.append(date_info)
        
        # Add main historical events
        for theme in key_elements['main_themes'][:2]:
            if len(' '.join(summary_parts + [theme])) < max_length * 0.8:
                summary_parts.append(theme)
        
        # Add significance
        if key_elements['events']:
            event_note = f"Known for {key_elements['events'][0]}"
            if len(' '.join(summary_parts + [event_note])) < max_length:
                summary_parts.append(event_note)
        
        return '. '.join(summary_parts) + '.'
    
    def _summarize_folklore(self, content: str, key_elements: Dict, max_length: int) -> str:
        """Summarize folklore content"""
        summary_parts = []
        
        # Folklore often starts with traditional openings
        if 'once upon a time' in content.lower():
            summary_parts.append("This folk tale tells of")
        
        # Add main narrative
        for theme in key_elements['main_themes'][:2]:
            if len(' '.join(summary_parts + [theme])) < max_length * 0.8:
                summary_parts.append(theme)
        
        # Add cultural context
        if key_elements['cultural_terms']:
            cultural_context = f"reflecting {', '.join(key_elements['cultural_terms'][:2])}"
            if len(' '.join(summary_parts + [cultural_context])) < max_length:
                summary_parts.append(cultural_context)
        
        return '. '.join(summary_parts) + '.'
    
    def _summarize_horror(self, content: str, key_elements: Dict, max_length: int) -> str:
        """Summarize horror/mystery content"""
        summary_parts = []
        
        # Set mysterious tone
        summary_parts.append("This mysterious tale reveals")
        
        # Add main elements while maintaining atmosphere
        for theme in key_elements['main_themes'][:2]:
            if len(' '.join(summary_parts + [theme])) < max_length * 0.8:
                summary_parts.append(theme)
        
        # Add mysterious elements
        if key_elements['cultural_terms']:
            mystery_note = f"surrounded by {', '.join(key_elements['cultural_terms'][:2])}"
            if len(' '.join(summary_parts + [mystery_note])) < max_length:
                summary_parts.append(mystery_note)
        
        return '. '.join(summary_parts) + '.'
    
    def _summarize_general(self, content: str, key_elements: Dict, max_length: int) -> str:
        """General summarization approach"""
        # Use extractive summarization - select most important sentences
        sentences = re.split(r'[.!?]+', content)
        scored_sentences = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) > 20:
                score = self._calculate_sentence_importance(sentence, 'general')
                scored_sentences.append((sentence, score))
        
        # Sort by score and select top sentences
        scored_sentences.sort(key=lambda x: x[1], reverse=True)
        
        summary_sentences = []
        current_length = 0
        
        for sentence, score in scored_sentences:
            if current_length + len(sentence) + 2 <= max_length:  # +2 for '. '
                summary_sentences.append(sentence)
                current_length += len(sentence) + 2
            else:
                break
        
        return '. '.join(summary_sentences) + '.' if summary_sentences else content[:max_length]
    
    def _preserve_cultural_keywords(self, summary: str, original_content: str) -> str:
        """Ensure important cultural keywords are preserved in summary"""
        # Find cultural keywords in original that might be missing from summary
        summary_lower = summary.lower()
        original_lower = original_content.lower()
        
        missing_important_terms = []
        
        for category, keywords in self.cultural_keywords.items():
            for keyword in keywords:
                if keyword.lower() in original_lower and keyword.lower() not in summary_lower:
                    # Check if this term appears multiple times in original (indicating importance)
                    if original_lower.count(keyword.lower()) >= 2:
                        missing_important_terms.append(keyword)
        
        # Add back most important missing terms if there's space
        if missing_important_terms and len(summary) < self.max_length * 0.9:
            # Find a natural place to insert the term
            for term in missing_important_terms[:2]:  # Limit to 2 terms
                if len(summary) + len(term) + 10 < self.max_length:  # +10 for context
                    # Simple insertion at the end with context
                    summary += f" The story also mentions {term}."
        
        return summary
    
    def _finalize_summary(self, summary: str, max_length: int) -> str:
        """Final cleanup and validation of summary"""
        # Ensure proper sentence endings
        if not summary.endswith(('.', '!', '?')):
            summary += '.'
        
        # Trim if still too long
        if len(summary) > max_length:
            # Find last complete sentence within limit
            truncated = summary[:max_length]
            last_period = truncated.rfind('.')
            if last_period > max_length * 0.7:  # If we can keep most of it
                summary = truncated[:last_period + 1]
            else:
                summary = truncated.rstrip() + '...'
        
        # Capitalize first letter
        if summary and summary[0].islower():
            summary = summary[0].upper() + summary[1:]
        
        return summary.strip()
    
    def _get_fallback_summary(self, content: str, max_length: int) -> str:
        """Provide fallback summary when main summarization fails"""
        if len(content) <= max_length:
            return content.strip()
        
        # Simple truncation with word boundary
        truncated = content[:max_length]
        last_space = truncated.rfind(' ')
        
        if last_space > max_length * 0.8:  # If we can preserve most words
            return truncated[:last_space] + '...'
        else:
            return truncated + '...'
    
    def get_summary_stats(self, original: str, summary: str) -> Dict[str, Any]:
        """Get statistics about the summarization"""
        return {
            'original_length': len(original),
            'summary_length': len(summary),
            'compression_ratio': round(len(summary) / len(original), 3),
            'words_original': len(original.split()),
            'words_summary': len(summary.split()),
            'sentences_original': len(re.split(r'[.!?]+', original)),
            'sentences_summary': len(re.split(r'[.!?]+', summary)),
        }