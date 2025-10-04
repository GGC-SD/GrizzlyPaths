import { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import RecommendCourse from "./RecommendCourse";
import AboutUS from "./AboutUS";

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

  if (currentPage === "dashboard"){
    return(
      <Dashboard
        onLogout={handleLogout}
        onViewCourses={() => setCurrentPage("courses")}
        onAboutUS={() => setCurrentPage("AboutUS")}
      />
    );
  }

  //if (currentPage === "dashboard") {
    //return <Dashboard onLogout={handleLogout} onViewCourses={() => setCurrentPage("courses")} />;
  //}

  if (currentPage === "courses") {
    return <RecommendCourse onBack={() => setCurrentPage("dashboard")} />;
  }

  if (currentPage === "AboutUS") {
    return <AboutUS onBack={() => setCurrentPage("dashboard")} />;
  }

  return null;
}
