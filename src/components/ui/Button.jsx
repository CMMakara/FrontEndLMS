import React from "react";
import { Spinner } from "react-bootstrap";

const Button = ({
  children = "click me",
  variant = "primary",
  size = "lg",
  loading = false,
  disabled = false,
  icon,
  className = "",
  type = "button",
  onClick,
}) => {
  const sizes = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizes[size]} d-inline-flex align-items-center gap-2 fw-semibold shadow-sm ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <Spinner animation="border" size="sm" />
          Loading...
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;