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
      <div className="d-flex justify-content-between align-items-center mb-3">
        
        <h3 className="mb-0">
          Categories
        </h3>

        <button className="btn btn-success" onClick={openModalCreate}>
          <i className="bi bi-plus-lg me-2"></i>
          Add Category
        </button>

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
