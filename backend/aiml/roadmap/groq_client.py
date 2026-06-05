import os
import requests
from dotenv import load_dotenv

from roadmap.system_prompt import get_system_prompt
from roadmap.user_prompt import get_user_prompt

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

API_KEY = os.getenv("GROQ_API_KEY")
MODEL = os.getenv("MODEL_NAME")

API_URL = "https://api.groq.com/openai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}


def generate_roadmap(topic, level, duration):

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": get_system_prompt()},
            {"role": "user", "content": get_user_prompt(topic, level, duration)}
        ],
        "temperature": 0.3,
        "max_tokens": 2000
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    data = response.json()

    print("\n====== DEBUG START ======")
    print("API KEY:", API_KEY[:15] if API_KEY else None)
    print("MODEL:", MODEL)
    print("Status Code:", response.status_code)
    print("Full Response:", data)
    print("====== DEBUG END ======\n")

    if "choices" not in data:
        print("ERROR RESPONSE:", data)
        return {"error": data}

    return data["choices"][0]["message"]["content"]