import React, { useState } from "react";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import "../css/Auth.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const signUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.replace("/c_user");
    } catch (err) {
      console.error(err);
    }
  };
  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.replace("/c_user");
    } catch (err) {
      console.error(err);
    }
  };
  const resetPassword = async () => {
    if (!email) return alert("Please enter your email address");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent to your email address");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form className="auth-form" onSubmit={isSignUp ? signUp : signIn}>
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="auth-button">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <button className="auth-link" onClick={resetPassword}>
          Forgot your password?
        </button>
        <button
          className="toggle-button"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
  // return (
  //   <div className="App">
  //     <input
  //       type="email"
  //       placeholder="Email..."
  //       onChange={(e) => setEmail(e.target.value)}
  //       style={{ marginRight: "1px" }}
  //     ></input>
  //     <input
  //       type="password"
  //       placeholder="Password..."
  //       onChange={(e) => setPassword(e.target.value)}
  //       style={{ marginLeft: "1px" }}
  //     ></input>
  //     <div className="App">
  //       <button onClick={signIn} style={{ marginRight: "2px" }}>
  //         Sign In
  //       </button>
  //       <button onClick={signUp} style={{ marginLeft: "2px" }}>
  //         Sign Up
  //       </button>
  //     </div>
  //   </div>
  // );
}
