import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const topicsList = ["arithmetic", "algebra", "geometry", "stats"];

function Progress() {
  const [data, setData] = useState({});
  const [weakTopics, setWeakTopics] = useState([]);
  const [insight, setInsight] = useState("");
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

    const weak = topicsList.filter((t) => topics[t].score < 50);

    setWeakTopics(weak);
    setData(topics);

    generateInsight(topics, weak);
  };

  /* 🧠 PERSONALIZED INSIGHT */
  const generateInsight = (topics, weak) => {
  let messages = [];

  topicsList.forEach((t) => {
    const d = topics[t];
    if (!d || d.total === 0) return;

    const accuracy = d.correct / d.total;
    const avgTime = d.time / d.total;
    const hintRate = d.hints / d.total;

    // 🔴 Accuracy issues
    if (accuracy < 0.5) {
      messages.push(
        `In ${capitalize(
          t
        )}, you're getting many answers wrong. Try slowing down and focusing on understanding the steps rather than rushing.`
      );
    }

    // 🟡 Too many hints
    if (hintRate > 0.4) {
      messages.push(
        `You're relying quite a bit on hints in ${capitalize(
          t
        )}. Try attempting the problem a bit longer before asking for help — it will strengthen your thinking.`
      );
    }

    // 🔵 Speed issues
    if (avgTime > 40) {
      messages.push(
        `You're taking longer than usual in ${capitalize(
          t
        )}. Practicing similar problems can help improve your speed and confidence.`
      );
    }

    // 🟢 Strong area
    if (accuracy > 0.8 && hintRate < 0.2 && avgTime < 30) {
      messages.push(
        `You're doing great in ${capitalize(
          t
        )} — strong accuracy, good speed, and minimal hints. Keep it up!`
      );
    }
  });

  // 🔥 Fallback if no strong signals
  if (messages.length === 0) {
    messages.push(
      "You're making steady progress. Keep practicing consistently to improve even further."
    );
  }

  // Combine naturally
  const finalMessage =
    "Here’s what I’ve noticed from your recent practice:\n\n" +
    messages.slice(0, 3).join(" ") +
    "\n\nKeep going — you're improving with every step 🚀";

  setInsight(finalMessage);
};

  const handlePractice = (topic) => {
    navigate(`/practice?topic=${topic}`);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back
        </button>

        <div style={styles.navRight}>
          <span>👤 {auth.currentUser?.email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Your Progress</h1>
        <p style={styles.subtitle}>
          Track your growth and improve smarter 📊
        </p>
      </div>

      {/* CARDS */}
      <div style={styles.grid}>
        {topicsList.map((t, i) => {
          const d = data[t] || {};
          const score = d.score || 0;

          return (
            <div key={t} style={{ ...styles.card, ...styles.gradients[i] }}>
              <h3 style={styles.cardTitle}>{capitalize(t)}</h3>

              <div style={styles.scoreCircle}>{score}%</div>

              <div style={styles.stats}>
                <div>✅ {d.correct || 0} Correct</div>
                <div>❌ {d.wrong || 0} Mistakes</div>
                <div>💡 {d.hints || 0} Hints</div>
                <div>⏱ {Math.round(d.time || 0)} s</div>
              </div>

              <button
                style={styles.btn}
                onClick={() => handlePractice(t)}
              >
                Practice →
              </button>
            </div>
          );
        })}
      </div>

      {/* 🧠 INSIGHT */}
      <div style={styles.insightCard}>
        <h2>🧠 Mathezy Insight</h2>
        <p style={styles.insightText}>{insight}</p>
      </div>
    </div>
  );
}

/* HELPER */
const capitalize = (text) =>
  text?.charAt(0).toUpperCase() + text?.slice(1);

/* STYLES */
const styles = {
  page: {
    fontFamily: "Inter",
    background: "#f9fafb",
    minHeight: "100vh",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 40px",
    background: "white",
    borderBottom: "1px solid #eee",
  },

  navRight: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  logoutBtn: {
    background: "#111",
    color: "white",
    borderRadius: "8px",
    padding: "6px 12px",
  },

  backBtn: {
    border: "1px solid #ddd",
    padding: "6px 12px",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
  },

  header: {
    textAlign: "center",
    padding: "40px",
  },

  title: { fontSize: "36px" },

  subtitle: { color: "#666" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "28px",
    maxWidth: "900px",
    margin: "0 auto",
  },

  card: {
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },

  gradients: [
    { background: "linear-gradient(135deg,#e8f5e9,#fff)" },
    { background: "linear-gradient(135deg,#e3f2fd,#fff)" },
    { background: "linear-gradient(135deg,#f3e5f5,#fff)" },
    { background: "linear-gradient(135deg,#fff3e0,#fff)" },
  ],

  cardTitle: { fontSize: "20px" },

  scoreCircle: {
    margin: "15px auto",
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    border: "6px solid #22c55e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    fontSize: "14px",
    marginBottom: "15px",
  },

  btn: {
    background: "#111",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
  },

  insightCard: {
    marginTop: "40px",
    maxWidth: "900px",
    marginInline: "auto",
    padding: "25px",
    borderRadius: "18px",
    background: "white",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },

  insightText: {
    marginTop: "10px",
    color: "#444",
    lineHeight: "1.6",
  },
};

export default Progress;