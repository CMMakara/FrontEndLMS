import { useEffect, useState } from "react"
import { approveBorrowAPI, getAllBorrowRequestAPI, rejectBorrowAPI } from "../services/borrowRequest"
import { useToast } from '../context/ToastContext.jsx'

const useBorrowRequest = ({ search = "", perPage = 5, } = {}) =>{

  const [borrowsRequest , setBorrowsRequest] = useState([])
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    perPage : 0
  });
  const { showToast } = useToast()

  const getAllBorrowRequest = async () =>{
    try {
      let res = await getAllBorrowRequestAPI({
        page,
        per_page: perPage,
        search,
      })
      let data = res.data || []
      setBorrowsRequest(data)
      setPagination({
        total: res.pagination.total || 0,
        totalPages: res.pagination.totalPage || 0,
        perPage: res?.pagination?.per_page || perPage,
      });
      return true
    } catch (error) {
      console.log(error)
    }
  }

  const approveBorrow = async (id) =>{
    try {
      let res = await approveBorrowAPI(id)
      if(res.result === false){
        showToast(res?.message || res?.data || 'Approve borrow book Failed', "error");
        return false
      }
      showToast("Approve borrow book success", "success")
      return true
    } catch (error) {
      console.log(error)
    }
  }

  const rejectBorrow = async (id) =>{
    try {
      let res = await rejectBorrowAPI(id)
      if(res.result === false){
        showToast(res?.message || res?.data || 'Reject borrow book Failed', "error");
        return false
      }
      showToast("Reject borrow book success", "success")
      return true
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllBorrowRequest()
  }, [search, perPage , page])
  return {
    borrowsRequest,
    getAllBorrowRequest,
    approveBorrow,
    rejectBorrow
  }
}

export default useBorrowRequest