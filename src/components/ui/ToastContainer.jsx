import React from "react";

function ToastContainer({ toasts, onClose }) {
  return (
    <div className="toast-container-bottom-right">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item ${toast.type || "info"}`}
        >
          {/* Optional: Icon indicator based on type */}
          <div className="toast-icon">
            {toast.type === "success" && "✓"}
            {toast.type === "error" && "✕"}
            {toast.type === "warning" && "⚠"}
            {toast.type === "info" && "ℹ"}
          </div>

          <div className="toast-content">
            {toast.title && <b className="toast-title">{toast.title}</b>}
            <p className="toast-message">{toast.message}</p>
          </div>

          {/* Close button */}
          {onClose && (
            <button 
              className="toast-close-btn" 
              onClick={() => onClose(toast.id)}
            >
              &times;
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;