import { useState } from "react";

export default function Login({ onLogin }) {
  const [studentName, setStudentName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentName.trim() && studentID.trim()) {
      localStorage.setItem("studentName", studentName);
      localStorage.setItem("studentID", studentID);
      onLogin();
    } else {
      setMessage("Please enter both name and ID!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Grizzly Path Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="studentname" className="form-label">Student Name</label>
            <input
              type="text"
              className="form-control"
              id="studentname"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="studentID" className="form-label">Student ID</label>
            <input
              type="number"
              className="form-control"
              id="studentID"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        {message && <div className="mt-3 text-center text-danger">{message}</div>}
      </div>
    </div>
  );
}
