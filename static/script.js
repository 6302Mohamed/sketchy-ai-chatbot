const appShell = document.getElementById("app-shell");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const newChatBtn = document.getElementById("new-chat-btn");
const conversationList = document.getElementById("conversation-list");
const searchToggleBtn = document.getElementById("search-toggle-btn");
const searchWrap = document.getElementById("search-wrap");
const chatSearch = document.getElementById("chat-search");
const chatPanel = document.getElementById("chat-panel");
const heroState = document.getElementById("hero-state");
const heroGreeting = document.getElementById("hero-greeting");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");

const composer = document.getElementById("composer");
const composerActionBtn = document.getElementById("composer-action-btn");
const attachmentMenu = document.getElementById("attachment-menu");
const attachFileOption = document.getElementById("attach-file-option");
const fileInput = document.getElementById("file-input");
const selectedFileBar = document.getElementById("selected-file-bar");
const selectedFileName = document.getElementById("selected-file-name");
const clearFileBtn = document.getElementById("clear-file-btn");

const STORAGE_KEY = "ai_chatbot_conversations";
const ACTIVE_KEY = "ai_chatbot_active_conversation";
const THEME_KEY = "ai_chatbot_theme";
const SIDEBAR_KEY = "ai_chatbot_sidebar_collapsed";
const GREETING_MESSAGES = [
  "Welcome. What can I help you with?",
  "What’s on your mind today?",
  "What is bugging you?"
];

let conversations = [];
let activeConversationId = null;
let greetingLoopTimer = null;
let greetingRunning = false;
let selectedFile = null;

function generateId() {
  return "chat_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
}

function truncateText(text, maxLength = 40) {
  if (!text) return "New chat";
  return text.length > maxLength ? text.slice(0, maxLength).trim() + "..." : text;
}

function createSmartTitle(text) {
  if (!text) return "New chat";

  let cleaned = text
    .replace(/\s+/g, " ")
    .replace(/[^\w\s?!.,-]/g, "")
    .trim();

  const words = cleaned.split(" ").filter(Boolean);

  if (words.length <= 6) {
    return cleaned;
  }

  return words.slice(0, 6).join(" ") + "...";
}

function normalizeConversations(data) {
  return data.map(chat => ({
    id: chat.id || generateId(),
    title: chat.title || "New chat",
    messages: Array.isArray(chat.messages) ? chat.messages : [],
    updatedAt: chat.updatedAt || Date.now()
  }));
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  localStorage.setItem(ACTIVE_KEY, activeConversationId || "");
}

function loadState() {
  const storedChats = localStorage.getItem(STORAGE_KEY);
  const storedActiveId = localStorage.getItem(ACTIVE_KEY);

  conversations = storedChats ? normalizeConversations(JSON.parse(storedChats)) : [];

  if (conversations.length === 0) {
    const firstChat = createConversation("New chat");
    activeConversationId = firstChat.id;
  } else {
    activeConversationId = storedActiveId || conversations[0].id;
  }

  saveState();
}

function applySidebarState(isCollapsed) {
  appShell.classList.toggle("sidebar-collapsed", isCollapsed);
  localStorage.setItem(SIDEBAR_KEY, isCollapsed ? "true" : "false");
  sidebarToggleBtn.textContent = isCollapsed ? "☰" : "☰";
}

function loadSidebarState() {
  const saved = localStorage.getItem(SIDEBAR_KEY);
  applySidebarState(saved === "true");
}

function toggleSidebar() {
  const collapsed = appShell.classList.contains("sidebar-collapsed");
  applySidebarState(!collapsed);
}

function createConversation(title = "New chat") {
  const newConversation = {
    id: generateId(),
    title,
    messages: [],
    updatedAt: Date.now()
  };

  conversations.unshift(newConversation);
  return newConversation;
}

function getActiveConversation() {
  return conversations.find(chat => chat.id === activeConversationId);
}

