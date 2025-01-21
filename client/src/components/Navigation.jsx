import React from "react";
import { NavLink } from "react-router-dom";
import homeIcon from "../media/home-nav-icon.png";
import envelopesIcon from "../media/envelopes-nav-icon.png";
import goalsIcon from "../media/goals-nav-icon.png";
import profileIcon from "../media/profile-nav-icon.png";

const Navigation = () => {
  const routeMap = [
    { name: "Home", path: "/home", src: homeIcon },
    { name: "Envelopes", path: "/envelopes", src: envelopesIcon },
    { name: "Goals", path: "/goals", src: goalsIcon },
    { name: "Profile", path: "/profile", src: profileIcon },
  ];

  return (
    <nav className="navbar">
      {routeMap.map((route) => (
        <NavLink
          key={route.name}
          to={route.path}
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <img src={route.src} alt={route.name} width="32" />
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;

//{route.name}
