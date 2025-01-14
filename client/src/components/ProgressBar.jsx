import React, { useEffect, useRef } from "react";

const ProgressBar = ({ percentage }) => {
  const componentRef = useRef(null);

  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.style.setProperty("--bar-width", `${percentage}%`);
    }
  }, [percentage]);

  return (
    <div className="progress-bar-container">
      <div
        ref={componentRef}
        className="progress-bar-container__progress-bar"
      ></div>
      <span className="progress-bar-container__percentage">
        {percentage === Infinity ? "Loading..." : `${percentage}%`}
      </span>
    </div>
  );
};

export default ProgressBar;
