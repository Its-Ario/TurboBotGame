from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

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
    user_hash = data.get("hash")

    user_scores[user_hash] = score
    
    response = {"ok": True, "hash": user_hash, "score": score}
    print(response)

    return jsonify(data)

@app.route('/get-score', methods=['GET'])
async def get_score():
    user_hash = request.args.get("hash")

    if user_hash in user_scores:
        score = user_scores[user_hash]
        return jsonify({"hash": user_hash, "score": score})
    else:
        return jsonify({"error": "User hash not found"}), 404

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='443')
