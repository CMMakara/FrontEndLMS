import { useEffect, useState } from "react"
import { createAuthorAPI, deteleAuthorAPI, getAllAuthorAPI, updateAuthorAPI } from "../services/authorService"
import { useToast } from '../context/ToastContext.jsx'
const useAuthor = (options= {}) =>{
  const { all = false, per_page = 1000 } = options;
  const [author , setAuthor] = useState([])
  const [sortBy , setSortby] = useState('asc')
  const [search, setSearch] = useState('')
  const { showToast } = useToast()
  const getAllAuthor = async (currentSortBy = sortBy ,currentSearch = search) =>{
    try {
      const res = await getAllAuthorAPI({
        sort_by: currentSortBy,
        search: currentSearch,
        all,
        per_page,
      })
      const data = res.data || []
      setAuthor(data)
      return true
    } catch (error) {
       console.log(error)
    }
  }

  const updateAuthor = async (id, data) =>{
    try {
      let res = await updateAuthorAPI(id, data)
      if (res.result === false) {
        showToast(res?.data, "error");
        return false;
      }
      showToast('update information Author success' , 'success')
      return true
    } catch (error) {
      console.log(error)
    }
  }

  const deleteAuthor = async (id) =>{
    try {
      let res = await deteleAuthorAPI(id)
      console.log(res)
       if (res.result === false) {
        showToast(res?.data, "error");
        return false;
      }
      showToast('update author success' , 'success')
      return true
    } catch (error) {
      console.log(error)
    }
  }

  const createAuthor = async (data) =>{
    try {
      let res = await createAuthorAPI(data)
      if(res.result === false){
        showToast(res?.data, "error");
        return false;
      }
      showToast('create new author success' , 'success')
      return true
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    getAllAuthor()
  },[sortBy ,search])

  return {
    author ,
    search,
    setSearch,
    updateAuthor,
    getAllAuthor,
    deleteAuthor,
    createAuthor
  }
}

export default useAuthor