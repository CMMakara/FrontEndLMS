
import { useEffect, useState } from "react"
import { createUserAPI, deleteProfileAPI, getAllUserAPI, getMeAPI, updateProfileAPI, updateProfileImageAPI } from "../services/userService"
import { useToast } from '../context/ToastContext.jsx'

// Shared profile state across all useUser instances (Navbar, Profile, Sidebar, etc.)
let sharedUserProfile = null;
let profileFetchPromise = null;
const profileListeners = new Set();

export const getSharedUserProfile = () => sharedUserProfile;

export const broadcastUserProfile = (profile) => {
  sharedUserProfile = profile ? { ...profile } : null;
  profileListeners.forEach((listener) => {
    try {
      listener(sharedUserProfile);
    } catch (e) {
      console.error("Error broadcasting profile update:", e);
    }
  });
};

const useUser = (initialPage = 1, per_page = 10) => {
  const [users, setUsers] = useState([])
  const [userProfile, setUserProfileState] = useState(sharedUserProfile)
  const [page, setPage] = useState(initialPage)
  const [pagination, setPagination] = useState({})
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState("asc");
  const { showToast } = useToast()

  // Subscribe this component instance to shared profile updates
  useEffect(() => {
    profileListeners.add(setUserProfileState);
    if (sharedUserProfile) {
      setUserProfileState(sharedUserProfile);
    }
    return () => {
      profileListeners.delete(setUserProfileState);
    };
  }, []);

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

  const getUserProfile = async (forceRefresh = false) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        broadcastUserProfile(null);
        return null;
      }
      if (profileFetchPromise && !forceRefresh) {
        return await profileFetchPromise;
      }
      profileFetchPromise = (async () => {
        const res = await getMeAPI();
        const profile = (res?.data && typeof res.data === "object" && !Array.isArray(res.data))
          ? res.data
          : (res?.data?.data || res || null);
        broadcastUserProfile(profile);
        return profile;
      })();
      const result = await profileFetchPromise;
      return result;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      profileFetchPromise = null;
    }
  }

  const updateProfile = async (data) => {
    try {
      let res = await updateProfileAPI(data);
      if (res?.result === false) {
        showToast(res?.data || 'update profile fail', 'error');
        return false;
      }
      showToast('Update Information success', 'success');
      // Immediately refresh profile so all components (Navbar, Profile, Sidebar) update
      const updated = await getUserProfile(true);
      return res.data || updated;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  const updateProfileImage = async (file) => {
    try {
      let res = await updateProfileImageAPI(file);
      if (res?.result === false) {
        showToast(res?.data || 'upload profile fail', 'error');
        return false;
      }
      showToast('Upload Information success', 'success');
      // Immediately refresh profile so Navbar, Sidebar, Profile all get new image
      const updated = await getUserProfile(true);
      return res.data || updated;
    } catch (error) {
      console.log(error);
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
      showToast("Profile image removed", "success");
      // Immediately refresh profile so Navbar, Sidebar, Profile all clear image
      const updated = await getUserProfile(true);
      return res.data || updated;
    } catch (error) {
      console.log(error);
      showToast("Delete image error", "error");
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !sharedUserProfile) {
      getUserProfile();
    }
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