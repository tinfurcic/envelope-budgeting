import React, { useEffect, useState } from "react";
import currenciesBasic from "../util/currencies-basic.json";
import Button from "./Button";

const CurrencyDropdown = () => {
  let initialValue = "";
  const [selectedValue, setSelectedValue] = useState(""); //change to null once you start fetching
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    //fetch the currency from the firebase
    // = selectedValue
    // = initialValue
  }, []);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    setHasChanged(selectedValue !== initialValue);
  }, [selectedValue, initialValue]);

  const handleSave = () => {
    // save to firebase
    // display saving.../success/error message
    // specifically disable submitting the empty string
    return;
  };

  return (
    <div className="currency-dropdown-container">
      <label htmlFor="currency-select">Currency</label>
      <select
        className="dropdown"
        name="currency-select"
        id="currency-select"
        onChange={handleChange}
      >
        {/*... or a custom dropdown? This one's not so pretty */}
        <option key="000" value=""></option>
        {Object.entries(currenciesBasic).map(([code]) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
      {hasChanged && selectedValue !== "" && (
        <div className="currency-dropdown-container__save-btn">
          <Button
            type="button"
            className="button"
            onClick={handleSave}
            variant="green"
            isDisabled={!hasChanged || selectedValue === ""}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default CurrencyDropdown;
