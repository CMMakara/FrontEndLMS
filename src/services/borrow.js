import api  from "./api";

export const createBorrowRecordAPI = async (data) =>{
  try {
    let res = await api.post('/borrows' , data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getAllBorrowRecordAPI = async (params = {}) =>{
  try {
    let res = await api.get('/borrows',{
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

export const returnBookAPI = async(id , data) =>{
  try {
    let res = await api.put(`/borrows/return/${id}` ,data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}
