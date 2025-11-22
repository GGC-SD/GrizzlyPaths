/**
 * ForgotPassword Component
 * ------------------------
 * This component allows a user to reset their password through Firebase Authentication.
 * The user enters their email and receives a password reset link if the email is valid.
 *
 * Features:
 * - Validates email input before enabling submission.
 * - Sends a Firebase password reset email.
 * - Displays success or error messages based on Firebase response.
 * - Automatically redirects back to the login page after successful email dispatch.
 *
 * Workflow:
 * 1. User clicks "Send Reset Link".
 * 2. Firebase sends a password reset email if the account exists.
 * 3. UI displays success message and auto-navigates back to Login after 3 seconds.
 *
 * State Variables:
 * - email (string): Stores the user’s email input.
 * - message (string): Displays success/error feedback.
 * - success (boolean): Tracks whether the reset email was successfully sent.
 *
 * External Dependencies:
 * - Firebase Authentication (sendPasswordResetEmail)
 * - React Router (useNavigate) for navigation
 * - Bootstrap classes for UI styling
 */


import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../Backend/firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  //handle function
  //authenticate using email
  //if the email is valid, send the reset password link using that email
  //automatically redirect to the login page
  //if the email is invalid, send the error
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setMessage("Password reset link sent! Please check your email.");
      setTimeout(() => navigate("/"), 3000); 
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Forgot Password</h3>
        <p className="text-center text-muted">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!email || success}
          >
            {success ? "Email Sent" : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <div className="mt-3 text-center text-info">{message}</div>
        )}

        {!success && (
          <div className="mt-3 text-center">
            <button
              className="btn btn-link"
              onClick={() => navigate("/")}
            >
              ← Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


