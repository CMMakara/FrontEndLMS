import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext.jsx'
import { createBorrowRecordAPI, getAllBorrowRecordAPI, getBorrowedAPI, returnBookAPI, getDueDate as getDueDateAPI } from '../services/borrow'

const useBorrows = () => {
  const [borrow, setBorrow] = useState([])
  const [dueDates, setDueDates] = useState([])
  const [dueDatesUser, setDueDatesUser] = useState(null)
  const [loading, setLoading] = useState(false)
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

  const getBorrowed = async (id, status) => {
    try {
      setLoading(true);
      let res = await getBorrowedAPI(id, status);
      const data = res?.data !== undefined ? res.data : res;
      let list = Array.isArray(data)
        ? data
        : (data && typeof data === 'object' && Object.keys(data).length > 0 ? [data] : []);

      if (status && status !== "All" && status !== "all") {
        const s = status.toLowerCase();
        list = list.filter((item) => {
          const itemStatus = (item.status || item.borrow_status || "").toLowerCase();
          if (s === "borrowed" || s === "active") {
            return itemStatus === "borrowed" || !item.return_date;
          }
          if (s === "overdue") {
            return itemStatus === "overdue" || item.is_overdue;
          }
          if (s === "returned") {
            return itemStatus === "returned" || item.return_date;
          }
          return true;
        });
      }

      setBorrow(list);
      return list;
    } catch (error) {
      console.log(error);
      setBorrow([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getDueDate = async (id, status) => {
    try {
      setLoading(true);
      const res = await getDueDateAPI(id, status);
      const list = res?.data || [];
      setDueDates(list);
      setDueDatesUser(res?.user || null);
      return res;
    } catch (error) {
      console.log(error);
      setDueDates([]);
      setDueDatesUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBorrowRecord,
    borrow,
    dueDates,
    dueDatesUser,
    loading,
    getAllBorrowRecord,
    pagination,
    returnBook,
    getBorrowed,
    getDueDate,
    fetchDueDate: getDueDate,
  }

}

export default useBorrows