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
        <h1>Dashboard</h1>
        <p>Welcome back! What would you like to do today?</p>
      </div>

      {/* CARDS */}
      <div style={styles.grid}>

        <Link to="/chat" style={styles.card}>
          <h3>🤖 AI Tutor</h3>
          <p>Get step-by-step help and explanations instantly.</p>
        </Link>

        <Link to="/practice" style={styles.card}>
          <h3>📝 Practice</h3>
          <p>Sharpen your skills with smart exercises.</p>
        </Link>

        <Link to="/progress" style={styles.card}>
          <h3>📊 Progress</h3>
          <p>Track your learning and performance over time.</p>
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
    fontWeight: "bold",
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
    padding: "6px 12px",
    background: "#555",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  header: {
    padding: "40px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    padding: "0 40px 40px",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "#111",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
};

export default Dashboard;