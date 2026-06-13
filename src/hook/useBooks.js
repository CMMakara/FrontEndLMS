import { useEffect, useState } from "react"
import { getAllBooksAPI } from "../services/booksService"


const useBooks = () =>{

  const [books , setBooks] = useState({})

  const getAllBooks = async () =>{
    try {
      let res = await getAllBooksAPI()
      const data = res.data || []
      setBooks(data)
      return true
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getAllBooks()
  },[])

  return {
    books,
    getAllBooks
  }
}

export default useBooks