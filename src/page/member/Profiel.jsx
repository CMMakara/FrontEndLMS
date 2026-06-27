import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import useUser from '../../hook/useUsers'
import Table from '../../components/ui/Table'
import useBorrowRequest from "../../hook/useBorrowRequest";
import Pagination from "../../components/ui/Pagination";
import useBorrow from '../../hook/useBorrow'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'


const NAV_ITEMS = [
  { key: "profile", label: "My Profile", icon: "bi-person", activeIcon: "bi-person-fill", path: "" },
  { key: "orders", label: "Borrowing History", icon: "bi-clock-history", activeIcon: "bi-clock-history", path: "borrowing-history" },
  { key: "address", label: "Due Date", icon: "bi-calendar-event", activeIcon: "bi-calendar-event-fill", path: "due-date" },

];

/* ---------------- SIDEBAR COMPONENT ---------------- */
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = "/member/profile";

  return (
    <div className="d-flex flex-column h-100 justify-content-between">

      <div className="nav flex-column gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === ""
              ? location.pathname === "/member/profile"
              : location.pathname.includes(item.path);

          return (
            <button
              key={item.key}
              onClick={() => navigate(`${basePath}/${item.path}`)}
              className={`btn d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                }`}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </button>
          );
        })}
      </div>

      <button className="btn btn-outline-danger mt-3" onClick={() => navigate("/login")}>
        Logout
      </button>

    </div>
  );
}

