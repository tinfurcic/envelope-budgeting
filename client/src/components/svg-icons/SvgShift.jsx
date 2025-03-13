import React from "react";

const SvgShift = ({ fillColor, strokeColor }) => {
  return (
    <div className="svg-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="100%"
        viewBox="1.5 1.5 21 21"
        width="100%"
      >
        <circle fill={fillColor} cx="12" cy="12" r="9" />
        <path
          fill={strokeColor}
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-13.5V9h-4v2h4v2.5l3.5-3.5zm-6 4L5.5 14 9 17.5V15h4v-2H9z"
        />
      </svg>
    </div>
  );
};

export default SvgShift;
