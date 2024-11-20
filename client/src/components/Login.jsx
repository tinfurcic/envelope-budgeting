import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import Logout from "./Logout";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");


  const handleSignup = async (event, email, password) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', userCredential.user);
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  const handleLogin = async (event, email, password) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user);
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  return (
    <div>
      <h2>Log in:</h2>
      <form name="login" onSubmit={(e) => handleLogin(e, loginEmail, loginPassword)}>
      <label>E-mail:</label>
        <input
          type="text"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button type="submit">Log in</button>
        </form>
      
      <h2>Sign up:</h2>
      <form name="signup" onSubmit={(e) => handleSignup(e, signupEmail, signupPassword)}>
      <label>E-mail:</label>
        <input
          type="text"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
        />
        <button type="submit">Sign up</button>
      </form>
      <Logout />

    </div>
  );
}

export default Login;