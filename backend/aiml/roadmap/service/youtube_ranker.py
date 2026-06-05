import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("YOUTUBE_API_KEY")


def get_best_video(query):

    url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        "part": "snippet",
        "q": query,
        "maxResults": 5,
        "type": "video",
        "key": API_KEY
    }

    response = requests.get(url, params=params)

    data = response.json()

    # SAFETY CHECK
    if "items" not in data or len(data["items"]) == 0:
        return {
            "title": "No video found",
            "url": "https://youtube.com"
        }

    videos = []

    for item in data["items"]:

        video_id = item["id"]["videoId"]

        stats_url = "https://www.googleapis.com/youtube/v3/videos"

        stats_res = requests.get(
            stats_url,
            params={
                "part": "statistics",
                "id": video_id,
                "key": API_KEY
            }
        )

        stats_data = stats_res.json()

        if "items" not in stats_data or len(stats_data["items"]) == 0:
            continue

        stat = stats_data["items"][0]["statistics"]

        views = int(stat.get("viewCount", 0))
        likes = int(stat.get("likeCount", 0))

        score = likes / views if views > 0 else 0

        videos.append({
            "title": item["snippet"]["title"],
            "url": f"https://youtube.com/watch?v={video_id}",
            "score": score
        })

    if len(videos) == 0:
        return {
            "title": "No video found",
            "url": "https://youtube.com"
        }

    videos.sort(key=lambda x: x["score"], reverse=True)

    return videos[0]