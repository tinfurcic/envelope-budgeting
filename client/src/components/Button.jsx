import React from "react";

const Button = ({
  type,
  className,
  onClick,
  variant,
  isDisabled,
  children,
}) => {
  return (
    <button
      type={type}
      className={`${className} ${variant && `${className}--${variant}`}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export default Button;
