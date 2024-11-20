import React from "react";
import { Link } from "react-router-dom";

const NavButton = ({ name }) => {
  const routeMap = {
    Home: "/home",
    Budget: "/budget",
    Savings: "/savings",
    Goals: "/goals",
  };

  // maybe I don't need a separate component for this after all. Consider moving back to Navigation.jsx

  return (
    <div className="button-wrapper">
      <Link to={routeMap[name]}>
        <button className="button-wrapper__button">{name}</button>
      </Link>
    </div>
  );
};

export default NavButton;
