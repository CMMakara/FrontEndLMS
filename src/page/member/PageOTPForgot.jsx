import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUserAuth from "../../hook/useAuth";
import AuthStepHeader from "../../components/auth/AuthStepHeader";

function PageOTPForgot() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyResetOtp, resendOtp, forgotPassword } = useUserAuth();

  const userEmail =
    location.state?.email ||
    sessionStorage.getItem("forgot_email") ||
    localStorage.getItem("forgot_email") ||
    "";

  // Redirect if no email found
  useEffect(() => {
    if (!userEmail) {
      navigate("/forgot-password");
    } else {
      inputRefs.current[0]?.focus();
    }
  }, [userEmail, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    setError("");
    const val = e.target.value;
    const cleaned = val.replace(/\D/g, "");

    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const singleDigit = cleaned.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = singleDigit;
    setOtp(newOtp);

    // Auto-advance to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = [...otp];
    const digits = pastedData.split("");
    digits.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });

    setOtp(newOtp);
    setError("");

    const focusIndex = Math.min(digits.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleFocus = (index) => {
    inputRefs.current[index]?.select();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const otpCode = otp.join("").trim();
    if (otpCode.length < 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await verifyResetOtp(userEmail, otpCode);

      if (res !== false) {
        sessionStorage.setItem("forgot_token", otpCode);
        sessionStorage.setItem("forgot_verified", "true");
        sessionStorage.setItem("forgot_email", userEmail);
        localStorage.setItem("forgot_token", otpCode);
        localStorage.setItem("forgot_email", userEmail);

        navigate("/reset-password", {
          state: {
            email: userEmail,
            token: otpCode,
          },
        });
      } else {
        setError("Invalid OTP or verification code does not match. Please check and try again.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.data ||
        err?.response?.data?.msg ||
        "Verification failed. The OTP did not match our records."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;

    try {
      setResending(true);
      setError("");
      setOtp(Array(6).fill(""));

      let res = await resendOtp(userEmail);
      if (!res) {
        res = await forgotPassword(userEmail);
      }

      setTimer(60);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleBack = () => {
    navigate("/forgot-password", { state: { email: userEmail } });
  };

  const isOtpComplete = otp.every((d) => d !== "");

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
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
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
        title="Back to Email Step"
      >
        <i className="bi bi-arrow-left fs-5"></i>
      </button>

      {/* Main Card */}
      <div
        className="card border-0 bg-white position-relative shadow-lg overflow-hidden text-center"
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
          <AuthStepHeader currentStep={2} />

          {/* Header Icon */}
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-4 mb-3 shadow-sm"
            style={{
              width: "60px",
              height: "60px",
              background: error
                ? "rgba(239, 68, 68, 0.12)"
                : "linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(6, 182, 212, 0.15))",
              border: error
                ? "1px solid rgba(239, 68, 68, 0.3)"
                : "1px solid rgba(79, 70, 229, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            <i
              className={`bi fs-2 ${error ? "bi-shield-x text-danger" : "bi-shield-check text-primary"}`}
              style={{ color: error ? "#ef4444" : "#4f46e5" }}
            ></i>
          </div>

          <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.5px" }}>
            Verify OTP Code
          </h3>

          <p className="text-muted small mb-2">
            Enter the 6-digit security code sent to:
          </p>

          {/* User Email Pill Badge */}
          <div
            className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-1.5 rounded-pill border"
            style={{
              background: "#f8fafc",
              borderColor: "#e2e8f0",
              color: "#334155",
              fontSize: "0.85rem",
              fontWeight: "600",
            }}
          >
            <i className="bi bi-envelope-check text-primary"></i>
            <span>{userEmail}</span>
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-link p-0 text-decoration-none small ms-1 text-primary fw-bold"
              title="Change email"
              style={{ fontSize: "0.75rem" }}
            >
              <i className="bi bi-pencil-square"></i> Change
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* 6 Digit OTP Inputs */}
            <div className="d-flex justify-content-center gap-2 gap-sm-3 mb-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  onFocus={() => handleFocus(index)}
                  className="form-control text-center fw-bold shadow-none"
                  style={{
                    width: "48px",
                    height: "56px",
                    maxWidth: "52px",
                    fontSize: "1.4rem",
                    borderRadius: "12px",
                    background: digit ? "#eef2ff" : "#f8fafc",
                    border: error
                      ? "2px solid #ef4444"
                      : digit
                      ? "2px solid #4f46e5"
                      : "1.5px solid #cbd5e1",
                    color: "#0f172a",
                    boxShadow: digit ? "0 0 10px rgba(79, 70, 229, 0.15)" : "none",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="mb-3 p-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 text-danger small"
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                }}
              >
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isOtpComplete || loading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="btn w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 text-white shadow position-relative overflow-hidden mt-3"
              style={{
                background: !isOtpComplete
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #4f46e5 0%, #00b4d8 100%)",
                border: "none",
                borderRadius: "14px",
                fontSize: "0.95rem",
                letterSpacing: "0.3px",
                cursor: !isOtpComplete || loading ? "not-allowed" : "pointer",
                transform: isHovered && isOtpComplete && !loading ? "translateY(-2px)" : "translateY(0)",
                boxShadow: isOtpComplete
                  ? isHovered
                    ? "0 10px 25px rgba(79, 70, 229, 0.4)"
                    : "0 4px 15px rgba(79, 70, 229, 0.2)"
                  : "none",
                transition: "all 0.25s ease",
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify Code & Continue</span>
                  <i className="bi bi-arrow-right fs-6"></i>
                </>
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-4 pt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
            {timer > 0 ? (
              <div className="d-flex align-items-center justify-content-center gap-2 text-secondary small">
                <i className="bi bi-clock-history text-primary"></i>
                <span>Resend code in</span>
                <span className="fw-bold px-2 py-0.5 rounded bg-light border text-dark">
                  {timer}s
                </span>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center gap-2 small">
                <span className="text-secondary">Didn't receive the code?</span>
                <button
                  type="button"
                  disabled={resending}
                  onClick={handleResend}
                  className="btn btn-link p-0 fw-bold text-decoration-none d-inline-flex align-items-center gap-1"
                  style={{ color: "#4f46e5" }}
                >
                  {resending ? (
                    <>
                      <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px" }} />
                      Resending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-clockwise"></i> Resend Code
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageOTPForgot;
