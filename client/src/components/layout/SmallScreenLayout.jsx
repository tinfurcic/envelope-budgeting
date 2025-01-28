import React from "react";
import Navigation from "../Navigation";

const SmallScreenLayout = ({ children }) => (
  <div className="small-screen-layout">
    <div className="small-screen-layout__main">
      {children}
    </div>
    <div className="small-screen-layout__nav">
      <Navigation useText={false} />
    </div>
  </div>
);

export default SmallScreenLayout;
