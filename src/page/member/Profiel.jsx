import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import useUser, { broadcastUserProfile } from "../../hook/useUsers";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import useBorrow from "../../hook/useBorrow";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { getAvatarUrl, isDefaultAvatar, handleAvatarError } from "../../utils/avatar";
import "../../assets/profile.css";

const NAV_ITEMS = [
  { key: "profile", label: "My Profile", icon: "bi-person", activeIcon: "bi-person-fill", path: "" },
  { key: "orders", label: "Borrowing History", icon: "bi-clock-history", activeIcon: "bi-clock-history", path: "borrowing-history" },
  { key: "address", label: "Due Date", icon: "bi-calendar-event", activeIcon: "bi-calendar-event-fill", path: "due-date" },
];

/* ---------------- SIDEBAR COMPONENT ---------------- */
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useUser();
  const basePath = "/member/profile";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    broadcastUserProfile(null);
    navigate("/login");
  };

  const avatarSrc = getAvatarUrl(userProfile?.profile_image, userProfile?.full_name);

  return (
    <div className="d-flex flex-column h-100 justify-content-between">
      <div>
        {/* User Mini Profile in Sidebar */}
        <div className="sidebar-user-header">
          <div className="sidebar-avatar-wrapper">
            <img
              src={avatarSrc}
              alt={userProfile?.full_name || "User"}
              className="sidebar-avatar"
              onError={(e) => handleAvatarError(e, userProfile?.full_name || "User")}
            />
            <span className="sidebar-status-dot" title="Account Active"></span>
          </div>
          <h6 className="fw-bold text-dark mb-0 text-truncate" title={userProfile?.full_name}>
            {userProfile?.full_name || "Member Profile"}
          </h6>
          <small className="text-muted d-block text-truncate">
            {userProfile?.role_name ? `${userProfile.role_name} • ` : ""}
            {userProfile?.member_code || (userProfile?.user_id ? `#MEM${String(userProfile.user_id).padStart(3, "0")}` : "")}
          </small>
        </div>

        {/* Navigation items */}
        <div className="sidebar-nav-list">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.path === ""
                ? location.pathname === "/member/profile" || location.pathname === "/member/profile/"
                : location.pathname.includes(item.path);

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(`${basePath}/${item.path}`)}
                className={`sidebar-nav-btn ${isActive ? "active" : ""}`}
              >
                <i className={`bi ${isActive ? item.activeIcon : item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button type="button" className="sidebar-logout-btn" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i>
        <span>Logout</span>
      </button>
    </div>
  );
}

/* ---------------- MAIN CONTAINER WRAPPER ---------------- */
export default function Profile() {
  return (
    <div className="profile-page-wrapper">
      <div className="container py-4">
        <div className="row g-4 mx-auto">
          {/* SIDEBAR PANEL LAYOUT COLUMN */}
          <div className="col-12 col-md-4 col-lg-3">
            <div className="profile-sidebar-card position-sticky" style={{ top: "110px" }}>
              <Sidebar />
            </div>
          </div>

          {/* CONTENT SWITCHING VIEWPORT PANEL */}
          <div className="col-12 col-md-8 col-lg-9">
            <Routes>
              <Route index element={<ProfileContent />} />
              <Route path="borrowing-history" element={<BorrowingHistoryContent />} />
              <Route path="due-date" element={<DueDateContent />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- EDITORIAL CONTENT VIEWS ---------------- */
const PageHeader = ({ title, subtitle }) => (
  <div className="pb-3 mb-4 border-bottom border-light-subtle d-flex flex-column gap-1">
    <h4 className="fw-bold text-dark mb-0" style={{ letterSpacing: "-0.02em" }}>{title}</h4>
    {subtitle && <small className="text-muted">{subtitle}</small>}
  </div>
);

function ProfileContent() {
  const navigate = useNavigate();
  const { userProfile, updateProfile, getUserProfile, updateProfileImage, deleteProfileImage } = useUser();
  const { borrow, getBorrowed } = useBorrow();
  const [isModal, setIsModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const userData = userProfile;

  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    phone: "",
    email: "",
    username: "",
    address: "",
  });

  useEffect(() => {
    const uid = userProfile?.user_id || userProfile?.id;
    if (uid) {
      getBorrowed(uid);
    }
  }, [userProfile?.user_id, userProfile?.id]);

  const openModal = () => {
    setIsModal(true);
    setForm({
      full_name: userData?.full_name || "",
      gender: userData?.gender || "",
      phone: userData?.phone || "",
      email: userData?.email || "",
      username: userData?.username || "",
      address: userData?.address || "",
    });
  };

  const handleEditInformation = async () => {
    let res = await updateProfile(form);
    if (res) {
      await getUserProfile(true);
      setIsModal(false);
    }
  };

  const handleSelectImage = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    setUploadingImage(true);

    try {
      let res = await updateProfileImage(file);
      if (res) {
        setPreviewImage(null);
        await getUserProfile(true);
      }
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleDeleteImage = async () => {
    await deleteProfileImage();
    setPreviewImage(null);
    await getUserProfile(true);
  };

  if (!userData) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
        <div className="spinner-border text-primary mx-auto mb-3" role="status"></div>
        <h6 className="text-muted fw-semibold">Loading your profile...</h6>
      </div>
    );
  }

  // Calculate Member Metrics from borrow records
  const borrowList = Array.isArray(borrow) ? borrow : [];
  const activeBorrows = borrowList.filter(b => !b.return_date && b.status !== "returned").length;
  const overdueBorrows = borrowList.filter(b => b.is_overdue || b.status === "overdue").length;
  const totalBorrows = borrowList.length;
  const totalFine = borrowList.reduce((acc, b) => acc + (Number(b.fine) || 0), 0);

  const avatarSrc =
    previewImage || getAvatarUrl(userData?.profile_image, userData?.full_name);

  return (
    <div>
      {/* Profile Summary Hero Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-banner"></div>

        <div className="profile-hero-body">
          <div className="profile-avatar-row">
            {/* Avatar with Floating Badges */}
            <div className="profile-avatar-container">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />

              <img
                src={avatarSrc}
                alt={userData.full_name}
                className="profile-main-avatar"
                onError={(e) => handleAvatarError(e, userData?.full_name || "User")}
              />

              {uploadingImage && (
                <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center bg-dark bg-opacity-50 text-white">
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                </div>
              )}

              {/* Camera upload button */}
              <button
                type="button"
                className="avatar-edit-badge"
                title="Change Photo"
                onClick={handleSelectImage}
              >
                <i className="bi bi-camera-fill"></i>
              </button>

              {/* Delete photo button */}
              {!isDefaultAvatar(userData.profile_image) && (
                <button
                  type="button"
                  className="avatar-delete-badge"
                  title="Remove Photo"
                  onClick={handleDeleteImage}
                >
                  <i className="bi bi-trash3-fill"></i>
                </button>
              )}
            </div>

            {/* Edit Profile Action Button */}
            <div className="profile-header-actions">
              <button
                type="button"
                onClick={openModal}
                className="btn-edit-profile shadow-sm"
              >
                <i className="bi bi-pencil-square text-primary"></i>
                Edit Information
              </button>
            </div>
          </div>

          {/* User Branding & Identity Info */}
          <div className="profile-meta-info">
            <h3>{userData.full_name}</h3>

            <div className="profile-badge-row">
              <span className="badge-role">
                <i className="bi bi-person-badge me-1"></i>
                {userData.role_name || "Member"}
              </span>

              {userData.is_verified === 1 ? (
                <span className="badge-verified">
                  <i className="bi bi-patch-check-fill"></i> Verified Member
                </span>
              ) : (
                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1 small fw-semibold">
                  <i className="bi bi-clock-history me-1"></i> Pending Verification
                </span>
              )}

              <span className="badge-code">
                Member Code: {userData.member_code || (userData.user_id ? `#MEM${String(userData.user_id).padStart(3, "0")}` : "N/A")}
              </span>
            </div>

            <p className="text-muted small mb-0">
              <span className="fw-medium text-dark">@{userData.username}</span>
              {" • "}
              <span>User ID: #{userData.user_id}</span>
              {" • "}
              <span>{userData.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Member Statistics KPI Cards Grid */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="stat-icon-box stat-icon-blue">
            <i className="bi bi-book-half"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Currently Borrowed</div>
            <div className="stat-val">{activeBorrows} <small className="fs-6 text-muted fw-normal">books</small></div>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-icon-box stat-icon-rose">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Overdue Books</div>
            <div className={`stat-val ${overdueBorrows > 0 ? "text-danger" : ""}`}>
              {overdueBorrows} <small className="fs-6 text-muted fw-normal">items</small>
            </div>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-icon-box stat-icon-amber">
            <i className="bi bi-clock-history"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total History</div>
            <div className="stat-val">{totalBorrows} <small className="fs-6 text-muted fw-normal">records</small></div>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="stat-icon-box stat-icon-emerald">
            <i className="bi bi-shield-check"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Fine Balance</div>
            <div className="stat-val">
              {totalFine > 0 ? `$${(totalFine / 4000).toFixed(2)}` : "$0.00"}
            </div>
          </div>
        </div>
      </div>

      {/* Account Personal Details Card */}
      <div className="profile-details-card">
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-light-subtle">
          <div className="card-section-title">
            <i className="bi bi-person-lines-fill text-primary"></i>
            Personal Information Workspace
          </div>
          <button
            type="button"
            onClick={openModal}
            className="btn btn-sm btn-outline-secondary border-light-subtle rounded-3 d-flex align-items-center gap-1.5"
            style={{ fontSize: "12px", fontWeight: "500" }}
          >
            <i className="bi bi-pencil" style={{ fontSize: "12px" }}></i>
            Edit
          </button>
        </div>

        <div className="row gy-3">
          {/* Full Name */}
          <div className="col-md-6">
            <div className="info-field-card">
              <div className="info-field-header">
                <div className="info-icon-circle">
                  <i className="bi bi-person"></i>
                </div>
                <div className="info-field-title">Full Legal Name</div>
              </div>
              <div className="info-field-value">{userData.full_name || "Not specified"}</div>
            </div>
          </div>

          {/* Email Address */}
          <div className="col-md-6">
            <div className="info-field-card">
              <div className="info-field-header">
                <div className="info-icon-circle">
                  <i className="bi bi-envelope"></i>
                </div>
                <div className="info-field-title">Email Address</div>
              </div>
              <div className="info-field-value text-truncate">{userData.email || "Not specified"}</div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="col-md-6">
            <div className="info-field-card">
              <div className="info-field-header">
                <div className="info-icon-circle">
                  <i className="bi bi-telephone"></i>
                </div>
                <div className="info-field-title">Phone Number</div>
              </div>
              <div className={`info-field-value ${!userData.phone ? "muted" : ""}`}>
                {userData.phone || "No phone number added"}
              </div>
            </div>
          </div>

          {/* Gender */}
          <div className="col-md-6">
            <div className="info-field-card">
              <div className="info-field-header">
                <div className="info-icon-circle">
                  <i className="bi bi-gender-ambiguous"></i>
                </div>
                <div className="info-field-title">Gender Identity</div>
              </div>
              <div className={`info-field-value ${!userData.gender ? "muted" : ""}`}>
                {userData.gender || "Not specified"}
              </div>
            </div>
          </div>

          {/* Username */}
          <div className="col-md-6">
            <div className="info-field-card">
              <div className="info-field-header">
                <div className="info-icon-circle">
                  <i className="bi bi-at"></i>
                </div>
                <div className="info-field-title">Username Handle</div>
              </div>
              <div className="info-field-value">@{userData.username || "user"}</div>
            </div>
          </div>

          {/* Physical Address */}
          <div className="col-md-6">
            <div className="info-field-card">
              <div className="info-field-header">
                <div className="info-icon-circle">
                  <i className="bi bi-geo-alt"></i>
                </div>
                <div className="info-field-title">Physical Address</div>
              </div>
              <div className={`info-field-value ${!userData.address ? "muted" : ""}`}>
                {userData.address || "No residential address provided"}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Timestamps */}
        <div className="profile-audit-bar">
          <div>
            <i className="bi bi-calendar-check me-1.5 text-primary"></i>
            Member Since: {userData.created_at ? new Date(userData.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
          </div>
          <div>
            <i className="bi bi-clock-history me-1.5 text-muted"></i>
            Last Synchronized: {userData.updated_at ? new Date(userData.updated_at).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }) : "Recently"}
          </div>
        </div>
      </div>

      {/* Edit Information Modal */}
      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title="Edit Personal Information"
        onSave={handleEditInformation}
        saveText="Save Changes"
        children={
          <div className="container-fluid px-0">
            <div className="row gy-3">
              <div className="col-md-6">
                <Input
                  width="100%"
                  label="Full Name"
                  name="full_name"
                  placeholder="Enter full name"
                  icon="bi-person-fill"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      full_name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <Select
                  width="100%"
                  label="Gender"
                  name="gender"
                  icon="bi bi-gender-ambiguous"
                  value={form.gender}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      gender: e.target.value,
                    })
                  }
                  options={[
                    { value: "", label: "Select Gender" },
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                />
              </div>

              <div className="col-md-6">
                <Input
                  width="100%"
                  label="Phone Number"
                  name="phone"
                  placeholder="Enter phone number"
                  icon="bi-telephone-fill"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <Input
                  width="100%"
                  label="Username"
                  name="username"
                  placeholder="Enter username"
                  icon="bi-person-badge-fill"
                  value={form.username}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      username: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-12">
                <Input
                  width="100%"
                  label="Address"
                  name="address"
                  placeholder="Enter address"
                  icon="bi-geo-alt-fill"
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-12">
                <Input
                  width="100%"
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  icon="bi-envelope-fill"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}



function BorrowingHistoryContent() {
  const { userProfile } = useUser();
  const { borrow, getBorrowed, loading } = useBorrow();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const itemsPerPage = 5;

  useEffect(() => {
    const memberId = userProfile?.user_id || userProfile?.id;
    if (memberId) {
      getBorrowed(memberId, statusFilter);
    }
  }, [userProfile?.user_id, userProfile?.id, statusFilter]);

  const paginatedRequests = useMemo(() => {
    if (!borrow || !Array.isArray(borrow)) return [];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return borrow.slice(startIndex, endIndex);
  }, [borrow, currentPage]);

  const totalPages = Math.ceil((borrow?.length || 0) / itemsPerPage) || 1;
  const columnBorrowHistory = [
    {
      header: "No",
      render: (row, index) =>
        (currentPage - 1) * itemsPerPage + index + 1
    },
    {
      header: 'Member Info',
      accessor: '',
      render: (row) => {
        const name = row.member_name || userProfile?.full_name || 'Member';
        const code = row.member_code || (userProfile?.user_id ? `#${userProfile.user_id}` : '');
        const imagePath = row.profile_image || userProfile?.profile_image;
        const imgSrc = getAvatarUrl(imagePath, name);

        return (
          <div className="d-flex align-items-center gap-2">
            <img
              src={imgSrc}
              alt={name}
              width={40}
              height={40}
              className="rounded-circle object-fit-cover shadow-sm"
              onError={(e) => handleAvatarError(e, name)}
            />

            <div>
              <div className="fw-medium text-dark">{name}</div>
              {code && <small className="text-muted">{code}</small>}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Book Info',
      accessor: '',
      render: (row) => {
        const thumb = row.thumbnail || row.book_thumbnail;
        const imgSrc = thumb
          ? (thumb.startsWith('http')
              ? thumb
              : `${import.meta.env.VITE_API_URL}${thumb.replace(/^\/uploads\//, '').replace(/^\/+/, '')}`)
          : `${import.meta.env.VITE_API_URL}books/default-book.png`;

        return (
          <div className="d-flex align-items-center gap-2">
            <img
              src={imgSrc}
              alt={row.book_title || row.title}
              width={40}
              height={55}
              className="rounded object-fit-cover shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${import.meta.env.VITE_API_URL}books/default-book.png`;
              }}
            />

            <div>
              <div className="fw-semibold text-dark">{row.book_title || row.title || 'Untitled'}</div>
              <small className="text-muted">
                by : {row.author_name || row.author || 'Unknown'}
              </small>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Borrow Date',
      accessor: 'borrow_date',
      render: (row) => {
        const dateVal = row.borrow_date || row.request_date || row.created_at;
        return (
          <div>
            {dateVal
              ? new Date(dateVal).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              : '-'}
          </div>
        );
      }
    },
    {
      header: 'Due Date',
      accessor: 'due_date',
      render: (row) => (
        <div>
          {row.due_date
            ? new Date(row.due_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            : '-'}
        </div>
      )
    },
    {
      header: 'Return Date',
      accessor: 'return_date',
      render: (row) => (
        <div>
          {row.return_date
            ? new Date(row.return_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            : '-'}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const status = (row.status || row.borrow_status || 'pending').toLowerCase();
        const statusClass = {
          pending: 'bg-warning text-dark',
          approved: 'bg-info text-dark',
          borrowed: 'bg-primary',
          returned: 'bg-success',
          complete: 'bg-success',
          overdue: 'bg-danger',
          rejected: 'bg-danger'
        }[status] || 'bg-secondary';

        return (
          <span className={`badge ${statusClass}`}>
            {row.status || row.borrow_status || 'Unknown'}
          </span>
        );
      }
    },
  ];

  return (
    <div className="profile-details-card">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 pb-3 mb-4 border-bottom border-light-subtle">
        <div>
          <h4 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>Borrowing History</h4>
          <small className="text-muted">Track all your past and current book borrowings</small>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted small mt-2">Loading borrowing records...</p>
        </div>
      ) : paginatedRequests.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3 text-muted" style={{ fontSize: "42px" }}>
            <i className="bi bi-journal-x"></i>
          </div>
          <h6 className="fw-semibold text-dark">No records found</h6>
          <p className="text-muted small mb-0">
            {statusFilter !== "All"
              ? `No ${statusFilter} records found for your account.`
              : "You have not borrowed any books yet."}
          </p>
        </div>
      ) : (
        <>
          <Table columns={columnBorrowHistory} data={paginatedRequests} />
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
}

function DueDateContent() {
  const { userProfile } = useUser();
  const { dueDates, getDueDate, loading } = useBorrow();
  const [currentPageDueDateContent, setCurrentPageDueDateContent] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const itemsPerPage = 5;

  useEffect(() => {
    const memberId = userProfile?.user_id || userProfile?.id;
    if (memberId) {
      getDueDate(memberId, statusFilter);
    }
  }, [userProfile?.user_id, userProfile?.id, statusFilter]);

  const paginatedRequests = useMemo(() => {
    if (!dueDates || !Array.isArray(dueDates)) return [];

    const startIndex = (currentPageDueDateContent - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return dueDates.slice(startIndex, endIndex);
  }, [dueDates, currentPageDueDateContent]);

  const totalPages = Math.ceil((dueDates?.length || 0) / itemsPerPage) || 1;

  const columnDueDateContent = [
    {
      header: "No",
      render: (row, index) => (currentPageDueDateContent - 1) * itemsPerPage + index + 1
    },
    {
      header: "Book Info",
      render: (row) => {
        const thumb = row.thumbnail || row.book_thumbnail;
        const imgSrc = thumb
          ? (thumb.startsWith("http")
              ? thumb
              : `${import.meta.env.VITE_API_URL}${thumb.replace(/^\/uploads\//, "").replace(/^\/+/, "")}`)
          : `${import.meta.env.VITE_API_URL}books/default-book.png`;

        return (
          <div className="d-flex align-items-center gap-2">
            <img
              src={imgSrc}
              alt={row.book_title}
              width={40}
              height={55}
              className="rounded object-fit-cover shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${import.meta.env.VITE_API_URL}books/default-book.png`;
              }}
            />
            <div>
              <div className="fw-semibold text-dark">{row.book_title || "Untitled"}</div>
              {row.member_name && (
                <small className="text-muted">Member: {row.member_name}</small>
              )}
            </div>
          </div>
        );
      }
    },
    {
      header: "Borrow Date",
      accessor: "borrow_date",
      render: (row) =>
        row.borrow_date
          ? new Date(row.borrow_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })
          : "-"
    },
    {
      header: "Due Date",
      accessor: "due_date",
      render: (row) => {
        const d = row.due_date ? new Date(row.due_date) : null;
        if (!d) return "-";
        const isOverdue = row.is_overdue || (new Date() > d && !row.return_date);
        return (
          <span className={isOverdue ? "text-danger fw-bold" : "text-dark fw-medium"}>
            <i className="bi bi-calendar-event me-1"></i>
            {d.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </span>
        );
      }
    },
    {
      header: "Return Date",
      accessor: "return_date",
      render: (row) =>
        row.return_date
          ? new Date(row.return_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })
          : "-"
    },
    {
      header: "Days Info",
      render: (row) => {
        const dueDate = new Date(row.due_date);
        const isReturned = Boolean(row.return_date);
        const now = new Date();
        const endDate = isReturned ? new Date(row.return_date) : now;
        const diffMs = dueDate - endDate;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (isReturned) {
          return <span className="badge bg-light text-muted border">Returned</span>;
        }

        if (diffDays < 0) {
          return (
            <span className="badge bg-danger">
              <i className="bi bi-exclamation-circle me-1"></i>
              {Math.abs(diffDays)} day(s) overdue
            </span>
          );
        }

        if (diffDays === 0) {
          return (
            <span className="badge bg-warning text-dark">
              <i className="bi bi-clock me-1"></i> Due today
            </span>
          );
        }

        return (
          <span className="badge bg-success">
            <i className="bi bi-check2 me-1"></i>
            {diffDays} day(s) left
          </span>
        );
      }
    },
    {
      header: "Fine (USD)",
      accessor: "fine",
      render: (row) => {
        const fineVal = Number(row.fine) || 0;
        return fineVal > 0 ? (
          <span className="text-danger fw-bold">${(fineVal / 4000).toFixed(2)}</span>
        ) : (
          <span className="text-muted">$0.00</span>
        );
      }
    },
    {
      header: "Status",
      render: (row) => {
        const status = (row.status || row.borrow_status || "").toLowerCase();
        const statusClass = {
          borrowed: "bg-primary",
          returned: "bg-success",
          overdue: "bg-danger",
          lost: "bg-dark"
        }[status] || "bg-secondary";

        return <span className={`badge ${statusClass}`}>{row.status || row.borrow_status || "Unknown"}</span>;
      }
    }
  ];

  return (
    <div className="profile-details-card">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 pb-3 mb-4 border-bottom border-light-subtle">
        <div>
          <h4 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>Due Dates</h4>
          <small className="text-muted">Monitor due dates, overdue statuses, and calculated fines</small>
        </div>

        <div className="status-pill-group">
          {[
            { label: "All", value: "All" },
            { label: "Active", value: "borrowed" },
            { label: "Overdue", value: "overdue" },
            { label: "Returned", value: "returned" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={`status-pill-btn ${statusFilter === item.value ? "active" : ""}`}
              onClick={() => {
                setStatusFilter(item.value);
                setCurrentPageDueDateContent(1);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted small mt-2">Checking due dates...</p>
        </div>
      ) : paginatedRequests.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3 text-muted" style={{ fontSize: "42px" }}>
            <i className="bi bi-calendar-check"></i>
          </div>
          <h6 className="fw-semibold text-dark">No due date records</h6>
          <p className="text-muted small mb-0">
            {statusFilter !== "All"
              ? `No books matching "${statusFilter}" status.`
              : "You have no active borrowings with upcoming due dates."}
          </p>
        </div>
      ) : (
        <>
          <Table columns={columnDueDateContent} data={paginatedRequests} />
          <div className="mt-4">
            <Pagination
              currentPage={currentPageDueDateContent}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPageDueDateContent(page)}
            />
          </div>
        </>
      )}
    </div>
  );
}

