import React, { useEffect, useMemo } from "react";
import { getMatchingColors } from "../util/getMatchingColors";

const Colors = ({ newEnvelopeColor, setNewEnvelopeColor }) => {
  const colors = useMemo(() => getMatchingColors("#e5a0a0"), []);

  const handleClick = (color) => {
    setNewEnvelopeColor(color);
  };

  useEffect(() => {
    if (colors[0]) {
      setNewEnvelopeColor(colors[0]);
    }
  }, [setNewEnvelopeColor, colors]);

  return (
    <>
      <p>Color</p>
      <div className="form-item__colors">
        {colors.map((color) => (
          <button
            type="button"
            className={`form-item__color-box ${newEnvelopeColor === color ? "active" : ""}`}
            style={{ backgroundColor: color }}
            key={color}
            onClick={() => handleClick(color)}
          ></button>
        ))}
      </div>
    </>
  );
};

export default Colors;
