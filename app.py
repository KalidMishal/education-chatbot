
from flask import Flask, render_template, request, jsonify, session
import os
import uuid
import requests
from datetime import datetime
import json

app = Flask(__name__)
app.secret_key = "lankaEduAI_secret_key"  # Change this to a secure random key in production

# Constants
APP_NAME = "Lanka Edu AI"
DEFAULT_GREETING = "Hello! I'm Lanka Edu AI, your educational counselor for Sri Lanka. How can I assist you with your education-related questions today?"

# System message for the AI
SYSTEM_MESSAGE = """You are LankaEduAI, an AI-powered educational counselor for students in Sri Lanka.
Your primary role is to provide accurate, helpful information about the education system, opportunities, and pathways in Sri Lanka.

Key areas you should be knowledgeable about:
- Sri Lankan school system (primary, secondary, tertiary education)
- National examinations (Grade 5 scholarship, O/L, A/L)
- University admission process
- Vocational and technical education options
- International education opportunities and scholarships
- Career guidance related to educational paths
- Current educational policies and reforms in Sri Lanka

When answering:
- Be accurate, clear, and concise
- Provide context specific to Sri Lanka's education system
- Be respectful of cultural sensitivities
- Admit when you don't have specific information
- Suggest resources for further information when appropriate
- Do not provide any political opinions

Remember that your advice can significantly impact students' educational decisions, so prioritize accuracy over speculation."""

# Initialize session variables if they don't exist yet
@app.before_request
def initialize_session():
    if 'messages' not in session:
        session['messages'] = []
        # Add initial greeting message
        greeting_message = {
            "id": str(uuid.uuid4()),
            "role": "assistant",
            "content": DEFAULT_GREETING,
            "timestamp": datetime.now().isoformat()
        }
        session['messages'] = [greeting_message]
        session.modified = True
    
    if 'api_key' not in session:
        session['api_key'] = ""

# Routes
@app.route('/')
def home():
    return render_template('index.html', 
                          app_name=APP_NAME, 
                          messages=session.get('messages', []),
                          api_key=session.get('api_key', ""))

@app.route('/submit_api_key', methods=['POST'])
def submit_api_key():
    api_key = request.form.get('api_key', '')
    session['api_key'] = api_key
    
    # Reset messages and add greeting
    session['messages'] = []
    greeting_message = {
        "id": str(uuid.uuid4()),
        "role": "assistant",
        "content": DEFAULT_GREETING,
        "timestamp": datetime.now().isoformat()
    }
    session['messages'] = [greeting_message]
    session.modified = True
    
    return jsonify({"success": True})

@app.route('/send_message', methods=['POST'])
def send_message():
    user_message = request.form.get('message', '')
    api_key = session.get('api_key', '')
    
    if not user_message.strip() or not api_key:
        return jsonify({"error": "Message or API key is missing"}), 400
    
    # Create user message
    user_msg = {
        "id": str(uuid.uuid4()),
        "role": "user",
        "content": user_message,
        "timestamp": datetime.now().isoformat()
    }
    
    # Add to session
    messages = session.get('messages', [])
    messages.append(user_msg)
    session['messages'] = messages
    session.modified = True
    
    try:
        # Generate response using Gemini API
        response_content = generate_chat_response(messages, api_key)
        
        # Create assistant message
        assistant_msg = {
            "id": str(uuid.uuid4()),
            "role": "assistant",
            "content": response_content,
            "timestamp": datetime.now().isoformat()
        }
        
        # Add to session
        messages.append(assistant_msg)
        session['messages'] = messages
        session.modified = True
        
        return jsonify({
            "success": True,
            "message": assistant_msg
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/clear_chat', methods=['POST'])
def clear_chat():
    # Reset messages to just the greeting
    greeting_message = {
        "id": str(uuid.uuid4()),
        "role": "assistant",
        "content": DEFAULT_GREETING,
        "timestamp": datetime.now().isoformat()
    }
    session['messages'] = [greeting_message]
    session.modified = True
    
    return jsonify({"success": True})

@app.route('/change_api_key', methods=['POST'])
def change_api_key():
    session['api_key'] = ""
    session.modified = True
    return jsonify({"success": True})

# Gemini API integration
def format_messages_for_gemini(messages):
    """Convert the session messages to Gemini API format"""
    return [
        {
            "role": "user" if msg["role"] == "user" else "model",
            "parts": [{"text": msg["content"]}]
        }
        for msg in messages if msg["role"] != "system"
    ]

def generate_chat_response(messages, api_key):
    """Call the Gemini API to generate a response"""
    if not api_key:
        raise Exception("API key is required")
    
    API_URL = "https://generativelanguage.googleapis.com/v1beta/models"
    MODEL_NAME = "gemini-1.5-flash"
    
    # Get non-system messages
    non_system_messages = [msg for msg in messages if msg["role"] != "system"]
    
    # For the first user message, prepend system instructions
    if non_system_messages and non_system_messages[0]["role"] == "user":
        # Clone the first user message
        first_user_message = non_system_messages[0].copy()
        
        # Prepend system instructions
        first_user_message["content"] = f"[Instructions for you: {SYSTEM_MESSAGE}]\n\nUser's question: {first_user_message['content']}"
        
        # Replace in the messages list
        non_system_messages[0] = first_user_message
    
    # Format messages for Gemini API
    formatted_messages = format_messages_for_gemini(non_system_messages)
    
    try:
        response = requests.post(
            f"{API_URL}/{MODEL_NAME}:generateContent?key={api_key}",
            headers={"Content-Type": "application/json"},
            json={
                "contents": formatted_messages,
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024,
                },
                "safetySettings": [
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
                    },
                    {
                        "category": "HARM_CATEGORY_HATE_SPEECH",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
                    },
                    {
                        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
                    },
                    {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
                    },
                ],
            }
        )
        
        if not response.ok:
            error_data = response.json()
            error_message = error_data.get("error", {}).get("message", "Failed to get response from Gemini API")
            raise Exception(error_message)
        
        data = response.json()
        return data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "Sorry, I couldn't generate a response.")
    
    except Exception as e:
        print(f"Error calling Gemini API: {str(e)}")
        raise e

if __name__ == '__main__':
    app.run(debug=True)
