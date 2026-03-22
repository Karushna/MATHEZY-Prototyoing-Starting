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

        if (!user) {
          alert("❌ You must be logged in");
          return;
        }

        const querySnapshot = await getDocs(collection(db, "progress"));

        let totalQuestions = 0;
        let correctAnswers = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (data.userId === user.uid) {
            totalQuestions++;

            if (data.correct) {
              correctAnswers++;
            }
          }
        });

        setTotal(totalQuestions);
        setCorrect(correctAnswers);

        const acc =
          totalQuestions === 0
            ? 0
            : ((correctAnswers / totalQuestions) * 100).toFixed(2);

        setAccuracy(acc);

      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Your Progress</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.card}>
          <p><strong>Total Questions:</strong> {total}</p>
          <p><strong>Correct Answers:</strong> {correct}</p>
          <p><strong>Accuracy:</strong> {accuracy}%</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px"
  },
  card: {
    display: "inline-block",
    padding: "20px",
    background: "#f4f4f4",
    borderRadius: "10px",
    marginTop: "20px",
    minWidth: "250px"
  }
};

export default Progress;