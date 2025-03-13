import React from "react";

const Button = ({
  type = "button",
  className,
  extraStyle,
  onClick,
  isDisabled = false,
  children,
}) => {
  return (
    <button
      type={type}
      className={className}
      style={extraStyle}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export default Button;
