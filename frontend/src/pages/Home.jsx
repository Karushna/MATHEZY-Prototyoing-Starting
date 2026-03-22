import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Mathezy</h2>

        <div style={styles.navRight}>
          <Link to="/login" style={styles.navLink}>Login</Link>
          <Link to="/register" style={styles.navBtn}>Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          The Smart Way to Learn Math
        </h1>

        <p style={styles.subtitle}>
          AI-powered tutoring, personalized practice, and real-time feedback —
          everything you need to master math faster.
        </p>

        <div style={styles.buttons}>
          <Link to="/register">
            <button style={styles.primaryBtn}>Start Learning</button>
          </Link>

          <Link to="/login">
            <button style={styles.secondaryBtn}>Login</button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Built for Modern Students</h2>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>⚡ Instant AI Help</h3>
            <p>Get step-by-step explanations instantly.</p>
          </div>

          <div style={styles.card}>
            <h3>📊 Track Progress</h3>
            <p>Visual insights to monitor your growth.</p>
          </div>

          <div style={styles.card}>
            <h3>🎯 Personalized Learning</h3>
            <p>Adaptive questions based on your level.</p>
          </div>

          <div style={styles.card}>
            <h3>🧠 Practice Smart</h3>
            <p>Focus on weak areas and improve faster.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.steps}>
        <h2 style={styles.sectionTitle}>How It Works</h2>

        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <span style={styles.stepNumber}>1</span>
            <h3>Sign Up</h3>
            <p>Create your account in seconds.</p>
          </div>

          <div style={styles.step}>
            <span style={styles.stepNumber}>2</span>
            <h3>Start Learning</h3>
            <p>Ask questions and practice instantly.</p>
          </div>

          <div style={styles.step}>
            <span style={styles.stepNumber}>3</span>
            <h3>Track Progress</h3>
            <p>See your improvement over time.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>
          Ready to level up your math skills?
        </h2>

        <Link to="/register">
          <button style={styles.primaryBtn}>Get Started Free</button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <h3>Mathezy</h3>
        <p>AI-powered math learning platform</p>
        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          © 2026 Mathezy. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Inter, Arial, sans-serif",
    background: "#ffffff",
    color: "#111",
  },

  /* NAVBAR */
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    position: "sticky",
    top: 0,
    background: "white",
    borderBottom: "1px solid #eee",
    zIndex: 100,
  },

  logo: {
    fontWeight: "bold",
    color: "#2e7d32",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  navLink: {
    textDecoration: "none",
    color: "#333",
  },

  navBtn: {
    padding: "8px 16px",
    background: "#4CAF50",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
  },

  /* HERO */
  hero: {
    textAlign: "center",
    padding: "120px 20px",
    background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
  },

  title: {
    fontSize: "48px",
    marginBottom: "20px",
  },

  subtitle: {
    fontSize: "20px",
    color: "#555",
    maxWidth: "700px",
    margin: "0 auto 30px",
  },

  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },

  primaryBtn: {
    padding: "14px 28px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },

  secondaryBtn: {
    padding: "14px 28px",
    background: "transparent",
    border: "2px solid #4CAF50",
    color: "#4CAF50",
    borderRadius: "8px",
    cursor: "pointer",
  },

  /* FEATURES */
  features: {
    padding: "100px 20px",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: "34px",
    marginBottom: "50px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  card: {
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #eee",
    background: "#fafafa",
  },

  /* STEPS */
  steps: {
    padding: "100px 20px",
    background: "#f9fafb",
    textAlign: "center",
  },

  stepsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },

  step: {
    maxWidth: "250px",
  },

  stepNumber: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#4CAF50",
  },

  /* CTA */
  cta: {
    textAlign: "center",
    padding: "100px 20px",
    background: "linear-gradient(135deg, #4CAF50, #2e7d32)",
    color: "white",
  },

  ctaTitle: {
    fontSize: "32px",
    marginBottom: "20px",
  },

  /* FOOTER */
  footer: {
    textAlign: "center",
    padding: "40px",
    background: "#111",
    color: "white",
  },
};

export default Home;