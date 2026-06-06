import React from "react";
import styled from "styled-components";

function Textarea({
  width = "300px",
  icon = "bi bi-chat-left-text",
  label = "",
  placeholder = "Enter ...",
  error = "",
  value,
  onChange,
  name,
  id,
  rows = 4,
}) {
  return (
    <StyledWrapper style={{ maxWidth: width }}>
      {label && (
        <label className="form-label fw-semibold" htmlFor={id}>
          {label}
        </label>
      )}

      <div className="group">
        {icon && <i className={`${icon} icon`} />}

        <textarea
          id={id}
          className={`textarea ${error ? "textarea-error" : ""} textarea`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          rows={rows}
        />
      </div>

      {error && <div className="error">{error}</div>}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .group {
    position: relative;
    width: 100%;
  }

  .textarea {
    width: 100%;
    padding: 12px 12px 12px 42px;
    border-radius: 10px;
    border: 1px solid #dee2e6;
    background: #f8f9fa;
    outline: none;
    transition: 0.2s ease;
    resize: vertical;
    min-height: 100px;
  }

  .textarea:focus {
    border-color: #0d6efd;
    background: #fff;
    box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.15);
  }

  .icon {
    position: absolute;
    left: 12px;
    top: 14px;
    color: #6c757d;
    pointer-events: none;
  }

  .error {
    margin-top: 5px;
    font-size: 13px;
    color: #dc3545;
  }

  .textarea-error {
    border: 2px solid #dc3545 !important;
    background: #fff;
  }
`;

export default Textarea;
