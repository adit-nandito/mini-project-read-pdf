import React from "react";
import "./style.css";

const Button = (props) => {
  const { text, onClick, type, disabled } = props;
  return (
    <div>
      <button
        className="animated-button"
        onClick={onClick}
        type={type}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
