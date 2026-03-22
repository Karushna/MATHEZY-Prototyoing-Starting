import { useState, useRef, useEffect } from "react";
import axios from "axios";

function ChatTutor() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/ask-ai", {
        question: question,
      });

      setMessages([
        ...newMessages,
        {
          role: "ai",
          text: response.data.explanation || "No response from AI",
        },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "ai",
          text: "❌ Error: Unable to connect to AI server",
        },
      ]);
    }

    setLoading(false);
    setQuestion("");
  };

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div style={styles.page}>

      {/* TOP BAR */}
      <div style={styles.nav}>
        <h3>🤖 AI Math Tutor</h3>
      </div>

      {/* CHAT AREA */}
      <div style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.role === "user"
                ? styles.userWrapper
                : styles.aiWrapper
            }
          >
            <div
              style={
                msg.role === "user"
                  ? styles.userMessage
                  : styles.aiMessage
              }
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={styles.aiWrapper}>
            <div style={styles.aiMessage}>Typing...</div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a math question..."
          onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
        />

        <button style={styles.button} onClick={sendQuestion}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "Inter, Arial, sans-serif",
    background: "#f9fafb",
  },

  /* NAV */
  nav: {
    padding: "15px 20px",
    background: "white",
    borderBottom: "1px solid #eee",
  },

  /* CHAT */
  chatContainer: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  userWrapper: {
    display: "flex",
    justifyContent: "flex-end",
  },

  aiWrapper: {
    display: "flex",
    justifyContent: "flex-start",
  },

  userMessage: {
    background: "linear-gradient(135deg, #4CAF50, #2e7d32)",
    color: "white",
    padding: "12px 16px",
    borderRadius: "15px 15px 0 15px",
    maxWidth: "60%",
  },

  aiMessage: {
    background: "white",
    padding: "12px 16px",
    borderRadius: "15px 15px 15px 0",
    maxWidth: "60%",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },

  /* INPUT */
  inputArea: {
    display: "flex",
    padding: "15px",
    borderTop: "1px solid #eee",
    background: "white",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    marginLeft: "10px",
    padding: "12px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default ChatTutor;