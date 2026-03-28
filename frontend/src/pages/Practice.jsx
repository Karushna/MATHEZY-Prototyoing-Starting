import { useState, useEffect } from "react";
import axios from "axios";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function Practice() {
  const [topic, setTopic] = useState(null);
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
  const [hint, setHint] = useState("");

  const [time, setTime] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  // ⏱ TIMER
  useEffect(() => {
    if (!question) return;

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [question]);

  const generateQuestion = async (selectedTopic = topic) => {
    if (!selectedTopic) return;

    const res = await axios.post("http://127.0.0.1:8000/generate-question", {
      topic: selectedTopic,
    });

    setQuestion(res.data.question);
    setCorrectAnswer(res.data.answer);
    setUserAnswer("");
    setResult("");
    setHint("");
    setTime(0);
    setHintUsed(false);
  };

  const checkAnswer = async () => {
    if (!userAnswer) return;

    const isCorrect =
      Math.abs(parseFloat(userAnswer) - correctAnswer) < 0.001;

    setResult(isCorrect ? "correct" : "wrong");

    // ✅ SAVE TO FIRESTORE
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, "progress"), {
        userId: user.uid,
        topic: topic, // 🔥 VERY IMPORTANT
        correct: isCorrect,
        hintUsed: hintUsed,
        timeTaken: time,
        timestamp: new Date(),
      });
    }

    setTimeout(() => {
      generateQuestion();
    }, 1200);
  };

  const getHint = async () => {
    const res = await axios.post("http://127.0.0.1:8000/ask-ai", {
      question,
    });

    setHint(res.data.explanation);
    setHintUsed(true); // 🔥 track hint usage
  };

  return (
    <div style={styles.page}>
      {!topic && (
        <>
          <h1 style={styles.mainTitle}>Practice</h1>
          <p style={styles.subtitle}>
            Choose a topic to start improving your skills
          </p>

          <div style={styles.grid}>
            {sections.map((sec) => (
              <HoverCard
                key={sec.key}
                sec={sec}
                onClick={() => {
                  setTopic(sec.key);
                  generateQuestion(sec.key);
                }}
              />
            ))}
          </div>
        </>
      )}

      {topic && (
        <div style={styles.practiceContainer}>
          <div style={styles.practiceHeader}>
            <button onClick={() => setTopic(null)} style={styles.backBtn}>
              ← Back
            </button>

            <h1 style={styles.sectionTitle}>
              {getTitle(topic)} Practice
            </h1>
          </div>

          <div style={styles.questionCard}>
            <h2 style={styles.question}>{question}</h2>
            <p style={{ color: "#666", marginTop: "10px" }}>
              ⏱ {time}s
            </p>
          </div>

          <div style={styles.answerBox}>
            <input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer..."
              style={styles.input}
            />

            <button onClick={checkAnswer} style={styles.submitBtn}>
              Submit
            </button>
          </div>

          <button onClick={getHint} style={styles.hintBtn}>
            💡 Show Hint
          </button>

          {hint && <div style={styles.hint}>{hint}</div>}

          {result && (
            <div style={styles.result}>
              {result === "correct"
                ? "✅ Correct!"
                : `❌ Correct Answer: ${correctAnswer}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* HOVER CARD */
function HoverCard({ sec, onClick }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles.card,
        transform: hover ? "scale(1.05)" : "scale(1)",
        boxShadow: hover
          ? "0 12px 30px rgba(0,0,0,0.15)"
          : "0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div style={styles.icon}>{sec.icon}</div>
      <h2 style={styles.cardTitle}>{sec.title}</h2>
      <p style={styles.cardDesc}>{sec.desc}</p>
    </div>
  );
}

const sections = [
  { key: "arithmetic", title: "Arithmetic", icon: "➕", desc: "Basic operations" },
  { key: "algebra", title: "Algebra", icon: "🔤", desc: "Solve equations" },
  { key: "geometry", title: "Geometry", icon: "📐", desc: "Shapes and space" },
  { key: "stats", title: "Statistics", icon: "📊", desc: "Data and probability" },
];

const getTitle = (key) => {
  const found = sections.find((s) => s.key === key);
  return found ? found.title : "";
};

const styles = {
  page: { padding: "60px 20px", fontFamily: "Inter", background: "#f9fafb" },
  mainTitle: { textAlign: "center", fontSize: "42px" },
  subtitle: { textAlign: "center", marginBottom: "40px", color: "#666" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "25px",
    maxWidth: "800px",
    margin: "0 auto",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    cursor: "pointer",
    textAlign: "center",
  },

  icon: { fontSize: "32px", marginBottom: "10px" },

  practiceContainer: { maxWidth: "600px", margin: "0 auto" },

  practiceHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },

  sectionTitle: { fontSize: "28px" },

  backBtn: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  questionCard: {
    background: "white",
    padding: "30px",
    borderRadius: "14px",
    textAlign: "center",
    marginBottom: "20px",
  },

  question: { fontSize: "24px" },

  answerBox: { display: "flex", gap: "10px" },

  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },

  submitBtn: {
    background: "#111",
    color: "white",
    padding: "14px",
    borderRadius: "10px",
  },

  hintBtn: {
    marginTop: "15px",
    background: "#2563eb",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
  },

  hint: {
    marginTop: "10px",
    background: "#eef2ff",
    padding: "10px",
    borderRadius: "10px",
  },

  result: {
    marginTop: "15px",
    fontSize: "18px",
    textAlign: "center",
  },
};

export default Practice;