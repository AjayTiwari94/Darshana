from flask import Blueprint, request, jsonify, current_app
import os
import requests

bp = Blueprint('ai_openai', __name__, url_prefix='/api/ai')

@bp.route('/chat', methods=['POST'])
def chat():
    body = request.get_json(silent=True) or {}
    messages = body.get('messages')
    if not messages:
        return jsonify({'error': 'messages array required'}), 400

    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        current_app.logger.error('Missing OPENAI_API_KEY')
        return jsonify({'error': 'AI service not configured'}), 503

    url = 'https://api.openai.com/v1/chat/completions'
    headers = {'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}
    payload = {
        "model": body.get('model', 'gpt-3.5-turbo'),
        "messages": messages,
        "max_tokens": body.get('max_tokens', 512),
        "temperature": body.get('temperature', 0.7)
    }

    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=60)
    except requests.RequestException as e:
        current_app.logger.exception('Error calling OpenAI')
        return jsonify({'error': 'AI provider request failed', 'details': str(e)}), 502

    if not resp.ok:
        current_app.logger.error('OpenAI returned error: %s %s', resp.status_code, resp.text)
        return jsonify({'error': 'AI provider error', 'status': resp.status_code, 'details': resp.text}), 502

    return jsonify(resp.json())
