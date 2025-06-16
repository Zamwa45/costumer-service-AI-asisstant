import os
import datetime
from flask import Flask, send_from_directory, request, jsonify
from dotenv import load_dotenv
import requests


load_dotenv()

template_dir = os.path.abspath('.')
app = Flask(__name__, static_folder='.', static_url_path='')


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
CONTACT_NUMBER = "+964 750 077 5909"
GYM_EMAIL = "welcometogym@gmail.com"
GYM_LOCATION = "Sulaymaniyah, Iraq"
COACHES = ["Ahmad", "Zamwa", "Mr. Samyar (swimming pool specialist)"]


gym_qna = [
    
]


def get_current_time():
    now = datetime.datetime.now()
    return now.strftime("%I:%M %p")


def check_local_database(query: str) -> str:
    q = query.lower().strip()
    
    for item in gym_qna:
        if q == item["question"].lower():
            return item["answer"]
    
    for item in gym_qna:
        if item["question"].lower() in q or q in item["question"].lower():
            return item["answer"]
    
    for item in gym_qna:
        for keyword in item["question"].lower().split():
            if len(keyword) > 3 and keyword in q:
                return item["answer"]
    return None


def query_openai(user_message: str) -> str:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are Zamos, the AI assistant for Hulk Gym in Sulaymaniyah, Iraq. "
                    f"Gym location: {GYM_LOCATION}\n"
                    f"Contact: {CONTACT_NUMBER}\n"
                    f"Email: {GYM_EMAIL}\n"
                    f"Coaches: {', '.join(COACHES)}\n"
                    "Keep answers brief and friendly. Respond in the same language as the user's question."
                )
            },
            {"role": "user", "content": user_message}
        ],
        "max_tokens": 150,
        "temperature": 0.7
    }
    try:
        resp = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=10
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception:
        return f"I'm having connection issues. For immediate help, please call {CONTACT_NUMBER}."


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/style.css')
def serve_css():
    return send_from_directory('.', 'style.css')

@app.route('/script.js')
def serve_js():
    return send_from_directory('.', 'script.js')

@app.route('/api/message', methods=['POST'])
def handle_message():
    data = request.get_json(silent=True)
    if not data or 'message' not in data:
        return jsonify({'error': 'Invalid request'}), 400

    user_msg = data['message'].strip()
    if not user_msg:
        return jsonify({'error': 'Empty message'}), 400

    # Check local Q&A first
    local = check_local_database(user_msg)
    if local:
        return jsonify({'answer': local, 'time': get_current_time(), 'source': 'local'})

    # Otherwise query OpenAI
    ai_ans = query_openai(user_msg)
    return jsonify({'answer': ai_ans, 'time': get_current_time(), 'source': 'ai'})

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error', 'message': 'Please try again later or call ' + CONTACT_NUMBER}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
