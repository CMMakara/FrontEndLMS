import { useEffect, useState } from "react"
import { createPublishersAPI, deletePublishersAPI, getAllPublishersAPI, updatePublishersAPI } from "../services/publishersService"
import { useToast } from '../context/ToastContext.jsx'
const usePublishers = () =>{
  const [publishers , setPublishers] = useState([])
  const { showToast } = useToast()
  const getAllPublishers = async () =>{
    try {
      let res = await getAllPublishersAPI()
      let data = res.data || []
      setPublishers(data)
      return true
    } catch (error) {
      console.log(error)
    }
  }

  const updatePublishers = async (id, data) =>{
    try {
      let res = await updatePublishersAPI(id , data)
      if(res.result === false){
        showToast(res?.data, "error");
        return false
      }
      showToast('update Publisher success' , 'success')
      return true
    } catch (error) {
      console.log(error)
    }
  }

  const createPublishers = async (data) =>{
    try {
      let res = await createPublishersAPI(data)
      if(res.result === false){
        showToast(res?.data, "error");
        return false
      }
      showToast('Create Publisher success' , 'success')
      return true
    } catch (error) {
      console.log(error)
    }
  }

  const deletePublishers = async (id) =>{
    try {
      let res = await deletePublishersAPI(id)
      if(res.result === false){
        showToast(res?.data, "error");
        return false
      }
      showToast('Delete Publisher success' , 'success')
      return true
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getAllPublishers()
  },[])

  return{
    getAllPublishers,
    publishers,
    updatePublishers,
    createPublishers,
    deletePublishers
  }
}

export default usePublishers