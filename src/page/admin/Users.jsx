import React, { useState, useMemo } from "react";
import Table from "../../components/ui/Table";
import useUsers from "../../hook/useUsers";
import Pagination from "../../components/ui/Pagination";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import { validateCreateUser } from "../../validations/CreateUserSchema";
import { getAvatarUrl, handleAvatarError } from "../../utils/avatar";

/* ─────────────────────────────────────────
    MAIN COMPONENT: User
───────────────────────────────────────── */
function User() {
  const {
    users = [],
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

  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"
  const [roleFilter, setRoleFilter] = useState("all"); // "all" | "admin" | "librarian" | "member"
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    role_id: 1,
  });

  // KPI Metrics
  const totalCount = pagination?.total || users.length;
  const adminCount = useMemo(
    () => users.filter((u) => (u.role_name || "").toLowerCase() === "admin").length,
    [users]
  );
  const librarianCount = useMemo(
    () => users.filter((u) => (u.role_name || "").toLowerCase() === "librarian").length,
    [users]
  );
  const memberCount = useMemo(
    () =>
      users.filter(
        (u) =>
          (u.role_name || "").toLowerCase() === "member" ||
          (u.role_name || "").toLowerCase() === "user"
      ).length,
    [users]
  );

  // Role Filtering
  const filteredUsers = useMemo(() => {
    if (roleFilter === "all") return users;
    return users.filter((u) => {
      const r = (u.role_name || "").toLowerCase();
      if (roleFilter === "member") return r === "member" || r === "user";
      return r === roleFilter;
    });
  }, [users, roleFilter]);

  const getProfileImage = (user) => {
    return getAvatarUrl(user?.profile_image, user?.full_name || user?.username || "User");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const openModal = () => {
    setForm({
      full_name: "",
      username: "",
      email: "",
      password: "",
      role_id: 1,
    });
    setShowPassword(false);
    setErrors({});
    setIsModal(true);
  };

  const handleCreate = async () => {
    const validationErrors = validateCreateUser(form, [1, 2, 3]);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createUser(form);
      if (!result) return;
      await getAllUsers();
      setIsModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Table Columns Definition
  const columns = [
    {
      header: "#",
      className: "ps-4",
      cellClassName: "ps-4",
      render: (row, index) => (
        <span className="badge bg-light text-secondary border rounded-pill px-2.5 py-1 font-monospace">
          {(page - 1) * 10 + index + 1}
        </span>
      ),
    },
    {
      header: "User Profile",
      render: (row) => (
        <div className="d-flex align-items-center gap-2.5">
          <img
            src={getProfileImage(row)}
            alt={row.full_name || row.username}
            className="rounded-circle shadow-xs flex-shrink-0"
            style={{
              width: "42px",
              height: "42px",
              objectFit: "cover",
              border: "2px solid #f1f5f9",
            }}
            onError={(e) => handleAvatarError(e, row.full_name || row.username || "User")}
          />
          <div className="overflow-hidden">
            <div
              className="fw-semibold text-dark text-truncate"
              style={{ maxWidth: "170px" }}
              title={row.full_name}
            >
              {row.full_name || "Unnamed User"}
            </div>
            <small className="text-muted text-truncate d-block" style={{ fontSize: "11.5px" }}>
              @{row.username}
            </small>
          </div>
        </div>
      ),
    },
    {
      header: "System Role",
      render: (row) => {
        const role = (row.role_name || "").toLowerCase();
        let bg = "bg-secondary-subtle text-secondary border-secondary-subtle";
        let icon = "bi-person";

        if (role === "admin") {
          bg = "bg-danger-subtle text-danger border-danger-subtle";
          icon = "bi-shield-lock-fill";
        } else if (role === "librarian") {
          bg = "bg-primary-subtle text-primary border-primary-subtle";
          icon = "bi-mortarboard-fill";
        } else if (role === "member" || role === "user") {
          bg = "bg-success-subtle text-success border-success-subtle";
          icon = "bi-person-check-fill";
        }

        return (
          <span
            className={`badge ${bg} border rounded-pill px-2.5 py-1 small fw-semibold d-inline-flex align-items-center gap-1.5`}
          >
            <i className={`bi ${icon}`} style={{ fontSize: "10px" }}></i>
            {row.role_name || "Member"}
          </span>
        );
      },
    },
    {
      header: "Contact Info",
      render: (row) => (
        <div>
          <div className="text-dark small text-truncate" style={{ maxWidth: "180px" }}>
            <i className="bi bi-envelope text-muted me-1.5"></i>
            {row.email || "No email"}
          </div>
          {row.phone && (
            <small className="text-muted d-block" style={{ fontSize: "11px" }}>
              <i className="bi bi-telephone text-muted me-1.5"></i>
              {row.phone}
            </small>
          )}
        </div>
      ),
    },
    {
      header: "Location",
      render: (row) => (
        <span
          className="text-muted small text-truncate d-inline-block"
          style={{ maxWidth: "150px" }}
          title={row.address || "N/A"}
        >
          <i className="bi bi-geo-alt text-muted me-1"></i>
          {row.address || "N/A"}
        </span>
      ),
    },
    {
      header: "Verification",
      render: (row) => (
        <span
          className={`badge ${
            row.is_verified === 1
              ? "bg-success-subtle text-success border-success-subtle"
              : "bg-warning-subtle text-warning border-warning-subtle"
          } border rounded-pill px-2.5 py-1 small fw-semibold d-inline-flex align-items-center gap-1.5`}
        >
          <span
            className={`d-inline-block rounded-circle ${
              row.is_verified === 1 ? "bg-success" : "bg-warning"
            }`}
            style={{ width: "6px", height: "6px" }}
          />
          {row.is_verified === 1 ? "Verified" : "Unverified"}
        </span>
      ),
    },
    {
      header: "Joined Date",
      render: (row) => {
        if (!row.created_at) return <span className="text-muted small">N/A</span>;
        const date = new Date(row.created_at);
        return (
          <span className="text-muted small">
            <i className="bi bi-calendar3 me-1 opacity-75"></i>
            {date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      header: "Actions",
      className: "text-end pe-4",
      cellClassName: "text-end pe-4",
      render: (row) => (
        <button
          type="button"
          className="btn btn-sm btn-white bg-white border shadow-xs rounded-pill px-3 py-1 text-primary d-inline-flex align-items-center gap-1 fw-medium"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(row);
          }}
          title="View Details"
        >
          <i className="bi bi-eye"></i>
          <span>Details</span>
        </button>
      ),
    },
  ];

  return (
    <div className="container-fluid px-3 px-lg-4 py-3 min-vh-100" style={{ backgroundColor: "#f8fafc" }}>
      {/* ─────────────────────────────────────────
          EXECUTIVE HERO HEADER
      ───────────────────────────────────────── */}
      <div
        className="card border-0 rounded-4 p-4 mb-4 bg-white shadow-sm"
        style={{ border: "1px solid #e2e8f0" }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          {/* Left: Icon & Title */}
          <div className="d-flex align-items-center gap-3.5">
            <div
              className="rounded-4 d-flex align-items-center justify-content-center p-3 shadow flex-shrink-0"
              style={{
                width: "60px",
                height: "60px",
                padding: "14px",
                background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                color: "#ffffff",
                boxShadow: "0 8px 22px rgba(6, 182, 212, 0.25)",
              }}
            >
              <i className="bi bi-people-fill fs-2"></i>
            </div>
            <div>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                <h3 className="fw-bold text-dark mb-0 ms-3" style={{ letterSpacing: "-0.5px" }}>
                  User Management
                </h3>
                <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-2.5 py-1 small fw-semibold d-inline-flex align-items-center gap-1.5">
                  <span
                    className="d-inline-block rounded-circle bg-info"
                    style={{ width: "6px", height: "6px" }}
                  />
                  {totalCount} Total Accounts
                </span>
              </div>
              <p className="text-muted small mb-0 ms-3">
                Manage roles, staff permissions, authentication security, and registered member privileges.
              </p>
            </div>
          </div>

          {/* Right: Search, Sorting & Create Button */}
          <div className="d-flex align-items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div style={{ width: "240px" }}>
              <Input
                icon="bi bi-search"
                placeholder="Search username or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Sort Order */}
            <select
              className="form-select form-select-sm shadow-xs rounded-pill px-3 py-2 text-secondary fw-medium"
              style={{
                width: "120px",
                border: "1px solid #dee2e6",
                cursor: "pointer",
                height: "40px",
              }}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>

            {/* View Mode Toggle */}
            <div className="btn-group p-1 bg-light border rounded-pill shadow-xs" role="group">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1 fw-medium border-0 ${
                  viewMode === "table" ? "btn-white bg-white shadow-xs text-primary" : "text-secondary"
                }`}
                onClick={() => setViewMode("table")}
                title="Dense Table View"
              >
                <i className="bi bi-list-ul"></i>
                <span className="d-none d-md-inline">Table</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1 fw-medium border-0 ${
                  viewMode === "grid" ? "btn-white bg-white shadow-xs text-primary" : "text-secondary"
                }`}
                onClick={() => setViewMode("grid")}
                title="Cards Grid View"
              >
                <i className="bi bi-grid-fill"></i>
                <span className="d-none d-md-inline">Cards</span>
              </button>
            </div>

            {/* Create User Button */}
            <button
              type="button"
              className="btn text-white rounded-pill px-3.5 py-2.5 shadow-sm d-inline-flex align-items-center gap-2 fw-semibold"
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                border: "none",
              }}
              onClick={openModal}
            >
              <i className="bi bi-person-plus-fill"></i>
              <span>Create User</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          4 KPI SUMMARY STAT TILES
      ───────────────────────────────────────── */}
      <div className="row gy-3 mb-4">
        {/* Total Accounts */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="card border-0 rounded-4 p-3.5 bg-white shadow-sm h-100"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <div className="d-flex align-items-center gap-3 p-4">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-xs"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(6, 182, 212, 0.12)",
                  color: "#06b6d4",
                  borderRadius: "14px",
                }}
              >
                <i className="bi bi-people-fill fs-4"></i>
              </div>
              <div>
                <span
                  className="text-muted text-uppercase fw-semibold d-block"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  Total Accounts
                </span>
                <h4 className="fw-bold text-dark mb-0">{totalCount}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Administrators */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="card border-0 rounded-4 p-3.5 bg-white shadow-sm h-100"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <div className="d-flex align-items-center gap-3 p-4">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-xs"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(239, 68, 68, 0.12)",
                  color: "#ef4444",
                  borderRadius: "14px",
                }}
              >
                <i className="bi bi-shield-lock-fill fs-4"></i>
              </div>
              <div>
                <span
                  className="text-muted text-uppercase fw-semibold d-block"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  Administrators
                </span>
                <h4 className="fw-bold text-dark mb-0">{adminCount}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Librarians */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="card border-0 rounded-4 p-3.5 bg-white shadow-sm h-100"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <div className="d-flex align-items-center gap-3 p-4">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-xs"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(79, 70, 229, 0.12)",
                  color: "#4f46e5",
                  borderRadius: "14px",
                }}
              >
                <i className="bi bi-mortarboard-fill fs-4"></i>
              </div>
              <div>
                <span
                  className="text-muted text-uppercase fw-semibold d-block"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  Library Staff
                </span>
                <h4 className="fw-bold text-dark mb-0">{librarianCount}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="card border-0 rounded-4 p-3.5 bg-white shadow-sm h-100"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <div className="d-flex align-items-center gap-3 p-4">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-xs"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#10b981",
                  borderRadius: "14px",
                }}
              >
                <i className="bi bi-person-check-fill fs-4"></i>
              </div>
              <div>
                <span
                  className="text-muted text-uppercase fw-semibold d-block"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  Registered Members
                </span>
                <h4 className="fw-bold text-dark mb-0">{memberCount}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          FILTER BAR (ROLE PILLS)
      ───────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-4 shadow-sm border mb-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium border-0 d-inline-flex align-items-center gap-1.5 ${
              roleFilter === "all" ? "btn-primary text-white shadow-xs" : "btn-light text-secondary"
            }`}
            onClick={() => setRoleFilter("all")}
          >
            <i className="bi bi-grid-fill"></i>
            <span>All Roles ({users.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium border-0 d-inline-flex align-items-center gap-1.5 ${
              roleFilter === "admin" ? "btn-danger text-white shadow-xs" : "btn-light text-secondary"
            }`}
            onClick={() => setRoleFilter("admin")}
          >
            <i className="bi bi-shield-lock-fill"></i>
            <span>Admins ({adminCount})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium border-0 d-inline-flex align-items-center gap-1.5 ${
              roleFilter === "librarian" ? "btn-primary text-white shadow-xs" : "btn-light text-secondary"
            }`}
            onClick={() => setRoleFilter("librarian")}
          >
            <i className="bi bi-mortarboard-fill"></i>
            <span>Librarians ({librarianCount})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium border-0 d-inline-flex align-items-center gap-1.5 ${
              roleFilter === "member" ? "btn-success text-white shadow-xs" : "btn-light text-secondary"
            }`}
            onClick={() => setRoleFilter("member")}
          >
            <i className="bi bi-person-check-fill"></i>
            <span>Members ({memberCount})</span>
          </button>
        </div>

        <span className="text-muted small px-2">
          Showing <strong>{filteredUsers.length}</strong> of {totalCount} records
        </span>
      </div>

      {/* ─────────────────────────────────────────
          CONTENT AREA: TABLE OR GRID CARDS
      ───────────────────────────────────────── */}
      {filteredUsers.length > 0 ? (
        viewMode === "table" ? (
          /* ── TABLE VIEW ── */
          <div
            className="card border-0 rounded-4 bg-white shadow-sm overflow-hidden mb-4"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <Table
              columns={columns}
              data={filteredUsers}
              hover={true}
              onRowClick={(row) => setSelectedUser(row)}
            />
          </div>
        ) : (
          /* ── GRID CARDS VIEW ── */
          <div className="row gy-3 g-xl-4 mb-4">
            {filteredUsers.map((u, index) => {
              const role = (u.role_name || "").toLowerCase();
              let roleBadge = "bg-secondary-subtle text-secondary border-secondary-subtle";
              if (role === "admin") roleBadge = "bg-danger-subtle text-danger border-danger-subtle";
              else if (role === "librarian") roleBadge = "bg-primary-subtle text-primary border-primary-subtle";
              else if (role === "member" || role === "user") roleBadge = "bg-success-subtle text-success border-success-subtle";

              return (
                <div className="col-12 col-sm-6 col-xl-4 col-xxl-3 d-flex" key={u.id || index}>
                  <div
                    className="card border-0 rounded-4 bg-white w-100 p-4 shadow-sm position-relative overflow-hidden d-flex flex-column"
                    style={{
                      border: "1px solid #e2e8f0",
                      transition: "transform 0.22s ease, box-shadow 0.22s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedUser(u)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 14px 28px -6px rgba(15, 23, 42, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(15, 23, 42, 0.04)";
                    }}
                  >
                    {/* Top avatar & badges */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <img
                        src={getProfileImage(u)}
                        alt={u.full_name}
                        className="rounded-circle shadow-xs"
                        style={{
                          width: "56px",
                          height: "56px",
                          objectFit: "cover",
                          border: "3px solid #f1f5f9",
                        }}
                        onError={(e) => handleAvatarError(e, u.full_name || u.username || "User")}
                      />
                      <span className={`badge ${roleBadge} border rounded-pill px-2.5 py-1 small fw-semibold text-capitalize`}>
                        {u.role_name || "Member"}
                      </span>
                    </div>

                    {/* Name & username */}
                    <h5 className="fw-bold text-dark mb-0 text-truncate" title={u.full_name}>
                      {u.full_name || "Unnamed User"}
                    </h5>
                    <small className="text-muted text-truncate d-block mb-3">@{u.username}</small>

                    {/* Details Box */}
                    <div
                      className="p-2.5 rounded-3 mb-3 bg-light flex-grow-1"
                      style={{ fontSize: "12px", border: "1px solid #f1f5f9" }}
                    >
                      <div className="text-truncate text-secondary mb-1">
                        <i className="bi bi-envelope me-1.5 text-muted"></i>
                        {u.email || "No email documented"}
                      </div>
                      <div className="text-truncate text-secondary">
                        <i className="bi bi-telephone me-1.5 text-muted"></i>
                        {u.phone || "No phone recorded"}
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto" style={{ borderColor: "#f1f5f9" }}>
                      <span className={`badge ${u.is_verified === 1 ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"} rounded-pill px-2 py-0.5`} style={{ fontSize: "10.5px" }}>
                        {u.is_verified === 1 ? "Verified" : "Unverified"}
                      </span>

                      <button
                        type="button"
                        className="btn btn-sm btn-link text-primary p-0 text-decoration-none fw-semibold"
                        style={{ fontSize: "12px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(u);
                        }}
                      >
                        Profile <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* ── EMPTY STATE ── */
        <div
          className="card border-0 rounded-4 p-5 bg-white shadow-sm text-center my-4 d-flex flex-column align-items-center justify-content-center"
          style={{ border: "1px solid #e2e8f0", minHeight: "340px" }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-xs"
            style={{
              width: "72px",
              height: "72px",
              background: "rgba(6, 182, 212, 0.12)",
              color: "#06b6d4",
            }}
          >
            <i className="bi bi-search fs-2"></i>
          </div>
          <h5 className="fw-bold text-dark mb-1">No Matching Users Found</h5>
          <p className="text-muted small mb-3" style={{ maxWidth: "420px" }}>
            {search
              ? `No user accounts match "${search}". Check for typos or try clearing your filters.`
              : "No user accounts are registered for this role filter."}
          </p>
          <div className="d-flex gap-2">
            {search && (
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-3.5 py-2"
                onClick={() => setSearch("")}
              >
                <i className="bi bi-arrow-counterclockwise me-1.5"></i> Clear Search
              </button>
            )}
            <button
              type="button"
              className="btn text-white rounded-pill px-4 py-2 shadow-sm fw-semibold"
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                border: "none",
              }}
              onClick={openModal}
            >
              <i className="bi bi-person-plus-fill me-1.5"></i> Create New User
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination?.totalPage > 1 && (
        <div className="d-flex justify-content-center my-4">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPage}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* ─────────────────────────────────────────
          MODAL: USER PROFILE DETAIL VIEW
      ───────────────────────────────────────── */}
      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title={`User Account Details • #${selectedUser?.id || selectedUser?.user_id || ""}`}
        saveText="Close Profile"
        btnColorSave="btn-secondary"
        children={
          <div>
            {/* Header profile banner */}
            <div
              className="rounded-4 p-4 text-center position-relative mb-4 overflow-hidden shadow-xs"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                color: "#ffffff",
              }}
            >
              <img
                src={getProfileImage(selectedUser)}
                alt={selectedUser?.full_name}
                className="rounded-circle shadow mb-2"
                style={{
                  width: "88px",
                  height: "88px",
                  objectFit: "cover",
                  border: "4px solid rgba(255, 255, 255, 0.25)",
                }}
                onError={(e) => handleAvatarError(e, selectedUser?.full_name || "User")}
              />
              <h5 className="fw-bold mb-0 text-white">{selectedUser?.full_name || "Unnamed User"}</h5>
              <p className="text-white-50 small mb-3">@{selectedUser?.username}</p>

              <div className="d-flex justify-content-center gap-2">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fw-semibold text-capitalize">
                  {selectedUser?.role_name || "Member"}
                </span>
                <span
                  className={`badge ${
                    selectedUser?.is_verified === 1
                      ? "bg-success-subtle text-success border-success-subtle"
                      : "bg-warning-subtle text-warning border-warning-subtle"
                  } border rounded-pill px-3 py-1.5 fw-semibold`}
                >
                  {selectedUser?.is_verified === 1 ? "Verified Account" : "Unverified Account"}
                </span>
              </div>
            </div>

            {/* Profile Detail Fields Grid */}
            <div className="row gy-3">
              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="text-muted small fw-semibold d-block mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    EMAIL ADDRESS
                  </span>
                  <div className="text-dark small fw-semibold text-truncate">
                    <i className="bi bi-envelope me-1.5 text-primary me-2"></i>
                    {selectedUser?.email || "N/A"}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="text-muted small fw-semibold d-block mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    PHONE NUMBER
                  </span>
                  <div className="text-dark small fw-semibold text-truncate">
                    <i className="bi bi-telephone me-1.5 text-primary me-2"></i>
                    {selectedUser?.phone || "N/A"}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="text-muted small fw-semibold d-block mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    GENDER
                  </span>
                  <div className="text-dark small fw-semibold text-capitalize">
                    <i className="bi bi-gender-ambiguous me-1.5 text-primary me-2"></i>
                    {selectedUser?.gender || "Not specified"}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="text-muted small fw-semibold d-block mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    ACCOUNT ID
                  </span>
                  <div className="text-dark small fw-semibold font-monospace">
                    #{selectedUser?.id || selectedUser?.user_id || "N/A"}
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="text-muted small fw-semibold d-block mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    RESIDENTIAL ADDRESS
                  </span>
                  <div className="text-dark small">
                    <i className="bi bi-geo-alt me-1.5 text-primary me-2"></i>
                    {selectedUser?.address || "No address documented on file"}
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="text-muted small fw-semibold d-block mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    ACCOUNT CREATED
                  </span>
                  <div className="text-muted small">
                    <i className="bi bi-clock-history me-1.5 text-primary me-2"></i>
                    {selectedUser?.created_at
                      ? new Date(selectedUser.created_at).toLocaleString("en-US", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />

      {/* ─────────────────────────────────────────
          MODAL: CREATE NEW USER
      ───────────────────────────────────────── */}
      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title="Create New User Account"
        onSave={handleCreate}
        saveText={isSubmitting ? "Creating..." : "Create Account"}
        btnColorSave="btn-primary"
        children={
          <div>
            <div className="mb-3">
              <Input
                label="Full Name"
                width="100%"
                icon="bi bi-person"
                placeholder="e.g. Sokha Chan"
                name="full_name"
                value={form.full_name}
                error={errors.full_name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <Input
                label="Username"
                width="100%"
                icon="bi bi-person-badge"
                placeholder="e.g. sokhachan_24"
                name="username"
                value={form.username}
                error={errors.username}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <Input
                label="Email Address"
                width="100%"
                icon="bi bi-envelope"
                placeholder="e.g. user@library.edu"
                name="email"
                value={form.email}
                error={errors.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3 position-relative">
              <Input
                label="Account Password"
                width="100%"
                placeholder="At least 8 chars, 1 uppercase, 1 special char"
                name="password"
                autoComplete="new-password"
                value={form.password}
                error={errors.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="btn btn-link text-muted position-absolute end-0 top-50 translate-middle-y me-2 p-0 text-decoration-none"
                style={{ zIndex: 5, marginTop: errors.password ? "-10px" : "12px" }}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>

            <div className="mb-2">
              <Select
                label="Assigned Role"
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
                  { label: "Member / Student (Default)", value: 1 },
                  { label: "Librarian (Circulation Desk)", value: 2 },
                  { label: "Administrator (Full Access)", value: 3 },
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
