import React, { useState } from 'react';
import Table from '../../components/ui/Table';
import useUsers from '../../hook/useUsers';
import Pagination from '../../components/ui/Pagination';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input'

function User() {
  const { users, page, pagination, setPage, order, setOrder ,search ,setSearch} = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const columns = [
    {
      header: "No",
      render: (row, index) =>
        (page - 1) * 10 + index + 1
    },
    { header: 'Full Name', accessor: 'full_name' },
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: 'address' },
    { header: 'Gender', accessor: 'gender' },
    { header: 'role Name', accessor: 'role_name' },
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
    if (user?.profile_image == null) {
      return "http://localhost:3000/uploads/profiles/default-profile.png";
    }

    return `http://localhost:3000/uploads/${user.profile_image}`;
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

        <button className="btn btn-primary d-flex align-items-center gap-2">
          <i className="bi bi-person-plus"></i>
          Create User
        </button>

        <div style={{ flex: 1, maxWidth: '320px' }}>
          <Input
            icon='bi bi-search'
            placeholder='search user'
            value={search}
            onChange={(e) =>{
              setSearch(e.target.value)
              setPage(1)
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
                    className={`badge ${selectedUser?.member_status === 'active'
                      ? 'bg-success'
                      : 'bg-secondary'
                      }`}
                  >
                    {selectedUser?.member_status || 'unknown'}
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
                  <span className="badge bg-primary-subtle text-primary border">
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
                      <div>{selectedUser?.phone || '-'}</div>
                    </div>

                    <div className="col-6">
                      <small className="text-muted">Address</small>
                      <div className="text-truncate">
                        {selectedUser?.address || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
