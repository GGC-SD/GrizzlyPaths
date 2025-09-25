import { useEffect, useState } from "react";
import SoftHardSkills from "./SoftHardSkills";
import Course from "./Course";

export default function Dashboard({ onLogout, onViewCourses }) {
  const [studentName, setStudentName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [studentMajor, setStudentMajor] = useState("");

  // Load student info from localStorage
  useEffect(() => {
    setStudentName(localStorage.getItem("studentName") || "Guest");
    setStudentID(localStorage.getItem("studentID") || "N/A");
    setStudentMajor(localStorage.getItem("studentMajor") || "Undecided");
  }, []);

  const handleMajorChange = (e) => {
    const major = e.target.value;
    if (major !== "Change Majors") {
      localStorage.setItem("studentMajor", major);
      setStudentMajor(major);
    }
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    onLogout(); // Call App's logout
  };

  const majors = [
    "Software Engineer",
    "Software Developer",
    "Systems and Cybersecurity",
    "Digital Media",
    "Data Science and Analytics",
    "Enterprise System"
  ];

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark">
          <div className="container-fluid">
          {/* Select for changing majors */}
          <select
            className="form-select form-select-sm"
            aria-label="small select example"
            onChange={handleMajorChange}
          >
            <option>Change Majors</option>
            {majors.map((major) => (
              <option key={major}>{major}</option>
            ))}
          </select>

          <div className="d-flex ms-auto">
            <button onClick={handleLogoutClick} className="btn my-btn-primary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mt-5">
        <h1 className="text-center">Welcome to Grizzly Path</h1>
        <h2 className="mb-3">My Dashboard</h2>

        <div className="row mt-4">
          {/* Profile Card */}
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Profile</h5>
                <p className="card-text">
                  Student Name: {studentName} <br />
                  Student ID: {studentID} <br />
                  Student Major: {studentMajor}
                </p>
                <button className="btn btn-outline-primary btn-sm">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <br />
        <Course />
        <br />
        <SoftHardSkills />
        <br />

        {/* Recommended Courses Button */}
        <button onClick={onViewCourses} className="btn btn-primary me-2">
          View Recommended Courses
        </button>

        {/* Timeline */}
        <div className="container py-5">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <ul className="timeline">
                <li>
                  <div className="card shadow-sm timelineContainer">
                    <div className="timeline-badge bg-success">Step 1</div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <h5>Hard Skills</h5>
                      </div>
                      <div className="timeline-body">
                        <p>Technical skills that are shown in work</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="card shadow-sm timelineContainer">
                    <div className="timeline-badge bg-success">Step 2</div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <h5>Soft Skills</h5>
                      </div>
                      <div className="timeline-body">
                        <p>Skills that are used in personal interactions</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="timelineModal"
        tabIndex="-1"
        aria-labelledby="timelineModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="timelineModalLabel">
                Step Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" id="modalBodyContent">
              <p>information from react should go in here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
