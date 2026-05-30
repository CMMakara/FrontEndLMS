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