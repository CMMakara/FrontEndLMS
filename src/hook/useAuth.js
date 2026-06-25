import { loginUser, logoutUserAPI, registerAPI, resendOtpAPI, verifyOtpAPI } from "../services/authService";
import { data, useNavigate } from "react-router-dom";
import { setAuth } from "../utils/auth";
import { validateLogin } from "../validations/LoginSchema";
import { useState } from "react";
import { useToast } from '../context/ToastContext.jsx'

const useUserAuth = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { showToast } = useToast()
  const handleLogin = async (emailOrUsername, password) => {
    const payload = {
      email_or_username: emailOrUsername,
      password,
    };

    const validationErrors = validateLogin({
      emailOrUsername,
      password,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setErrors({});

    try {
      const res = await loginUser(payload);
      if (res.result === false) {
        showToast("Invalid email or password", "error")
        setErrors({});
        return false;
      }
      // optional safety check
      if (!res?.data.token) {
        return false;
      }

      setAuth(res.data.token, res.data.role_name);

      if (res.data.role_name === "Admin") {
        navigate("/admin");
      } else if (res.data.role_name === "Librarian") {
        navigate("/librarian");
      } else {
        navigate("/");
      }

      showToast("Login successfully", "success")
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // clear single field error
  const clearError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const logout = async () => {
    try {
      await logoutUserAPI();
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      showToast("Logout successfully", "success");
    } catch (error) {
      console.log("Logout API failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      showToast("Logout failed, but session cleared", "warning");
    }
  };

  const register = async (data) => {
    try {
      let res = await registerAPI(data)
      if (res.result === false) {
        console.log(res?.data)
        showToast(res?.data || res?.messag || "Register Failed", "error");
        return false
      }
      showToast("Register Account Member success", "success");
      return res.data
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  const verifyOtp = async (token) => {
    try {
      const res = await verifyOtpAPI(token);

      if (res.result === false) {
        showToast(res?.data || "Invalid OTP", "error");
        return false;
      }

      showToast("OTP verified successfully", "success");
      return res?.data || true;
    } catch (error) {
      console.log(error);
      showToast(
        error.response?.data?.message || "Verification failed",
        "error"
      );
      return false;
    }
  };
  const resendOtp = async (email) => {
    try {
      const res = await resendOtpAPI(email);

      const message = res?.msg || res?.data;

      if (!res?.result) {
        showToast(message || "Failed to resend OTP", "error");
        return false;
      }

      showToast(message || "OTP resent successfully", "success");
      return true;

    } catch (error) {
      console.log(error);

      showToast(
        error?.response?.data?.msg ||
        error?.response?.data?.data ||
        "Failed to resend OTP",
        "error"
      );

      return false;
    }
  };

  return {
    handleLogin,
    errors,
    setErrors,
    clearError,
    logout,
    register,
    verifyOtp,
    resendOtp
  };
};

export default useUserAuth;