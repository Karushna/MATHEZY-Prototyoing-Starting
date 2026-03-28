import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.page}>
      
      {/* NAVBAR */}
      <nav style={styles.nav}>
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
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>
          Welcome back! Let’s continue learning 🚀
        </p>
      </div>

      {/* CARDS */}
      <div style={styles.grid}>

        {/* AI Tutor */}
        <Link to="/chat" style={{ ...styles.card, ...styles.cardGreen }}>
          <div style={styles.cardTop}>
            <span style={styles.icon}>🤖</span>
            <span style={styles.badge}>Smart Help</span>
          </div>

          <h3 style={styles.cardTitle}>AI Tutor</h3>
          <p style={styles.cardText}>
            Get step-by-step explanations instantly.
          </p>

          <span style={styles.cta}>Start Learning →</span>
        </Link>

        {/* Practice */}
        <Link to="/practice" style={{ ...styles.card, ...styles.cardBlue }}>
          <div style={styles.cardTop}>
            <span style={styles.icon}>📝</span>
            <span style={styles.badge}>Daily</span>
          </div>

          <h3 style={styles.cardTitle}>Practice</h3>
          <p style={styles.cardText}>
            Solve smart exercises and improve faster.
          </p>

          <span style={styles.cta}>Start Practice →</span>
        </Link>

        {/* Progress */}
        <Link to="/progress" style={{ ...styles.card, ...styles.cardPurple }}>
          <div style={styles.cardTop}>
            <span style={styles.icon}>📊</span>
            <span style={styles.badge}>Track</span>
          </div>

          <h3 style={styles.cardTitle}>Progress</h3>
          <p style={styles.cardText}>
            Monitor your growth and achievements.
          </p>

          <span style={styles.cta}>View Progress →</span>
        </Link>

      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Inter, Arial, sans-serif",
    background: "#f9fafb",
    minHeight: "100vh",
  },

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
    padding: "8px 14px",
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  header: {
    padding: "50px 40px 20px",
  },

  title: {
    fontSize: "36px",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#666",
    fontSize: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "25px",
    padding: "20px 40px 50px",
  },

  card: {
    padding: "28px",
    borderRadius: "18px",
    textDecoration: "none",
    color: "#111",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    transition: "all 0.25s ease",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  icon: {
    fontSize: "24px",
  },

  badge: {
    fontSize: "12px",
    background: "rgba(0,0,0,0.06)",
    padding: "4px 10px",
    borderRadius: "20px",
  },

  cardTitle: {
    fontSize: "20px",
    marginBottom: "8px",
  },

  cardText: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px",
  },

  cta: {
    fontSize: "14px",
    fontWeight: "600",
  },

  /* COLORS */
  cardGreen: {
    background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
  },

  cardBlue: {
    background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
  },

  cardPurple: {
    background: "linear-gradient(135deg, #f3e5f5, #ffffff)",
  },
};

export default Dashboard;