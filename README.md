Here is the complete, updated **README.md** content in raw Markdown format. I have fixed the repository URL logic, added the Groq setup steps, and included the customization sections for `profile.txt` and the system prompt as requested.

```markdown
# 🚀 Sketchy AI

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/Framework-Flask-lightgrey.svg)](https://flask.palletsprojects.com/)
[![Groq](https://img.shields.io/badge/AI-Groq_Cloud-orange.svg)](https://groq.com/)
[![Docker](https://img.shields.io/badge/Container-Docker-blue.svg)](https://www.docker.com/)

**Sketchy AI** is a polished web-based chatbot built with **Flask**, **Groq API**, **HTML**, **CSS**, and **JavaScript**.

It was created to go beyond a basic chatbot demo by combining a modern chat interface with useful features like **multi-conversation persistence**, **theme switching**, and **document summarization** for `.txt`, `.pdf`, and `.docx` files.

The UI is inspired by modern AI chat applications such as ChatGPT, while still being customized into its own project structure and interaction flow.

---

## ✨ Key Features

- **⚡ Fast AI responses** powered by the Groq API.
- **💬 Multi-chat sidebar** with persistent local conversation history.
- **📂 Document summarization** for `.txt`, `.pdf`, and `.docx`.
- **🌓 Dark and light mode** support.
- **🧠 Custom persona support** through `profile.txt`.
- **🐳 Docker support** for easy portability and setup.
- **🎨 Polished interface** inspired by modern AI chat layouts.

---

## 🛠️ Tech Stack

### **Backend**
- Python, Flask, Groq API, `pypdf`, `python-docx`

### **Frontend**
- HTML5, CSS3, Vanilla JavaScript

### **Infrastructure**
- Docker, Docker Compose, Environment variables (`.env`)

---

## 📂 Project Structure

```bash
.
├── app.py              # Flask server and route handling
├── chatbot.py          # Groq integration, chatbot logic, summarization logic
├── requirements.txt    # Python dependencies
├── Dockerfile          # Docker image instructions
├── compose.yaml        # Docker Compose configuration
├── .env.example        # Template for environment variables
├── profile.txt         # Optional custom profile/persona context
├── README.md           # Project documentation
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

---

## 🤖 Why this project was made
Sketchy AI was built as a portfolio-style AI web application that demonstrates more than just a basic chatbot. The goal was to create something that feels modern, practical, and polished:

1. A chatbot interface that looks clean and interactive.
2. A backend that connects to a real AI model via high-speed inference.
3. A file summarizer that adds useful productivity value.
4. A project structure that is easy for others to clone and adapt.

---

## 🔑 Before You Run the Project
Before running Sketchy AI, you need a **Groq API key**.

1. **Get your Groq API key:**
   - Go to [Groq Console](https://console.groq.com/).
   - Sign in or create an account.
   - Navigate to "API Keys" and create a new key.
2. **Setup your environment:**
   - Copy that key into your local `.env` file (see below).

---

## 🚀 Getting Started

### **Prerequisites**
- Python 3.9+ or Docker
- A Groq API Key

### **Option 1: Local Installation**

1. **Clone the repository**
   ```bash
   git clone [https://github.com/YOUR_GITHUB_USERNAME/ai-chatbot-gui.git](https://github.com/YOUR_GITHUB_USERNAME/ai-chatbot-gui.git)
   cd ai-chatbot-gui
   ```

2. **Create and activate a virtual environment**
   - **Windows PowerShell:**
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Copy `.env.example` to `.env`:
   ```bash
   # Windows
   copy .env.example .env
   # macOS / Linux
   cp .env.example .env
   ```
   Edit `.env` and add your real Groq API key:
   ```env
   GROQ_API_KEY=your_real_key_here
   GROQ_MODEL=llama-3.1-8b-instant
   FLASK_ENV=development
   PORT=5000
   ```

5. **Run the app**
   ```bash
   python app.py
   ```
   Open [http://localhost:5000](http://localhost:5000).

### **Option 2: Run with Docker**
```bash
docker compose up --build
```
Open [http://localhost:5000](http://localhost:5000).

---

## 📄 Document Summarization
Sketchy AI supports summarizing `.txt`, `.pdf`, and `.docx` files.

**How it works:**
The backend extracts raw text from your upload and sends it to the Groq model with a specific summarization prompt. This turns the project into a lightweight AI productivity tool.

---

## 🧩 Customization

### **1. Customize profile.txt**
The file `profile.txt` provides persona context for the chatbot. Edit it to reflect your background or project goals.
*Example:*
```text
Name: [Your Name]
Interests: AI Engineering, MLOps, Python Automation
```

### **2. Customize the System Prompt**
You can modify the chatbot's behavior (tone, rules, personality) inside `chatbot.py`. Look for the `system_prompt` variable to change how the assistant speaks to users.

### **3. Change Branding**
To rename the bot, simply search and replace "Sketchy AI" in `templates/index.html` and `chatbot.py`.

---

## 🏗️ Future Enhancements
- [ ] Streaming responses for real-time typing.
- [ ] Markdown rendering in chat replies.
- [ ] Conversation export as PDF or JSON.
- [ ] Drag and drop file uploads.

---

## ⚖️ License
This project is open for learning, experimentation, and portfolio use. Please replace the API keys and customize the persona before sharing your version.

---

## 🙏 Thanks
Special thanks to **Groq** for providing the high-speed LPU™ Inference Engine that powers this experience.

---
**Developed with ❤️ for the AI community.**
