import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { auth } from "../Backend/firebase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      //sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Fetch student info from Realtime Database
      const db = getDatabase();
      const studentRef = ref(db, "student/" + uid);
      const snapshot = await get(studentRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        localStorage.setItem("studentName", data.name);
        localStorage.setItem("studentID", data.studentID);
        localStorage.setItem("studentMajor", data.major);
        onLogin(); 
      } else {
        setMessage("Student data not found in database.");
      }
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
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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