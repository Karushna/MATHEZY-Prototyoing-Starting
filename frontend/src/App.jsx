import { Routes, Route } from "react-router-dom";

// Import pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChatTutor from "./pages/ChatTutor";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<ChatTutor />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/progress" element={<Progress />} />
    </Routes>
  );
}

export default App;