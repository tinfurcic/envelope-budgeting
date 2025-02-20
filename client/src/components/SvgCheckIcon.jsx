import React from "react";

const SvgCheckIcon = ({ fillColor, strokeColor }) => (
  <div className="svg-container">
    <svg
      width="100%"
      height="100%"
      viewBox="3 3 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.664 5.253a1 1 0 0 1 .083 1.411l-10.666 12a1 1 0 0 1-1.495 0l-5.333-6a1 1 0 0 1 1.494-1.328l4.586 5.159 9.92-11.16a1 1 0 0 1 1.411-.082z"
        fill={fillColor}
        stroke={strokeColor}
      />
    </svg>
  </div>
);

export default SvgCheckIcon;
