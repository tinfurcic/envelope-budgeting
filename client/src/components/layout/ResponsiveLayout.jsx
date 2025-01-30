import React from "react";
import SmallScreenLayout from "./SmallScreenLayout";
import LargeScreenLayout from "./LargeScreenLayout";
import useScreenSize from "../../hooks/useScreenSize";

const ResponsiveLayout = ({ children }) => {
  const { isSmall } = useScreenSize();

  return isSmall ? (
    <SmallScreenLayout>{children}</SmallScreenLayout>
  ) : (
    <LargeScreenLayout>{children}</LargeScreenLayout>
  );
};

export default ResponsiveLayout;
