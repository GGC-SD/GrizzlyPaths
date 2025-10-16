// import { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "./Login";
// import Dashboard from "./Dashboard";
// import RecommendCourse from "./RecommendCourse";
// import AboutUS from "./AboutUS";
// import RoadMap from "./Roadmap";
// import Write from "./Component/Write";

// export default function App() {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [currentPage, setCurrentPage] = useState("dashboard"); // dashboard | courses

//   useEffect(() => {
//     const name = localStorage.getItem("studentName");
//     const id = localStorage.getItem("studentID");
//     if (name && id) setLoggedIn(true);
//   }, []);

//   const handleLogin = () => {
//     setLoggedIn(true);
//     setCurrentPage("dashboard");
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     setLoggedIn(false);
//     setCurrentPage("dashboard");
//   };

//   if (!loggedIn) {
//     return <Login onLogin={handleLogin} />;
//   }

      
//   if (currentPage === "dashboard"){
//     return(
//       <Dashboard
//         onLogout={handleLogout}
//         onViewCourses={() => setCurrentPage("courses")}
//         onAboutUS={() => setCurrentPage("AboutUS")}
//         onViewRoadMap={() => setCurrentPage("roadmap")}
//             />
//           );
//         }


//         if (currentPage === "courses") {
//           return <RecommendCourse onBack={() => setCurrentPage("dashboard")} />;
//         }

//         if (currentPage === "roadmap") {
//           return <RoadMap onBack={() => setCurrentPage("dashboard")} />;
//         }

//         if (currentPage === "AboutUS") {
//           return <AboutUS onBack={() => setCurrentPage("dashboard")} />;
//         }
      
//   return null;
// }

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import RecommendCourse from "./RecommendCourse";
import AboutUS from "./AboutUS";
import RoadMap from "./Roadmap";
import Write from "./Component/Write";
import Read from "./Component/Read";
import MajorUploader from "./Component/ImportMajors";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("studentName");
    const id = localStorage.getItem("studentID");
    if (name && id) setLoggedIn(true);
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              onLogout={handleLogout}
              onViewCourses={() => window.location.href = "/courses"}
              onAboutUS={() => window.location.href = "/about"}
              onViewRoadMap={() => window.location.href = "/roadmap"}
            />
          }
        />
        <Route path="/import" element={<Read/>} />
        <Route path="/courses" element={<RecommendCourse onBack={() => window.location.href = "/"} />} />
        <Route path="/roadmap" element={<RoadMap onBack={() => window.location.href = "/"} />} />
        <Route path="/about" element={<AboutUS onBack={() => window.location.href = "/"} />} />
        <Route path="/write" element={<Write />} />
        <Route path="/major" element={<MajorUploader />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

