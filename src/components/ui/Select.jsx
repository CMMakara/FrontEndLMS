import React from "react";
import styled from "styled-components";

const Select = ({
  width = "300px",
  icon = "bi bi-list",
  label = "",
  error = "",
  value,
  onChange,
  name,
  id,
  options = [],
}) => {
  return (
    <StyledWrapper style={{ maxWidth: width }}>
      {label && (
        <label className="form-label fw-semibold" htmlFor={id}>
          {label}
        </label>
      )}

      <div className="group">
        {icon && <i className={`${icon} icon`} />}

        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`select ${error ? "select-error" : ""}`}
        >
          {options.map((item) => (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>

        <i className="bi bi-chevron-down arrow" />
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

  .select {
    width: 100%;
    height: 46px;
    padding-left: 42px;
    padding-right: 42px;
    border-radius: 10px;
    border: 1px solid #dee2e6;
    background: #f8f9fa;
    outline: none;
    transition: 0.2s ease;
    appearance: none;
    cursor: pointer;
  }

  .select:focus {
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

  .arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
    pointer-events: none;
  }

  .error {
    margin-top: 5px;
    font-size: 13px;
    color: #dc3545;
  }

  .select-error {
    border: 2px solid #dc3545 !important;
    background: #fff;
  }
`;

export default Select;