import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ type, className, navigateTo, variant, isDisabled, children }) => {
  const navigate = useNavigate();

  return (
    <button 
      type={type} 
      className={`${className} ${variant && `${className}--${variant}`}`} 
      onClick={navigateTo ? () => navigate(`${navigateTo}`) : null} 
      disabled={isDisabled} 
    >
      {children}
    </button>
  );
};

export default Button;