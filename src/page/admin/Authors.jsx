import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import useAuthor from '../../hook/useAuthor';
import Modal from '../../components/ui/Modal'
import Textarea from '../../components/ui/Textarea';
import { validateAuthor } from "../../validations/AuthorSchema";
function Authors() {
  const { author, search, setSearch, updateAuthor, getAllAuthor, deleteAuthor ,createAuthor } = useAuthor(1, { per_page: 1000 });
  const [isModalEdit, setIsModalEdit] = useState(false)
  const [isModalDelete, setIsModalDelete] = useState(false)
  const [isModalCreate, setIsModalCreate] = useState(false)
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ author_name: '', biography: '' })
  const [selectedId, setSelectedId] = useState(null);
  const filteredAuthors = author.filter((data) =>
    data.author_name.toLowerCase().includes(search.toLowerCase())
  );
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

  const openModalCreate = () =>{
    setIsModalCreate(true)
    setErrors({})
    setFormData({
      author_name: '',
      biography:  ''
    })
  }

  const openModelEdit = (data) => {
    setErrors({})
    setSelectedId(data.id)
    setIsModalEdit(true)
    setFormData({
      author_name: data.author_name || '',
      biography: data.biography || ''
    })
  }

  const openModalDelete = (data) => {
    setSelectedId(data.id)
    setIsModalDelete(true)
  }

  const handleDelete = async () => {
    if (!selectedId) {
      return
    }
    await deleteAuthor(selectedId)
    setIsModalDelete(false)
    setSelectedId(null)

    await getAllAuthor()
  }

  const handleEdit = async () => {
    const validationError = validateAuthor(formData)
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError)
      return;
    }
    setErrors({})
    await updateAuthor(selectedId, formData)
    setIsModalEdit(false)
    await getAllAuthor()
  }

  const hanldeCreate = async () =>{
    const validationError = validateAuthor(formData)
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError)
      return;
    }
    setErrors({})
    await createAuthor(formData)
    setIsModalCreate(false)
    await getAllAuthor()
  }
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* HEADER */}
      <div
        className="py-5 rounded-4"
        style={{
          background: 'linear-gradient(135deg,#1a1a2e,#0f3460)',
        }}
      >
        <div className="container">
          <div className="row align-items-center">

            {/* LEFT */}
            <div className="col-md-6 mb-3 mb-md-0">
              <h2 className="text-white fw-bold mb-1">
                Meet the Authors
              </h2>

              <p className="text-white-50 mb-3">
                {author.length} contributors
              </p>

              {/* Button group */}
              <div className="d-flex gap-2">
                <button className="btn btn-success btn-sm px-3" onClick={openModalCreate}>
                  <i className="bi bi-person-plus me-2"></i>
                  Create
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-md-6 d-flex justify-content-md-end">
              <div style={{ width: "100%", maxWidth: "320px" }}>
                <Input
                  icon="bi bi-search"
                  placeholder="Search authors..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row mt-5">
          {author.map((data , index) => (
            <div className="col-md-6 col-lg-4 mb-4 d-flex" key={data.id}>
              <Card
                className="author-card w-100 h-100 d-flex flex-column"
                header={
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          background: 'linear-gradient(135deg,#0d6efd,#6ea8fe)',
                          color: '#f3eeee',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                        }}
                      >
                        {data.author_name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>

                      <strong className="text-dark">{data.author_name}</strong>
                    </div>

                    <span
                      className="badge"
                      style={{
                        background: '#e7f1ff',
                        color: '#0d6efd',
                        border: '1px solid #cfe2ff',
                        fontSize: '0.75rem',
                        borderRadius: 20,
                      }}
                    >
                      ID: {index + 1}
                    </span>
                  </div>
                }
                footer={
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Created: {new Date(data.created_at).toLocaleDateString()}
                    </small>

                    {/* ACTION BUTTONS */}
                    <div className="d-flex gap-2">
                      {/* EDIT */}
                      <button
                        className="btn btn-sm"
                        style={{
                          borderRadius: 10,
                          background: '#fff3cd',
                          color: '#856404',
                          border: '1px solid #ffeeba',
                        }}
                        onClick={() => openModelEdit(data)}
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        className="btn btn-sm"
                        style={{
                          borderRadius: 10,
                          background: '#f8d7da',
                          color: '#721c24',
                          border: '1px solid #f5c6cb',
                        }}
                        onClick={() => openModalDelete(data)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                }
              >
                <p
                  className="mb-0"
                  style={{
                    color: '#6c757d',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    height : '50px'
                  }}
                >
                  {data.biography.length > 120
                    ? data.biography.slice(0, 120) + '...'
                    : data.biography}
                </p>
              </Card>
            </div>
          ))}

          {/* not found */}
          <div className="row mt-5">

            {filteredAuthors.length > 0 ? (
              filteredAuthors.map((data) => (
                <div className="col-md-6 col-lg-4 mb-4 d-flex" key={data.id}>
                  {/* CARD HERE */}
                </div>
              ))
            ) : (
              <div className="text-center py-5 w-100">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2748/2748614.png"
                  alt="Not found"
                  style={{ width: 120, opacity: 0.7 }}
                />
                <h5 className="mt-3 text-muted">No authors found</h5>
                <p className="text-muted">Try searching with different keywords</p>
              </div>
            )}

          </div>

          {/* Modal edit */}
          <Modal
            isOpen={isModalEdit}
            onClose={() => setIsModalEdit(false)}
            title={'Update Information Authors'}
            onSave={handleEdit}
            saveText='save Update'
            btnColorSave='btn-success'
            children={
              <div>
                <div className='mb-3'>
                  <Input className='mb-5'
                    width='100%'
                    label='Name Author'
                    placeholder='enter name author'
                    icon='bi bi-person-badge'
                    name={'author_name'}
                    value={formData.author_name}
                    error={errors.author_name}
                    onChange={handleChange}
                  />
                </div>
                <Textarea
                  width='100%'
                  label='biography'
                  placeholder='enter biography'
                  icon='bi bi-journal-text'
                  name={'biography'}
                  value={formData.biography}
                  error={errors.biography}
                  onChange={handleChange}
                />
              </div>
            }
          />

          {/* modal delete */}
          <Modal
            isOpen={isModalDelete}
            onClose={() => setIsModalDelete(false)}
            title={'Confirm Delete'}
            onSave={handleDelete}
            saveText='Yes'
            btnColorSave='btn-danger'
            children={
              <div className="text-center">
                <p className="text-muted">
                  Are you sure you want to delete this author? This action cannot be undone.
                </p>
              </div>
            }
          />

          {/* modal create */}
          <Modal
          isOpen={isModalCreate}
          onClose={()=> setIsModalCreate(false)}
          title={'Create New Author'}
          onSave={hanldeCreate}
          saveText='save'
          children={
            <div>
                <div className='mb-3'>
                  <Input className='mb-5'
                    width='100%'
                    label='Name Author'
                    placeholder='enter name author'
                    icon='bi bi-person-badge'
                    value={formData.author_name}
                    name={'author_name'}
                    error={errors.author_name}
                    onChange={handleChange}
                  />
                </div>
                <Textarea
                  width='100%'
                  label='biography'
                  placeholder='enter biography'
                  icon='bi bi-journal-text'
                  value={formData.biography}
                  name={'biography'} 
                  error={errors.biography}     
                  onChange={handleChange}           
                />
              </div>
          }
          />
        </div>
      </div>
    </div>
  );
}

export default Authors;
