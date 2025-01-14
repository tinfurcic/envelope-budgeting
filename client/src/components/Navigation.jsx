import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  const routeMap = [
    { name: "Home", path: "/home" },
    { name: "Envelopes", path: "/envelopes" },
    { name: "Goals", path: "/goals" },
  ];

  return (
    <nav className="navbar">
      {routeMap.map((route) => (
        <NavLink
          key={route.name}
          to={route.path}
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          {route.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
