import React, { useEffect, useState } from 'react'
import Table from '../../components/ui/Table'
import useCategory from '../../hook/useCategory'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Pagination from '../../components/ui/Pagination'
import { validateCategory } from '../../validations/CategorySchema'
function category() {

  const {category ,
    fetchUpdateCategory , 
    fetchCreateCategory ,
    fetchGetAllCategory , 
    fetchDeleteCategory,
    pagination,
    page,
    setPage,
    search,
    setSearch,
    searchError,
    errors,
    setErrors
  } = useCategory()
  const [openEdit , setOpenEdit] = useState(false)
  const [openAdd , setOpenAdd] = useState(false)
  const [openDelete , setOpenDelete] = useState(false)
  const [selectData , setSelectData] = useState({id: null , category_name : ''})
  const openModalEdit = (data) =>{
    setErrors(false)
    setOpenEdit(true)
    setSelectData(
      {
        id : data.id,
        category_name : data.category_name
      })
  }
  const openModalCreate = () =>{
    setErrors(false)
    setOpenAdd(true)
    setSelectData({
      id : null,
      category_name : ''
    })
  }

  const openModalDelete = (data) =>{
    setOpenDelete(true)
    setSelectData({id : data.id})
  }
  const handleUpdate = async () =>{
    const result = await fetchUpdateCategory(selectData.id , {
      category_name : selectData.category_name
    })
    if (!result) {
      return;
    }
    setOpenEdit(false)
  }

  const handleCreate = async () =>{
    const result = await fetchCreateCategory({
      category_name : selectData.category_name
    })
     if (!result) {
      return
     }
    await fetchGetAllCategory()
    setOpenAdd(false)
    setSelectData({
      id : null,
      category_name : ''
    })
  }

  const handleDelete = async () =>{
    await fetchDeleteCategory(selectData.id)
    await fetchGetAllCategory()
    setOpenDelete(false)
  }

  const columns = [
    {
      header: "No",
      render: (row, index) =>
        (page - 1) * 5 + index + 1
    },
    {
      header: "Category Name",
      render: (row) => (
        <span className="badge-category">
          {row?.category_name}
        </span>
      ),
    },
    {
      header: "Action",
      className: "text-center",
      cellClassName: "text-center",
      render: (row) => (
        <div className="d-flex justify-content-center gap-2">
          <button onClick={() => openModalEdit(row)}
            className="btn btn-sm btn-primary"
          >
            <i className="bi bi-pencil-square"></i>
          </button>

          <button onClick={()=> openModalDelete(row)}
            className="btn btn-sm btn-danger"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-3">

      {/* Top Header */}
      <div className="card border-0 rounded-4 p-4 mb-4 bg-white shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3.5">
            <div
              className="rounded-4 d-flex align-items-center justify-content-center p-3 shadow flex-shrink-0"
              style={{
                width: "60px",
                height: "60px",
                padding: "14px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                boxShadow: "0 8px 22px rgba(139, 92, 246, 0.25)",
              }}
            >
              <i className="bi bi-collection-fill fs-2"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0 ms-3" style={{ letterSpacing: "-0.5px" }}>Categories</h2>
              <p className="text-muted small mb-0 ms-3">Organize literature into genres and academic collections</p>
            </div>
          </div>

          <button
            className="btn text-white rounded-pill px-3.5 py-2.5 shadow-sm d-inline-flex align-items-center gap-2 fw-semibold"
            style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)", border: "none" }}
            onClick={openModalCreate}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Category</span>
          </button>
        </div>
      </div>
      {/* search */}
      <div className='mt-2 mb-2'>
        <Input
        icon='bi bi-search'
        placeholder='search'
        value={search}
        error={searchError}
        onChange={(e) =>{
          setSearch(e.target.value)
          setPage(1)
        }}
        />
      </div>
      {/* Table */}
      <Table
        columns={columns}
        data={category}
        hover={false}
      />
      {/* modal edit*/}
      <Modal 
      isOpen={openEdit}
      onClose={() => setOpenEdit(false)}
      title={"Update category"}
      saveText='Update'
      onSave={handleUpdate}
      children={
        <div className='p-2'>
          <Input
          width='100%'
          icon='bi bi-tags'
          placeholder='category Name'
          error={errors.category_name}
          value={selectData.category_name}
          onChange={(e)=>{
            setSelectData({
              ...selectData,
              category_name: e.target.value
            });
            if (errors.category_name) {
              setErrors({});
            }
          }
          }
          />
        </div>
      }
      />
      {/* model create */}
      <Modal 
      isOpen={openAdd}
      onClose={() => setOpenAdd(false)}
      title={"Create New category"}
      saveText='Save'
      onSave={handleCreate}
      btnColorSave='btn-success'
      children={
        <div className='p-2'>
          <Input
          width='100%'
          icon='bi bi-tags'
          placeholder='category Name'
          error={errors.category_name}
          value={selectData.category_name}
          onChange={(e) =>
            setSelectData({
              ...selectData ,
              category_name : e.target.value
            })
          }
          />
        </div>
      }
      />
      {/* model delete */}
      <Modal
      isOpen={openDelete}
      onClose={()=> setOpenDelete(false)}
      saveText='Delete'
      onSave={handleDelete}
      btnColorSave='bg-danger text-white'
      children={
        <div className='text-center mt-3'>
          <h5>Do you want delete category?</h5>
        </div>
      }
      />
      <Pagination
        currentPage={page}
        totalPages={pagination.totalPage}
        onPageChange={setPage}
      />
    </div>
  )
}

export default category
