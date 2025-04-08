
# Lanka Edu AI - Python Flask Application

A Python Flask implementation of Lanka Edu AI, an educational counselor chatbot for Sri Lankan students.

## Setup Instructions

1. Clone this repository:
```
git clone <repository-url>
cd lanka-edu-ai-python
```

2. Set up a virtual environment:
```
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```
pip install -r requirements.txt
```

5. Run the application:
```
python app.py
```

6. Open your browser and go to: `http://127.0.0.1:5000/`

## Requirements

- Python 3.7 or higher
- Google Gemini API key (https://ai.google.dev/)

## Features

- Chat interface for educational queries
- Gemini API integration
- Session management for chat history
- Responsive design for mobile and desktop

## Project Structure

- `app.py` - Main Flask application
- `templates/` - HTML templates
- `static/` - CSS and other static assets
