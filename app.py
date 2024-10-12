from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from asgiref.wsgi import WsgiToAsgi
from logging_config import setup_logging
import logging

setup_logging()
logger = logging.getLogger(__name__)

app = Flask(__name__, template_folder="templates")
CORS(app)

user_scores = {}

@app.route("/")
def main():
    return render_template('index.html')

@app.route('/save-score', methods=['POST'])
async def save_score():
    data = request.get_json()
    score = data.get('score')
    user_hash = data.get("userHash")

    user_scores[user_hash] = score
    
    response = {"hash": user_hash, "score": score}
    logger.debug(response)

    return jsonify(data)

@app.route('/get-score', methods=['GET'])
async def get_score():
    user_hash = request.args.get("hash")

    if user_hash in user_scores:
        score = user_scores[user_hash]
        del user_scores[user_hash]
        return jsonify({"ok":True, "hash": user_hash, "score": score})
    else:
        return jsonify({"ok": False, "error": "User hash not found"}), 404

asgi_app = WsgiToAsgi(app)