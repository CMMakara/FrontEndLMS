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
      email: email,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordAPI = async (email) =>{
  try {
    const res = await api.put("/auth/resend-Email", {
      email
    });

    return res.data.data;
  } catch (error) {
    throw error;
  }
}

export const resetPasswordAPI = async (data) => {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
};