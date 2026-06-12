import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
CX = os.getenv("GOOGLE_CX")


def get_best_article(query):

    url = "https://www.googleapis.com/customsearch/v1"

    params = {
        "q": query,
        "key": API_KEY,
        "cx": CX
    }

    res = requests.get(url, params=params)

    data = res.json()

    if "items" not in data or len(data["items"]) == 0:

        return {
            "title": "Search result",
            "url": f"https://www.google.com/search?q={query}"
        }

    item = data["items"][0]

    return {
        "title": item.get("title", "Article"),
        "url": item.get("link", "")
    }