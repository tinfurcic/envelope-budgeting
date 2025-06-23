import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = ({ useText }) => {
  const routeMap = [
    { name: "Home", path: "/home", iconId: "home" },
    { name: "Envelopes", path: "/envelopes", iconId: "mail" },
    { name: "Goals", path: "/goals", iconId: "star" },
    { name: "Profile", path: "/profile", iconId: "user" },
  ];

  return (
    <nav className={`navbar ${useText ? "navbar--text" : "navbar--icon"}`}>
      {routeMap.map((route) => (
        <NavLink
          key={route.name}
          to={route.path}
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <div className="nav-content">
            {!useText && (
              <svg width="44" height="44" aria-hidden="true">
                <use href={`#${route.iconId}`} />
              </svg>
            )}
            <span className="nav-name">{route.name}</span>
          </div>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
