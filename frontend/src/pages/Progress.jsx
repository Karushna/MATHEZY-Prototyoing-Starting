import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const topicsList = ["arithmetic", "algebra", "geometry", "stats"];

function Progress() {
  const [data, setData] = useState({});
  const [weakTopic, setWeakTopic] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "progress"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    const topics = {};

    topicsList.forEach((t) => {
      topics[t] = {
        total: 0,
        correct: 0,
        wrong: 0,
        hints: 0,
        time: 0,
        score: 0,
      };
    });

    snapshot.forEach((doc) => {
      const d = doc.data();
      const t = d.topic;

      if (!topics[t]) return;

      topics[t].total += 1;
      if (d.correct) topics[t].correct += 1;
      else topics[t].wrong += 1;

      if (d.hintUsed) topics[t].hints += 1;
      topics[t].time += d.timeTaken || 0;
    });

    // 🔥 SCORE CALCULATION
    Object.keys(topics).forEach((t) => {
      const item = topics[t];

      if (item.total === 0) {
        item.score = 0;
        return;
      }

      const accuracy = item.correct / item.total;
      const hintPenalty = item.hints / item.total;
      const timePenalty = item.time / (item.total * 30);

      let score =
        accuracy * 70 +
        (1 - hintPenalty) * 20 +
        (1 - Math.min(timePenalty, 1)) * 10;

      item.score = Math.max(0, Math.min(100, score)).toFixed(1);
    });

    // Weak topic
    let weakest = "";
    let min = 100;
    Object.keys(topics).forEach((t) => {
      if (topics[t].score < min) {
        min = topics[t].score;
        weakest = t;
      }
    });

    setWeakTopic(weakest);
    setData(topics);
  };

  const handlePractice = (topic) => {
    navigate(`/practice?topic=${topic}`);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Your Progress</h1>

      {/* 🧠 MATHEZY INSIGHTS */}
      <div style={styles.insightBox}>
        <h2 style={styles.insightTitle}> Mathezy AI Insights</h2>

        <div style={styles.insightGrid}>
          <div>
            <h4>✅ Strengths</h4>
            {topicsList
              .filter((t) => data[t]?.score > 75)
              .map((t) => (
                <p key={t}>• Strong in {capitalize(t)}</p>
              ))}
          </div>

          <div>
            <h4>⚠️ Weak Areas</h4>
            {topicsList
              .filter((t) => data[t]?.score < 50)
              .map((t) => (
                <p key={t}>• Needs work: {capitalize(t)}</p>
              ))}
          </div>

          <div>
            <h4>⚡ Speed</h4>
            <p>• Improve time efficiency</p>
          </div>
        </div>
      </div>

      {/* 🔥 SUBJECT CARDS */}
      <div style={styles.grid}>
        {topicsList.map((t) => {
          const d = data[t] || {};
          const score = d.score || 0;

          return (
            <div
              key={t}
              style={{
                ...styles.card,
                border:
                  t === weakTopic
                    ? "2px solid #ef4444"
                    : "1px solid #eee",
              }}
            >
              <h3>{capitalize(t)}</h3>

              {/* Circle */}
              <div style={styles.circle}>
                <span>{score}%</span>
              </div>

              <p>Correct: {d.correct || 0}</p>
              <p>Mistakes: {d.wrong || 0}</p>
              <p>Hints: {d.hints || 0}</p>
              <p>⏱ {Math.round(d.time || 0)} sec</p>

              <button
                style={styles.btn}
                onClick={() => handlePractice(t)}
              >
                Practice More
              </button>

              {t === weakTopic && (
                <p style={styles.warning}>Needs Attention</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function capitalize(text) {
  return text?.charAt(0).toUpperCase() + text?.slice(1);
}

/* 🎨 STYLES */
const styles = {
  page: {
    padding: "40px",
    fontFamily: "Inter",
    background: "#f9fafb",
  },

  title: {
    textAlign: "center",
    fontSize: "36px",
    marginBottom: "30px",
  },

  insightBox: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  },

  insightTitle: {
    marginBottom: "15px",
  },

  insightGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  },

  circle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "6px solid #22c55e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px auto",
    fontWeight: "bold",
  },

  btn: {
    marginTop: "10px",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "#111",
    color: "white",
    cursor: "pointer",
  },

  warning: {
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "8px",
  },
};

export default Progress;