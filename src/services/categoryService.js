import api  from "./api";

export const getAllCategory = async (page= 1 , per_page = 10 , search = '') =>{
  try {
    const res = await api.get('/category',{
      params:{
        page,
        per_page,
        search
      }
    })
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const updateCategoryAPI = async (id ,data) =>{
  try {
    const res = await api.put(`/category/${id}` , data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const createCategoryAPI = async (data) =>{
  try {
    const res = await api.post('/category' ,data)
    return res.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const deleteCategoryAPI = async (id) =>{
  try {
    const res = await api.delete(`/category/${id}`)
    return res.data
  } catch (error) {
    console.log(error)
  }
}