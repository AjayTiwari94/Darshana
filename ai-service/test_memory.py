from src.utils.conversation_memory import ConversationMemory

def test_conversation_memory():
    # Create a conversation memory instance
    memory = ConversationMemory()
    
    # Create a test session
    session_id = "test_session_001"
    
    # Add some messages
    memory.add_message(session_id, "user", "Hello, I'd like to learn about Indian history.")
    memory.add_message(session_id, "ai", "Namaste! I'd be happy to help you learn about Indian history. India has a rich and diverse history spanning thousands of years. Would you like to know about a specific period or dynasty?")
    memory.add_message(session_id, "user", "Can you tell me about the Maurya Empire?")
    memory.add_message(session_id, "ai", "Certainly! The Maurya Empire was one of the largest and most powerful empires in ancient India, existing from 322-185 BCE. It was founded by Chandragupta Maurya and reached its peak under Emperor Ashoka the Great. The empire covered much of the Indian subcontinent and was known for its centralized administration and military prowess.")
    
    # Get the conversation history
    history = memory.get_history(session_id)
    print(f"Conversation history has {len(history)} messages:")
    for i, msg in enumerate(history):
        print(f"  {i+1}. {msg['role']}: {msg['content']}")
    
    print("\nTest completed successfully!")

if __name__ == "__main__":
    test_conversation_memory()