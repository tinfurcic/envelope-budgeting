import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import logoutImage from "../media/logout-32.png";

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="logout">
      <button className="logout__button">
        <img src={logoutImage ? logoutImage : "asdff"} alt="Log Out" />
      </button>
    </div>
  );
};

export default Logout;
