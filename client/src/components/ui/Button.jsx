import React from "react";

const Button = ({
  type = "button",
  className,
  extraStyle,
  onClick,
  //onTouchEnd,
  isDisabled = false,
  children,
}) => {
  return (
    <button
      type={type}
      className={className}
      style={extraStyle}
      onClick={onClick}
      //onTouchEnd={onTouchEnd}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export default Button;
