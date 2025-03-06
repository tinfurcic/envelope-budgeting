import React from "react";

const SvgDeleteIcon = ({ fillColor, strokeColor }) => {
  return (
    <div className="svg-container">
      <svg
        height="100%"
        viewBox="-0.5 -0.5 21 21"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform="translate(-2 -2)"
          stroke={strokeColor}
          strokeWidth="2"
          fill={fillColor}
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m15 9-6 6m6 0-6-6" />
        </g>
      </svg>
    </div>
  );
};

export default SvgDeleteIcon;
