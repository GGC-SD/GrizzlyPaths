import { useEffect, useState } from "react";
import { ref, update } from "firebase/database";
import { auth, database } from "../Backend/firebase";
//import { Link } from "react-router-dom";
//import MajorUploader from "./Component/ImportMajors";
//import ReadCourses from "./Component/ImportCourse";

export default function Dashboard({ onLogout, onViewCourses, onAboutUS, onViewRoadMap }) {
  const [studentName, setStudentName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [studentMajor, setStudentMajor] = useState("");

  // Load student info from localStorage
  useEffect(() => {
    setStudentName(localStorage.getItem("studentName") || "Guest");
    setStudentID(localStorage.getItem("studentID") || "N/A");
    setStudentMajor(localStorage.getItem("studentMajor") || "Undecided");
  }, []);

  const handleMajorChange = async (e) => {
    const major = e.target.value;
    if (major !== "Change Majors") {
      setStudentMajor(major);
      localStorage.setItem("studentMajor", major);
      const user = auth.currentUser;
      if (!user) {
      console.error("No user logged in");
      return;
    }
    try{
      const studentRef = ref(database, "student/" + user.uid);
      await update(studentRef, {major});
      console.log("Major updated in Firebase:", major);
    } catch(error){
      console.error("Error updating major:", error);
    }
  }
};

  const handleLogoutClick = () => {
    localStorage.clear();
    onLogout(); 
  };

  const majors = [
    "Software Developer",
    "Systems and Cybersecurity",
    "Digital Media",
    "Data Science and Analytics",
    "Enterprise System"
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg bg-dark">
          <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Select for changing majors */}
          <select
            className="form-select form-select-sm"
            aria-label="small select example"
            value={studentMajor}
            onChange={handleMajorChange}
          >
            <option disabled>Change Majors</option>
            {majors.map((major) => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>

          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="bi bi-person-circle"></i>
            </button>

            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
              <a className="dropdown-item" onClick={onAboutUS} >About Us</a>
              <a className="dropdown-item" onClick={handleLogoutClick} >Logout</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mt-5">
        <h1 className="text-center">Welcome to Grizzly Path</h1>
        <hr/>
        <h2 className="mb-3">My Dashboard</h2>
        <div className="row mt-4 align-items-stretch">
          <div className="col-md-4 mb-3 flex">
            <div className="card shadow-sm flex-fill">
              <h5 className="card-header bg-secondary text-light text-center">
                <i className="bi bi-person"></i>
                Student Information
                </h5>
                <div className="card-body d-flex flex-column justify-content-center text-center">
                  <p className="mb-1">Student Name: {studentName} </p> 
                  <p className="mb-1">Student ID: {studentID}</p>
                  <p className="mb-1">Student Major: {studentMajor}</p>
                </div>
            </div>
          </div>
        
          <div className="col-md-4 mb-3 d-flex">
            <div className="card shadow-sm flex-fill">
              <h5 className="card-header bg-secondary text-light text-center">
                <i class="bi bi-card-checklist me-1"></i>
                Course
                </h5>
              <div className="card-body py-3s">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-1"><a href="" onClick={(e) => {
                          e.preventDefault();
                          onViewCourses();
                          }}
                      > Recommend Course </a>
                    </li>
                    <li><a href="" onClick={(e) => {
                          e.preventDefault();
                          onViewRoadMap();
                          }}
                      >RoadMap</a>
                    </li>
                  </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
      <footer className="mt-auto">
        <div className="footer-row">
          <p>&copy; <b>2025 Georgia Gwinnett College GrizzlyPath</b></p>
        </div>
      </footer>
    </div>
);
}