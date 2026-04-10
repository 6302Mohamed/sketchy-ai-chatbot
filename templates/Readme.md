````markdown
# Sketchy AI

Sketchy AI is a polished web-based chatbot built with **Flask**, **Groq API**, **HTML**, **CSS**, and **JavaScript**.

It was created as a small but practical AI web application that goes beyond a basic chatbot. In addition to normal chat, it supports **multiple conversations**, **theme switching**, and **document summarization** for files like **PDF**, **DOCX**, and **TXT**.

The interface is inspired by modern AI chat applications, especially the clean conversation flow and sidebar-based layout popularized by ChatGPT, while still keeping its own identity and features.

## Why this project was made

This project was built for two reasons:

1. To create a polished AI chatbot web app that looks modern and feels enjoyable to use.
2. To turn a simple chatbot idea into a stronger portfolio project by adding useful features like file summarization and cleaner UI design.

Instead of stopping at a plain question-and-answer interface, Sketchy AI was extended into a small productivity-style web app that demonstrates both frontend polish and backend integration.

## What the app can do

Sketchy AI supports:

- Chatting with an AI assistant through a clean web interface
- Creating multiple conversations with local chat history
- Switching between dark and light themes
- Uploading and summarizing `.txt`, `.pdf`, and `.docx` files
- Showing smooth typing states and a polished empty-state greeting
- Running locally with Python or through Docker

## Tech stack

### Backend
- Flask
- Groq API
- Python

### Frontend
- HTML
- CSS
- JavaScript

### File handling
- `pypdf` for PDF text extraction
- `python-docx` for DOCX text extraction

### Deployment / portability
- Docker
- Docker Compose

## Why Groq was used

Groq was used as the model provider because it offers a very simple developer experience and fast response times, which makes it a strong fit for a lightweight chatbot project like this.

The app sends user messages to the Groq API from the Flask backend, receives the model response, and returns that response to the frontend chat interface.

Groq is also easy to swap or configure because the API key and model name are loaded from environment variables.

## File summarization support

One of the main extra features in this project is file summarization.

Users can attach supported files and ask the app to summarize them. The backend extracts the file text first, then sends the extracted text to the AI model with a summarization prompt.

Currently supported file types:

- `.txt`
- `.pdf`
- `.docx`

This makes the app more useful than a normal chatbot and gives it a more practical real-world feel.

## Project structure

```bash
.
├── app.py
├── chatbot.py
├── requirements.txt
├── Dockerfile
├── compose.yaml
├── .dockerignore
├── .env.example
├── .gitignore
├── profile.txt
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
````

## How to run locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/sketchy-ai.git
cd sketchy-ai
```

### 2. Create a virtual environment

#### Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

#### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create your environment file

Copy `.env.example` to `.env`.

#### Windows PowerShell

```powershell
copy .env.example .env
```

#### macOS / Linux

```bash
cp .env.example .env
```

Then open `.env` and add your real Groq API key.

Example:

```env
GROQ_API_KEY=your_real_key_here
GROQ_MODEL=llama-3.1-8b-instant
FLASK_ENV=development
PORT=5000
```

### 5. Run the app

```bash
python app.py
```

Then open:

```text
http://localhost:5000
```

## How to run with Docker

If you want to run the app with Docker instead of a local Python environment:

### 1. Create your `.env` file

Make sure `.env` exists and contains your real Groq API key.

### 2. Build and start the app

```bash
docker compose up --build
```

Then open:

```text
http://localhost:5000
```

## If you want to clone this project

If you clone this project for your own use, you should change a few things:

### 1. Add your own Groq API key

Edit the `.env` file and replace:

```env
GROQ_API_KEY=your_real_key_here
```

with your own key.

### 2. Change the model if you want

You can update:

```env
GROQ_MODEL=llama-3.1-8b-instant
```

to another Groq-supported model if needed.

### 3. Change branding

If you want to rename the bot, edit the title and bot name in:

* `templates/index.html`
* `chatbot.py`

### 4. Change or remove personal profile context

If you are using `profile.txt`, replace it with your own information or remove it entirely.

### 5. Keep secrets out of GitHub

Do not commit your `.env` file with real API keys.

## Inspiration

This project was visually inspired by modern AI chat products, especially the clean layout style associated with ChatGPT:

* left sidebar for conversation history
* main chat panel
* smooth minimal interface
* clear prompt input area
* focused conversational experience

The goal was not to copy ChatGPT exactly, but to take inspiration from what makes that style feel intuitive and modern, then build a personalized version around it.

## Notes

* This chatbot does **not** use live web search.
* Very recent facts may be outdated.
* Uploaded files are summarized based on extracted text.
* Some PDFs may not extract perfectly if they are image-based or scanned.
* The chatbot can make mistakes, so important information should always be verified.

## Future improvements

Possible future improvements include:

* drag and drop file uploads
* deleting conversations
* renaming conversations
* streaming responses
* markdown rendering in replies
* better mobile responsiveness
* richer summarization modes such as bullet summary, executive summary, or study notes

## License

This project is open for learning and portfolio use.

If you use it as a base, make sure to replace the API key, personalize the content, and adapt the branding to your own work.

```
```
