
import api from './api'

export const getAllPublishersAPI = async () =>{
  try {
    let res = await api.get('/publishers')
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const updatePublishersAPI = async (id , data) =>{
  try {
    let res = await api.put(`/publishers/${id}` , data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const createPublishersAPI = async (data) =>{
  try {
    let res = await api.post('/publishers' , data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const deletePublishersAPI = async (id) =>{
  try {
    let res = await api.delete(`/publishers/${id}`)
    return res.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}