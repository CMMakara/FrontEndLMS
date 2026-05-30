import React from "react";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  saveText = "Save Changes",
  size = "",
  btnColorSave = 'btn-primary'
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.3)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className={`modal-dialog modal-dialog-centered ${size}`}>
        <div className="modal-content border-0 shadow-lg rounded-4">
          
          {/* Header */}
          <div className="modal-header border-bottom-0 pt-4 px-4 pb-2">
            <h5 className="modal-title fw-bold fs-4 text-dark">
              {title}
            </h5>

            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body px-4 py-3 text-muted">
            {children}
          </div>

          {/* Footer */}
          <div className="modal-footer border-top-0 pb-4 px-4 pt-2">
            <button
              type="button"
              className="btn btn-light px-4 py-2 rounded-3 fw-medium text-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            {onSave && (
              <button
                type="button"
                className={`btn ${btnColorSave} px-4 py-2 rounded-3 fw-medium shadow-sm`}
                onClick={onSave}
              >
                {saveText}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Modal;