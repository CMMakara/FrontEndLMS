import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUserAuth from "../../hook/useAuth";

function PageOTP() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(50);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyOtp, resendOtp } = useUserAuth()

  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const userEmail =
    location.state?.email ||
    localStorage.getItem("verifyEmail") ||
    "";

  useEffect(() => {
    if (!userEmail) {
      navigate("/register");
    }
  }, [userEmail, navigate]);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    setError("");

    const value = e.target.value.replace(/\D/g, "");

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const newOtp = [...otp];

    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const token = otp.join("");

    try {
      const res = await verifyOtp(token)
      if (!res) {
        setError(res?.message || "Invalid OTP");
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
        return;
      }
      localStorage.removeItem("verifyEmail");
      navigate("/login");
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setOtp(Array(6).fill(""));
      setError("");
      setTimer(30);
      inputRefs.current[0]?.focus();
      await resendOtp(userEmail);

    } catch (error) {
      setError("Failed to resend OTP");
    }
  };
  const handleBackToRegister = () => {
    localStorage.removeItem("verifyEmail");
    navigate("/register");
  };
  return (
    <div
      className="container-fluid vh-100"
      style={{ background: "#F4F7FC" }}
    >
      <div className="row h-100">
        <div
          className="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center text-white"
          style={{
            background:
              "linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)",
          }}
        >
          <div className="text-center">
            <div
              className="rounded-circle bg-white bg-opacity-10 d-flex justify-content-center align-items-center mx-auto mb-4"
              style={{ width: "120px", height: "120px" }}
            >
              <i className="bi bi-book-half display-3"></i>
            </div>

            <h1 className="fw-bold">Library Management System</h1>

            <p className="mt-3 text-light">
              Secure staff portal for managing books and members.
            </p>

            <img
              src="https://cdn-icons-png.flaticon.com/512/6195/6195700.png"
              alt=""
              className="img-fluid mt-5"
              style={{ maxWidth: "300px" }}
            />
          </div>
        </div>

        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <div
            className="card shadow-lg border-0 p-5"
            style={{
              width: "450px",
              borderRadius: "25px",
            }}
          >
            <button
              onClick={handleBackToRegister}
              className="btn btn-light position-absolute top-0 start-0 m-4 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: "42px", height: "42px" }}
              title="Back to Register"
            >
              <i className="bi bi-arrow-left fs-5 text-secondary"></i>
            </button>
            <div className="text-center">
              <div
                className={`rounded-circle d-flex justify-content-center align-items-center mx-auto mb-4 ${error ? "bg-danger bg-opacity-10" : "bg-success bg-opacity-10"
                  }`}
                style={{
                  width: "80px",
                  height: "80px",
                  transition: "all .3s ease"
                }}
              >
                <i
                  className={`bi fs-1 ${error
                    ? "bi-x-circle-fill text-danger"
                    : "bi-shield-lock text-success"
                    }`}
                ></i>
              </div>

              <h3 className="fw-bold">Verify OTP</h3>

              <p className="text-secondary mb-4">
                Enter the verification code sent to
                <br />
                <strong>{userEmail}</strong>
              </p>

              <form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between mb-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      ref={(el) => (inputRefs.current[index] = el)}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      className="form-control text-center fw-bold fs-4"
                      style={{
                        width: "55px",
                        height: "60px",
                        borderRadius: "15px",
                        border: error
                          ? "2px solid #dc3545"
                          : "2px solid #e5e7eb",
                      }}
                    />
                  ))}
                </div>

                {error && (
                  <div
                    className="mb-3 p-3 text-start"
                    style={{
                      background: "#fff5f5",
                      border: "1px solid #f8d7da",
                      borderRadius: "15px",
                      color: "#dc3545",
                    }}
                  >
                    <div className="fw-bold">
                      <i className="bi bi-x-circle-fill me-2"></i>
                      Verification Failed
                    </div>

                    <small>{error}</small>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={otp.includes("") || loading}
                  className="btn btn-success w-100 py-3 fw-semibold"
                  style={{ borderRadius: "15px" }}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </form>

              <div className="mt-4">
                {timer > 0 ? (
                  <small className="text-muted">
                    Resend code in
                    <span className="fw-bold text-success">
                      {" "}
                      {timer}s
                    </span>
                  </small>
                ) : (
                  <button
                    className="btn btn-link text-success fw-bold text-decoration-none"
                    onClick={handleResend}
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageOTP;

