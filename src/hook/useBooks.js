import { useEffect, useState } from "react"
import { createBookAPI, deleteBookAPI, getAllBooksAPI, getBooksByIdAPI, updateBookAPI, uploadImageBookAPI } from "../services/booksService"
import { useToast } from '../context/ToastContext.jsx'

const useBooks = () => {

  const [books, setBooks] = useState([])
  const { showToast } = useToast()
  const getAllBooks = async () => {
    try {
      let res = await getAllBooksAPI()
      const data = res.data || []
      setBooks(data)
      return true
    } catch (error) {
      console.log(error)
    }
  }

  const createBook = async (data) => {
    try {
      let res = await createBookAPI(data)
      if (res?.result === false) {
        showToast(res?.data || "Create failed", "error");
        return false;
      }
      showToast('Create New books success', 'success')
      return res
    } catch (error) {
      console.log(error)
    }
  }
  const uploadImageBook = async (id, thumbnail) => {
    try {
      const formData = new FormData();
      formData.append("thumbnail", thumbnail);
      formData.append("id", id);

      const res = await uploadImageBookAPI(formData);

      if (res?.result === false) {
        showToast(res?.data || "Upload failed", "error");
        return false;
      }

      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const getBooksById = async (id) =>{
    try {
      let res = await getBooksByIdAPI(id)
      return res || []
    } catch (error) {
       console.log(error);
    }
  }

  const updateBook = async (id, data) =>{
    try {
      let res = await updateBookAPI(id ,data)
      if (res?.result === false) {
        showToast(res?.data || "update failed", "error");
        return false;
      }
      showToast('Update books success', 'success')
      return res
    } catch (error) {
      console.log(error);
    }
  }

  const deleteBook = async (id) =>{
    try {
      let res = await deleteBookAPI(id)
      if (res?.result === false) {
        showToast(res?.data || "delete failed", "error");
        return false;
      }
      showToast('delete books success', 'success')
      return res
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllBooks()
  }, [])

  return {
    books,
    getAllBooks,
    createBook,
    uploadImageBook,
    getBooksById,
    updateBook,
    deleteBook
  }
}

export default useBooks