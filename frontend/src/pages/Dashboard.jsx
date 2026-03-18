import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div style={styles.container}>
      <h1>Welcome to Mathezy</h1>
      <p>Select what you want to do:</p>

      <div style={styles.grid}>
        
        <div style={styles.cardBox}>
          <Link to="/chat">
            <button style={styles.button}>AI Tutor</button>
          </Link>
          <p style={styles.text}>
            Get step-by-step explanations for math problems using AI.
          </p>
        </div>

        <div style={styles.cardBox}>
          <Link to="/practice">
            <button style={styles.button}>Practice</button>
          </Link>
          <p style={styles.text}>
            Practice math questions based on topics and difficulty.
          </p>
        </div>

        <div style={styles.cardBox}>
          <Link to="/progress">
            <button style={styles.button}>Progress</button>
          </Link>
          <p style={styles.text}>
            Track your performance and see your improvement over time.
          </p>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px"
  },
  grid: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "40px"
  },
  cardBox: {
    width: "200px"
  },
  button: {
    padding: "15px",
    width: "100%",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    background: "#4CAF50",
    color: "white",
    cursor: "pointer"
  },
  text: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#555"
  }
};

export default Dashboard;