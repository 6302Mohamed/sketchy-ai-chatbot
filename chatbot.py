import os
from datetime import datetime

from groq import Groq


def load_profile_context() -> str:
    try:
        with open("profile.txt", "r", encoding="utf-8") as file:
            return file.read().strip()
    except FileNotFoundError:
        return (
            "No profile information is available yet. "
            "If asked about the owner, say that no profile details were provided."
        )


def get_client() -> Groq:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("Missing GROQ_API_KEY in environment variables.")
    return Groq(api_key=api_key)


def get_model_name() -> str:
    return os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")


def fallback_response(user_message: str) -> str:
    text = user_message.lower().strip()
    current_year = datetime.now().strftime("%Y")
    current_date = datetime.now().strftime("%Y-%m-%d")

    if "year" in text:
        return f"We are in {current_year}."
    if "date" in text or "today" in text:
        return f"Today's date is {current_date}."
    if text in ["hi", "hello", "hey"]:
        return "Hello. Welcome to the AI Chatbot demo."
    return "Sorry, I could not get a live response right now. Please try again."


def get_groq_response(user_message: str) -> str:
    current_date = datetime.now().strftime("%Y-%m-%d")
    current_year = datetime.now().strftime("%Y")
    lower_msg = user_message.lower().strip()

    if "what year" in lower_msg or "which year" in lower_msg:
        return f"We are in {current_year}."

    if "what is today's date" in lower_msg or "what is the date" in lower_msg:
        return f"Today's date is {current_date}."

    profile_context = load_profile_context()
    client = get_client()
    model_name = get_model_name()

    system_prompt = f"""
You are a helpful AI chatbot inside a web app.
Your name is Sketchy AI.
The current date is {current_date}.
The current year is {current_year}.

Here is profile information you can use when relevant:
{profile_context}

Rules:
- Keep answers clear, short, and friendly unless the user asks for detail.
- Use the provided current date and year for date-related questions.
- If the user asks about the owner/profile, answer only from the provided profile information.
- If the requested profile information is not provided, clearly say you do not know.
- If the question asks for live or very recent facts, say that current facts may be outdated.
- Do not make up facts.
"""

    try:
        chat_completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.5,
            max_completion_tokens=250,
        )

        reply = chat_completion.choices[0].message.content
        if reply:
            return reply.strip()

        return fallback_response(user_message)

    except Exception:
        return fallback_response(user_message)


def summarize_extracted_text(extracted_text: str, filename: str = "", user_instruction: str = "") -> str:
    client = get_client()
    model_name = get_model_name()

    current_date = datetime.now().strftime("%Y-%m-%d")
    trimmed_text = extracted_text[:15000]

    extra_instruction = user_instruction.strip() if user_instruction else "Provide a clear general summary."

    prompt = f"""
You are a helpful summarization assistant inside a student web app.

Today is {current_date}.
File name: {filename or "Unknown file"}

User instruction:
{extra_instruction}

You are summarizing extracted file text.
Write the response in this structure:

Summary:
- Give a short overall summary.

Key Points:
- Use 4 to 8 concise bullet points.

Important Details:
- Mention notable names, dates, numbers, or topics if present.

Action Items:
- Include action items only if the document suggests any. Otherwise say "No clear action items."

Keep the wording clean and easy to read.
Do not invent information that is not in the text.

File text:
\"\"\"
{trimmed_text}
\"\"\"
"""

    try:
        chat_completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": "You summarize documents clearly and faithfully."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_completion_tokens=500,
        )

        reply = chat_completion.choices[0].message.content
        if reply:
            return reply.strip()

        return "Sorry, I could not summarize this file."

    except Exception:
        return "Sorry, I could not summarize this file right now."