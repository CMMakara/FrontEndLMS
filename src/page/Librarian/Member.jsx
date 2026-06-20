import React, { useEffect, useState } from 'react';
import '../../assets/member.css';
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Table from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import useMember from '../../hook/useMember'
import useBorrow from '../../hook/useBorrow'
import Modal from '../../components/ui/Modal'
import useUser from '../../hook/useUsers';
import { validateCreateUser } from "../../validations/CreateUserSchema";
const Members = () => {
  // State Management
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isModal, setIsModal] = useState(false)
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    role_id: 3,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { members, allMembers, getAllMember } = useMember({ search: searchQuery, perPage: 10000 });
  const { borrow, getAllBorrowRecord } = useBorrow()
  const { createUser, getAllUsers } = useUser()

  useEffect(() => {
    getAllBorrowRecord('', 1, 10000);
  }, []);

  useEffect(() => {
    getAllMember()
  }, [searchQuery, currentPage])

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
    try {
      const errors = validateCreateUser(form, [3])
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return
      }
      const payload = {
        ...form,
        role_id: Number(form.role_id)
      };

      const result = await createUser(payload);

      if (!result) {
        console.log("Create failed");
        return;
      }

      setIsModal(false);

      setForm({
        full_name: '',
        username: '',
        email: '',
        password: '',
        role_id: 3,
      });

      setErrors({});

      await getAllMember();

      setCurrentPage(1);
    } catch (error) {
      console.log("Create error:", error);
    }
  };

  const baseURL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

  const column = [
    {
      header: "No",
      render: (row, index) =>
        (currentPage - 1) * 5 + index + 1
    },
    {
      header: 'Member Info',
      accessor: '',
      render: (row) => {
        const imagePath = row.profile_image
          ? row.profile_image.replace('/uploads/', '')
          : 'profiles/default-profile.png';

        return (
          <div className="d-flex align-items-center gap-2">
            <img
              src={`${import.meta.env.VITE_API_URL}${imagePath}`}
              alt={row.full_name}
              width={40}
              height={40}
              className="rounded-circle"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = `${import.meta.env.VITE_API_URL}profiles/default-profile.png`;
              }}
            />

            <div>
              <div>{row.full_name}</div>
              <small className="text-muted">
                {row.member_code}
              </small>
            </div>
          </div>
        );
      }
    },
    { header: 'phone', accessor: 'phone' },
    { header: 'email', accessor: 'email' },
    { header: 'member type', accessor: 'member_type' },
    {
      header: 'Verified',
      render: (row) =>
        row.is_verified ? (
          <span className="badge bg-success">Verified</span>
        ) : (
          <span className="badge bg-danger">Not Verified</span>
        )
    },
    { header: 'Books Borrowing', accessor: 'total_borrow' },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const status = row.status;

        let color = "secondary";

        if (status === "active") color = "success";
        else if (status === "inactive") color = "danger";
        return (
          <span className={`badge bg-${color}`}>
            {formatLabel(status)}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessor: "action",
      render: (row) => (
        <div className="action-cell">
          <button
            className="action-btn view-details"
            title="View Details"
            onClick={() => handleSelectMember(row)}
          >
            <i className="bi bi-eye"></i>
          </button>
        </div>
      ),
    }
  ]

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const columBorrow = [
    { header: 'Borrow ID', accessor: 'id' },
    { header: 'Book Title', accessor: 'book_title' },
    {
      header: 'Borrow Date',
      accessor: 'borrow_date',
      render: (row) => formatDate(row.borrow_date),
    },
    {
      header: 'Due Date',
      accessor: 'due_date',
      render: (row) => formatDate(row.due_date),
    },
    {
      header: 'Return Date',
      accessor: 'return_date',
      render: (row) => formatDate(row.return_date),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const status = row.status;

        const colors = {
          borrowed: 'bg-primary',
          returned: 'bg-success',
          overdue: 'bg-danger',
          lost: 'bg-dark',
        };

        return (
          <span className={`badge ${colors[status] || 'bg-secondary'}`}>
            {formatLabel(status)}
          </span>
        );
      },
    }
  ]

  const formatLabel = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

  const filteredMembers = members.filter(member => {
    const matchesStatus =
      statusFilter === 'All' ||
      String(member.is_verified) === statusFilter;

    const matchesType =
      typeFilter === 'All' ||
      (member.member_type ?? '').toLowerCase() === typeFilter.toLowerCase();

    return matchesStatus && matchesType;
  });


  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

  const summaryStats = [
    { title: 'Total Members', value: allMembers.length, icon: 'bi-people-fill', color: '#00C18F' },
    { title: 'Active Members', value: allMembers.filter(m => m.status === 'active').length, icon: 'bi-person-check-fill', color: '#3B82F6' },
    { title: 'Members Borrowing', value: allMembers.filter(m => m.currently_borrowing > 0).length, icon: 'bi-book-half', color: '#8B5CF6' },
    { title: 'Overdue Books', value: allMembers.reduce((sum, m) => sum + Number(m.overdue_books || 0), 0), icon: 'bi-exclamation-circle-fill', color: '#EF4444' }
  ];

  const getProfileImage = (img) => {
    if (!img || typeof img !== "string") {
      return `${baseURL}/profiles/default-profile.png`;
    }

    const cleanImg = img.trim();
    if (cleanImg.startsWith("http")) return cleanImg;
    if (cleanImg.startsWith("/uploads/")) return `${baseURL}${cleanImg.replace("/uploads", "")}`;
    if (cleanImg.startsWith("profiles/")) return `${baseURL}/${cleanImg}`;
    return `${baseURL}/profiles/${cleanImg.replace(/^\/+/, "")}`;
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setTypeFilter('All');
    setCurrentPage(1);
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
  };

  const memberBorrowHistory = selectedMember
    ? borrow.filter(item => String(item.member_code) === String(selectedMember.member_code))
    : [];

  return (
    <div className="members-page">
      <div className="members-container">
        <div className="members-main">
          <div className="row p-3">
            <div className="col-6">
              <h1 className="page-title">Members</h1>
              <p className="page-subtitle">Manage and monitor library members.</p>
            </div>
            <div className="col-6 d-flex align-items-center justify-content-end">
              <button className="btn btn-primary" onClick={openModal}>
                <i className="bi bi-person-plus-fill me-2"></i>
                Create Member
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards-grid">
            {summaryStats.map((stat, index) => (
              <div key={index} className="summary-card">
                <div className="summary-card-content">
                  <div className="summary-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                    <i className={`bi ${stat.icon}`}></i>
                  </div>
                  <div className="summary-info">
                    <p className="summary-title">{stat.title}</p>
                    <h3 className="summary-value">{stat.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Filter Section */}
          <div className="search-filter-card">
            <div className="search-filter-content">
              <div className="search-input-wrapper">
                <Input
                  width='100%'
                  icon='bi-search'
                  placeholder='Search name, phone, email'
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset page on text search change
                  }}
                />
              </div>

              <div className="filters-group">
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1); // Forces pagination back to page 1 on selection
                  }}
                  options={[
                    { value: 'All', label: 'All Status' },
                    { value: '1', label: 'verified' },
                    { value: '0', label: 'not verified' },
                  ]}
                />
                <Select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1); // Forces pagination back to page 1 on selection
                  }}
                  options={[
                    { value: 'All', label: 'All Types' },
                    { value: 'student', label: 'Student' },
                    { value: 'teacher', label: 'Teacher' },
                    { value: 'staff', label: 'Staff' },
                    { value: 'guest', label: 'Guest' },
                  ]}
                />
              </div>

              <div className="filter-actions">
                <button className="btn btn-primary-small">
                  <i className="bi bi-funnel"></i> Search
                </button>
                <button className="btn btn-reset" onClick={handleReset}>
                  <i className="bi bi-arrow-clockwise"></i> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="members-table-card">
            <div className="table-header">
              <h3 className="table-title">Member List</h3>
              <span className="table-count">{filteredMembers.length} members found</span>
            </div>

            <div className="table-responsive">
              <Table
                columns={column}
                data={paginatedMembers} /* Feeds properly sliced, filtered pages to your table view */
                hover={false}
              />
            </div>

            {/* Pagination handles local component state */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Borrowing History Section */}
          {selectedMember && (
            <div className="borrowing-history-card">
              <div className="section-header">
                <h3 className="section-title">Borrow History</h3>
                <span className="section-subtitle">Recent borrowing activities</span>
              </div>
              <div className="table-responsive">
                <Table
                  columns={columBorrow}
                  data={memberBorrowHistory}
                  hover={false}
                />
              </div>
            </div>
          )}

          {/* Recent Activities Section */}
          {selectedMember && (
            <div className="recent-activities-card">
              <div className="section-header">
                <h3 className="section-title">Recent Activities</h3>
                <span className="section-subtitle">Latest member activities</span>
              </div>
              <div className="activities-timeline">
                {memberBorrowHistory.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="timeline-item">
                    <div className="timeline-marker">
                      <i className={`bi ${activity.status === "returned" ? "bi-check-circle-fill" : activity.status === "overdue" ? "bi-exclamation-circle-fill" : "bi-book"}`}></i>
                    </div>
                    <div className="timeline-content">
                      <p className="activity-action text-capitalize">{activity.status}</p>
                      <p className="activity-detail">{activity.book_title}</p>
                      <span className="activity-date">{formatDate(activity.borrow_date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        {selectedMember && (
          <aside className="members-sidebar">
            <div className="member-details-card">
              <div className="member-header">
                <img
                  src={getProfileImage(selectedMember?.profile_image)}
                  className="member-avatar"
                  alt={selectedMember?.full_name || "profile"}
                />
                <h4 className="member-name-large">{selectedMember.full_name}</h4>
                <p className="member-id-large ">{selectedMember.user_id}</p>
              </div>

              <div className="member-info-grid">
                <div className="info-item"><label>Email</label><p>{selectedMember.email}</p></div>
                <div className="info-item"><label>Phone</label><p>{selectedMember.phone || 'N/A'}</p></div>
                <div className="info-item"><label>Gender</label><p>{selectedMember.gender}</p></div>
                <div className="info-item"><label>Member Type</label><p>{selectedMember.member_type}</p></div>
                <div className="info-item"><label>Address</label><p>{selectedMember.address || 'N/A'}</p></div>
                <div className="info-item"><label>Registration Date</label><p>{selectedMember.registered_date}</p></div>
                <div className="info-item">
                  <label>Status</label>
                  <p><span className={`status-badge status-${selectedMember?.status.toLowerCase()}`}>{selectedMember.status}</span></p>
                </div>
              </div>

              <div className="divider"></div>

              <div className="summary-info-section">
                <h5 className="summary-section-title">Summary</h5>
                <div className="summary-item"><span className="summary-label">Favorite Category</span><span className="summary-value-text">{selectedMember.favorite_category}</span></div>
                <div className="summary-item"><span className="summary-label">Total Borrowed Books</span><span className="summary-value-text">{selectedMember.total_borrow}</span></div>
                <div className="summary-item"><span className="summary-label">Currently Borrowing</span><span className="summary-value-text">{selectedMember.currently_borrowing}</span></div>
                <div className="summary-item"><span className="summary-label">Overdue Books</span><span className="summary-value-text danger">{selectedMember.overdue_books}</span></div>
                <div className="summary-item">
                  <span className="summary-label">Unpaid Fine</span>
                  <span className="summary-value-text danger">$ {(selectedMember.unpaid_fine / 4100).toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Last Borrow Date</span>
                  <span className="summary-value-text">
                    {selectedMember.last_borrow_date
                      ? new Date(selectedMember.last_borrow_date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* modal */}
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
          </div>
        }
      />
    </div>
  );
};

export default Members;