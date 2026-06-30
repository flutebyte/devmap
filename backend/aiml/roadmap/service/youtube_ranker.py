import os
import re
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("YOUTUBE_API_KEY")
MIN_DURATION_SEC = 120  # filter Shorts / tiny clips

# Topic keyword → preferred creator to search with
TOPIC_CREATORS = [
    (
        ["dsa", "data structure", "algorithm", "leetcode", "binary tree",
         "graph", "dynamic programming", "sorting", "searching", "linked list",
         "stack", "queue", "heap", "recursion", "backtracking", "trie",
         "sliding window", "two pointer", "bit manipulation"],
        "striver"
    ),
    (
        ["css", "flexbox", "grid", "responsive", "stylesheet",
         "css animation", "css selector", "css layout", "media query"],
        "kevin powell"
    ),
    (
        ["system design", "distributed system", "microservice", "load balancer",
         "caching", "message queue", "database design", "scalability",
         "cap theorem", "consistent hashing", "rate limiting"],
        "bytebytego"
    ),
    (
        ["machine learning", "neural network", "deep learning", "pytorch",
         "tensorflow", "gradient descent", "backpropagation", "cnn", "rnn",
         "transformer", "llm", "nlp"],
        "sentdex"
    ),
    (
        ["python"],
        "corey schafer"
    ),
    (
        ["react", "next.js", "nextjs", "redux", "react hooks"],
        "web dev simplified"
    ),
    (
        ["node.js", "nodejs", "express.js", "expressjs"],
        "the net ninja"
    ),
    (
        ["c++", "cpp"],
        "the cherno"
    ),
    (
        ["java"],
        "coding with john"
    ),
    (
        ["sql", "mysql", "postgresql", "database query"],
        "joey blue"
    ),
]


def _get_preferred_creator(query):
    q = query.lower()
    for keywords, creator in TOPIC_CREATORS:
        if any(kw in q for kw in keywords):
            return creator
    return None


def _simplify_query(query):
    """Strip compound 'X and Y' down to just X for cleaner searches."""
    first = re.split(r"\s+and\s+|\s+or\s+|\s+&\s+", query, flags=re.IGNORECASE)[0]
    return first.strip()


def _parse_duration(iso):
    match = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "")
    if not match:
        return 0
    return int(match.group(1) or 0) * 3600 + int(match.group(2) or 0) * 60 + int(match.group(3) or 0)


def _search_youtube(search_query, max_results=10):
    try:
        res = requests.get(
            "https://www.googleapis.com/youtube/v3/search",
            params={
                "part": "snippet",
                "q": search_query,
                "maxResults": max_results,
                "type": "video",
                "key": API_KEY,
            },
            timeout=10,
        )
        data = res.json()

        if "error" in data:
            print(f"[YouTube API error] {data['error'].get('message', data['error'])}")
            return {}

        items = data.get("items", [])
        return {
            item["id"]["videoId"]: item["snippet"]["title"]
            for item in items
            if "videoId" in item.get("id", {})
        }
    except Exception as e:
        print(f"[YouTube search exception] {e}")
        return {}


def _fetch_details(id_title_map):
    """Fetch duration + views for a batch of video IDs. Returns ranked list."""
    if not id_title_map:
        return []

    res = requests.get(
        "https://www.googleapis.com/youtube/v3/videos",
        params={
            "part": "statistics,contentDetails",
            "id": ",".join(id_title_map.keys()),
            "key": API_KEY,
        },
        timeout=10,
    )
    items = res.json().get("items", [])

    candidates = []
    for item in items:
        vid_id = item["id"]
        duration_sec = _parse_duration(
            item.get("contentDetails", {}).get("duration", "PT0S")
        )
        if duration_sec < MIN_DURATION_SEC:
            continue

        views = int(item.get("statistics", {}).get("viewCount", 0))
        candidates.append({
            "title": id_title_map[vid_id],
            "url": f"https://youtube.com/watch?v={vid_id}",
            "views": views,
        })

    candidates.sort(key=lambda x: x["views"], reverse=True)
    return candidates


def get_best_video(query):
    creator = _get_preferred_creator(query)

    # Try preferred creator first
    if creator:
        simple = _simplify_query(query)
        # Creator name first — YouTube prioritises it better
        id_title = _search_youtube(f"{creator} {simple}")
        candidates = _fetch_details(id_title)
        if candidates:
            print(f"[YouTube] Using {creator} for: {query}")
            return {"title": candidates[0]["title"], "url": candidates[0]["url"]}
        print(f"[YouTube] No {creator} results for: {query} (simplified: {simple}), falling back")

    # General fallback — most viewed tutorial
    simple_fallback = _simplify_query(query)
    id_title = _search_youtube(f"{simple_fallback} tutorial")
    candidates = _fetch_details(id_title)

    if candidates:
        return {"title": candidates[0]["title"], "url": candidates[0]["url"]}

    # Last resort — return first search result without duration filtering
    if not id_title:
        id_title = _search_youtube(f"{simple_fallback} tutorial", max_results=5)
    if id_title:
        first_id = list(id_title.keys())[0]
        return {"title": id_title[first_id], "url": f"https://youtube.com/watch?v={first_id}"}

    search_url = f"https://www.youtube.com/results?search_query={search_query.replace(' ', '+')}"
    return {"title": f"Search '{search_query}' on YouTube", "url": search_url}
