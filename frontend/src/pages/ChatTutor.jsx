import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function ChatTutor() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/ask-ai", {
        question,
      });

      setMessages([
        ...newMessages,
        {
          role: "ai",
          text: response.data.explanation || "No response",
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "ai",
          text: "❌ Error connecting to AI",
        },
      ]);
    }

    setLoading(false);
    setQuestion("");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back
        </button>

        <h2 style={styles.logo}>Mathezy</h2>

        <div style={styles.navRight}>
          <span style={styles.user}>
            👤 {user?.email || "Student"}
          </span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Mathezy Tutor</h1>
        <p style={styles.subtitle}>
          Ask any math question and get step-by-step help ✨
        </p>
      </div>

      {/* CHAT */}
      <div style={styles.chatContainer}>
        {messages.length === 0 && (
          <div style={styles.empty}>
            💬 Ask your first question to start learning
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
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
          placeholder="Type your math question..."
          onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
        />

        <button style={styles.sendBtn} onClick={sendQuestion}>
          Send →
        </button>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "Inter, sans-serif",
    background: "#f9fafb",
  },

  /* NAVBAR */
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "white",
    borderBottom: "1px solid #eee",
  },

  logo: {
    color: "#2e7d32",
    fontWeight: "700",
    fontSize: "22px",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  user: {
    fontSize: "14px",
    color: "#555",
  },

  logoutBtn: {
    padding: "6px 12px",
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  backBtn: {
    padding: "6px 12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
  },

  /* HEADER */
  header: {
    padding: "40px",
  },

  title: {
    fontSize: "32px",
    marginBottom: "6px",
  },

  subtitle: {
    color: "#666",
  },

  /* CHAT */
  chatContainer: {
    flex: 1,
    padding: "20px 40px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
  },

  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: "60px",
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
    background: "linear-gradient(135deg,#4CAF50,#2e7d32)",
    color: "white",
    padding: "14px 18px",
    borderRadius: "16px 16px 4px 16px",
    maxWidth: "60%",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  aiMessage: {
    background: "white",
    padding: "14px 18px",
    borderRadius: "16px 16px 16px 4px",
    maxWidth: "60%",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },

  /* INPUT */
  inputArea: {
    display: "flex",
    padding: "15px 40px",
    background: "white",
    borderTop: "1px solid #eee",
  },

  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },

  sendBtn: {
    marginLeft: "10px",
    padding: "14px 20px",
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default ChatTutor;