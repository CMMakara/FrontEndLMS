import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext.jsx'
import { createBorrowRecordAPI, getAllBorrowRecordAPI, returnBookAPI } from '../services/borrow'

const useBorrows = () => {
  const [borrow, setBorrow] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
  });
  const { showToast } = useToast()
  const createBorrowRecord = async (data) => {
    try {
      let res = await createBorrowRecordAPI(data)
      if (res?.result === false) {
        showToast(res?.data || "create borrow books failed", "error");
        return false;
      }
      showToast('Create borrow books success', 'success')
      return res
    } catch (error) {
      console.log(error)
      return false
    }
  }
  const getAllBorrowRecord = async (search = '', page = 1, per_page = 10) => {
    try {
      let res = await getAllBorrowRecordAPI({
        search,
        page,
        per_page
      })
      const data = res?.data || [];
      setBorrow(data)
      setPagination({
          page: res?.page || page,
          per_page: res?.per_page || per_page,
          total: res?.total || 0,
          totalPages: res?.pagination?.totalPages || 1,
      })
      return data
    } catch (error) {
      console.log(error)
      return []
    }
  }
  const returnBook = async (id , data) => {
    try {
      let res = await returnBookAPI(id, data)
      if(res.result === false){
        showToast(res?.data || "return  books failed", "error");
        return false;
      }
      showToast('Return books success', 'success')
      return res
    } catch (error) {
      console.log(error)
    }
  }

  return {
    createBorrowRecord,
    borrow,
    getAllBorrowRecord,
    pagination,
    returnBook
  }

}

export default useBorrows