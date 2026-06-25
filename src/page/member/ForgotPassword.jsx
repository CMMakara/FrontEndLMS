import React, { useState } from "react";
import Input from "../../components/ui/Input";
import { useNavigate } from "react-router-dom";
import useUserAuth from "../../hook/useAuth";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const { forgotPassword } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!isValid) {
      setStatus("error");
      return;
    }

    try {
      setSubmitting(true);
      setStatus(null);

      await forgotPassword(email);

      setStatus("success");
      
      navigate("/otp-forgot", { state: { email } });

    } catch (error) {
      setStatus("error");
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 position-relative"
      style={{
        backgroundImage:
          "url(https://i.pinimg.com/1200x/61/ec/dc/61ecdc1cef01ca2d57c7ce986be759a1.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="btn btn-light position-absolute top-0 start-0 m-3 rounded-circle shadow"
        style={{ width: "42px", height: "42px" }}
      >
        <i className="bi bi-arrow-left"></i>
      </button>

      <div
        className="card text-center text-white border-0 shadow-lg"
        style={{
          width: "400px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(15px)",
          borderRadius: "18px",
        }}
      >
        <div className="card-body p-4">
          <h4 className="fw-bold">Reset Password</h4>

          <p className="small text-light opacity-75">
            Enter your email and we’ll send a reset code.
          </p>

          {status === "error" && (
            <div className="alert alert-danger py-2">
              Something went wrong or invalid email
            </div>
          )}

          {status === "success" && (
            <div className="alert alert-success py-2">
              OTP sent successfully
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-3">
            <Input
              width="100%"
              label="Email Address"
              value={email}
              placeholder="name@example.com"
              icon="bi-envelope"
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus(null);
              }}
            />

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-100 mt-3"
            >
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;