/* ---------------- MAIN CONTAINER WRAPPER ---------------- */
export default function Profile() {
  return (
    <div className="container py-4 min-vh-100 bg-light-subtle " style={{ marginTop: '100px' }}>
      <div className="row g-4 mx-auto" >

        {/* SIDEBAR PANEL LAYOUT COLUMN */}
        <div className="col-12 col-md-4 col-lg-3">
          <div className="bg-white border border-light-subtle rounded-4 shadow-sm p-3 position-sticky" style={{ top: "24px" }}>
            <Sidebar />
          </div>
        </div>

        {/* CONTENT SWITCHING VIEWPORT PANEL */}
        <div className="col-12 col-md-8 col-lg-9">
          <div className="bg-white border border-light-subtle rounded-4 shadow-sm p-4  min-vh-50 d-flex flex-column justify-content-between" style={{ minHeight: "500px" }}>

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
const PageHeader = ({ title }) => (
  <div className="pb-2 mb-4 border-bottom border-light-subtle">
    <h4 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>{title}</h4>
  </div>
);


function ProfileContent() {
  const { userProfile, updateProfile, getUserProfile , updateProfileImage , deleteProfileImage} = useUser();
  const [isModal, setIsModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
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
      await getUserProfile();
      setIsModal(false);
    }
  };
  const handleSelectImage = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async(e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    let res = await updateProfileImage(file)
    if(res) {
      await getUserProfile();
      setPreviewImage(null);
    }
  };
  const handleDeleteImage = async() => {
    await deleteProfileImage()
    setPreviewImage(null)
    await getUserProfile()
  }

  const initials = userData?.full_name
    ? userData.full_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  if (!userData) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5 text-muted small">
        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
        Syncing secure profile metrics...
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Profile" />

      {/* Profile Summary Hero Header */}
      <div className="card border-light-subtle bg-light bg-opacity-25 p-4 rounded-4 mb-4">
        <div className="d-flex flex-column flex-sm-row align-items-center gap-4">

          {/* Avatar Area with Minimal Overlay Controls */}
          <div className="position-relative mx-auto" style={{ width: 100, height: 100 }}>

            {/* Hidden input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />

            {/* Image */}
            <img
              src={
                previewImage ||
                (userData.profile_image
                  ? `${import.meta.env.VITE_API_URL}/${userData.profile_image}`
                  : "https://via.placeholder.com/100")
              }
              className="rounded-circle border shadow-sm w-100 h-100 object-fit-cover"
            />

            {/* Overlay button */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center gap-2"
              style={{
                background: "rgba(0,0,0,0.4)",
                borderRadius: "50%",
                opacity: 0,
                transition: "opacity 0.25s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
            >
              <button
                type="button"
                onClick={handleSelectImage}
                className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: 34,
                  height: 34,
                  padding: 0,
                }}
              >
                <i className="bi bi-camera-fill" style={{ fontSize: "14px" }}></i>
              </button>

              {userData.profile_image && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: 34,
                    height: 34,
                    padding: 0,
                  }}
                >
                  <i className="bi bi-trash3-fill" style={{ fontSize: "14px" }}></i>
                </button>
              )}
            </div>
          </div>

          {/* User Branding Meta Info */}
          <div className="text-center text-sm-start flex-grow-1">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start gap-2 mb-1">
              <h5 className="fw-bold text-dark mb-0">{userData.full_name}</h5>

              <span className="badge bg-dark-subtle text-dark-emphasis border border-dark-subtle px-2 py-1 small fw-semibold">
                {userData.role_name}
              </span>

              {userData.is_verified === 1 && (
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 d-inline-flex align-items-center gap-1 small fw-semibold">
                  <i className="bi bi-patch-check-fill" style={{ fontSize: "11px" }}></i> Verified
                </span>
              )}
            </div>
            <p className="text-muted small mb-0">@{userData.username} · System Identification ID: #{userData.user_id}</p>
          </div>
        </div>
      </div>

      {/* Account Info Detail Data Fields Grid */}
      <div className="card border-light-subtle p-4 rounded-4 bg-white">

        {/* Workspace Title & Edit Information Action Bar */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-light-subtle">
          <div className="fw-semibold text-dark" style={{ fontSize: "14px", letterSpacing: "-0.01em" }}>
            Personal Information Workspace
          </div>
          <button
            type="button"
            onClick={() => openModal()}
            className="btn btn-light btn-sm border border-light-subtle rounded-3 text-secondary d-flex align-items-center gap-2 px-2.5 py-1.5"
            style={{ fontSize: "12px", fontWeight: "500" }}
          >
            <i className="bi bi-pencil-square" style={{ fontSize: "13px" }}></i>
            Edit Information
          </button>
        </div>

        <div className="row g-4 text-secondary small">
          {/* Email field */}
          <div className="col-md-6">
            <div className="text-muted mb-1" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase" }}>Email Address</div>
            <div className="d-flex align-items-center gap-2 text-dark fw-medium p-2 bg-light bg-opacity-50 rounded-3 border border-light-subtle">
              <i className="bi bi-envelope text-muted px-1"></i>
              <span className="text-truncate">{userData.email}</span>
            </div>
          </div>

          {/* Phone Field */}
          <div className="col-md-6">
            <div className="text-muted mb-1" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase" }}>Phone Number</div>
            <div className="d-flex align-items-center gap-2 text-dark fw-medium p-2 bg-light bg-opacity-50 rounded-3 border border-light-subtle">
              <i className="bi bi-telephone text-muted px-1"></i>
              <span>{userData.phone || "Not Provided"}</span>
            </div>
          </div>

          {/* Gender Field */}
          <div className="col-md-6">
            <div className="text-muted mb-1" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase" }}>Gender Identity</div>
            <div className="d-flex align-items-center gap-2 text-dark fw-medium p-2 bg-light bg-opacity-50 rounded-3 border border-light-subtle">
              <i className="bi bi-gender-ambiguous text-muted px-1"></i>
              <span>{userData.gender || "Unspecified"}</span>
            </div>
          </div>

          {/* Address Field */}
          <div className="col-md-6">
            <div className="text-muted mb-1" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase" }}>Physical Address</div>
            <div className="d-flex align-items-center gap-2 text-dark fw-medium p-2 bg-light bg-opacity-50 rounded-3 border border-light-subtle">
              <i className="bi bi-geo-alt text-muted px-1"></i>
              <span className={!userData.address ? "text-muted font-italic text-truncate" : "text-truncate"}>
                {userData.address || "No billing or secondary address attached"}
              </span>
            </div>
          </div>
        </div>

        {/* Audit Dates Subtext Stamp */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-4 mt-4 border-top border-light-subtle text-muted" style={{ fontSize: "11px" }}>
          <div>
            <i className="bi bi-calendar-plus me-1"></i>
            Account Created: {new Date(userData.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </div>
          <div>
            <i className="bi bi-pencil-square me-1"></i>
            Profile Synced: {new Date(userData.updated_at).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title='Edit Information'
        onSave={handleEditInformation}
        saveText="Save"
        children={
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6 mb-3">
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

              <div className="col-md-6 mb-3">
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

              <div className="col-md-6 mb-3">
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

              <div className="col-md-6 mb-3">
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

              <div className="col-md-12 mb-3">
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

              <div className="col-md-12 mb-3">
                <Input
                  width="100%"
                  label="Email"
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
  const { getAllBorrowRequest, borrowsRequest } = useBorrowRequest({ perPage: 10000 })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5;
  const paginatedRequests = useMemo(() => {
    if (!borrowsRequest) return [];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return borrowsRequest.slice(startIndex, endIndex);
  }, [borrowsRequest, currentPage]);

  const totalPages = Math.ceil((borrowsRequest?.length || 0) / itemsPerPage) || 1;
  const columnBorrowHistory = [
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
              alt={row.member_name}
              width={40}
              height={40}
              className="rounded-circle"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = `${import.meta.env.VITE_API_URL}profiles/default-profile.png`;
              }}
            />

            <div>
              <div>{row.member_name}</div>
              <small className="text-muted">
                {row.member_code}
              </small>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Book Info',
      accessor: '',
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <img
            src={`${import.meta.env.VITE_API_URL}${row.thumbnail}`}
            alt={row.book_title}
            width={40}
            height={60}
            className="rounded"
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = `${import.meta.env.VITE_API_URL}books/default-book.png`;
            }}
          />

          <div>
            <div>{row.book_title}</div>
            <small className="text-muted">
              by : {row.author_name}
            </small>
          </div>
        </div>
      )
    },
    {
      header: 'Request Date',
      accessor: 'request_date',
      render: (row) => (
        <div>
          {new Date(row.request_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const statusClass = {
          pending: 'bg-warning text-dark',
          approved: 'bg-success',
          rejected: 'bg-danger',
          returned: 'bg-primary'
        }[row.status?.toLowerCase()] || 'bg-secondary';

        return (
          <span className={`badge ${statusClass}`}>
            {row.status}
          </span>
        );
      }
    },
  ]
  return (
    <div>
      <PageHeader title="Borrowing History" />
      <div >
        <Table
          columns={columnBorrowHistory}
          data={paginatedRequests}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

function DueDateContent() {
  const [currentPageDueDateContent, setCurrentPageDueDateContent] = useState(1);
  const { borrow, getAllBorrowRecord } = useBorrow();
  const itemsPerPage = 5;
  const paginatedRequests = useMemo(() => {
    if (!borrow) return [];

    const startIndex = (currentPageDueDateContent - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return borrow.slice(startIndex, endIndex);
  }, [borrow, currentPageDueDateContent]);

  const totalPages = Math.ceil((borrow?.length || 0) / itemsPerPage) || 1;
  useEffect(() => {
    getAllBorrowRecord("", 1, 10000);
  }, []);

  const columnDueDateContent = [
    {
      header: "No",
      render: (row, index) => (currentPageDueDateContent - 1) * 5 + index + 1
    },
    { header: "Book Title", accessor: "book_title" },
    { header: "Member Name", accessor: "member_name" },
    {
      header: "Return Date",
      accessor: "return_date",
      render: (row) =>
        row.return_date
          ? new Date(row.return_date).toLocaleDateString("en-GB")
          : "-"
    },
    {
      header: "Fine (USD)",
      accessor: "fine",
      render: (row) => `$${(row.fine / 4000).toFixed(2)}`
    },
    {
      header: "Late Days",
      render: (row) => {
        const dueDate = new Date(row.due_date);

        const endDate =
          ["returned", "complete"].includes(row.status?.toLowerCase())
            ? new Date(row.return_date)
            : new Date();

        const lateDays = Math.max(
          0,
          Math.floor((endDate - dueDate) / (1000 * 60 * 60 * 24))
        );

        return (
          <span
            className="badge"
            style={{
              backgroundColor: lateDays > 0 ? "#ff4d4f" : "#52c41a",
              color: "white",
              padding: "6px 10px",
              borderRadius: "8px",
              fontWeight: "600"
            }}
          >
            {lateDays > 0 ? `${lateDays} day(s)` : "On time"}
          </span>
        );
      }
    },
    {
      header: "Status",
      render: (row) => {
        const statusClass = {
          pending: "bg-warning text-dark",
          approved: "bg-success",
          rejected: "bg-danger",
          returned: "bg-primary"
        }[row.status?.toLowerCase()] || "bg-secondary";

        return <span className={`badge ${statusClass}`}>{row.status}</span>;
      }
    }
  ];

  return (
    <div>
      <PageHeader title="Due Dates" />

      <Table columns={columnDueDateContent} data={borrow || []} />
      <Pagination
        currentPage={currentPageDueDateContent}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

