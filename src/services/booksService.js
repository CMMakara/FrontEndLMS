
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

export const createBookAPI = async (data) =>{
  try {
    let res = await api.post('/books' ,data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const uploadImageBookAPI = async (formData) =>{
  try {
    let res = await api.post('/books/image' , formData ,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getBooksByIdAPI = async (id) =>{
  try {
    let res = await api.get(`/books/${id}`)
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateBookAPI = async (id , data) =>{
  try {
    let res = await api.put(`/books/${id}` , data, {
      headers: {
        "Content-Type": "application/json",
      }
    })
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteBookAPI = async (id) =>{
  try {
    let res = await api.delete(`/books/${id}`)
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}