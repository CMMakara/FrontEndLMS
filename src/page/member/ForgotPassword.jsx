import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUserAuth from "../../hook/useAuth";
import AuthStepHeader from "../../components/auth/AuthStepHeader";

const ForgotPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { forgotPassword } = useUserAuth();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const savedEmail =
      location.state?.email ||
      sessionStorage.getItem("forgot_email") ||
      localStorage.getItem("forgot_email") ||
      "";
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, [location.state]);

  const validate = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Email address is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const cleanEmail = email.trim();
      const res = await forgotPassword(cleanEmail);

      if (res !== false) {
        sessionStorage.setItem("forgot_email", cleanEmail);
        localStorage.setItem("forgot_email", cleanEmail);
        navigate("/otp-forgot", { state: { email: cleanEmail } });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 position-relative px-3 py-4"
      style={{
        backgroundColor: "#f4f7fc",
        backgroundImage: `
          radial-gradient(at 10% 15%, rgba(79, 70, 229, 0.07) 0px, transparent 40%),
          radial-gradient(at 90% 85%, rgba(6, 182, 212, 0.07) 0px, transparent 40%)
        `,
      }}
    >
      {/* Quick Back to Sign In Button */}
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="btn btn-white position-absolute top-0 start-0 m-3 m-md-4 rounded-circle shadow-sm d-flex align-items-center justify-content-center border"
        style={{
          width: "44px",
          height: "44px",
          background: "#ffffff",
          borderColor: "#e2e8f0",
          color: "#475569",
          transition: "all 0.25s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateX(-3px)";
          e.currentTarget.style.color = "#4f46e5";
          e.currentTarget.style.borderColor = "#4f46e5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateX(0)";
          e.currentTarget.style.color = "#475569";
          e.currentTarget.style.borderColor = "#e2e8f0";
        }}
        title="Back to Sign In"
      >
        <i className="bi bi-arrow-left fs-5"></i>
      </button>

      {/* Main Card */}
      <div
        className="card border-0 bg-white position-relative shadow-lg overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "470px",
          borderRadius: "24px",
          boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.1), 0 0 1px rgba(15, 23, 42, 0.1)",
        }}
      >
        {/* Top Color Accent Line */}
        <div
          className="w-100"
          style={{
            height: "5px",
            background: "linear-gradient(90deg, #4f46e5, #00b4d8, #10b981)",
          }}
        />

        <div className="card-body p-4 p-sm-5">
          {/* Progress Stepper */}
          <AuthStepHeader currentStep={1} />

          {/* Icon Header */}
          <div className="text-center mb-3">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-4 mb-2 shadow-sm"
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(6, 182, 212, 0.15))",
                border: "1px solid rgba(79, 70, 229, 0.2)",
              }}
            >
              <i className="bi bi-key-fill fs-2" style={{ color: "#4f46e5" }}></i>
            </div>
            <h3 className="fw-bold mt-2 text-dark mb-1" style={{ letterSpacing: "-0.5px" }}>
              Forgot Password?
            </h3>
            <p className="text-muted small mb-0" style={{ lineHeight: "1.5" }}>
              Enter your registered email address and we'll send a 6-digit verification code to reset your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4" noValidate>
            <div className="mb-3 text-start">
              <label htmlFor="email" className="form-label small fw-semibold text-secondary mb-1">
                Email Address
              </label>

              <div className="position-relative">
                <i
                  className="bi bi-envelope position-absolute top-50 translate-middle-y"
                  style={{
                    left: "14px",
                    color: emailError ? "#ef4444" : "#94a3b8",
                    fontSize: "1.1rem",
                    transition: "color 0.2s",
                  }}
                />
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  className={`form-control ${emailError ? "is-invalid" : ""}`}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  onBlur={validate}
                  style={{
                    height: "50px",
                    paddingLeft: "44px",
                    paddingRight: "16px",
                    background: "#f8fafc",
                    border: emailError ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    transition: "all 0.2s ease",
                  }}
                />
              </div>

              {emailError && (
                <div className="d-flex align-items-center text-danger small mt-1">
                  <i className="bi bi-exclamation-circle-fill me-1" style={{ fontSize: "0.85rem" }}></i>
                  {emailError}
                </div>
              )}
            </div>

            {/* Info Hint Callout */}
            <div
              className="p-3 mb-4 rounded-3 d-flex align-items-start gap-2"
              style={{
                background: "#f0fdfa",
                border: "1px solid #ccfbf1",
              }}
            >
              <i className="bi bi-info-circle-fill text-info mt-0.5" style={{ fontSize: "1rem" }}></i>
              <small className="text-secondary" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
                Make sure you have access to this inbox. Check your Spam or Junk folder if you do not see the email within 1 minute.
              </small>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="btn w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 text-white shadow"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #00b4d8 100%)",
                border: "none",
                borderRadius: "14px",
                fontSize: "0.95rem",
                letterSpacing: "0.3px",
                transform: isHovered && !submitting ? "translateY(-2px)" : "translateY(0)",
                boxShadow: isHovered
                  ? "0 10px 25px rgba(79, 70, 229, 0.4)"
                  : "0 4px 15px rgba(79, 70, 229, 0.2)",
                transition: "all 0.25s ease",
              }}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <i className="bi bi-arrow-right fs-6"></i>
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
            <span className="text-muted small">Remember your password?</span>{" "}
            <button
              type="button"
              className="btn btn-link p-0 fw-bold text-decoration-none small ms-1"
              style={{ color: "#4f46e5" }}
              onClick={() => navigate("/login")}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;