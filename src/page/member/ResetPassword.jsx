import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUserAuth from "../../hook/useAuth";
import AuthStepHeader from "../../components/auth/AuthStepHeader";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectCount, setRedirectCount] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useUserAuth();

  const email =
    location.state?.email ||
    sessionStorage.getItem("forgot_email") ||
    localStorage.getItem("forgot_email") ||
    "";
  const token =
    location.state?.token ||
    sessionStorage.getItem("forgot_token") ||
    localStorage.getItem("forgot_token") ||
    "";

  // Check requirements
  const hasLength = password.length >= 8;
  const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
  const hasNumber = /(?=.*\d)/.test(password);
  const hasSpecial = /(?=.*[@$!%*?&#^()_-])/.test(password);

  const strengthScore = [hasLength, hasUpperLower, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthInfo = () => {
    if (!password) return { label: "", color: "transparent", width: "0%" };
    switch (strengthScore) {
      case 1:
        return { label: "Weak", color: "#ef4444", width: "25%" };
      case 2:
        return { label: "Fair", color: "#f97316", width: "50%" };
      case 3:
        return { label: "Good", color: "#eab308", width: "75%" };
      case 4:
        return { label: "Strong", color: "#10b981", width: "100%" };
      default:
        return { label: "Weak", color: "#ef4444", width: "20%" };
    }
  };

  const strength = getStrengthInfo();

  useEffect(() => {
    if (!isSuccess) return;

    if (redirectCount === 0) {
      sessionStorage.removeItem("forgot_email");
      sessionStorage.removeItem("forgot_token");
      sessionStorage.removeItem("forgot_verified");
      localStorage.removeItem("forgot_email");
      localStorage.removeItem("forgot_token");
      navigate("/login");
      return;
    }

    const timer = setTimeout(() => {
      setRedirectCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSuccess, redirectCount, navigate]);

  const validate = () => {
    const errs = {};
    if (!password) {
      errs.password = "New password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setErrors({});

      const cleanEmail = email ? String(email).trim() : "";
      const cleanToken = token ? String(token).trim() : "";

      const payload = {
        email: cleanEmail,
        token: cleanToken,
        otp: cleanToken,
        otp_code: cleanToken,
        password,
        new_password: password,
        confirm_password: confirmPassword,
        confirmPassword: confirmPassword,
      };

      const res = await resetPassword(payload);

      if (res !== false) {
        setIsSuccess(true);
      }
    } catch (err) {
      setErrors({
        general:
          err?.response?.data?.message ||
          err?.response?.data?.data ||
          err?.response?.data?.msg ||
          "Failed to reset password. Please try again.",
      });
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
      {/* Main Card */}
      <div
        className="card border-0 bg-white position-relative shadow-lg overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "480px",
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
          <AuthStepHeader currentStep={3} />

          {isSuccess ? (
            /* Success View */
            <div className="text-center py-3">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-sm"
                style={{
                  width: "80px",
                  height: "80px",
                  background: "#dcfce7",
                  border: "2px solid #86efac",
                }}
              >
                <i className="bi bi-check-lg display-4 text-success"></i>
              </div>

              <h3 className="fw-bold text-dark mb-2" style={{ letterSpacing: "-0.5px" }}>
                Password Reset Successfully!
              </h3>

              <p className="text-muted small mb-4">
                Your account password has been updated. You will be automatically redirected to sign in in{" "}
                <span className="text-primary fw-bold">{redirectCount}s</span>.
              </p>

              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem("forgot_email");
                  sessionStorage.removeItem("forgot_token");
                  sessionStorage.removeItem("forgot_verified");
                  localStorage.removeItem("forgot_email");
                  localStorage.removeItem("forgot_token");
                  navigate("/login");
                }}
                className="btn w-100 py-3 fw-bold text-white shadow"
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  borderRadius: "14px",
                  fontSize: "0.95rem",
                }}
              >
                Sign In Now <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          ) : (
            /* Form View */
            <>
              {/* Header Icon */}
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
                  <i className="bi bi-lock-fill fs-2" style={{ color: "#4f46e5" }}></i>
                </div>
                <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.5px" }}>
                  Create New Password
                </h3>
                <p className="text-muted small mb-0">
                  Your identity has been verified. Choose a strong new password for your account.
                </p>

                {email && (
                  <div
                    className="d-inline-flex align-items-center gap-2 mt-2 px-3 py-1 rounded-pill border"
                    style={{
                      background: "#f8fafc",
                      borderColor: "#e2e8f0",
                      color: "#334155",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    <i className="bi bi-person-check text-primary"></i>
                    <span>{email}</span>
                  </div>
                )}
              </div>

              {/* General Error Banner */}
              {errors.general && (
                <div
                  className="mb-3 p-3 rounded-3 d-flex align-items-center gap-2 text-danger small text-start"
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                  }}
                >
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* New Password */}
                <div className="mb-3 text-start">
                  <label htmlFor="new-password" className="form-label small fw-semibold text-secondary mb-1">
                    New Password
                  </label>

                  <div className="position-relative">
                    <i
                      className="bi bi-lock position-absolute top-50 translate-middle-y"
                      style={{
                        left: "14px",
                        color: errors.password ? "#ef4444" : "#94a3b8",
                        fontSize: "1.1rem",
                      }}
                    />
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      style={{
                        height: "50px",
                        paddingLeft: "44px",
                        paddingRight: "44px",
                        background: "#f8fafc",
                        border: errors.password ? "1.5px solid #ef4444" : "1.5px solid #cbd5e1",
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        color: "#0f172a",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="btn btn-link position-absolute top-50 translate-middle-y end-0 me-2 text-secondary p-0"
                      style={{ textDecoration: "none" }}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} fs-6`}></i>
                    </button>
                  </div>

                  {errors.password && (
                    <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                      <i className="bi bi-exclamation-circle-fill" style={{ fontSize: "0.85rem" }}></i>
                      {errors.password}
                    </div>
                  )}

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Password Strength:
                        </span>
                        <span
                          className="fw-bold"
                          style={{ fontSize: "0.75rem", color: strength.color }}
                        >
                          {strength.label}
                        </span>
                      </div>
                      <div
                        className="w-100 rounded-pill overflow-hidden"
                        style={{ height: "4px", background: "#e2e8f0" }}
                      >
                        <div
                          className="h-100 rounded-pill"
                          style={{
                            width: strength.width,
                            backgroundColor: strength.color,
                            transition: "all 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-3 text-start">
                  <label htmlFor="confirm-password" className="form-label small fw-semibold text-secondary mb-1">
                    Confirm New Password
                  </label>

                  <div className="position-relative">
                    <i
                      className="bi bi-shield-lock position-absolute top-50 translate-middle-y"
                      style={{
                        left: "14px",
                        color: errors.confirmPassword ? "#ef4444" : "#94a3b8",
                        fontSize: "1.1rem",
                      }}
                    />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                        }
                      }}
                      style={{
                        height: "50px",
                        paddingLeft: "44px",
                        paddingRight: "44px",
                        background: "#f8fafc",
                        border: errors.confirmPassword ? "1.5px solid #ef4444" : "1.5px solid #cbd5e1",
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        color: "#0f172a",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="btn btn-link position-absolute top-50 translate-middle-y end-0 me-2 text-secondary p-0"
                      style={{ textDecoration: "none" }}
                    >
                      <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} fs-6`}></i>
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                      <i className="bi bi-exclamation-circle-fill" style={{ fontSize: "0.85rem" }}></i>
                      {errors.confirmPassword}
                    </div>
                  )}

                  {confirmPassword && (
                    <div className="mt-1 small">
                      {password === confirmPassword ? (
                        <span className="text-success d-flex align-items-center gap-1" style={{ fontSize: "0.78rem" }}>
                          <i className="bi bi-check-circle-fill"></i> Passwords match
                        </span>
                      ) : (
                        <span className="text-danger d-flex align-items-center gap-1" style={{ fontSize: "0.78rem" }}>
                          <i className="bi bi-x-circle-fill"></i> Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Requirements Checklist */}
                <div
                  className="p-3 mb-4 rounded-3 text-start"
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div className="text-muted mb-2 fw-semibold" style={{ fontSize: "0.75rem" }}>
                    Password Requirements:
                  </div>
                  <div className="row g-2" style={{ fontSize: "0.75rem" }}>
                    <div className="col-6 d-flex align-items-center gap-1.5">
                      <i
                        className={`bi ${hasLength ? "bi-check-circle-fill text-success" : "bi-circle text-muted"}`}
                      ></i>
                      <span className={hasLength ? "text-dark fw-medium" : "text-muted"}>8+ Characters</span>
                    </div>
                    <div className="col-6 d-flex align-items-center gap-1.5">
                      <i
                        className={`bi ${hasUpperLower ? "bi-check-circle-fill text-success" : "bi-circle text-muted"}`}
                      ></i>
                      <span className={hasUpperLower ? "text-dark fw-medium" : "text-muted"}>Upper & Lowercase</span>
                    </div>
                    <div className="col-6 d-flex align-items-center gap-1.5">
                      <i
                        className={`bi ${hasNumber ? "bi-check-circle-fill text-success" : "bi-circle text-muted"}`}
                      ></i>
                      <span className={hasNumber ? "text-dark fw-medium" : "text-muted"}>At least 1 Number</span>
                    </div>
                    <div className="col-6 d-flex align-items-center gap-1.5">
                      <i
                        className={`bi ${hasSpecial ? "bi-check-circle-fill text-success" : "bi-circle text-muted"}`}
                      ></i>
                      <span className={hasSpecial ? "text-dark fw-medium" : "text-muted"}>Special Symbol (!@#$)</span>
                    </div>
                  </div>
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
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lock-fill"></i>
                      <span>Reset Password</span>
                    </>
                  )}
                </button>
              </form>

              {/* Back Link */}
              <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
                <button
                  type="button"
                  className="btn btn-link p-0 fw-bold text-decoration-none small text-secondary"
                  onClick={() => navigate("/login")}
                >
                  <i className="bi bi-arrow-left me-1"></i> Cancel & Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;