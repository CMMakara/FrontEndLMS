import React, { useState } from 'react';
import Table from '../../components/ui/Table';
import useUsers from '../../hook/useUsers';
import Pagination from '../../components/ui/Pagination';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import { validateCreateUser } from "../../validations/CreateUserSchema";
function User() {
  const {
    users,
    page,
    pagination,
    setPage,
    order,
    setOrder,
    search,
    setSearch,
    createUser,
    getAllUsers,
  } = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    role_id: '',
  });
  const columns = [
    {
      header: 'No',
      render: (row, index) => (page - 1) * 10 + index + 1,
    },
    { header: 'Full Name', accessor: 'full_name' },
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Role Name',
      render: (row) => {
        const colors = {
          admin: 'bg-danger',
          librarian: 'bg-primary',
          member: 'bg-success',
        };

        return (
          <span className={`badge ${colors[row.role_name?.toLowerCase()] || 'bg-secondary'}`}>
            {row.role_name}
          </span>
        );
      },
    },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: 'address' },
    { header: 'Gender', accessor: 'gender' },
    {
      header: 'Is Verified',
      render: (row) => {
        const colors = {
          1: 'bg-danger',
          0: 'bg-success',
        };

        return (
          <span className={`badge ${colors[row.is_verified] || 'bg-secondary'}`}>
            {row.is_verified === 1 ? 'Verified' : 'Not Verified'}
          </span>
        );
      },
    },
    {
      header: 'Created At',
      render: (row) => {
        if (!row.created_at) return 'N/A';
        const date = new Date(row.created_at);
        return date.toLocaleDateString('en-GB');
      },
    },

  ];
  const getProfileImage = (user) => {
    const baseUrl = import.meta.env.VITE_API_URL;
    // fallback image
    const defaultImg = `${baseUrl}/profiles/default-profile.png`;

    // no image case
    if (
      !user?.profile_image ||
      user.profile_image === '/uploads/default-profile.png' ||
      user.profile_image === '/uploads/profiles/default-profile.png'
    ) {
      return defaultImg;
    }

    // clean path (avoid double slash)
    const path = user.profile_image.startsWith('/')
      ? user.profile_image.slice(1)
      : user.profile_image;

    return `${baseUrl}/${path}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "", // clear field error
    }));
  };
  const openModal = () => {
    setForm({
      full_name: '',
      username: '',
      email: '',
      password: '',
      role_id: 3,
    });
    setErrors({});
    setIsModal(true);
  }
  const handleCreate = async () => {
    const errors = validateCreateUser(form, [1,2,3])
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return
    }
    let result = await createUser(form);
    if (!result) return;
    await getAllUsers();
    setIsModal(false);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Left Title */}
        <h1 className="text-xl fw-semibold mb-0">Users</h1>

        {/* Right Controls */}
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-primary fs-6">
            Total: {pagination?.total || 0}
          </span>

          <select
            className="form-select form-select-sm shadow-sm"
            style={{
              width: '150px',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              cursor: 'pointer',
            }}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="asc">Oldest</option>
            <option value="desc">Newest</option>
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={openModal}
        >
          <i className="bi bi-person-plus"></i>
          Create User
        </button>

        <div style={{ flex: 1, maxWidth: '320px' }}>
          <Input
            icon="bi bi-search"
            placeholder="search user"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>
      <Table
        columns={columns}
        data={users || null}
        hover={true}
        onRowClick={(row) => {
          setSelectedUser(row);
        }}
      />

      <Pagination
        currentPage={page}
        totalPages={pagination.totalPage}
        onPageChange={setPage}
      />

      {selectedUser && (
        <div
          onClick={() => setSelectedUser(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '450px' }}
          >
            <Card
              header={
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">User Profile</div>
                    <small className="text-muted">System Account</small>
                  </div>

                  <span className="badge bg-light text-dark border">
                    ID: {selectedUser?.user_id}
                  </span>
                </div>
              }
              footer={
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Status</small>
                  <span
                    className={`badge ${selectedUser?.status === 'active'
                      ? 'bg-success'
                      : 'bg-secondary'
                      }`}
                  >
                    {selectedUser?.status || 'unknown'}
                  </span>
                </div>
              }
            >
              {/* BODY */}
              <div className="text-center">
                <img
                  src={getProfileImage(selectedUser)}
                  alt={selectedUser?.full_name}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #f1f1f1',
                  }}
                />

                <h5 className="mt-3 mb-0 fw-bold">{selectedUser?.full_name}</h5>
                <small className="text-muted">@{selectedUser?.username}</small>

                <div className="mt-2">
                  <span
                    className={`badge ${selectedUser?.role_name?.toLowerCase() === 'admin'
                      ? 'bg-danger'
                      : selectedUser?.role_name?.toLowerCase() === 'librarian'
                        ? 'bg-primary'
                        : selectedUser?.role_name?.toLowerCase() === 'member'
                          ? 'bg-success'
                          : 'bg-secondary'
                      }`}
                  >
                    {selectedUser?.role_name}
                  </span>
                </div>

                <hr />

                <div className="text-start">
                  <div className="mb-2">
                    <small className="text-muted">Email</small>
                    <div>{selectedUser?.email}</div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted">Phone</small>
                      <div>{selectedUser?.phone || 'N/A'}</div>
                    </div>

                    <div className="col-6">
                      <small className="text-muted">Address</small>
                      <div className="text-truncate">
                        {selectedUser?.address || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* modal create */}
      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title="Create New User Account"
        onSave={handleCreate}
        saveText="Create"
        btnColorSave="btn-success"
        children={
          <div>
            <div className="mt-2">
              <Input
                label="Full Name"
                width="100%"
                icon="bi bi-person"
                placeholder="Enter full name"
                name="full_name"
                value={form.full_name}
                error={errors.full_name}
                onChange={handleChange}
              />
            </div>
            <div className="mt-2">
              <Input
                label="Username"
                width="100%"
                icon="bi bi-person-badge"
                placeholder="Enter UserName"
                name="username"
                value={form.username}
                error={errors.username}
                onChange={handleChange}
              />
            </div>
            <div className="mt-2">
              <Input
                label="Email"
                width="100%"
                icon="bi bi-envelope"
                placeholder="Enter email"
                name="email"
                value={form.email}
                error={errors.email}
                onChange={handleChange}
              />
            </div>
            <div className="mt-2">
              <Input
                label="password"
                width="100%"
                icon="bi bi-lock"
                placeholder="Enter password"
                type="password"
                name="password"
                value={form.password}
                error={errors.password}
                onChange={handleChange}
              />
            </div>
            <div className="mt-2 mb-2">
              <Select
                label="Role"
                width="100%"
                placeholder="Select role"
                name="role_id"
                value={form.role_id}
                error={errors.role_id}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    role_id: Number(e.target.value),
                  }))
                }
                options={[
                  { label: 'Admin', value: 3 },
                  { label: 'Librarian', value: 2 },
                  { label: 'User', value: 1 },
                ]}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default User;
