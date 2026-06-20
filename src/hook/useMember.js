import { useEffect, useState } from "react"
import { getAllMemberAPI } from "../services/memberService"

const useMember = ({ search = "", perPage = 5, } = {}) => {

  const [members, setMembers] = useState([])
  const [allMembers, setAllMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  const getAllMember = async () => {
    try {
      let res = await getAllMemberAPI({
        page,
        per_page: perPage,
        search,
      })
      let data = res.data || []
      setMembers(data)
      setPagination({
        total: res.pagination.total || 0,
        totalPages: res.pagination.totalPage || 0,
        per_page: res.pagination.per_page || 0
      });
      return true
    } catch (error) {
      console.log(error)
    }
  }
  const getAllMembersForStats = async () => {
    try {
      let res = await getAllMemberAPI({
        page: 1,
        per_page: 10000,
        search,
      });

      setAllMembers(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllMember()
  }, [search, page, perPage])

  useEffect(() => {
    getAllMembersForStats()
  }, []);

  return {
    members,
    page,
    setPage,
    pagination,
    allMembers,
    getAllMember
  }
}

export default useMember