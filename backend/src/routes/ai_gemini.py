from flask import Blueprint, request, jsonify, current_app
import os
import requests

bp = Blueprint('ai_gemini', __name__, url_prefix='/api/ai')

@bp.route('/chat', methods=['POST'])
def chat():
    # Basic validation
    payload = request.get_json(silent=True) or {}
    messages = payload.get('messages') or payload.get('prompt') or payload.get('input')
    if not messages:
        return jsonify({'error': 'messages (array) or prompt required in request body'}), 400

    # Load config
    api_key = os.getenv('GEMINI_API_KEY')
    model = os.getenv('MODEL_NAME', 'gemini-2.0-flash')
    if not api_key:
        current_app.logger.error('Missing GEMINI_API_KEY in environment')
        return jsonify({'error': 'AI service not configured'}), 503

    # Build request for Google's Generative Language REST endpoint.
    # NOTE: Google GenAI REST contract can vary; adapt `data` to the precise body your project expects.
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generate'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }

    # Convert messages to a single prompt if client sent an array of messages (simple example)
    if isinstance(messages, list):
        # join user messages into a single text prompt — adapt this to your conversation format
        user_text = "\n".join([m.get('content') if isinstance(m, dict) else str(m) for m in messages])
    else:
        user_text = str(messages)

    data = {
        "prompt": {
            "text": user_text
        },
        # optional: tuning params; remove or adapt as necessary
        "temperature": 0.7,
        "maxOutputTokens": 512
    }

    try:
        resp = requests.post(url, headers=headers, json=data, timeout=60)
    except requests.RequestException as e:
        current_app.logger.exception('Error calling Gemini API')
        return jsonify({'error': 'AI provider request failed', 'details': str(e)}), 502

    if not resp.ok:
        current_app.logger.error('Gemini API returned error: %s %s', resp.status_code, resp.text)
        return jsonify({'error': 'AI provider error', 'status': resp.status_code, 'details': resp.text}), 502

    return jsonify(resp.json())
