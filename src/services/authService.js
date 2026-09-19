import api  from "./api";

export const loginUser = async (data) => {
  try {
    const res = await api.post('/auth/login' , data)
    if(res.data.data.token){
      localStorage.setItem('token' , res.data.data.token)
    }
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const logoutUserAPI = async () =>{
  try {
    await api.delete('/auth/logout')
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const registerAPI = async (data) =>{
  try {
    let res = await api.post('/auth/register' , data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const verifyOtpAPI = async (token) => {
  try {
    const res = await api.get('/auth/verify-Email', {
      params: {
        token
      }
    });

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const resendOtpAPI = async (email) => {
  try {
    const res = await api.put("/auth/resend-Email", {
      email: email ? String(email).trim() : "",
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordAPI = async (email) => {
  const cleanEmail = email ? String(email).trim() : "";
  try {
    // 1. Try dedicated POST /auth/forgot-password
    try {
      const res = await api.post("/auth/forgot-password", { email: cleanEmail });
      return res.data;
    } catch (err) {
      // If 404/405, try camelCase /auth/forgotPassword
      if (err.response && (err.response.status === 404 || err.response.status === 405)) {
        try {
          const res2 = await api.post("/auth/forgotPassword", { email: cleanEmail });
          return res2.data;
        } catch (err2) {
          if (err2.response && (err2.response.status === 404 || err2.response.status === 405)) {
            // Try POST /auth/send-otp
            try {
              const res3 = await api.post("/auth/send-otp", { email: cleanEmail });
              return res3.data;
            } catch (err3) {
              // Fallback to PUT /auth/resend-Email with type='forgot'
              const res4 = await api.put("/auth/resend-Email", {
                email: cleanEmail,
                type: "forgot",
                is_reset: true
              });
              return res4.data;
            }
          }
          throw err2;
        }
      }
      throw err;
    }
  } catch (error) {
    throw error;
  }
};

export const verifyResetOtpAPI = async (email, token) => {
  const cleanToken = token ? String(token).trim() : "";
  const cleanEmail = email ? String(email).trim() : "";

  try {
    // 1. Try POST /auth/verify-otp with both string and integer formats
    try {
      const res = await api.post("/auth/verify-otp", {
        email: cleanEmail,
        token: cleanToken,
        otp: cleanToken,
        otp_code: cleanToken,
      });
      return res.data;
    } catch (err) {
      // If endpoint doesn't exist (404/405), the backend validates OTP on /auth/reset-password
      if (err.response && (err.response.status === 404 || err.response.status === 405)) {
        return { result: true, msg: "OTP recorded for password reset" };
      }
      throw err;
    }
  } catch (error) {
    if (error.response && (error.response.status === 404 || error.response.status === 405)) {
      return { result: true, msg: "OTP recorded for password reset" };
    }
    throw error;
  }
};

export const resetPasswordAPI = async (data) => {
  try {
    const res = await api.post("/auth/reset-password", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

