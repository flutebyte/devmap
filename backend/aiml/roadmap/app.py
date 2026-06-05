from roadmap.groq_client import generate_roadmap
from roadmap.roadmap_parser import extract_json
from roadmap.resource_engine import attach_resources

def generate_full_roadmap(topic, level, duration):

    data = None

    for attempt in range(2):  # 🔁 retry once if AI messes up
        response = generate_roadmap(topic, level, duration)
        print(f"\nATTEMPT {attempt+1}")
        print("RAW AI RESPONSE:", response)

        if isinstance(response, dict):
            return {"error": "AI request failed", "details": response}

        data = extract_json(response)

        if data:
            break

    if data is None:
        return {"error": "Failed to parse roadmap after retry"}

    data = attach_resources(data)

    return data