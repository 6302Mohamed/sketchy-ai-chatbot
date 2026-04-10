
# 🚀 Sketchy AI

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/Framework-Flask-lightgrey.svg)](https://flask.palletsprojects.com/)
[![Groq](https://img.shields.io/badge/AI-Groq_Cloud-orange.svg)](https://groq.com/)
[![Docker](https://img.shields.io/badge/Container-Docker-blue.svg)](https://www.docker.com/)

**Sketchy AI** is a high-performance, web-based chatbot built to provide a modern AI experience. Leveraging the **Groq LPU™ Inference Engine**, it delivers near-instantaneous responses while offering professional-grade features like multi-conversation persistence and intelligent document summarization.

The project focuses on balancing clean UI/UX with robust backend automation, going beyond a simple "Hello World" chatbot.

---

## ✨ Key Features

* **⚡ High-Speed Inference:** Integration with Groq API for lightning-fast token generation.
* **📂 Document Intelligence:** Extract and summarize insights from `.txt`, `.pdf`, and `.docx` files.
* **💬 Persistent Workspace:** Manage multiple chat sessions with a local history sidebar.
* **🌓 Modern UI:** Responsive design with fluid Dark and Light mode transitions.
* **🐳 Containerized Deployment:** Fully configured Docker and Docker Compose setup for portability.
* **🔧 Personalized Context:** Supports custom persona profiles via local configuration.

---

## 🛠️ Tech Stack

### **Backend**
- **Core:** Python & Flask
- **AI Engine:** Groq API (Llama 3.1 8B/70B)
- **Extraction:** `pypdf` (PDFs) & `python-docx` (Word Documents)

### **Frontend**
- **Markup/Styling:** HTML5, CSS3 (Modern sidebar-based layout)
- **Interactivity:** Vanilla JavaScript (Asynchronous chat handling & UI state management)

### **Infrastructure**
- **Containerization:** Docker & Docker Compose
- **Configuration:** Environment-based variable management (`.env`)

---

## 📂 Project Structure

```bash
.
├── app.py              # Flask server & route management
├── chatbot.py          # Groq API integration & logic
├── requirements.txt    # Python dependencies
├── Dockerfile          # Container instructions
├── compose.yaml        # Docker Compose orchestration
├── .env.example        # Template for API keys & settings
├── profile.txt         # Optional persona/context for the AI
├── templates/          # Jinja2 HTML templates
└── static/             # CSS styles and JavaScript logic
```

---

## 🚀 Getting Started

### **Prerequisites**
- Python 3.9+ or Docker
- A [Groq API Key](https://console.groq.com/)

### **Option 1: Local Installation**

1. **Clone the Repo**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/sketchy-ai.git](https://github.com/YOUR_USERNAME/sketchy-ai.git)
   cd sketchy-ai
   ```

2. **Setup Virtual Environment**
   ```bash
   # Windows
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Setup**
   Copy `.env.example` to `.env` and add your Groq API key:
   ```bash
   cp .env.example .env
   ```

5. **Launch**
   ```bash
   python app.py
   ```
   Access the app at `http://localhost:5000`.

### **Option 2: Running with Docker**

```bash
docker compose up --build
```

---

## 🏗️ Future Enhancements
- [ ] **Streaming Responses:** Implement Server-Sent Events (SSE) for real-time typing.
- [ ] **Markdown Rendering:** Full support for code blocks and tables in chat.
- [ ] **Conversation Export:** Save chat logs as PDF or JSON.
- [ ] **Advanced RAG:** Vector-based search for larger document processing.

---

## ⚖️ License
This project is open-source and available for learning and portfolio purposes. Feel free to adapt the code and branding for your own work.

---
### Developed with ❤️ for the AI Community
```