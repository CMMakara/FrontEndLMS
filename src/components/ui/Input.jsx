import React, { useState } from "react";
import styled from "styled-components";

const Input = ({
  width = "300px",
  icon = "bi bi-person",
  label = "",
  type = "text",
  placeholder = "Enter ...",
  error = "",
  value,
  onChange,
  name,
  id,
}) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  const inputType = isPassword
    ? show
      ? "text"
      : "password"
    : type;

  return (
    <StyledWrapper style={{ maxWidth: width }}>
      {label && <label className="form-label fw-semibold" htmlFor={id}>{label}</label>}

      <div className="group">
        {icon && <i className={`${icon} icon`} />}

        <input
          id={id}
          className={`input ${error ? "input-error" : ""}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
        />

        {isPassword && (
          <i
            className={`toggle bi ${show ? "bi-eye" : "bi-eye-slash"}`}
            onClick={() => setShow((s) => !s)}
          />
        )}
      </div>

      {error && <div className="error">{error}</div>}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .group {
    position: relative;
    width: 100%;
  }

  .input {
    width: 100%;
    height: 46px;
    padding-left: 42px;
    padding-right: 42px;
    border-radius: 10px;
    border: 1px solid #dee2e6;
    background: #f8f9fa;
    outline: none;
    transition: 0.2s ease;
  }

  .input:focus {
    border-color: #0d6efd;
    background: #fff;
    box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.15);
  }

  .icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
    pointer-events: none;
  }

  .toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #6c757d;
  }

  .error {
    margin-top: 5px;
    font-size: 13px;
    color: #dc3545;
  }

  .input-error {
    border: 2px solid #dc3545 !important;
    background: #fff;
  }

  .input-error:focus {
    border: 2px solid #dc3545 !important;
    box-shadow: 0 0 0 0.15rem rgba(220, 53, 69, 0.15);
  }
`;

export default Input;