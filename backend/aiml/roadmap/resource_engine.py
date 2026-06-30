from roadmap.service.youtube_ranker import get_best_video
from roadmap.service.web_search import get_best_article


def attach_resources(roadmap):

    for topic in roadmap.get("topics", []):

        for sub in topic.get("subtopics", []):

            if isinstance(sub, str):
                sub = {"name": sub}

            query = sub.get("name", "")

            video = get_best_video(query)

            article = get_best_article(query)

            sub["resources"] = [

                {
                    "type": "video",
                    "title": video["title"],
                    "link": video["url"]
                },

                {
                    "type": "article",
                    "title": article["title"],
                    "link": article["url"]
                }

            ]

    return roadmap