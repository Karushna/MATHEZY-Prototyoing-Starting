import { useState } from "react";
import axios from "axios";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function Practice() {
  const [topic, setTopic] = useState("algebra");
  const [difficulty, setDifficulty] = useState("easy");

  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");

  const generateQuestion = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/generate-question", {
        topic,
        difficulty,
      });

      setQuestion(response.data.question);
      setCorrectAnswer(response.data.answer);
      setUserAnswer("");
      setResult("");
    } catch {
      alert("Error generating question");
    }
  };

  const checkAnswer = async () => {
    if (!userAnswer) return;

    let isCorrect = parseFloat(userAnswer) === correctAnswer;
    setResult(isCorrect ? "correct" : "wrong");

    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "progress"), {
      userId: user.uid,
      question,
      correct: isCorrect,
      timestamp: new Date(),
    });
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Practice</h1>
        <p style={styles.subtitle}>Improve your math skills step by step</p>
      </div>

      {/* MAIN AREA */}
      <div style={styles.container}>

        {/* TOP CONTROLS */}
        <div style={styles.topBar}>
          <select value={topic} onChange={(e) => setTopic(e.target.value)} style={styles.select}>
            <option value="algebra">Algebra</option>
            <option value="arithmetic">Arithmetic</option>
          </select>

          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={styles.select}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button style={styles.generateBtn} onClick={generateQuestion}>
            Generate Question
          </button>
        </div>

        {/* QUESTION */}
        {question && (
          <div style={styles.questionCard}>
            <h2 style={styles.questionText}>{question}</h2>
          </div>
        )}

        {/* ANSWER INPUT */}
        {question && (
          <div style={styles.answerBox}>
            <input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer..."
              style={styles.input}
            />

            <button style={styles.submitBtn} onClick={checkAnswer}>
              Check
            </button>
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div style={styles.result}>
            {result === "correct" ? "✅ Correct!" : `❌ Answer: ${correctAnswer}`}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "Inter, system-ui",
    padding: "60px 20px",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  title: {
    fontSize: "40px",
    fontWeight: "600",
  },

  subtitle: {
    color: "#666",
    marginTop: "10px",
  },

  container: {
    maxWidth: "700px",
    margin: "0 auto",
  },

  topBar: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  select: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },

  generateBtn: {
    padding: "10px 16px",
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  questionCard: {
    background: "#f7f7f7",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    marginBottom: "25px",
  },

  questionText: {
    fontSize: "24px",
  },

  answerBox: {
    display: "flex",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },

  submitBtn: {
    padding: "14px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  result: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "500",
  },
};

export default Practice;