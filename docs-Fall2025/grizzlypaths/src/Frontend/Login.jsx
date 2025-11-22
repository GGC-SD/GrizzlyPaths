/**
 * Login Component
 * ----------------
 * This component handles user authentication using Firebase Authentication
 * and retrieves associated student data stored in Firebase Realtime Database.
 *
 * Workflow:
 * 1. User enters email + password.
 * 2. signInWithEmailAndPassword() authenticates the user.
 * 3. Firebase returns a userCredential containing the UID.
 * 4. Using the UID, we retrieve the student's profile info from:
 *        Realtime Database → "student/<uid>"
 * 5. If data exists:
 *        - Save student info to localStorage
 *        - Call onLogin() to update the app state
 *    If not:
 *        - Display "Student data not found"
 *
 * Props:
 * - onLogin (function): Callback executed after successful login and data retrieval.
 *
 * State Variables:
 * - email: Stores the user's email input
 * - password: Stores the user's password input
 * - message: Stores success/error messages for UI feedback
 */

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { auth } from "../Backend/firebase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  /**
   * Handles form submission:
   * - prevents page reload
   * - performs Firebase Auth login
   * - retrieves student data from Realtime Database
   * - stores user info locally
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Authenticate the user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await auth.currentUser.getIdToken(true);

      // Retrieve student info from Realtime Database
      const db = getDatabase();
      const studentRef = ref(db, "student/" + uid);
      const snapshot = await get(studentRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        // student info store in the database
        localStorage.setItem("studentName", data.name);
        localStorage.setItem("studentID", data.studentID);
        localStorage.setItem("studentMajor", data.major);
        // Notify parent component login succeeded
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

          <h6><a href="/forgotpassword">Forgot Password?</a></h6>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        <h6 className="text-center"><a href="/signup">Don't have an account? Sign up</a></h6>

        {message && <div className="mt-3 text-center text-danger">{message}</div>}
      </div>
    </div>
  );
}
