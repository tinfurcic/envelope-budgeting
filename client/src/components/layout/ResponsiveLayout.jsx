import React, { useState } from "react";
import SmallScreenLayout from "./SmallScreenLayout";
import LargeScreenLayout from "./LargeScreenLayout";
import useScreenSize from "../../hooks/useScreenSize";
//import { useLocation } from "react-router-dom";

const ResponsiveLayout = ({ children }) => {
/*
  const location = useLocation();
  const navRoutes = ["/home", "/envelopes", "/goals", "/profile"];
  const isNavRoute = navRoutes.includes(location.pathname);
*/
  const { isSmall } = useScreenSize();

  return isSmall ? (
    <SmallScreenLayout>{children}</SmallScreenLayout>
  ) : (
    <LargeScreenLayout>{children}</LargeScreenLayout>
  );
};

export default ResponsiveLayout;

/*
{isNavRoute && <Navigation />}

{isNavRoute && <Navigation />}
*/