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