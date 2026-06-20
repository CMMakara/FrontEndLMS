
import { useEffect, useState } from "react"
import {createUserAPI, getAllUserAPI, getMeAPI} from "../services/userService"
import { useToast } from '../context/ToastContext.jsx'
const useUser = (initialPage = 1, per_page = 10) =>{

  const [users , setUsers] = useState([])
  const [userProfile , setUserProfile] = useState(null)
  const [page, setPage] = useState(initialPage)
  const [pagination, setPagination] = useState({})
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState("asc");
  const { showToast } = useToast()
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

  const createUser = async (data) =>{
    try {
      let res = await createUserAPI(data)
      if(res?.result === false){
        showToast('Create user fail' , 'error')
        return false
      }
      showToast('create user success', 'success')
      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  const getUserProfile = async () =>{
    try {
      let res = await getMeAPI()
      setUserProfile(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUserProfile();
  }, []);

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
    setSearch,
    createUser,
    userProfile
  }
}

export default useUser