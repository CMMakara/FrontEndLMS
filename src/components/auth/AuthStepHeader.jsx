import React from "react";

const AuthStepHeader = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: "Email", icon: "bi-envelope-at" },
    { number: 2, label: "Verify OTP", icon: "bi-shield-check" },
    { number: 3, label: "Reset Password", icon: "bi-key" },
  ];

  return (
    <div className="w-100 mb-4 px-2">
      <div className="d-flex align-items-center justify-content-between position-relative">
        {/* Background Connecting Line */}
        <div
          className="position-absolute start-0 end-0 top-50 translate-middle-y"
          style={{
            height: "3px",
            background: "#e2e8f0",
            zIndex: 0,
            margin: "0 28px",
            borderRadius: "4px",
          }}
        >
          {/* Active progress track */}
          <div
            style={{
              height: "100%",
              width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
              background: "linear-gradient(90deg, #4f46e5, #00b4d8)",
              transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div
              key={step.number}
              className="d-flex flex-column align-items-center position-relative"
              style={{ zIndex: 1, minWidth: "70px" }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-circle transition-all shadow-sm"
                style={{
                  width: "40px",
                  height: "40px",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  transition: "all 0.3s ease",
                  background: isCompleted
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : isActive
                    ? "linear-gradient(135deg, #4f46e5, #00b4d8)"
                    : "#ffffff",
                  color: isCompleted || isActive ? "#ffffff" : "#64748b",
                  border: isActive
                    ? "2.5px solid #ffffff"
                    : isCompleted
                    ? "2.5px solid #ffffff"
                    : "2px solid #e2e8f0",
                  boxShadow: isActive
                    ? "0 4px 14px rgba(79, 70, 229, 0.4), 0 0 0 3px rgba(79, 70, 229, 0.15)"
                    : isCompleted
                    ? "0 4px 12px rgba(16, 185, 129, 0.3)"
                    : "0 2px 5px rgba(0, 0, 0, 0.04)",
                }}
              >
                {isCompleted ? (
                  <i className="bi bi-check-lg fw-bold" style={{ fontSize: "1.1rem" }} />
                ) : (
                  <i className={`bi ${step.icon}`} style={{ fontSize: "0.95rem" }} />
                )}
              </div>

              <span
                className="mt-2 text-center text-nowrap"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: isActive ? "700" : "600",
                  color: isActive ? "#4f46e5" : isCompleted ? "#0f172a" : "#94a3b8",
                  letterSpacing: "0.2px",
                  transition: "color 0.3s ease",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuthStepHeader;
