import React from "react";

const Card = ({
  header,
  children,
  footer,
  className = "",
  style = {},
  headerClass = "",
  bodyClass = "",
  footerClass = "",
}) => {
  return (
    <div
      className={`card border-0 shadow-sm rounded-4 w-100 ${className}`}
      style={{
        maxWidth: "420px",
        background: "#fff",
        ...style,
      }}
    >
      {/* HEADER */}
      {header && (
        <div className={`p-3 border-bottom ${headerClass}`}>
          {header}
        </div>
      )}

      {/* BODY */}
      <div className={`p-4 ${bodyClass}`}>{children}</div>

      {/* FOOTER */}
      {footer && (
        <div className={`p-3 border-top bg-light ${footerClass}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;