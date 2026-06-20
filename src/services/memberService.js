import api  from "./api";

export const getAllMemberAPI = async (params = {}) =>{
  try {
    let res = await api.get('/members', {
      params: {
        search: params.search || '',
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}