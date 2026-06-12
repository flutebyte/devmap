import json
def extract_json(text):
    try:
        # Remove markdown formatting
        text = text.replace("```json", "").replace("```", "").strip()

        # Find first { and last }
        start = text.find("{")
        end = text.rfind("}")

        if start != -1 and end != -1:
            json_str = text[start:end+1]
            return json.loads(json_str)

    except Exception as e:
        print("JSON PARSE ERROR:", e)
        print("RAW TEXT:", text)

    return None