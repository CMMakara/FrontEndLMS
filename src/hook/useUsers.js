
import { useEffect, useState } from "react"
import {getAllUserAPI} from "../services/userService"

const useUser = (initialPage = 1, per_page = 10) =>{

  const [users , setUsers] = useState([])
  const [page, setPage] = useState(initialPage)
  const [pagination, setPagination] = useState({})
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState("asc");
  const getAllUsers = async (currentPage = page , currentOrder = order ,currentSearch = search) =>{
    try {
      const res = await getAllUserAPI({
        page,
        per_page,
        search,
        order,
      })
      const data = res.data || []
      setUsers(data)
      setPagination(res?.pagination || {})
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(()=>{
    getAllUsers()
  },[page ,order ,search])
  return{
    users,
    setUsers,
    getAllUsers,
    page,
    setPage,
    pagination,
    order,
    setOrder,
    search,
    setSearch
  }
}

export default useUser