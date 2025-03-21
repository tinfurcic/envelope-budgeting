import React from "react";

const SvgEnvelopeStack = () => {
  return (
    <div className="svg-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="100%"
        viewBox="0 0 450 350"
      >
        <defs>
          <symbol xmlns="http://www.w3.org/2000/svg" id="a">
            <g stroke="#333" strokeWidth="2">
              <path fill="#c4c48b" d="M3 16h94v68H3V16z" />
              <path fill="#eaeaab" d="m4 16 34 33c7 7 15 7 23 0l35-33H4z" />
              <path fill="none" d="M96 84 59 51M4 84l36-33" />
            </g>
          </symbol>
        </defs>
        <g className="layer">
          <use
            href="#a"
            transform="matrix(2.31826 -1.81149 1.71937 2.20037 -24.2625 149.366)"
          />
          <use
            href="#a"
            transform="matrix(2.88563 -.573567 .544398 2.73888 112.118 91.0389)"
          />
          <use
            href="#a"
            transform="matrix(2.94208 0 0 2.79246 73.515 104.682)"
          />
        </g>
      </svg>
    </div>
  );
};

export default SvgEnvelopeStack;
