import os
from io import BytesIO
from pathlib import Path

from docx import Document
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from pypdf import PdfReader
from werkzeug.utils import secure_filename

from chatbot import get_groq_response, summarize_extracted_text

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH, override=True)

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5 MB max file size

ALLOWED_EXTENSIONS = {"txt", "pdf", "docx"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_text_from_txt(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore").strip()


def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    pages = []

    for page in reader.pages:
        page_text = page.extract_text() or ""
        if page_text.strip():
            pages.append(page_text.strip())

    return "\n\n".join(pages).strip()


def extract_text_from_docx(file_bytes: bytes) -> str:
    document = Document(BytesIO(file_bytes))
    paragraphs = [paragraph.text.strip() for paragraph in document.paragraphs if paragraph.text.strip()]
    return "\n\n".join(paragraphs).strip()


def extract_text_from_file(filename: str, file_bytes: bytes) -> str:
    extension = filename.rsplit(".", 1)[1].lower()

    if extension == "txt":
        return extract_text_from_txt(file_bytes)

    if extension == "pdf":
        return extract_text_from_pdf(file_bytes)

    if extension == "docx":
        return extract_text_from_docx(file_bytes)

    raise ValueError("Unsupported file type.")


@app.errorhandler(413)
def file_too_large(_error):
    return jsonify({"error": "File is too large. Please upload a file under 5 MB."}), 413


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json() or {}
        user_message = (data.get("message") or "").strip()

        if not user_message:
            return jsonify({"error": "Message cannot be empty."}), 400

        bot_reply = get_groq_response(user_message)
        return jsonify({"reply": bot_reply})

    except Exception as exc:
        return jsonify({"error": f"Something went wrong: {str(exc)}"}), 500


@app.route("/summarize-file", methods=["POST"])
def summarize_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file was uploaded."}), 400

        uploaded_file = request.files["file"]
        user_instruction = (request.form.get("instruction") or "").strip()

        if not uploaded_file or not uploaded_file.filename:
            return jsonify({"error": "Please choose a file first."}), 400

        safe_filename = secure_filename(uploaded_file.filename)

        if not allowed_file(safe_filename):
            return jsonify({"error": "Only .txt, .pdf, and .docx files are supported."}), 400

        file_bytes = uploaded_file.read()
        if not file_bytes:
            return jsonify({"error": "The uploaded file is empty."}), 400

        extracted_text = extract_text_from_file(safe_filename, file_bytes)

        if not extracted_text:
            return jsonify({"error": "No readable text was found in this file."}), 400

        summary = summarize_extracted_text(
            extracted_text=extracted_text,
            filename=safe_filename,
            user_instruction=user_instruction
        )

        return jsonify({
            "reply": summary,
            "filename": safe_filename
        })

    except Exception as exc:
        return jsonify({"error": f"Something went wrong: {str(exc)}"}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)