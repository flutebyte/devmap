def get_user_prompt(topic, level, duration):

    level_guidance = {
        "Beginner": (
            "Cover: setting up the environment, core syntax, fundamental concepts, "
            "basic built-in tools, and 1-2 beginner project ideas. "
            "Avoid advanced frameworks or production-level patterns."
        ),
        "Intermediate": (
            "Cover: popular frameworks/libraries, design patterns, working with APIs, "
            "state management, testing basics, and real-world project structure. "
            "Assume the learner knows the fundamentals."
        ),
        "Advanced": (
            "Cover: system design, scalability, performance optimization, security best practices, "
            "CI/CD, architectural patterns, and contributing to or building production systems. "
            "Assume strong working knowledge of the topic."
        ),
    }

    guidance = level_guidance.get(level, f"Cover concepts appropriate for {level} level.")

    return f"""
Generate a learning roadmap for:

Topic: {topic}
Level: {level}
Study Duration: {duration}

Level guidance: {guidance}

Requirements:
- 5 to 7 topic sections, ordered from foundational to advanced within this level
- Each section must have 4 to 6 specific, concrete subtopics
- Subtopics should be distinct learning units a student can study in one sitting
- No resources or links — structure only
- Return ONLY the JSON object, nothing else
"""
