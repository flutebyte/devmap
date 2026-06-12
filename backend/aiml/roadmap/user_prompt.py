def get_user_prompt(topic, level, duration):

    return f"""
Generate a Computer Science roadmap.

Topic: {topic}

Level: {level}

Study Duration: {duration}

Return topics and subtopics only.

Follow JSON format from system prompt.
"""