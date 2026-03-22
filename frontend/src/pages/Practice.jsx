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
        difficulty
      });

      setQuestion(response.data.question);
      setCorrectAnswer(response.data.answer);

      setUserAnswer("");
      setResult("");

    } catch (error) {
      console.error(error);
      alert("❌ Error generating question");
    }
  };

  const checkAnswer = async () => {
    if (userAnswer === "") return;

    let isCorrect = false;

    if (parseFloat(userAnswer) === correctAnswer) {
      setResult("✅ Correct!");
      isCorrect = true;
    } else {
      setResult(`❌ Incorrect. Correct answer is ${correctAnswer}`);
    }

    const user = auth.currentUser;

    if (!user) {
      alert("❌ You must be logged in");
      return;
    }

    try {
      await addDoc(collection(db, "progress"), {
        userId: user.uid,
        question: question,
        correct: isCorrect,
        timestamp: new Date()
      });

      console.log("✅ Saved to Firebase");

    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Practice Page</h2>

      {/* Controls */}
      <div style={styles.controls}>
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="algebra">Algebra</option>
          <option value="arithmetic">Arithmetic</option>
        </select>

        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button style={styles.button} onClick={generateQuestion}>
          Generate Question
        </button>
      </div>

      {/* Question */}
      {question && (
        <div style={styles.questionBox}>
          <h3>{question}</h3>
        </div>
      )}

      {/* Answer */}
      {question && (
        <div style={styles.answerSection}>
          <input
            style={styles.input}
            placeholder="Enter your answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />

          <button style={styles.button} onClick={checkAnswer}>
            Check Answer
          </button>
        </div>
      )}

      {/* Result */}
      {result && <h3>{result}</h3>}
    </div>
  );
}

const styles = {
  container: {
    width: "600px",
    margin: "50px auto",
    textAlign: "center"
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px"
  },
  questionBox: {
    margin: "20px",
    padding: "20px",
    background: "#f4f4f4",
    borderRadius: "10px"
  },
  answerSection: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px"
  },
  input: {
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

export default Practice;