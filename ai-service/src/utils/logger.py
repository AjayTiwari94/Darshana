"""
Logging configuration for AI services
"""

import logging
import os
from logging.handlers import RotatingFileHandler
from datetime import datetime

def setup_logger(name: str, level: str = None) -> logging.Logger:
    """
    Set up a logger with both file and console handlers
    
    Args:
        name: Logger name
        level: Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        
    Returns:
        Configured logger instance
    """
    # Create logger
    logger = logging.getLogger(name)
    
    # Set log level
    log_level = getattr(logging, (level or os.getenv('LOG_LEVEL', 'INFO')).upper())
    logger.setLevel(log_level)
    
    # Prevent adding multiple handlers
    if logger.handlers:
        return logger
    
    # Create formatters
    file_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(module)s:%(lineno)d - %(message)s'
    )
    console_formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%H:%M:%S'
    )
    
    # Create logs directory if it doesn't exist
    logs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'logs')
    os.makedirs(logs_dir, exist_ok=True)
    
    # File handler (rotating)
    file_handler = RotatingFileHandler(
        filename=os.path.join(logs_dir, f'{name}.log'),
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(file_formatter)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(console_formatter)
    
    # Add handlers to logger
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

def log_ai_interaction(
    logger: logging.Logger,
    user_message: str,
    ai_response: str,
    session_id: str,
    intent: str,
    confidence: float
):
    """
    Log AI interaction for analysis and debugging
    
    Args:
        logger: Logger instance
        user_message: User's input message
        ai_response: AI's response
        session_id: Session identifier
        intent: Detected intent
        confidence: Response confidence score
    """
    logger.info(
        f"AI_INTERACTION | Session: {session_id} | Intent: {intent} | "
        f"Confidence: {confidence:.2f} | User: {user_message[:100]}... | "
        f"AI: {ai_response[:100]}..."
    )

def log_performance(
    logger: logging.Logger,
    operation: str,
    duration: float,
    success: bool = True,
    details: dict = None
):
    """
    Log performance metrics
    
    Args:
        logger: Logger instance
        operation: Operation name
        duration: Duration in seconds
        success: Whether operation was successful
        details: Additional performance details
    """
    status = "SUCCESS" if success else "FAILED"
    details_str = f" | Details: {details}" if details else ""
    
    logger.info(
        f"PERFORMANCE | Operation: {operation} | Duration: {duration:.3f}s | "
        f"Status: {status}{details_str}"
    )

def log_error_with_context(
    logger: logging.Logger,
    error: Exception,
    context: dict = None,
    user_id: str = None,
    session_id: str = None
):
    """
    Log error with contextual information
    
    Args:
        logger: Logger instance
        error: Exception that occurred
        context: Contextual information
        user_id: User identifier
        session_id: Session identifier
    """
    context_str = ""
    if user_id:
        context_str += f" | User: {user_id}"
    if session_id:
        context_str += f" | Session: {session_id}"
    if context:
        context_str += f" | Context: {context}"
    
    logger.error(
        f"ERROR | {type(error).__name__}: {str(error)}{context_str}",
        exc_info=True
    )