import json

TOPIC_KEYS    = ["topics", "sections", "modules", "chapters", "parts", "roadmap", "curriculum"]
SUBTOPIC_KEYS = ["subtopics", "items", "concepts", "lessons", "steps", "sub_topics", "children", "topics"]
NAME_KEYS     = ["name", "title", "topic", "label", "heading", "section"]


def _find(d, keys):
    for k in keys:
        if k in d:
            return d[k]
    return None


def normalize(data):
    if not isinstance(data, dict):
        return None

    # Handle one extra nesting level: {"roadmap": {"topics": [...]}}
    if len(data) == 1:
        inner = list(data.values())[0]
        if isinstance(inner, dict):
            data = inner

    topics_raw = _find(data, TOPIC_KEYS)
    if not isinstance(topics_raw, list) or len(topics_raw) == 0:
        return None

    topics = []
    for t in topics_raw:
        if not isinstance(t, dict):
            continue

        topic_name = _find(t, NAME_KEYS)
        if not topic_name:
            continue

        subtopics_raw = _find(t, SUBTOPIC_KEYS)
        if not isinstance(subtopics_raw, list):
            continue

        subtopics = []
        for sub in subtopics_raw:
            if isinstance(sub, str) and sub.strip():
                subtopics.append({"name": sub.strip()})
            elif isinstance(sub, dict):
                sub_name = _find(sub, NAME_KEYS)
                if sub_name:
                    subtopics.append({"name": sub_name})

        if subtopics:
            topics.append({"name": topic_name, "subtopics": subtopics})

    if not topics:
        return None

    return {
        "title":    data.get("title", ""),
        "level":    data.get("level", ""),
        "duration": data.get("duration", ""),
        "topics":   topics
    }


def extract_json(text):
    try:
        text = text.replace("```json", "").replace("```", "").strip()

        start = text.find("{")
        end   = text.rfind("}")

        if start != -1 and end != -1:
            json_str = text[start:end + 1]
            data = json.loads(json_str)
            result = normalize(data)
            if result:
                print(f"Parsed {len(result['topics'])} topics successfully")
            else:
                print("normalize() returned None — raw data:", json.dumps(data)[:500])
            return result

    except Exception as e:
        print("JSON PARSE ERROR:", e)
        print("RAW TEXT:", text[:500])

    return None
