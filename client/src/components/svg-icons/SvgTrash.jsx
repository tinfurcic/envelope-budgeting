import React from "react";

const SvgTrash = ({ fillColor, strokeColor }) => {
  return (
    <div className="svg-container">
      <svg
        width="100%"
        height="100%"
        viewBox="-160 -160 768 832"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle fill={fillColor} cx="224" cy="256" r="366" />
        <path d="M53.21 467c1.562 24.84 23.02 45 47.9 45h245.8c24.88 0 46.33-20.16 47.9-45L416 128H32L53.21 467zM432 32H320l-11.58-23.16c-2.709-5.42-8.25-8.844-14.31-8.844H153.9c-6.061 0-11.6 3.424-14.31 8.844L128 32H16c-8.836 0-16 7.162-16 16V80c0 8.836 7.164 16 16 16h416c8.838 0 16-7.164 16-16V48C448 39.16 440.8 32 432 32z" />
      </svg>
    </div>
  );
};

export default SvgTrash;
