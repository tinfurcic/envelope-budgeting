import React from "react";
import Navigation from "../Navigation";

const LargeScreenLayout = ({ children }) => (
  <div className="large-screen-layout">
    <Navigation useText={true}/>
    {children}
  </div>
);

export default LargeScreenLayout;