function sortConversations() {
  conversations.sort((a, b) => b.updatedAt - a.updatedAt);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderSidebar() {
  sortConversations();
  conversationList.innerHTML = "";

  const query = chatSearch.value.trim().toLowerCase();

  const filtered = conversations.filter(chat => {
    const combinedText = [
      chat.title,
      ...chat.messages.map(message => message.text)
    ].join(" ").toLowerCase();

    return combinedText.includes(query);
  });

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "no-chat-text";
    empty.textContent = query ? "No matching chats found." : "No chats yet.";
    conversationList.appendChild(empty);
    return;
  }

  filtered.forEach(chat => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "conversation-item" + (chat.id === activeConversationId ? " active" : "");

    item.innerHTML = `
      <div class="conversation-title only-title">${escapeHtml(chat.title || "New chat")}</div>
    `;

    item.addEventListener("click", () => {
      activeConversationId = chat.id;
      saveState();
      renderAll();
    });

    conversationList.appendChild(item);
  });
}

function renderChat() {
  const activeChat = getActiveConversation();
  chatBox.innerHTML = "";

  if (!activeChat || activeChat.messages.length === 0) {
    heroState.classList.remove("hidden");
    chatBox.classList.add("hidden");
    chatPanel.classList.add("empty-mode");
    startGreetingAnimation();
    return;
  }

  stopGreetingAnimation();
  heroState.classList.add("hidden");
  chatBox.classList.remove("hidden");
  chatPanel.classList.remove("empty-mode");

  activeChat.messages.forEach(message => {
    const row = document.createElement("div");
    row.className = `message-row ${message.sender}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = message.text;

    row.appendChild(bubble);
    chatBox.appendChild(row);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

function renderAll() {
  renderSidebar();
  renderChat();
}

function updateConversationTitle(chat, firstUserMessage) {
  if (!chat) return;

  const userMessageCount = chat.messages.filter(message => message.sender === "user").length;

  if (userMessageCount === 1) {
    chat.title = createSmartTitle(firstUserMessage);
  }
}

function addMessageToActiveConversation(text, sender) {
  const activeChat = getActiveConversation();
  if (!activeChat) return;

  activeChat.messages.push({ text, sender });
  activeChat.updatedAt = Date.now();

  if (sender === "user") {
    updateConversationTitle(activeChat, text);
  }

  saveState();
  renderAll();
}

function showTypingIndicator(label = "Thinking") {
  const row = document.createElement("div");
  row.className = "message-row bot";
  row.id = "typing-row";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble typing-bubble";

  bubble.innerHTML = `
    <span class="typing-label">${label}</span>
    <span class="typing-loader" aria-hidden="true">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </span>
  `;

  row.appendChild(bubble);
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
  const typingRow = document.getElementById("typing-row");
  if (typingRow) typingRow.remove();
}

function updateComposerGlow() {
  const shouldGlow = userInput.value.trim() === "" && !selectedFile;
  composer.classList.toggle("glow-ring", shouldGlow);
}

function closeAttachmentMenu() {
  attachmentMenu.classList.add("hidden");
}

function toggleAttachmentMenu() {
  attachmentMenu.classList.toggle("hidden");
}

function clearSelectedFile() {
  selectedFile = null;
  fileInput.value = "";
  selectedFileName.textContent = "";
  selectedFileBar.classList.add("hidden");
  updateComposerGlow();
}

function setSelectedFile(file) {
  selectedFile = file;
  selectedFileName.textContent = file.name;
  selectedFileBar.classList.remove("hidden");
  updateComposerGlow();
}

async function parseJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(`Server returned a non-JSON response. Status: ${response.status}`);
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Server returned invalid JSON. Status: ${response.status}`);
  }

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

async function sendChatMessage(message) {
  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  return parseJsonResponse(response);
}

async function summarizeSelectedFile(file, instructionText = "") {
  const formData = new FormData();
  formData.append("file", file);

  if (instructionText.trim()) {
    formData.append("instruction", instructionText.trim());
  }

  const response = await fetch("/summarize-file", {
    method: "POST",
    body: formData
  });

  return parseJsonResponse(response);
}

async function sendMessage() {
  const message = userInput.value.trim();

  if (!message && !selectedFile) return;

  userInput.value = "";
  autoResizeTextarea();
  updateComposerGlow();
  sendBtn.disabled = true;

  try {
    if (selectedFile) {
      const label = message
        ? `Summarize file "${selectedFile.name}" with this note: ${message}`
        : `Summarize file: ${selectedFile.name}`;

      addMessageToActiveConversation(label, "user");
      showTypingIndicator("Summarizing file");

      const data = await summarizeSelectedFile(selectedFile, message);
      removeTypingIndicator();

      if (data.reply) {
        addMessageToActiveConversation(data.reply, "bot");
      } else {
        addMessageToActiveConversation("Something went wrong while summarizing the file.", "bot");
      }

      clearSelectedFile();
      return;
    }

    addMessageToActiveConversation(message, "user");
    showTypingIndicator("Thinking");

    const data = await sendChatMessage(message);
    removeTypingIndicator();

    if (data.reply) {
      addMessageToActiveConversation(data.reply, "bot");
    } else {
      addMessageToActiveConversation("Something went wrong.", "bot");
    }
  } catch (error) {
    removeTypingIndicator();
    addMessageToActiveConversation(error.message || "Failed to connect to the server.", "bot");
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
    updateComposerGlow();
  }
}

function startNewChat() {
  const newChat = createConversation("New chat");
  activeConversationId = newChat.id;
  clearSelectedFile();
  saveState();
  renderAll();
  userInput.focus();
  updateComposerGlow();
}

function autoResizeTextarea() {
  userInput.style.height = "auto";
  userInput.style.height = Math.min(userInput.scrollHeight, 180) + "px";
}

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  themeToggleBtn.textContent = theme === "dark" ? "☀" : "☾";
  themeToggleBtn.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute("data-theme") || "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(savedTheme);
}

