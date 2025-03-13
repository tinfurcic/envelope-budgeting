import React, { useState, useEffect, useRef } from "react";

const ProgressBar = ({
  whole,
  part,
  secondPart,
  thin = false,
  loading,
  syncing,
}) => {
  const barRef = useRef(null);
  const negativeBarRef = useRef(null);
  const positiveBarRef = useRef(null);

  const prevSecondPartRef = useRef(null);
  const transitions = useRef(null);

  const [percentage, setPercentage] = useState(0);
  const [negativePercentage, setNegativePercentage] = useState(0);
  const [positivePercentage, setPositivePercentage] = useState(0);

  const fakeCurrency = "€";

  // --- Set percentages ---
  useEffect(() => {
    setPercentage(Math.round((part * 100) / whole));
  }, [part, whole]);

  useEffect(() => {
    if (secondPart !== undefined) {
      if (secondPart > 0) {
        setPositivePercentage(Math.round((secondPart * 100) / whole));
        setNegativePercentage(0);
      } else if (secondPart < 0) {
        setPositivePercentage(0);
        setNegativePercentage(Math.round((Math.abs(secondPart) * 100) / part));
      } else {
        setNegativePercentage(0);
        setPositivePercentage(0);
      }
    }
  }, [part, secondPart, whole]);

  // --- Recalculate bar widths ---
  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.setProperty("--bar-width", `${percentage}%`);
    }
  }, [percentage]);

  useEffect(() => {
    if (negativeBarRef.current) {
      negativeBarRef.current.style.setProperty(
        "--negative-bar-width",
        `${negativePercentage}%`,
      );
    }
  }, [negativePercentage]);

  useEffect(() => {
    if (positiveBarRef.current) {
      positiveBarRef.current.style.setProperty(
        "--positive-bar-width",
        `${positivePercentage}%`,
      );
    }
  }, [positivePercentage]);

  // --- Define transitions ---
  useEffect(() => {
    if (prevSecondPartRef.current !== null) {
      if (prevSecondPartRef.current < 0 && secondPart > 0) {
        const redDuration = Number(
          (
            Math.abs(prevSecondPartRef.current) /
            (Math.abs(prevSecondPartRef.current) + secondPart)
          ).toFixed(3),
        );
        const greenDuration = Number(
          (
            secondPart /
            (Math.abs(prevSecondPartRef.current) + secondPart)
          ).toFixed(3),
        );
        transitions.current = {
          bar: {
            transition: `width ${greenDuration}s ${redDuration}s linear`,
          },
          negativeBar: {
            transition: `width ${redDuration}s linear`,
          },
          positiveBar: {
            transition: `width ${greenDuration}s ${redDuration}s linear`,
          },
        };
      } else if (prevSecondPartRef.current > 0 && secondPart < 0) {
        const greenDuration = Number(
          (
            prevSecondPartRef.current /
            (prevSecondPartRef.current + Math.abs(secondPart))
          ).toFixed(3),
        );
        const redDuration = Number(
          (
            Math.abs(secondPart) /
            (prevSecondPartRef.current + Math.abs(secondPart))
          ).toFixed(3),
        );
        transitions.current = {
          bar: {
            transition: `width ${greenDuration}s linear`,
          },
          negativeBar: {
            transition: `width ${redDuration}s ${greenDuration}s linear`,
          },
          positiveBar: {
            transition: `width ${greenDuration}s linear`,
          },
        };
      } else {
        transitions.current = {};
      }
    }
    prevSecondPartRef.current = secondPart;
  }, [secondPart]);

  return (
    <div className={`progress-bar progress-bar--${thin ? "thin" : ""}`}>
      <div
        ref={barRef}
        className="progress-bar__bar"
        style={transitions?.current?.bar}
      >
        {secondPart !== undefined && (
          <div
            ref={negativeBarRef}
            className="progress-bar__negative-bar"
            style={transitions?.current?.negativeBar}
          ></div>
        )}
      </div>
      {secondPart !== undefined && (
        <div
          ref={positiveBarRef}
          className="progress-bar__positive-bar"
          style={transitions?.current?.positiveBar}
        ></div>
      )}
      <span className="progress-bar__percentage">
        {loading
          ? "Loading data..."
          : syncing
            ? "Syncing data..."
            : whole !== 0
              ? `${fakeCurrency}${secondPart !== undefined ? part + secondPart : part} / ${fakeCurrency}${whole}`
              : "Your assigned budget is 0"}
      </span>
    </div>
  );
};

export default ProgressBar;
