import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { auth } from "../Backend/firebase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [major, setMajor] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Create new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Store user data in Realtime Database
      const db = getDatabase();
      await set(ref(db, "student/" + uid), {
        name,
        studentID,
        major,
      });

      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 2500);
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const majors = [
    "Software Developer",
    "Systems and Cybersecurity",
    "Digital Media",
    "Data Science and Analytics",
    "Enterprise System"
  ];

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Create Account</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-0">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-1">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-1">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-1">
            <label className="form-label">Student ID</label>
            <input
              type="text"
              className="form-control"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              required
            />
          </div>

          <div className="mb-1">
          <label className="form-label">Major</label>
          <select
            className="form-control"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            required
          >
            <option value="" disabled>Select Major</option>
            <option value="Software Development">Software Development</option>
            <option value="Systems and Cybersecurity">Systems and Cybersecurity</option>
            <option value="Digital Media">Digital Media</option>
            <option value="Data Science and Analytics">Data Science and Analytics</option>
            <option value="Enterprise System">Enterprise System</option>
          </select>
        </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>

        <div className="mt-0 text-center">
          <button className="btn btn-link" onClick={() => navigate("/")}>
            ← Back to Login
          </button>
        </div>

        {message && <div className="mt-3 text-center text-info">{message}</div>}
      </div>
    </div>
  );
}
