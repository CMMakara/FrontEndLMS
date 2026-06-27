import api  from "./api";

export const getAllUserAPI = async ({
  page = 1,
  per_page = 100,
  order = "asc",
  search = "",
}) =>{
  try {
    const res = await api.get('/profile/getAll',{
      params :{
        page,
        per_page,
        order,
        search
      }
    })
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const createUserAPI = async (data) =>{
  try {
    let res = await api.post('/profile/user/register' , data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getMeAPI = async () =>{
  try {
    let res = await api.get('/auth/getMe')
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const updateProfileAPI = async (data) =>{
  try {
    let res = await api.put('/profile/info', data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const updateProfileImageAPI =  async(file) =>{
  try {
    const formData = new FormData();
    formData.append("profile_image", file);
    let res = await api.post('/profile/image' , formData , {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const deleteProfileAPI = async () =>{
  try {
    let res =await api.delete('/profile/image')
    return res.data
  } catch (error) {
    
  }
}