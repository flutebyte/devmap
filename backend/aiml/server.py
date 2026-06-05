from flask import Flask, request, jsonify
from roadmap.app import generate_full_roadmap
from question_engine import generate_questions

app = Flask(__name__)

@app.route("/generate-roadmap", methods=["POST"])
def generate():
    data = request.json or {}

    result = generate_full_roadmap(
        data.get("topic"),
        data.get("level"),
        data.get("duration")
    )

    return jsonify(result)

@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():
    data = request.json or {}
    topic = data.get("topic")
    difficulty = data.get("difficulty", "Beginner")
    qtype = data.get("type", "Theory")

    questions = generate_questions(topic, difficulty, qtype)

    if not questions:
        return jsonify({"error": "Quiz generation failed"}), 500

    return jsonify({"questions": questions})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)