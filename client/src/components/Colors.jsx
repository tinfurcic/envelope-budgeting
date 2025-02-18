import React, { useEffect, useMemo, useState } from "react";
import { getMatchingColors } from "../util/getMatchingColors";

const Colors = ({ newEnvelopeColor, setNewEnvelopeColor, currentColor = "#FFFFFF" }) => {
  const colors = useMemo(() => getMatchingColors("#e5a0a0"), []);

  const [currentColorIndex, setCurrentColorIndex] = useState(null);

  useEffect(() => {
    if (colors) {
      setCurrentColorIndex(colors.indexOf(currentColor));
    }
  }, [colors, currentColor, setCurrentColorIndex]);

  const handleClick = (color) => {
    setNewEnvelopeColor(color);
  };

  useEffect(() => {
    if (colors) {
      if (currentColorIndex === -1) {
        setNewEnvelopeColor(colors[0]);
      } else {
        setNewEnvelopeColor(colors[currentColorIndex]);
      }
    }
  }, [colors, currentColorIndex, setNewEnvelopeColor]);

  return (
    <>
      <div className="colors">
        {colors.map((color) => (
          <button
            type="button"
            className={`color-box ${newEnvelopeColor === color ? "active" : ""}`}
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
