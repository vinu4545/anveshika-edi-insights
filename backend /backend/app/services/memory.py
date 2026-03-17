# simple in-memory session store

chat_memory = {}

def get_history(session_id: str):
    return chat_memory.get(session_id, [])

def update_history(session_id: str, role: str, message: str):
    if session_id not in chat_memory:
        chat_memory[session_id] = []

    chat_memory[session_id].append({
        "role": role,
        "content": message
    })

    # keep last 10 messages
    chat_memory[session_id] = chat_memory[session_id][-10:]