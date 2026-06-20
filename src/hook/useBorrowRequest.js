import { useEffect, useState } from "react"
import { getAllBorrowRequestAPI } from "../services/borrowRequest"

const useBorrowRequest = ({ search = "", perPage = 5, } = {}) =>{

  const [borrowsRequest , setBorrowsRequest] = useState([])
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    perPage : 0
  });

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

  useEffect(() => {
    getAllBorrowRequest()
  }, [search, perPage , page])
  return {
    borrowsRequest,
    getAllBorrowRequest
  }
}

export default useBorrowRequest