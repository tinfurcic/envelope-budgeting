import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../util/axios/axiosInstance";
import Logout from "./Logout";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (event, email, password) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      console.log("User signed up:", user);

      // Call the backend using axiosInstance
      await axiosInstance.post("/users", {
        uid: user.uid,
        email: user.email,
      });

      navigate("/home");
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  const handleLogin = async (event, email, password) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("User signed in:", userCredential.user);
      navigate("/home");
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <div>
      <h2>Log in:</h2>
      <form
        name="login"
        onSubmit={(e) => handleLogin(e, loginEmail, loginPassword)}
      >
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
      <form
        name="signup"
        onSubmit={(e) => handleSignup(e, signupEmail, signupPassword)}
      >
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
};

export default Login;
