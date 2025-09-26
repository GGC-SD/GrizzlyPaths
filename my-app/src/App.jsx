import { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import RecommendCourse from "./RecommendCourse";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard"); // dashboard | courses

  useEffect(() => {
    const name = localStorage.getItem("studentName");
    const id = localStorage.getItem("studentID");
    if (name && id) setLoggedIn(true);
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setCurrentPage("dashboard");
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentPage === "dashboard") {
    return <Dashboard onLogout={handleLogout} onViewCourses={() => setCurrentPage("courses")} />;
  }

  if (currentPage === "courses") {
    return <RecommendCourse onBack={() => setCurrentPage("dashboard")} />;
  }

  return null;
}
