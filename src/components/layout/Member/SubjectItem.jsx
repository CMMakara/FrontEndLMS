import React from "react";

function SubjectItem({ title, iconClass, bgColor, count }) {
  return (
    <div className="col-6 col-sm-4 col-md-3 col-lg-2">
      <div
        className="card border-0 shadow-sm rounded-3 py-3 px-2 text-center h-100 d-flex flex-column align-items-center justify-content-center bg-white"
        style={{
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          borderBottom: `3px solid ${bgColor}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 0.125rem 0.25rem rgba(0,0,0,0.075)";
        }}
      >
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-sm"
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: `${bgColor}15`, // 15% opacity
            color: bgColor,
          }}
        >
          <i className={`bi ${iconClass} fs-4`}></i>
        </div>
        <span className="fw-bold text-dark small text-truncate w-100 px-1 mb-0">{title}</span>
        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
          {count} Books
        </small>
      </div>
    </div>
  );
}

export default SubjectItem;