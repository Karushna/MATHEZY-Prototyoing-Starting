import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Progress() {
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const querySnapshot = await getDocs(collection(db, "progress"));

        let totalQuestions = 0;
        let correctAnswers = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (data.userId === user.uid) {
            totalQuestions++;
            if (data.correct) correctAnswers++;
          }
        });

        setTotal(totalQuestions);
        setCorrect(correctAnswers);

        const acc =
          totalQuestions === 0
            ? 0
            : Math.round((correctAnswers / totalQuestions) * 100);

        setAccuracy(acc);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>Your Progress</h1>
        <p>Track your learning journey 📈</p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <div style={styles.container}>

          {/* STATS CARDS */}
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3>{total}</h3>
              <p>Total Questions</p>
            </div>

            <div style={styles.card}>
              <h3>{correct}</h3>
              <p>Correct Answers</p>
            </div>

            <div style={styles.card}>
              <h3>{accuracy}%</h3>
              <p>Accuracy</p>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div style={styles.progressSection}>
            <p style={styles.progressLabel}>Accuracy Progress</p>

            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${accuracy}%`,
                }}
              />
            </div>

            <p style={styles.progressText}>
              {accuracy}% performance
            </p>
          </div>

          {/* MOTIVATION */}
          <div style={styles.message}>
            {accuracy >= 80 && "🔥 Excellent work! Keep it up!"}
            {accuracy >= 50 && accuracy < 80 && "👍 Good progress, keep practicing!"}
            {accuracy < 50 && "💪 Keep going, you’ll improve!"}
          </div>

        </div>
      )}
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

  container: {
    maxWidth: "700px",
    margin: "0 auto",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },

  card: {
    background: "#f7f7f7",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
  },

  progressSection: {
    marginTop: "20px",
  },

  progressLabel: {
    marginBottom: "10px",
    fontWeight: "500",
  },

  progressBar: {
    height: "12px",
    background: "#eee",
    borderRadius: "10px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#4CAF50",
    borderRadius: "10px",
    transition: "width 0.5s ease",
  },

  progressText: {
    marginTop: "10px",
    textAlign: "center",
  },

  message: {
    marginTop: "30px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "500",
  },
};

export default Progress;