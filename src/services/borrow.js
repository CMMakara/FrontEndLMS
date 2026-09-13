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


export const getBorrowedAPI = async (id, status) => {
  try {
    const params = {};
    if (status && status !== 'All' && status !== 'all') {
      params.status = status;
    }
    const url = id ? `/borrows/${id}` : '/borrows';
    let res = await api.get(url, { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getDueDate = async (id, status) => {
  try {
    const params = {};
    if (status && status !== 'All' && status !== 'all') {
      params.status = status;
    }
    let res = await api.get(`/borrows/due-date/${id}`, { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};