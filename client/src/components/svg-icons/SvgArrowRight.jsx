import React from "react";

const SvgArrowRight = ({ fillColor, strokeColor }) => {
  return (
    <div className="svg-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="100%"
        viewBox="1.5 1.5 21 21"
        width="100%"
      >
        <circle fill={fillColor} cx="12" cy="12" r="9" />
        <g fill={strokeColor}>
          <path d="m17 12s0-.06 0-.09a.88.88 0 0 0 -.06-.28.72.72 0 0 0 -.11-.19 1 1 0 0 0 -.09-.13l-2.86-3a1 1 0 0 0 -1.45 1.38l1.23 1.31h-5.66a1 1 0 0 0 0 2h5.59l-1.3 1.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 .21-.32 1 1 0 0 0 .08-.39z" />
          <path d="m12 2a10 10 0 1 0 10 10 10 10 0 0 0 -10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1 -8 8z" />
        </g>
      </svg>
    </div>
  );
};

export default SvgArrowRight;
