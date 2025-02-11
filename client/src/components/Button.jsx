import React from "react";

const Button = ({
  type,
  className,
  extraStyle,
  onClick,
  isDisabled,
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
