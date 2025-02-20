import { useState, useEffect } from "react";

const useCSSVariable = (variableName) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const varValue = rootStyles.getPropertyValue(variableName).trim();
    setValue(varValue);
  }, [variableName]);

  return value;
};

export default useCSSVariable;
