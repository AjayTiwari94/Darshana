"""
Test script to verify that the conversation memory fix is working correctly.
This script directly tests the NaradAI class to ensure conversation history is properly formatted.
"""

import os
import sys
import logging

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

from src.services.narad_ai import NaradAI
from src.utils.conversation_memory import ConversationMemory

def test_conversation_memory_fix():
    """Test that the conversation memory fix is working correctly."""
    print("=== Testing Conversation Memory Fix ===")
    
    # Create a NaradAI instance
    narad = NaradAI()
    
    # Test session ID
    session_id = "test_memory_fix_001"
    
    # Test the conversation memory directly
    print("\n1. Testing ConversationMemory directly:")
    memory = narad.conversation_memory
    
    # Add some test messages
    memory.add_message(session_id, "user", "Hello Narad, I'd like to learn about Indian history.")
    memory.add_message(session_id, "ai", "Namaste! I'd be happy to help you learn about Indian history. India has a rich and diverse history spanning thousands of years. Would you like to know about a specific period or dynasty?")
    memory.add_message(session_id, "user", "Can you tell me about the Maurya Empire?")
    memory.add_message(session_id, "ai", "Certainly! The Maurya Empire was one of the largest and most powerful empires in ancient India, existing from 322-185 BCE. It was founded by Chandragupta Maurya and reached its peak under Emperor Ashoka the Great.")
    
    # Get the conversation history
    history = memory.get_history(session_id)
    print(f"   Conversation history has {len(history)} messages:")
    for i, msg in enumerate(history):
        print(f"     {i+1}. {msg['role']}: {msg['content']}")
    
    # Test the _format_conversation_history method
    print("\n2. Testing _format_conversation_history method:")
    formatted_history = narad._format_conversation_history(history)
    print(f"   Formatted history:\n{formatted_history}")
    
    # Verify the format is correct
    if "User:" in formatted_history and "Narad:" in formatted_history:
        print("   ✓ Conversation history formatting is working correctly!")
    else:
        print("   ✗ Conversation history formatting is NOT working correctly!")
        return False
    
    # Test with the process_message method
    print("\n3. Testing process_message with conversation memory:")
    
    # Clear previous messages for a clean test
    memory.clear_session(session_id)
    
    # First message
    print("   First message:")
    response1 = narad.process_message(
        message="Hello Narad, what can you tell me about Indian culture?",
        session_id=session_id
    )
    print(f"     Response: {response1['response'][:100]}...")
    
    # Second message - should reference the previous conversation
    print("   Second message (should reference previous conversation):")
    response2 = narad.process_message(
        message="That's interesting! Can you tell me more about Indian festivals?",
        session_id=session_id
    )
    print(f"     Response: {response2['response'][:100]}...")
    
    # Check if the AI is referencing the previous conversation
    history_after_second = memory.get_history(session_id)
    print(f"   After second message, history has {len(history_after_second)} messages:")
    for i, msg in enumerate(history_after_second):
        print(f"     {i+1}. {msg['role']}: {msg['content'][:50]}...")
    
    print("\n=== Test completed ===")
    return True

if __name__ == "__main__":
    # Set up logging to see debug information
    logging.basicConfig(level=logging.INFO)
    test_conversation_memory_fix()