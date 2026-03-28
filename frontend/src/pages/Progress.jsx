import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import axios from "axios";

const topicsList = ["arithmetic", "algebra", "geometry", "stats"];

function Progress() {
  const [data, setData] = useState({});
  const [insights, setInsights] = useState("");

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

    // Initialize ALL topics
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

    // 🔥 SMART SCORE CALCULATION
    Object.keys(topics).forEach((t) => {
      const item = topics[t];

      if (item.total === 0) {
        item.score = 0;
        return;
      }

      const accuracy = item.correct / item.total;
      const hintPenalty = item.hints / item.total;
      const timePenalty = item.time / (item.total * 30); // 30s ideal

      let score =
        accuracy * 100 -
        hintPenalty * 20 -
        timePenalty * 10;

      score = Math.max(0, Math.min(100, score));
      item.score = score.toFixed(1);
    });

    setData(topics);

    generateInsights(topics);
  };

  // 🤖 AI Insights
  const generateInsights = async (topics) => {
    const summary = JSON.stringify(topics);

    try {
      const res = await axios.post("http://127.0.0.1:8000/ask-ai", {
        question: `Analyze student performance and give short feedback + recommendation: ${summary}`,
      });

      setInsights(res.data.explanation);
    } catch {
      setInsights("Keep practicing! You're improving steadily.");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Your Progress</h1>
      <p style={styles.subtitle}>
        AI-powered performance insights
      </p>

      {/* 🔥 GRID 2x2 */}
      <div style={styles.grid}>
        {topicsList.map((topic) => {
          const t = data[topic] || {};

          return (
            <div key={topic} style={styles.card}>
              <h2 style={styles.topicTitle}>{capitalize(topic)}</h2>

              {/* Score Bar */}
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${t.score || 0}%`,
                  }}
                />
              </div>

              <p style={styles.score}>
                {t.score || 0}% Performance
              </p>

              {/* Stats */}
              <div style={styles.stats}>
                <Stat label="Total" value={t.total || 0} />
                <Stat label="Correct" value={t.correct || 0} />
                <Stat label="Mistakes" value={t.wrong || 0} />
                <Stat label="Hints" value={t.hints || 0} />
              </div>

              <p style={styles.time}>
                ⏱ {Math.round(t.time || 0)} sec
              </p>
            </div>
          );
        })}
      </div>

      {/* 📊 GRAPH */}
      <div style={styles.graphContainer}>
        <h2>Performance Overview</h2>
        <div style={styles.graph}>
          {topicsList.map((t) => (
            <div key={t} style={styles.barBox}>
              <div
                style={{
                  ...styles.bar,
                  height: `${data[t]?.score || 0}%`,
                }}
              />
              <p>{capitalize(t)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🤖 AI INSIGHTS */}
      <div style={styles.insightBox}>
        <h2>AI Feedback</h2>
        <p>{insights}</p>
      </div>
    </div>
  );
}

/* COMPONENTS */
function Stat({ label, value }) {
  return (
    <div style={styles.statBox}>
      <p style={styles.statValue}>{value}</p>
      <p style={styles.statLabel}>{label}</p>
    </div>
  );
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* 🎨 STYLES */
const styles = {
  page: {
    padding: "50px 20px",
    fontFamily: "Inter",
    background: "#f9fafb",
    minHeight: "100vh",
  },

  title: {
    textAlign: "center",
    fontSize: "36px",
    fontWeight: "700",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "40px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // 🔥 2x2 layout
    gap: "25px",
    maxWidth: "800px",
    margin: "0 auto",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    textAlign: "center",
  },

  topicTitle: {
    marginBottom: "10px",
    fontWeight: "600",
  },

  progressBar: {
    height: "10px",
    background: "#eee",
    borderRadius: "10px",
  },

  progressFill: {
    height: "100%",
    background: "#4CAF50",
    borderRadius: "10px",
  },

  score: {
    marginTop: "8px",
    fontWeight: "500",
  },

  stats: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },

  statBox: { textAlign: "center" },

  statValue: { fontWeight: "600" },

  statLabel: { fontSize: "12px", color: "#666" },

  time: {
    marginTop: "10px",
    fontSize: "14px",
  },

  graphContainer: {
    marginTop: "50px",
    textAlign: "center",
  },

  graph: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginTop: "20px",
  },

  barBox: {
    textAlign: "center",
  },

  bar: {
    width: "40px",
    background: "#2563eb",
    borderRadius: "6px",
  },

  insightBox: {
    marginTop: "40px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    maxWidth: "700px",
    marginInline: "auto",
  },
};

export default Progress;