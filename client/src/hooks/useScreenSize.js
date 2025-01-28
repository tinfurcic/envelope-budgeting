import { useState, useEffect } from "react";

const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isSmall: screenWidth <= 400,
    isLarge: screenWidth > 400,
    screenWidth,
  };
};

export default useScreenSize;
