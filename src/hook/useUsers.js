
import { useEffect, useState } from "react"
import { createUserAPI, deleteProfileAPI, getAllUserAPI, getMeAPI, updateProfileAPI, updateProfileImageAPI } from "../services/userService"
import { useToast } from '../context/ToastContext.jsx'
const useUser = (initialPage = 1, per_page = 10) => {

  const [users, setUsers] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [page, setPage] = useState(initialPage)
  const [pagination, setPagination] = useState({})
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState("asc");
  const { showToast } = useToast()
  const getAllUsers = async (currentPage = page, currentOrder = order, currentSearch = search) => {
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

  const createUser = async (data) => {
    try {
      let res = await createUserAPI(data)
      if (res?.result === false) {
        showToast('Create user fail', 'error')
        return false
      }
      showToast('create user success', 'success')
      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  const getUserProfile = async () => {
    try {
      let res = await getMeAPI()
      setUserProfile(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const updateProfile = async (data) => {
    try {
      let res = await updateProfileAPI(data)
      if (res?.result === false) {
        showToast(res?.data || 'update profile fail', 'error')
        return false
      }
      showToast('Update Information success', 'success')
      return res.data
    } catch (error) {
      onsole.log(error)
    }
  }

  const updateProfileImage = async (file) => {
    try {
      let res = await updateProfileImageAPI(file)
      if (res?.result === false) {
        showToast(res?.data || 'upload profile fail', 'error')
        return false
      }
      setUserProfile(res.data)
      await getUserProfile()
      showToast('Upload Information success', 'success')
      return res.data
    } catch (error) {
      console.log(error)
      return null;
    }
  }

  const deleteProfileImage = async () => {
    try {
      const res = await deleteProfileAPI();
      if (res?.result === false) {
        showToast(res?.data || "Delete image failed", "error");
        return false;
      }
      setUserProfile(res.data) 
      showToast("Profile image removed", "success");
      await getUserProfile();

      return res.data;
    } catch (error) {
      console.log(error);
      showToast("Delete image error", "error");
      return false;
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    getAllUsers()
  }, [page, order, search])
  return {
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
    userProfile,
    updateProfile,
    getUserProfile,
    updateProfileImage,
    deleteProfileImage
  }
}

export default useUser