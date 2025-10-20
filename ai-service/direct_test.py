import sys
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

from src.services.narad_ai import NaradAI

def test_conversation_memory():
    # Create a NaradAI instance
    narad = NaradAI()
    
    # Test session ID
    session_id = "direct_test_session_001"
    
    # First message
    print("=== First Message ===")
    response1 = narad.process_message(
        message="Hello Narad, I'd like to learn about Indian history.",
        session_id=session_id
    )
    print(f"Response 1: {response1['response']}")
    
    # Check conversation history after first message
    history1 = narad.conversation_memory.get_history(session_id)
    print(f"History after first message ({len(history1)} messages):")
    for i, msg in enumerate(history1):
        print(f"  {i+1}. {msg['role']}: {msg['content']}")
    
    # Second message
    print("\n=== Second Message ===")
    response2 = narad.process_message(
        message="Can you tell me about the Maurya Empire?",
        session_id=session_id
    )
    print(f"Response 2: {response2['response']}")
    
    # Check conversation history after second message
    history2 = narad.conversation_memory.get_history(session_id)
    print(f"History after second message ({len(history2)} messages):")
    for i, msg in enumerate(history2):
        print(f"  {i+1}. {msg['role']}: {msg['content']}")
    
    # Third message
    print("\n=== Third Message ===")
    response3 = narad.process_message(
        message="What about Ashoka the Great?",
        session_id=session_id
    )
    print(f"Response 3: {response3['response']}")
    
    # Check conversation history after third message
    history3 = narad.conversation_memory.get_history(session_id)
    print(f"History after third message ({len(history3)} messages):")
    for i, msg in enumerate(history3):
        print(f"  {i+1}. {msg['role']}: {msg['content']}")
    
    print("\nTest completed successfully!")

if __name__ == "__main__":
    test_conversation_memory()