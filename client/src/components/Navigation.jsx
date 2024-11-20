import React from "react";
import NavButton from "./NavButton";

// on small screens, icons should be rendered instead
// e.g. house, cash/envelope, jar, star

const Navigation = () => {
  return (
    <nav className="navbar">
      <NavButton name="Home" />
      <NavButton name="Budget" />
      <NavButton name="Savings" />
      <NavButton name="Goals" />
    </nav>
  );
};

export default Navigation;
