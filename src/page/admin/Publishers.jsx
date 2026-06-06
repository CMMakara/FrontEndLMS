import React, { useState } from "react";
import usePublishers from "../../hook/usePublishers";
import Table from "../../components/ui/Table";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal"
import {validatePublisher} from '../../validations/PublishersSchema'

function Publishers() {
  const { publishers , getAllPublishers , updatePublishers , createPublishers ,deletePublishers} = usePublishers();
  const [isModalEdit, setIsModalEdit] = useState(false)
  const [isModalDelete, setIsModalDelete] = useState(false)
  const [isModalCreate, setIsModalCreate] = useState(false)
  const [selectId, setSelectId] = useState(null)
  const [formData, setFormData] = useState({
    publisher_name: '',
    phone: '',
    address: ''
  })
  const [errors, setErrors] = useState({});
  const columns = [
    {
      header: "ID",
      render: (_, index) => index + 1,
    },
    {
      header: "Publisher Name",
      accessor: "publisher_name",
    },
    {
      header: "Phone",
      accessor: "phone",
    },
    {
      header: "Created At",
      accessor: "created_at",
      render: (row) =>
        new Date(row.created_at).toLocaleDateString(),
    },
    {
      render: (row) => (
        <div className="row-actions">
          <button onClick={() => openModalEdit(row)}>
            <i className="bi bi-pencil text-warning"></i>
          </button>

          <button onClick={() => openModalDelete(row)}>
            <i className="bi bi-trash text-danger"></i>
          </button>
        </div>
      ),
    }
  ];
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }
  const openModalEdit = (data) => {
    setIsModalEdit(true)
    setErrors({})
    setSelectId(data.id)
    setFormData({
      publisher_name: data.publisher_name || '',
      phone: data.phone || '',
      address: data.address || ''
    })
  }

  const handleEdit = async () => {
    const validationError = validatePublisher(formData)
      if (Object.keys(validationError).length > 0) {
        setErrors(validationError)
        return;
      }
      setErrors({})
    await updatePublishers(selectId , formData)
    setIsModalEdit(false)
    await getAllPublishers()
  }

  const openModalCreate = () =>{
    setIsModalCreate(true)
    setErrors({})
    setFormData({
      publisher_name:  '',
      phone: '',
      address: ''
    })
  }
  const handleCreate = async()=>{
    const validationError = validatePublisher(formData)
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError)
        return;
    }
    setErrors({})
    await createPublishers(formData)
    setIsModalCreate(false)
    await getAllPublishers()
  }

  const openModalDelete = (data) =>{
    setIsModalDelete(true)
    setSelectId(data.id)
  }
  const handleDelete = async () =>{
    if(!selectId){
      return 
    }
    await deletePublishers(selectId)
    setIsModalDelete(false)
    await getAllPublishers()
  }
  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div
        className="p-4 rounded-4 mb-4"
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h2 className="text-white fw-bold mb-1">
              Publishers Management
            </h2>

            <p className="text-white-50 mb-0">
              Manage all publishers in your system
            </p>
          </div>

          <button className="btn btn-success" onClick={openModalCreate}>
            <i className="bi bi-plus-circle me-2"></i>
            Create Publisher
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted">
                    Total Publishers
                  </h6>

                  <h3 className="fw-bold">
                    {publishers.length}
                  </h3>
                </div>

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 15,
                    background: "#e7f1ff",
                  }}
                >
                  <i
                    className="bi bi-buildings"
                    style={{
                      fontSize: "1.5rem",
                      color: "#0d6efd",
                    }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">
              Publisher List
            </h5>

            <div className="input-group" style={{ width: 300 }}>
              <Input
                icon="bi bi-search"
                placeholder="Search "
              />
            </div>
          </div>
        </div>

        <div className="card-body">
          <Table
            columns={columns}
            data={publishers}
            hover={false}
          />
        </div>
      </div>

      {/* modal edit */}
      <Modal
        isOpen={isModalEdit}
        onClose={() => setIsModalEdit(false)}
        onSave={handleEdit}
        saveText="update"
        btnColorSave="btn-success"
        title='Update Publisher'
        children={
          <div>
            <div>
              <Input
                label="Publisher Name"
                width="100%"
                icon="bi bi-building"
                placeholder="Enter Publisher Name"
                name="publisher_name"
                value={formData.publisher_name}
                error={errors.publisher_name}
                onChange={handleChange}
              />
            </div>
            <div className="mt-3">
              <Input
                label="Phone Nubmer"
                width="100%"
                icon="bi bi-telephone-outbound"
                placeholder="Enter Phone Nubmer"
                name="phone"
                value={formData.phone}
                error={errors.phone}
                onChange={handleChange}
              />
            </div>
            <div className="mt-3">
              <Input
                label="Address Publisher"
                width="100%"
                icon="bi bi-house"
                placeholder="Enter Address"
                name="address"
                value={formData.address}
                error={errors.address}
                onChange={handleChange}
              />
            </div>
          </div>
        }
      />

      {/* modal create */}
      <Modal
      isOpen={isModalCreate}
      onClose={()=> setIsModalCreate(false)}
      onSave={handleCreate}
      saveText="Save"
      title='create New Publisher'
      children={
          <div>
            <div>
              <Input
                label="Publisher Name"
                width="100%"
                icon="bi bi-building"
                placeholder="Enter Publisher Name"
                name="publisher_name"
                value={formData.publisher_name}
                error={errors.publisher_name}
                onChange={handleChange}
              />
            </div>
            <div className="mt-3">
              <Input
                label="Phone Nubmer"
                width="100%"
                icon="bi bi-telephone-outbound"
                placeholder="Enter Phone Nubmer"
                name="phone"
                value={formData.phone}
                error={errors.phone}
                onChange={handleChange}
              />
            </div>
            <div className="mt-3">
              <Input
                label="Address Publisher"
                width="100%"
                icon="bi bi-house"
                placeholder="Enter Address"
                name="address"
                value={formData.address}
                error={errors.address}
                onChange={handleChange}
              />
            </div>
          </div>
        }
      />

      {/* modale delete */}
      <Modal
      isOpen={isModalDelete}
      onClose={()=>setIsModalDelete(false)}
      title="Confirm Delete"
      onSave={handleDelete}
      saveText="Yes"
      btnColorSave="btn-danger"
      children={
        <div>
          <p className="mt-3 mb-3 text-center">
            Are you sure you want to delete this publisher?
          </p>
        </div>
      }
      />
    </div>
  );
}

export default Publishers;