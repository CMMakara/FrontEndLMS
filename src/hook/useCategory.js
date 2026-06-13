import { useEffect, useState } from 'react'
import { createCategoryAPI, deleteCategoryAPI, getAllCategory, updateCategoryAPI } from '../services/categoryService'
import { useToast } from '../context/ToastContext.jsx'
import { validateCategory } from '../validations/CategorySchema.js'
const useCategory = (initialPage = 1, options = {}) => {
  const validate = (data) => {
    const errors = validateCategory(data);
    return errors;
  };
  const { all = false, per_page = 5 } = options;
  const [category, setCategory] = useState([])
  const [page, setPage] = useState(initialPage)
  const [pagination, setPagination] = useState({})
  const [search, setSearch] = useState('')
  const [searchError, setSearchError] = useState(false)
  const [errors, setErrors] = useState({});
  const { showToast } = useToast()
  const fetchGetAllCategory = async (currentPage = page, currentSearch = search) => {
    try {
      const res = await getAllCategory({
          page: currentPage,
          per_page,
          search: currentSearch,
          all,
        })
      const data = res.data || []
      setCategory(data)
      setPagination(res?.pagination || {})
      if (currentSearch && data.length === 0) {
        setSearchError(true)
      }
      else {
        setSearchError(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUpdateCategory = async (id, data) => {
    const errors = validate(data)
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return false;
    }
    setErrors({});
    try {
      const res = await updateCategoryAPI(id, data)
      if (res.result === false) {
        showToast(res?.data, "error");
        return false;
      }
      setCategory((prev) =>
        prev.map((item) =>
          item.id === id ? res.data : item
        )
      );
      showToast("Update category success", "success")
      return true
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  const fetchCreateCategory = async (data) => {
    const errors = validate(data)
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return false;
    }
    setErrors({});
    try {
      const res = await createCategoryAPI(data)
      if (res.result === false) {
        showToast(res?.data, "error");
        return false;
      }
      if (res.result === false) {
        showToast(res.data, "error");
        return false;
      }
      const newCategory = res.data;
      setCategory((prev) => [newCategory, ...prev]);
      showToast("created category success", "success")
       return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  const fetchDeleteCategory = async (id) => {
    try {
      const res = await deleteCategoryAPI(id)
      if (res.result === false) {
        showToast(res?.data, "error");
        return false;
      }
      setCategory((prev) =>
        prev.filter((item) => item.id !== id)
      )
      showToast("Delete category success", "success")
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchGetAllCategory()
  }, [page, search])

  return {
    category,
    fetchGetAllCategory,
    fetchUpdateCategory,
    fetchCreateCategory,
    fetchDeleteCategory,
    page,
    setPage,
    pagination,
    search,
    setSearch,
    searchError,
    errors,
    setErrors
  }
}

export default useCategory