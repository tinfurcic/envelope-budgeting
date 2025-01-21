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
        type="button"
        className="button"
        onClick={handleLogout}
        variant="red"
        isDisabled={false}
      >
        Log out
      </Button>
    </div>
  );
};

export default Logout;
