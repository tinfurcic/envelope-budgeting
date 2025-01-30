import React from "react";
import Navigation from "../Navigation";
import { useLocation } from "react-router-dom";

const LargeScreenLayout = ({ children }) => {
  const location = useLocation();
  const navRoutes = ["/home", "/envelopes", "/goals", "/profile"];
  const isNavRoute = navRoutes.includes(location.pathname);

  return (
    <div className="large-screen-layout">
      <div className="large-screen-layout__nav">
        {isNavRoute && <Navigation useText={true} />}
      </div>
      <div className="large-screen-layout__main">{children}</div>
    </div>
  );
};

export default LargeScreenLayout;
