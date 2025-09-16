"""
Response helper utilities for consistent API responses
"""

from typing import Any, Dict, Optional
from datetime import datetime

def success_response(
    data: Any = None,
    message: Optional[str] = None,
    status_code: int = 200
) -> tuple:
    """
    Create a successful API response
    
    Args:
        data: Response data
        message: Optional success message
        status_code: HTTP status code
        
    Returns:
        Tuple of (response_dict, status_code)
    """
    response = {
        'success': True,
        'timestamp': datetime.utcnow().isoformat(),
    }
    
    if data is not None:
        response['data'] = data
    
    if message:
        response['message'] = message
    
    return response, status_code

def error_response(
    message: str,
    status_code: int = 400,
    error_code: Optional[str] = None,
    details: Optional[Dict] = None
) -> tuple:
    """
    Create an error API response
    
    Args:
        message: Error message
        status_code: HTTP status code
        error_code: Optional error code for categorization
        details: Additional error details
        
    Returns:
        Tuple of (response_dict, status_code)
    """
    response = {
        'success': False,
        'error': message,
        'timestamp': datetime.utcnow().isoformat(),
    }
    
    if error_code:
        response['error_code'] = error_code
    
    if details:
        response['details'] = details
    
    return response, status_code

def paginated_response(
    data: list,
    page: int,
    limit: int,
    total: int,
    message: Optional[str] = None
) -> tuple:
    """
    Create a paginated API response
    
    Args:
        data: List of items for current page
        page: Current page number
        limit: Items per page
        total: Total number of items
        message: Optional message
        
    Returns:
        Tuple of (response_dict, status_code)
    """
    total_pages = (total + limit - 1) // limit  # Ceiling division
    
    response = {
        'success': True,
        'data': data,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total,
            'pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1
        },
        'timestamp': datetime.utcnow().isoformat(),
    }
    
    if message:
        response['message'] = message
    
    return response, 200

def ai_response(
    content: str,
    confidence: float,
    intent: str,
    suggestions: list = None,
    metadata: Dict = None
) -> Dict:
    """
    Create a standardized AI response format
    
    Args:
        content: AI generated content
        confidence: Confidence score (0.0 - 1.0)
        intent: Detected user intent
        suggestions: List of suggested follow-up actions
        metadata: Additional response metadata
        
    Returns:
        Formatted AI response dictionary
    """
    response = {
        'content': content,
        'confidence': confidence,
        'intent': intent,
        'timestamp': datetime.utcnow().isoformat(),
    }
    
    if suggestions:
        response['suggestions'] = suggestions
    
    if metadata:
        response['metadata'] = metadata
    
    return response

def validation_error_response(errors: list) -> tuple:
    """
    Create a validation error response
    
    Args:
        errors: List of validation errors
        
    Returns:
        Tuple of (response_dict, status_code)
    """
    return error_response(
        message="Validation failed",
        status_code=422,
        error_code="VALIDATION_ERROR",
        details={'errors': errors}
    )