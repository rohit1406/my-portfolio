class ChatApp {
  constructor() {
    // Get references to DOM elements we'll need to manipulate
    this.messages = document.getElementById("messages");
    this.form = document.getElementById("chatForm");
    this.input = document.getElementById("messageInput");
    this.sendButton = document.getElementById("sendBtn");

    // Configure your backend URL here
    this.BASE_URL = "https://zany-doodle-pq7r596p969fr747-5000.app.github.dev"; // Update this for your environment
    this.API_ENDPOINT = `${this.BASE_URL}/hello`;

    // Set up event listeners when the chat app is created
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Listen for form submission (when user clicks Send or presses Enter)
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Also listen for Enter key in the input field (better UX)
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.handleSubmit(e);
      }
    });
  }

  async handleSubmit(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    const messageText = this.input.value.trim();
    if (!messageText) return; // Don't send empty messages

    // Provide user feedback that something is happening
    this.setLoading(true);

    // Add user message to chat immediately (optimistic UI)
    this.appendMessage(messageText, "user");

    // Clear input field so user can type next message
    this.input.value = "";

    try {
      // Call the AI API and wait for response
      const reply = await this.callAPI(messageText);

      // Add AI response to chat
      this.appendMessage(reply, "assistant");
    } catch (error) {
      console.error("API Error:", error);
      this.appendMessage(
        "Sorry, I'm having trouble connecting right now. Please try again.",
        "error",
      );
    } finally {
      // Re-enable the interface regardless of success or failure
      this.setLoading(false);
    }
  }

  async callAPI(message) {
    const response = await fetch(this.API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  }

  appendMessage(text, role) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${role}`;
    messageElement.innerHTML = `
            <div class="message-content">
                <span class="message-text">${this.escapeHtml(text)}</span>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;

    this.messages.appendChild(messageElement);
    this.scrollToBottom();
  }

  // XSS Prevention
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text; // This automatically escapes HTML
    return div.innerHTML;
  }

  scrollToBottom() {
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  setLoading(isLoading) {
    this.sendButton.disabled = isLoading;
    this.input.disabled = isLoading;
    this.sendButton.textContent = isLoading ? "Sending..." : "Send";
  }
}

// Initialize the chat application when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new ChatApp();
});
