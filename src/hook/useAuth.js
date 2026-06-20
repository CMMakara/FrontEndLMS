import { loginUser, logoutUserAPI } from "../services/authService";
import { useNavigate } from "react-router-dom";
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
      if(res.result  === false){
        showToast("Invalid email or password" , "error")
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

      showToast("Login successfully" , "success")
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

  return {
    handleLogin,
    errors,
    setErrors,
    clearError,
    logout
  };
};

export default useUserAuth;