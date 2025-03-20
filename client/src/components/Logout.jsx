import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import Button from "./Button";

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
      <Button
        className="button button--red"
        onClick={handleLogout}
        //onTouchEnd={handleLogout}
      >
        Log out
      </Button>
    </div>
  );
};

export default Logout;