function toggleSearch() {
  searchWrap.classList.toggle("hidden");

  if (!searchWrap.classList.contains("hidden")) {
    chatSearch.focus();
  } else {
    chatSearch.value = "";
    renderSidebar();
  }
}

function stopGreetingAnimation() {
  greetingRunning = false;
  if (greetingLoopTimer) {
    clearTimeout(greetingLoopTimer);
    greetingLoopTimer = null;
  }
  heroGreeting.classList.remove("fade-in", "fade-out");
  heroGreeting.textContent = "";
}

function startGreetingAnimation() {
  if (greetingRunning) return;
  greetingRunning = true;

  let messageIndex = 0;

  const showMessage = () => {
    if (!greetingRunning) return;

    const message = GREETING_MESSAGES[messageIndex];

    heroGreeting.classList.remove("fade-out");
    heroGreeting.textContent = message;

    requestAnimationFrame(() => {
      heroGreeting.classList.add("fade-in");
    });

    greetingLoopTimer = setTimeout(() => {
      heroGreeting.classList.remove("fade-in");
      heroGreeting.classList.add("fade-out");

      greetingLoopTimer = setTimeout(() => {
        messageIndex = (messageIndex + 1) % GREETING_MESSAGES.length;
        showMessage();
      }, 650);
    }, 2200);
  };

  showMessage();
}

newChatBtn.addEventListener("click", startNewChat);
sendBtn.addEventListener("click", sendMessage);
themeToggleBtn.addEventListener("click", toggleTheme);
sidebarToggleBtn.addEventListener("click", toggleSidebar);
searchToggleBtn.addEventListener("click", toggleSearch);
chatSearch.addEventListener("input", renderSidebar);

composerActionBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleAttachmentMenu();
});

attachFileOption.addEventListener("click", () => {
  closeAttachmentMenu();
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  setSelectedFile(file);
});

clearFileBtn.addEventListener("click", clearSelectedFile);

document.addEventListener("click", (event) => {
  const clickedInsideMenu = attachmentMenu.contains(event.target);
  const clickedActionButton = composerActionBtn.contains(event.target);

  if (!clickedInsideMenu && !clickedActionButton) {
    closeAttachmentMenu();
  }
});

userInput.addEventListener("input", () => {
  autoResizeTextarea();
  updateComposerGlow();
});

userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

loadState();
loadTheme();
loadSidebarState();
renderAll();
autoResizeTextarea();
updateComposerGlow();