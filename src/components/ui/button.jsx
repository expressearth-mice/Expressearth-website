import React from "react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-6 py-3 rounded-lg font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
