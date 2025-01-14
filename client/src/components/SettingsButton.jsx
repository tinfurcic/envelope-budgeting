import React from "react";
import gearIcon from "../media/gear-icon.png";

const SettingsButton = ({ handleClick, buttonText }) => {
  return (
    <button className="settings-button" onClick={handleClick}>
      <img
        src={gearIcon}
        alt="Gear Icon"
        className="settings-button__gear-icon"
        width="16"
      ></img>{" "}
      {buttonText}
    </button>
  );
};

export default SettingsButton;

//<span className="settings-button__gear-icon">⚙️</span>{buttonText}
