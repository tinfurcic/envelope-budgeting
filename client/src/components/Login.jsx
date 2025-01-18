import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../util/axios/axiosInstance";
import Button from "./Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event, email, password) => {
    event.preventDefault();
    try {
      const authFunction = isNewUser ? createUserWithEmailAndPassword : signInWithEmailAndPassword; // looks mighty sus
      const userCredential = await authFunction (auth, email, password);
      console.log(`User ${isNewUser ? "signed up" : "logged in"}:`, userCredential.user);

      if(isNewUser) {
        const user = userCredential.user;
        await axiosInstance.post("/users", {
          uid: user.uid,
          email: user.email,
        });
      }

      navigate("/home");
    } catch (error) {
      console.error(`Error ${isNewUser ? "signing up" : "logging in"}:`, error.message);
    }
  }

  const toggleIsNewUser = () => {
    setIsNewUser(!isNewUser);
    setEmail("");
    setPassword("");
  }

  return (
    <div className="login-page">
      <h1 className="login-page__greeting">
        {isNewUser ? "Sign up" : "Log in"}
      </h1>
      <p className="login-page__switch-mode" onClick={toggleIsNewUser} >{isNewUser ? "Already have an account?" : "Don't have an acount yet?"}</p>
      <form
        className="login-page__form"
        name={isNewUser ? "signup" : "login"}
        onSubmit={(e) => handleSubmit(e, email, password)}
      >
        <label htmlFor="email" >E-mail:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          name="email"
        />
        <label htmlFor="password" >Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          name="password"
        />
        <div className="login-page__form__submit-btn">
          <Button type="submit" className="button" navigateTo={null} variant="login" isDisabled={false} >
            {isNewUser ? "Sign up" : "Log in"}
          </Button>
        </div>
      </form>
    </div>
  );

  /*

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
    <div className="login-page">
      <h2>Log in:</h2>
      <form
        name="login"
        onSubmit={(e) => handleLogin(e, loginEmail, loginPassword)}
      >
        <label htmlFor="email" >E-mail:</label>
        <input
          type="text"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          id="email"
          name="email"
        />
        <label htmlFor="password" >Password:</label>
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          id="password"
          name="password"
        />
        <button type="submit">Log in</button>
      </form>

      <h2>Sign up:</h2>
      <form
        name="signup"
        onSubmit={(e) => handleSignup(e, signupEmail, signupPassword)}
      >
        <label htmlFor="email" >E-mail:</label>
        <input
          type="text"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
          id="email"
          name="email"
        />
        <label htmlFor="password" >Password:</label>
        <input
          type="password"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          id="password"
          name="password"
        />
        <button type="submit">Sign up</button>
      </form>
      <Logout />
    </div>
  );
*/

};

export default Login;
