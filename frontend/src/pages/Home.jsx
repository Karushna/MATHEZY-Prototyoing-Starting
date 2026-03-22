import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={styles.container}>
      <h1>Welcome to Mathezy</h1>

      <p style={styles.text}>
        Mathezy is an AI-powered learning platform designed to help students
        improve their math skills through interactive tutoring, practice
        exercises, and progress tracking.
      </p>

      <div style={styles.buttons}>
        <Link to="/login">
          <button style={styles.button}>Login</button>
        </Link>

        <Link to="/register">
          <button style={styles.button}>Register</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    padding: "20px"
  },
  text: {
    maxWidth: "600px",
    margin: "20px auto",
    fontSize: "18px",
    color: "#555"
  },
  buttons: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "20px"
  },
  button: {
    padding: "12px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px"
  }
};

export default Home;