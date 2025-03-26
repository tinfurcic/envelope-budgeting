import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../util/axios/axiosInstance";
import Button from "../ui/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event, email, password) => {
    event.preventDefault();
    try {
      const authFunction = isNewUser
        ? createUserWithEmailAndPassword
        : signInWithEmailAndPassword;
      const userCredential = await authFunction(auth, email, password);
      console.log(
        `User ${isNewUser ? "signed up" : "logged in"}:`,
        userCredential.user,
      );

      if (isNewUser) {
        const user = userCredential.user;
        await axiosInstance.post("/users", {
          uid: user.uid,
          email: user.email,
        });
      }

      navigate("/home");
    } catch (error) {
      console.error(
        `Error ${isNewUser ? "signing up" : "logging in"}:`,
        error.message,
      );
    }
  };

  const toggleIsNewUser = () => {
    setIsNewUser(!isNewUser);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-page">
      <h1 className="login-page__greeting">
        {isNewUser ? "Sign up" : "Log in"}
      </h1>
      <p
        className="login-page__switch-mode"
        onClick={toggleIsNewUser}
        //onTouchEnd={toggleIsNewUser}
      >
        {isNewUser ? "Already have an account?" : "Don't have an acount yet?"}
      </p>
      <form
        className="login-page__form"
        name={isNewUser ? "signup" : "login"}
        onSubmit={(e) => handleSubmit(e, email, password)}
      >
        <label htmlFor="email">E-mail:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          name="email"
          className="form-input"
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          name="password"
          className="form-input"
        />
        <div className="login-page__form__submit-btn">
          <Button type="submit" className="button button--login">
            {isNewUser ? "Sign up" : "Log in"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
