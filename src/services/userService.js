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