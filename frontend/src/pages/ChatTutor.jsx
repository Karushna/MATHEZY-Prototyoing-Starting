import { useState } from "react";
import axios from "axios";

function ChatTutor() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/ask-ai", {
        question: question
      });

      console.log("API Response:", response.data);

      setMessages([
        ...newMessages,
        {
          role: "ai",
          text: response.data.explanation || "No response from AI"
        }
      ]);

    } catch (error) {
      console.error(error);

      setMessages([
        ...newMessages,
        {
          role: "ai",
          text: "❌ Error: Unable to connect to AI server"
        }
      ]);
    }

    setLoading(false);
    setQuestion("");
  };

  return (
    <div style={styles.container}>
      <h2>AI Math Tutor</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.role === "user"
                ? styles.userMessage
                : styles.aiMessage
            }
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div style={styles.aiMessage}>Typing...</div>
        )}
      </div>

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a math question..."
        />

        <button style={styles.button} onClick={sendQuestion}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "600px",
    margin: "50px auto",
    textAlign: "center"
  },
  chatBox: {
    height: "400px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    overflowY: "auto",
    marginBottom: "10px",
    background: "#f9f9f9"
  },
  userMessage: {
    textAlign: "right",
    margin: "5px",
    padding: "10px",
    background: "#4CAF50",
    color: "white",
    borderRadius: "10px"
  },
  aiMessage: {
    textAlign: "left",
    margin: "5px",
    padding: "10px",
    background: "#e0e0e0",
    borderRadius: "10px"
  },
  inputArea: {
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default ChatTutor;