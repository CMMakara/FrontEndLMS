
import api from './api'

export const getAllBooksAPI = async () =>{
  try {
    let res = await api.get('/books')
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}