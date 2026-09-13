import React, { useState, useMemo } from "react";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Textarea from "../../components/ui/Textarea";
import useAuthor from "../../hook/useAuthor";
import useBooks from "../../hook/useBooks";
import { validateAuthor } from "../../validations/AuthorSchema";

/* ─────────────────────────────────────────
    HELPERS & AVATAR GENERATION
───────────────────────────────────────── */
function getAuthorInitials(name) {
  if (!name) return "AU";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
  "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
  "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)",
];

function getAvatarGradient(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

/* ─────────────────────────────────────────
    MAIN COMPONENT: Authors
───────────────────────────────────────── */
function Authors() {
  const {
    author = [],
    search = "",
    setSearch,
    updateAuthor,
    getAllAuthor,
    deleteAuthor,
    createAuthor,
  } = useAuthor({ all: true, per_page: 1000 });

  const { books = [] } = useBooks();

  // Local state
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ author_name: "", biography: "" });
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map author books count
  const authorBookCountMap = useMemo(() => {
    const map = {};
    books.forEach((b) => {
      if (b.author_name) {
        map[b.author_name.toLowerCase()] = (map[b.author_name.toLowerCase()] || 0) + 1;
      }
      if (b.author_id) {
        map[`id_${b.author_id}`] = (map[`id_${b.author_id}`] || 0) + 1;
      }
    });
    return map;
  }, [books]);

  const getBookCount = (data) => {
    if (!data) return 0;
    const byId = authorBookCountMap[`id_${data.id}`];
    const byName = authorBookCountMap[(data.author_name || "").toLowerCase()];
    return byId || byName || 0;
  };

  // Client-side search filtering
  const filteredAuthors = useMemo(() => {
    if (!search || !search.trim()) return author;
    const q = search.trim().toLowerCase();
    return author.filter(
      (a) =>
        (a.author_name || "").toLowerCase().includes(q) ||
        (a.biography || "").toLowerCase().includes(q)
    );
  }, [author, search]);

  // Statistics computations
  const totalAuthorsCount = author.length;
  const authorsWithBooks = useMemo(() => {
    return author.filter((a) => getBookCount(a) > 0).length;
  }, [author, authorBookCountMap]);

  const totalBooksAuthored = useMemo(() => {
    return author.reduce((acc, a) => acc + getBookCount(a), 0);
  }, [author, authorBookCountMap]);

  const authorsWithBio = useMemo(() => {
    return author.filter((a) => a.biography && a.biography.trim().length > 0).length;
  }, [author]);

  // Form Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const openModalCreate = () => {
    setErrors({});
    setFormData({ author_name: "", biography: "" });
    setIsModalCreate(true);
  };

  const openModelEdit = (data) => {
    setErrors({});
    setSelectedAuthor(data);
    setFormData({
      author_name: data.author_name || "",
      biography: data.biography || "",
    });
    setIsModalEdit(true);
  };

  const openModalDelete = (data) => {
    setSelectedAuthor(data);
    setIsModalDelete(true);
  };

  const handleDelete = async () => {
    if (!selectedAuthor?.id) return;
    setIsSubmitting(true);
    try {
      await deleteAuthor(selectedAuthor.id);
      setIsModalDelete(false);
      setSelectedAuthor(null);
      await getAllAuthor();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    const validationError = validateAuthor(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    if (!selectedAuthor?.id) return;
    setIsSubmitting(true);
    try {
      setErrors({});
      await updateAuthor(selectedAuthor.id, formData);
      setIsModalEdit(false);
      setSelectedAuthor(null);
      await getAllAuthor();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async () => {
    const validationError = validateAuthor(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    setIsSubmitting(true);
    try {
      setErrors({});
      await createAuthor(formData);
      setIsModalCreate(false);
      await getAllAuthor();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container px-3 px-lg-4 py-3 min-vh-100" style={{ backgroundColor: "#f8fafc" }}>
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
                background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                color: "#ffffff",
                boxShadow: "0 8px 22px rgba(16, 185, 129, 0.25)",
              }}
            >
              <i className="bi bi-person-badge-fill fs-2"></i>
            </div>
            <div>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                <h3 className="fw-bold text-dark mb-0 ms-3" style={{ letterSpacing: "-0.5px" }}>
                  Meet the Authors
                </h3>
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 small fw-semibold d-inline-flex align-items-center gap-1.5">
                  <span
                    className="d-inline-block rounded-circle bg-success"
                    style={{ width: "6px", height: "6px" }}
                  />
                  {totalAuthorsCount} Contributors
                </span>
              </div>
              <p className="text-muted small mb-0 ms-3">
                Manage authors, bibliographic profiles, and publication credits across the library catalog.
              </p>
            </div>
          </div>

          {/* Right: Search, View Switcher & Action Button */}
          <div className="d-flex align-items-center gap-4 flex-wrap">
            {/* Search Bar */}
            <div style={{ width: "240px"}}>
              <Input
                icon="bi bi-search"
                placeholder="Search authors or bio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* View Mode Toggle */}
            <div className="btn-group p-1 bg-light border rounded-pill shadow-xs" role="group">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1 fw-medium border-0 ${
                  viewMode === "grid" ? "btn-white bg-white shadow-xs text-primary" : "text-secondary"
                }`}
                onClick={() => setViewMode("grid")}
                title="Grid Card View"
              >
                <i className="bi bi-grid-fill"></i>
                <span className="d-none d-md-inline">Grid</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1 fw-medium border-0 ${
                  viewMode === "table" ? "btn-white bg-white shadow-xs text-primary" : "text-secondary"
                }`}
                onClick={() => setViewMode("table")}
                title="Compact Table View"
              >
                <i className="bi bi-list-ul"></i>
                <span className="d-none d-md-inline">Table</span>
              </button>
            </div>

            {/* Create Author Button */}
            <button
              type="button"
              className="btn text-white rounded-pill px-3.5 py-2.5 shadow-sm d-inline-flex align-items-center gap-2 fw-semibold"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                border: "none",
              }}
              onClick={openModalCreate}
            >
              <i className="bi bi-person-plus-fill"></i>
              <span>Create Author</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          KPI SUMMARY STATS RIBBON
      ───────────────────────────────────────── */}
      <div className="row gy-3 mb-4">
        {/* Total Authors */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="card border-0 rounded-4 p-4 bg-white shadow-sm h-100"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <div className="d-flex align-items-center gap-3">
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
                <i className="bi bi-people-fill fs-4"></i>
              </div>
              <div>
                <span
                  className="text-muted text-uppercase fw-semibold d-block"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  Total Authors
                </span>
                <h4 className="fw-bold text-dark mb-0">{totalAuthorsCount}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Authors with Books */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="card border-0 rounded-4 p-4 bg-white shadow-sm h-100"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <div className="d-flex align-items-center gap-3">
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
                <i className="bi bi-book-half fs-4"></i>
              </div>
              <div>
                <span
                  className="text-muted text-uppercase fw-semibold d-block"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  Catalog Creators
                </span>
                <h4 className="fw-bold text-dark mb-0">{authorsWithBooks}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Total Volumes */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="card border-0 rounded-4 p-4 bg-white shadow-sm h-100"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <div className="d-flex align-items-center gap-3">
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
                <i className="bi bi-journal-bookmark-fill fs-4"></i>
              </div>
              <div>
                <span
                  className="text-muted text-uppercase fw-semibold d-block"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  Authored Volumes
                </span>
                <h4 className="fw-bold text-dark mb-0">{totalBooksAuthored}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Documented Bios */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="card border-0 rounded-4 p-4 bg-white shadow-sm h-100"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-xs"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(245, 158, 11, 0.12)",
                  color: "#f59e0b",
                  borderRadius: "14px",
                }}
              >
                <i className="bi bi-card-text fs-4"></i>
              </div>
              <div>
                <span
                  className="text-muted text-uppercase fw-semibold d-block"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  Detailed Bios
                </span>
                <h4 className="fw-bold text-dark mb-0">{authorsWithBio}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          CONTENT AREA: GRID VIEW OR TABLE VIEW
      ───────────────────────────────────────── */}
      {filteredAuthors.length > 0 ? (
        viewMode === "grid" ? (
          /* ── GRID CARD VIEW ── */
          <div className="row gy-3 g-xl-4 mb-4">
            {filteredAuthors.map((data, index) => {
              const booksCount = getBookCount(data);
              return (
                <div className="col-12 col-md-6 col-xl-4 d-flex" key={data.id}>
                  <div
                    className="card border-0 rounded-4 bg-white w-100 p-4 shadow-sm position-relative overflow-hidden d-flex flex-column"
                    style={{
                      border: "1px solid #e2e8f0",
                      transition: "transform 0.22s ease, box-shadow 0.22s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 14px 28px -6px rgba(15, 23, 42, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(15, 23, 42, 0.04)";
                    }}
                  >
                    {/* Top row: Avatar, Name & ID Badge */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-3 overflow-hidden">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-xs flex-shrink-0"
                          style={{
                            width: "52px",
                            height: "52px",
                            background: getAvatarGradient(data.author_name),
                            fontSize: "16px",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {getAuthorInitials(data.author_name)}
                        </div>

                        <div className="overflow-hidden">
                          <h5
                            className="fw-bold text-dark mb-1 text-truncate"
                            title={data.author_name}
                            style={{ fontSize: "16px", lineHeight: "1.3" }}
                          >
                            {data.author_name}
                          </h5>
                          <div className="d-flex flex-wrap align-items-center gap-1.5">
                            <span
                              className="badge bg-light text-secondary border rounded-pill px-2 py-0.5"
                              style={{ fontSize: "10.5px" }}
                            >
                              ID #{data.id || index + 1}
                            </span>
                            <span
                              className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-0.5"
                              style={{ fontSize: "10.5px" }}
                            >
                              <i className="bi bi-book me-1"></i>
                              {booksCount} {booksCount === 1 ? "Volume" : "Volumes"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Biography Panel */}
                    <div
                      className="p-3 rounded-3 mb-3 flex-grow-1"
                      style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #f1f5f9",
                        minHeight: "84px",
                      }}
                    >
                      <div
                        className="d-flex align-items-center gap-1.5 text-muted small fw-semibold text-uppercase mb-1"
                        style={{ fontSize: "10.5px", letterSpacing: "0.4px" }}
                      >
                        <i className="bi bi-quote opacity-75"></i> Biography
                      </div>
                      <p
                        className="text-secondary small mb-0 lh-base"
                        style={{
                          fontSize: "12.5px",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                        title={data.biography}
                      >
                        {data.biography && data.biography.trim() ? (
                          data.biography
                        ) : (
                          <em className="text-muted opacity-75">No biography available for this author.</em>
                        )}
                      </p>
                    </div>

                    {/* Footer Row: Created Date & Actions */}
                    <div
                      className="d-flex align-items-center justify-content-between pt-2.5 border-top mt-auto"
                      style={{ borderColor: "#f1f5f9" }}
                    >
                      <small className="text-muted" style={{ fontSize: "11.5px" }}>
                        <i className="bi bi-calendar3 me-1 opacity-75"></i>
                        {data.created_at
                          ? new Date(data.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recently"}
                      </small>

                      <div className="d-flex align-items-center gap-1.5">
                        <button
                          type="button"
                          className="btn btn-sm btn-white bg-white border shadow-xs rounded-pill px-3 py-1 text-primary d-inline-flex align-items-center gap-1 fw-medium"
                          onClick={() => openModelEdit(data)}
                          title="Edit Author"
                        >
                          <i className="bi bi-pencil-square"></i>
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white bg-white border shadow-xs rounded-pill px-3 py-1 text-danger d-inline-flex align-items-center gap-1 fw-medium"
                          onClick={() => openModalDelete(data)}
                          title="Delete Author"
                        >
                          <i className="bi bi-trash"></i>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── COMPACT TABLE VIEW ── */
          <div
            className="card border-0 rounded-4 bg-white shadow-sm p-4 mb-4"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr
                    className="text-muted small text-uppercase"
                    style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                  >
                    <th>ID</th>
                    <th>Author Profile</th>
                    <th>Published Holdings</th>
                    <th>Biography Summary</th>
                    <th>Registration Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuthors.map((data, index) => {
                    const booksCount = getBookCount(data);
                    return (
                      <tr key={data.id}>
                        <td>
                          <span className="badge bg-light text-secondary border rounded-pill px-2.5 py-1 font-monospace">
                            #{data.id || index + 1}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2.5">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-xs flex-shrink-0"
                              style={{
                                width: "38px",
                                height: "38px",
                                background: getAvatarGradient(data.author_name),
                                fontSize: "13px",
                              }}
                            >
                              {getAuthorInitials(data.author_name)}
                            </div>
                            <div>
                              <div className="fw-semibold text-dark">{data.author_name}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1">
                            <i className="bi bi-book me-1"></i>
                            {booksCount} volumes
                          </span>
                        </td>
                        <td style={{ maxWidth: "320px" }}>
                          <span
                            className="text-muted small text-truncate d-inline-block w-100"
                            title={data.biography}
                          >
                            {data.biography || <em className="opacity-75">No biography</em>}
                          </span>
                        </td>
                        <td className="text-muted small">
                          {data.created_at
                            ? new Date(data.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recently"}
                        </td>
                        <td className="text-end">
                          <div className="d-inline-flex align-items-center gap-1.5">
                            <button
                              type="button"
                              className="btn btn-sm btn-white bg-white border shadow-xs rounded-pill px-2.5 py-1 text-primary"
                              onClick={() => openModelEdit(data)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-white bg-white border shadow-xs rounded-pill px-2.5 py-1 text-danger"
                              onClick={() => openModalDelete(data)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
              background: "rgba(16, 185, 129, 0.12)",
              color: "#10b981",
            }}
          >
            <i className="bi bi-search fs-2"></i>
          </div>
          <h5 className="fw-bold text-dark mb-1">No Matching Authors Found</h5>
          <p className="text-muted small mb-3" style={{ maxWidth: "420px" }}>
            {search
              ? `No author records match “${search}”. Check your spelling or try broader keywords.`
              : "No author profiles have been registered in the system yet."}
          </p>
          <div className="d-flex gap-2">
            {search && (
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-3.5 py-2"
                onClick={() => setSearch("")}
              >
                <i className="bi bi-arrow-counterclockwise me-1.5"></i> Reset Search
              </button>
            )}
            <button
              type="button"
              className="btn text-white rounded-pill px-4 py-2 shadow-sm fw-semibold"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                border: "none",
              }}
              onClick={openModalCreate}
            >
              <i className="bi bi-person-plus-fill me-1.5"></i> Create New Author
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          MODAL: CREATE NEW AUTHOR
      ───────────────────────────────────────── */}
      <Modal
        isOpen={isModalCreate}
        onClose={() => setIsModalCreate(false)}
        title="Create New Author Profile"
        onSave={handleCreate}
        saveText={isSubmitting ? "Saving..." : "Create Author"}
        btnColorSave="btn-success"
        children={
          <div>
            <div className="mb-3">
              <Input
                width="100%"
                label="Author Full Name"
                placeholder="e.g. J.K. Rowling, Stephen King"
                icon="bi bi-person-badge"
                value={formData.author_name}
                name="author_name"
                error={errors.author_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Textarea
                width="100%"
                label="Author Biography"
                placeholder="Write author background, literary honors, or summary..."
                icon="bi bi-journal-text"
                value={formData.biography}
                name="biography"
                error={errors.biography}
                onChange={handleChange}
              />
              <div className="d-flex justify-content-between align-items-center mt-1">
                <small className="text-muted" style={{ fontSize: "11px" }}>
                  Minimum 5 characters, up to 1000 characters.
                </small>
                <small
                  className={
                    (formData.biography?.length || 0) > 1000
                      ? "text-danger fw-semibold"
                      : "text-muted"
                  }
                  style={{ fontSize: "11px" }}
                >
                  {formData.biography?.length || 0}/1000
                </small>
              </div>
            </div>
          </div>
        }
      />

      {/* ─────────────────────────────────────────
          MODAL: UPDATE AUTHOR
      ───────────────────────────────────────── */}
      <Modal
        isOpen={isModalEdit}
        onClose={() => setIsModalEdit(false)}
        title={`Update Author • ${selectedAuthor?.author_name || "Profile"}`}
        onSave={handleEdit}
        saveText={isSubmitting ? "Updating..." : "Save Changes"}
        btnColorSave="btn-primary"
        children={
          <div>
            <div className="mb-3">
              <Input
                width="100%"
                label="Author Full Name"
                placeholder="Enter author full name"
                icon="bi bi-person-badge"
                name="author_name"
                value={formData.author_name}
                error={errors.author_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Textarea
                width="100%"
                label="Author Biography"
                placeholder="Enter biography..."
                icon="bi bi-journal-text"
                name="biography"
                value={formData.biography}
                error={errors.biography}
                onChange={handleChange}
              />
              <div className="d-flex justify-content-between align-items-center mt-1">
                <small className="text-muted" style={{ fontSize: "11px" }}>
                  Minimum 5 characters, up to 1000 characters.
                </small>
                <small
                  className={
                    (formData.biography?.length || 0) > 1000
                      ? "text-danger fw-semibold"
                      : "text-muted"
                  }
                  style={{ fontSize: "11px" }}
                >
                  {formData.biography?.length || 0}/1000
                </small>
              </div>
            </div>
          </div>
        }
      />

      {/* ─────────────────────────────────────────
          MODAL: CONFIRM DELETE
      ───────────────────────────────────────── */}
      <Modal
        isOpen={isModalDelete}
        onClose={() => setIsModalDelete(false)}
        title="Confirm Author Deletion"
        onSave={handleDelete}
        saveText={isSubmitting ? "Deleting..." : "Yes, Delete Author"}
        btnColorSave="btn-danger"
        children={
          <div className="text-center py-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
              }}
            >
              <i className="bi bi-trash3-fill fs-3"></i>
            </div>
            <h6 className="fw-bold text-dark mb-1">
              Delete “{selectedAuthor?.author_name}”?
            </h6>
            <p className="text-muted small mb-0" style={{ maxWidth: "340px", margin: "0 auto" }}>
              Are you sure you want to delete this author? This record will be permanently removed from the system.
            </p>
          </div>
        }
      />
    </div>
  );
}

export default Authors;
