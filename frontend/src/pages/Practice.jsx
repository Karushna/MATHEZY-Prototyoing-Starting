import { useState, useEffect } from "react";
import axios from "axios";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function Practice() {
  const [topic, setTopic] = useState(null);
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
  const [hint, setHint] = useState("");

  const [time, setTime] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const topicFromURL = params.get("topic");

  const user = auth.currentUser;

  /* TIMER */
  useEffect(() => {
    if (!question) return;
    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [question]);

  /* GENERATE QUESTION */
  const generateQuestion = async (selectedTopic = topic) => {
    if (!selectedTopic) return;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/generate-question",
        { topic: selectedTopic }
      );

      setQuestion(res.data.question);
      setCorrectAnswer(res.data.answer);
      setUserAnswer("");
      setResult("");
      setHint("");
      setTime(0);
      setHintUsed(false);
    } catch {
      alert("Error generating question");
    }
  };

  /* AUTO START FROM URL */
  useEffect(() => {
    if (topicFromURL) {
      setTopic(topicFromURL);
      generateQuestion(topicFromURL);
    }
  }, [topicFromURL]);

  /* CHECK ANSWER */
  const checkAnswer = async () => {
    if (!userAnswer) return;

    const isCorrect =
      Math.abs(parseFloat(userAnswer) - correctAnswer) < 0.001;

    setResult(isCorrect ? "correct" : "wrong");

    if (user) {
      await addDoc(collection(db, "progress"), {
        userId: user.uid,
        topic,
        correct: isCorrect,
        hintUsed,
        timeTaken: time,
        timestamp: new Date(),
      });
    }

    setTimeout(() => generateQuestion(), 1200);
  };

  /* GET HINT */
  const getHint = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/ask-ai", {
        question,
      });
      setHint(res.data.explanation);
      setHintUsed(true);
    } catch {
      alert("Error getting hint");
    }
  };

  /* LOGOUT */
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  /* BACK BUTTON */
  const handleBack = () => {
    navigate(-1); // go to previous page
  };

  return (
    <div>
      {/* ✅ NAVBAR */}
      <div style={styles.navbar}>
        {/* LEFT */}
        <button onClick={handleBack} style={styles.backBtn}>
          ← Back
        </button>

        {/* CENTER */}
        <h2 style={styles.logo}>Mathezy</h2>

        {/* RIGHT */}
        <div style={styles.userSection}>
          <span style={styles.userEmail}>
            👤 {user?.email || "user@email.com"}
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* PAGE */}
      <div style={styles.page}>
        {!topic ? (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Practice</h1>
              <p style={styles.subtitle}>
                Choose a topic and start improving 🚀
              </p>
            </div>

            <div style={styles.grid}>
              {sections.map((sec, i) => (
                <div
                  key={sec.key}
                  onClick={() => {
                    setTopic(sec.key);
                    generateQuestion(sec.key);
                  }}
                  style={{
                    ...styles.card,
                    ...styles.gradients[i],
                  }}
                >
                  <div style={styles.icon}>{sec.icon}</div>
                  <h3>{sec.title}</h3>
                  <p>{sec.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={styles.practiceContainer}>
            <button onClick={() => setTopic(null)}>← Back</button>

            <div style={styles.questionCard}>
              <div>⏱ {time}s</div>
              <h2>{question}</h2>
            </div>

            <div style={styles.answerBox}>
              <input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter answer..."
                style={styles.input}
              />
              <button onClick={checkAnswer} style={styles.submitBtn}>
                Submit
              </button>
            </div>

            <button onClick={getHint} style={styles.hintBtn}>
              💡 Get Hint
            </button>

            {hint && <div style={styles.hint}>{hint}</div>}

            {result && (
              <div
                style={{
                  ...styles.result,
                  color: result === "correct" ? "green" : "red",
                }}
              >
                {result === "correct"
                  ? "✅ Correct!"
                  : `❌ Answer: ${correctAnswer}`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* DATA */
const sections = [
  { key: "arithmetic", title: "Arithmetic", icon: "➕", desc: "Basic operations" },
  { key: "algebra", title: "Algebra", icon: "🔤", desc: "Solve equations" },
  { key: "geometry", title: "Geometry", icon: "📐", desc: "Shapes & space" },
  { key: "stats", title: "Statistics", icon: "📊", desc: "Data & probability" },
];

/* STYLES */
const styles = {
  navbar: {
    height: "70px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    borderBottom: "1px solid #e5e7eb",
    position: "relative",
  },

  backBtn: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "6px 12px",
    background: "white",
    cursor: "pointer",
  },

  logo: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#2e7d32",
    fontWeight: "700",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  userEmail: {
    color: "#444",
  },

  logoutBtn: {
    background: "#111",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  page: {
    padding: "40px",
    background: "#f9fafb",
    minHeight: "100vh",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  title: {
    fontSize: "32px",
  },

  subtitle: {
    color: "#666",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },

  card: {
    padding: "30px",
    borderRadius: "16px",
    background: "white",
    cursor: "pointer",
    textAlign: "center",
  },

  gradients: [
    { background: "#e8f5e9" },
    { background: "#e3f2fd" },
    { background: "#f3e5f5" },
    { background: "#fff3e0" },
  ],

  practiceContainer: {
    maxWidth: "600px",
    margin: "0 auto",
  },

  questionCard: {
    padding: "20px",
    background: "white",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  answerBox: {
    display: "flex",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "10px",
  },

  submitBtn: {
    background: "#111",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
  },

  hintBtn: {
    marginTop: "10px",
    background: "#2563eb",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
  },

  hint: {
    marginTop: "10px",
    background: "#eef2ff",
    padding: "10px",
    borderRadius: "8px",
  },

  result: {
    marginTop: "15px",
    textAlign: "center",
  },
};

export default Practice;