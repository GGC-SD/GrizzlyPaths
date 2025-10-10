import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; 

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(); 
    } catch (error) {
      setMessage("Login failed: " + error.message);
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
