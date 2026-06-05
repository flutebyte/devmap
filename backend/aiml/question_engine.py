from utils.groq_client import query_model
import json
import re
import random

# store previous questions
previous_questions = set()


def generate_questions(topic, difficulty, qtype):

    prompt = f"""
Generate exactly 10 UNIQUE engineering quiz questions.

Topic: {topic}
Difficulty: {difficulty}
Question Type: {qtype}


Rules:
- Questions must be different from each other.
- Avoid common textbook examples.
- Use different concepts inside the topic.
- Do NOT repeat questions.

Return ONLY JSON.

Format:

[
{{
"question":"text",
"options":{{"A":"", "B":"", "C":"", "D":""}},
"answer":"A",
"topic":"subtopic"
}}
]
"""

    raw = query_model(prompt)

    try:

        raw = re.sub(r"```json|```", "", raw).strip()

        questions = json.loads(raw)

        unique_questions = []

        for q in questions:

            q_text = q["question"].strip()

            # check if question already asked
            if q_text not in previous_questions:

                previous_questions.add(q_text)
                unique_questions.append(q)

        # if duplicates removed, regenerate missing ones
        while len(unique_questions) < 10:

            extra = query_model(prompt)

            try:

                extra = re.sub(r"```json|```", "", extra).strip()

                new_q = json.loads(extra)

                for q in new_q:

                    q_text = q["question"].strip()

                    if q_text not in previous_questions:

                        previous_questions.add(q_text)
                        unique_questions.append(q)

                    if len(unique_questions) == 10:
                        break

            except:
                break

        random.shuffle(unique_questions)

        return unique_questions[:10]

    except Exception as e:

        print("JSON Parse Error:", e)
        return []