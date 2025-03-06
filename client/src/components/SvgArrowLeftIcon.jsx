import React from "react";

const SvgArrowLeftIcon = ({ fillColor, strokeColor }) => {
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
          <path d="m16 11h-5.66l1.25-1.31a1 1 0 0 0 -1.45-1.38l-2.86 3a1 1 0 0 0 -.09.13.72.72 0 0 0 -.11.19.88.88 0 0 0 -.06.28s-.02.09-.02.09a1 1 0 0 0 .08.38 1 1 0 0 0 .21.32l3 3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-1.3-1.28h5.59a1 1 0 0 0 0-2z" />
          <path d="m12 2a10 10 0 1 0 10 10 10 10 0 0 0 -10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1 -8 8z" />
        </g>
      </svg>
    </div>
  );
};

export default SvgArrowLeftIcon;
