import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChatTutor from "./pages/ChatTutor";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";

// 🔐 Protected Route
function ProtectedRoute({ children }) {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatTutor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <Practice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;