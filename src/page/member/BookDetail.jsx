import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBooksByIdAPI, getAllBooksAPI } from "../../services/booksService";
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import useBorrowRequest from "../../hook/useBorrowRequest";

/* ── Helpers ── */
function getInitials(title) {
  if (!title) return "";
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function availVariant(available, total) {
  const ratio = total > 0 ? available / total : 0;
  if (available === 0) return "unavailable";
  if (ratio <= 0.3) return "limited";
  return "available";
}

/* ── Small sub-components using Bootstrap ── */
function AvailDot({ available, total }) {
  const v = availVariant(available, total);
  const colors = {
    available: "bg-success",
    limited: "bg-warning",
    unavailable: "bg-danger",
  };
  return (
    <span
      className={`d-inline-block rounded-circle ${colors[v]}`}
      style={{ width: 8, height: 8, flexShrink: 0 }}
    />
  );
}

function AvailBadge({ available, total }) {
  const v = availVariant(available, total);
  const badgeClasses = {
    available: "bg-success-subtle text-success border border-success-subtle",
    limited: "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
    unavailable: "bg-danger-subtle text-danger border border-danger-subtle",
  };
  const labels = {
    available: "Available",
    limited: "Limited copies",
    unavailable: "Unavailable",
  };
  const icons = {
    available: "bi-check-circle",
    limited: "bi-exclamation-circle",
    unavailable: "bi-x-circle",
  };
  return (
    <span className={`badge rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1 ${badgeClasses[v]}`}>
      <i className={`bi ${icons[v]}`}></i>
      {labels[v]}
    </span>
  );
}

function DetailRow({ icon, label, value, valueStyle }) {
  return (
    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
      <span className="d-flex align-items-center gap-2 text-muted small">
        <i className={`bi ${icon} fs-6`}></i>
        {label}
      </span>
      <span className="fw-semibold text-dark text-end small" style={valueStyle}>
        {value}
      </span>
    </div>
  );
}

/* ── Loading Skeleton using Bootstrap Placeholder Component ── */
function LoadingSkeleton() {
  return (
    <div className="container-fluid py-4 placeholder-glow">
      <div className="mb-3 placeholder col-2 rounded" style={{ height: 34 }} />
      <div className="card shadow-sm mb-4">
        <div className="row g-0">
          <div className="col-md-3 bg-dark d-flex align-items-center justify-content-center p-5" style={{ minHeight: 250 }} />
          <div className="col-md-9 card-body d-flex flex-column gap-3 p-4">
            <div className="d-flex gap-2">
              <span className="placeholder col-2 rounded-pill" style={{ height: 24 }} />
              <span className="placeholder col-2 rounded-pill" style={{ height: 24 }} />
            </div>
            <div className="placeholder col-8 rounded" style={{ height: 36 }} />
            <div className="placeholder col-5 rounded" style={{ height: 18 }} />
            <div className="placeholder col-12 rounded" style={{ height: 60 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Error State ── */
function ErrorState({ message, onBack, onRetry }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4 bg-light text-center">
      <div className="bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 56, height: 56 }}>
        <i className="bi bi-exclamation-circle text-danger fs-3" />
      </div>
      <h5 className="fw-bold mb-1">Failed to load book</h5>
      <p className="text-muted small mb-4">{message}</p>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-secondary btn-sm px-3" onClick={onBack}>
          <i className="bi bi-arrow-left me-1"></i> Go back
        </button>
        <button className="btn btn-dark btn-sm fw-semibold px-3" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1"></i> Retry
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function BookDetail() {
  const navigate = useNavigate();
  const { id } = useParams();


  const [book, setBook] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowState, setBorrowState] = useState("idle");
  const [isModal, setIsModal] = useState(false)
  const [form, setForm] = useState({ note: '' })
  const { borrowRequest } = useBorrowRequest()

  const openModal = () => {
    setIsModal(true)
  }
  /* ── Fetch Main Book and Recommendations ── */
  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const bookData = await getBooksByIdAPI(id);
      const currentBook = bookData.data ? bookData.data : bookData;
      setBook(currentBook);

      const catalogData = await getAllBooksAPI();
      const allBooks = catalogData.data ? catalogData.data : catalogData;

      const dynamicRecs = allBooks
        .filter((b) => String(b.id) !== String(id))
        .slice(0, 3);

      setRecommended(dynamicRecs);
    } catch (err) {
      setError(err.message || "Failed to sync with API database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBorrow = async() => {
    if (!book) return;
    console.log(book.id, form)
    const payload = {
      book_id: book.id,
      note: form.note,
    };
    await borrowRequest(payload)
    setBorrowState("done");
    setIsModal(false);
    setForm({ note: "" });
    fetchData();
    navigate('/member/books')
  };

  const handleRecommendedClick = (recId) => {
    navigate(`/member/books/${recId}`);
    setBorrowState("idle");
  };

  if (loading) return <LoadingSkeleton />;
  if (error)
    return (
      <ErrorState
        message={error}
        onBack={() => navigate(-1)}
        onRetry={fetchData}
      />
    );
  if (!book) return null;

  return (
    <div className="container py-4 bg-light min-vh-100 mt-3">
      {/* Back Button */}
      <button className="btn btn-white btn-sm border bg-white text-muted px-3 mb-3 d-inline-flex align-items-center gap-1 shadow-sm" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Back to catalog
      </button>

      {/* Hero Book Component */}
      <div className="card border shadow-sm overflow-hidden mb-4 bg-white">
        <div className="row g-0">
          {/* Cover Art Wrapper Column */}
          <div
            className="col-md-4 col-lg-3 bg-dark d-flex align-items-center justify-content-center p-0 text-center"
            style={{ minHeight: "250px" }}
          >
            <div className="w-100 h-100 d-flex align-items-center justify-content-center position-relative overflow-hidden">

              {book.thumbnail ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${book.thumbnail}`}
                  alt={book.book_title}
                  className="w-100 h-100 object-fit-cover"
                />
              ) : (
                <div className="text-white text-center">
                  <div className="fs-2 fw-bold">
                    {getInitials(book.book_title)}
                  </div>
                  <div style={{ fontSize: "10px", opacity: 0.7 }}>
                    No Cover
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Book Identity Body Column */}
          <div className="col-md-8 col-lg-9 p-4 d-flex flex-column justify-content-center gap-3">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="badge bg-light text-muted border px-2 py-1.5 d-inline-flex align-items-center gap-1 font-monospace">
                <i className="bi bi-tag"></i> {book.category_name || "General"}
              </span>
              <AvailBadge available={book.available_copies} total={book.total_copies} />
            </div>

            <div>
              <h1 className="h3 fw-bold mb-1 text-dark">{book.book_title}</h1>
              <p className="text-muted small mb-0">
                by <b className="text-dark">{book.author_name}</b> &nbsp;·&nbsp; {book.publisher_name} &nbsp;·&nbsp; {book.publish_year}
              </p>
            </div>

            <p className="text-muted border-start border-3 ps-3 small my-1 lh-base">
              {book.description || "No description provided."}
            </p>

            <div className="d-flex align-items-center gap-2 flex-wrap pt-1">
              <button
                className={`btn btn-sm px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 ${borrowState === "done" ? "btn-success" : "btn-dark"
                  }`}
                onClick={openModal}
                disabled={borrowState !== "idle" || book.available_copies === 0}
              >
                {borrowState === "loading" ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                ) : (
                  <i className={`bi ${borrowState === "done" ? "bi-check2" : "bi-book"}`} />
                )}
                {borrowState === "idle" && book.available_copies === 0
                  ? "Unavailable"
                  : borrowState === "loading"
                    ? "Processing..."
                    : borrowState === "done"
                      ? "Borrowed!"
                      : "Borrow this book"}
              </button>

              <div className="bg-light border px-3 py-1.5 rounded d-inline-flex align-items-center gap-2 text-muted small">
                <i className="bi bi-journals"></i>
                <span className="fw-bold text-dark fs-6">{book.available_copies}</span>
                <span>/ {book.total_copies} copies available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Matrix Stat Row */}
        <div className="row g-0 border-top bg-light">
          <div className="col-6 col-md-3 p-3 border-end text-center text-md-start">
            <div className="text-muted small" style={{ fontSize: "11px" }}>ISBN</div>
            <div className="fw-semibold text-dark small">{book.isbn || "N/A"}</div>
          </div>
          <div className="col-6 col-md-3 p-3 border-end-md text-center text-md-start border-end">
            <div className="text-muted small" style={{ fontSize: "11px" }}>Edition</div>
            <div className="fw-semibold text-dark small">{book.edition || "1st"} Edition</div>
          </div>
          <div className="col-6 col-md-3 p-3 border-end text-center text-md-start border-top border-top-md-0">
            <div className="text-muted small" style={{ fontSize: "11px" }}>Pages</div>
            <div className="fw-semibold text-dark small">{book.pages || "--"} pages</div>
          </div>
          <div className="col-6 col-md-3 p-3 text-center text-md-start border-top border-top-md-0">
            <div className="text-muted small" style={{ fontSize: "11px" }}>Language</div>
            <div className="fw-semibold text-dark small">{book.language || "English"}</div>
          </div>
        </div>
      </div>

      {/* Two-Column Metadata Information Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card p-4 border shadow-sm h-100 bg-white">
            <div className="text-muted fw-bold text-uppercase small tracking-wider mb-2" style={{ fontSize: "11px" }}>Book details</div>
            <DetailRow icon="bi-person-lines-fill" label="Author" value={book.author_name} />
            <DetailRow icon="bi-building" label="Publisher" value={book.publisher_name} />
            <DetailRow icon="bi-calendar3" label="Published" value={book.publish_year} />
            <DetailRow icon="bi-bookmark" label="Category" value={book.category_name || "Uncategorized"} />
            <DetailRow icon="bi-upc-scan" label="ISBN" value={book.isbn || "N/A"} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4 border shadow-sm h-100 bg-white">
            <div className="text-muted fw-bold text-uppercase small tracking-wider mb-2" style={{ fontSize: "11px" }}>Library info</div>
            <DetailRow icon="bi-journals" label="Total copies" value={book.total_copies} />
            <DetailRow icon="bi-check-circle" label="Available" value={`${book.available_copies} copies`} valueStyle={{ color: "#3B6D11" }} />
            <div className="d-flex justify-content-between align-items-center py-2">
              <span className="d-flex align-items-center gap-2 text-muted small">
                <i className="bi bi-geo-alt fs-6"></i> Shelf location
              </span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold px-2 py-1.5 d-inline-flex align-items-center gap-1">
                <i className="bi bi-geo-alt" style={{ fontSize: 12 }}></i> {book.shelf_location || "Main Stack"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Extensive Details Box */}
      <div className="card p-4 border shadow-sm mb-4 bg-white">
        <div className="text-muted fw-bold text-uppercase small tracking-wider mb-2" style={{ fontSize: "11px" }}>Description</div>
        <p className="text-muted small lh-lg mb-0">
          {book.description || "No extensive summary details available."}
        </p>
      </div>

      {/* Dynamic Recommended Section */}
      {recommended.length > 0 && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-dark mb-0">You might also like</h5>
            <button className="btn btn-link text-muted btn-sm text-decoration-none p-0 d-inline-flex align-items-center gap-1" onClick={() => navigate("/member/books")}>
              View all <i className="bi bi-auto-right"></i>
            </button>
          </div>

          <div className="row g-3">
            {recommended.map((rec) => (
              <div key={rec.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div
                  className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative p-0"
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  }}
                  onClick={() => handleRecommendedClick(rec.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 28px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.06)";
                  }}
                >
                  {/* IMAGE (same pattern as BookCard) */}
                  <div
                    className="bg-light position-relative overflow-hidden"
                    style={{ height: 280, objectFit: 'cover' }}
                  >
                    {rec.thumbnail ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${rec.thumbnail}`}
                        alt={rec.book_title}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100 text-secondary">
                        <span className="fs-3 fw-bold">
                          {getInitials(rec.book_title)}
                        </span>
                      </div>
                    )}

                    {/* YEAR BADGE (same style as main card) */}
                    <span className="position-absolute top-0 end-0 m-2 badge bg-dark text-white">
                      {rec.publish_year}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="card-body d-flex flex-column p-3">
                    <small className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: 10 }}>
                      {rec.category_name}
                    </small>

                    <h6 className="fw-bold text-dark text-truncate mb-1">
                      {rec.book_title.length > 25
                        ? rec.book_title.slice(0, 25) + "..."
                        : rec.book_title}
                    </h6>

                    <p className="text-muted small mb-2 text-truncate">
                      {rec.author_name}
                    </p>

                    <div className="mt-auto pt-2 border-top d-flex align-items-center gap-2">
                      <AvailDot
                        available={rec.available_copies}
                        total={rec.total_copies}
                      />
                      <span style={{ fontSize: "11px" }}>
                        {rec.available_copies} / {rec.total_copies} available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* modal */}
      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title='Borrow books'
        onSave={handleBorrow}
        saveText="Borrow"
        btnColorSave="btn-success"
        children={
          <div className="container-fluid">
            <div className="row">
              {/* Book Cover */}
              <div className="col-md-4 text-center mb-3">
                <img
                  src={`${import.meta.env.VITE_API_URL}${book.thumbnail}`}
                  alt={book.book_title}
                  className="img-fluid rounded shadow"
                  style={{
                    maxHeight: "260px",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Book Information */}
              <div className="col-md-8">
                <h4 className="fw-bold">{book.book_title}</h4>

                <div className="row mt-3">
                  <div className="col-6 mb-2">
                    <strong>Author</strong>
                    <p className="text-muted mb-0">{book.author_name}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>Category</strong>
                    <p className="text-muted mb-0">{book.category_name}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>ISBN</strong>
                    <p className="text-muted mb-0">{book.isbn}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>Edition</strong>
                    <p className="text-muted mb-0">{book.edition}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>Published</strong>
                    <p className="text-muted mb-0">{book.publish_year}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>Language</strong>
                    <p className="text-muted mb-0">{book.language}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>Pages</strong>
                    <p className="text-muted mb-0">{book.pages}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>Shelf</strong>
                    <p className="text-muted mb-0">{book.shelf_location}</p>
                  </div>

                  <div className="col-12 mb-2">
                    <strong>Status</strong>
                    <span
                      className={`badge ms-2 ${book.status === "available"
                        ? "bg-success"
                        : "bg-danger"
                        }`}
                    >
                      {book.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <strong>Description</strong>
                  <p className="text-muted">
                    {book.description}
                  </p>
                </div>
              </div>
            </div>

            <hr />

            {/* Borrow Form */}
            <Input
              width="100%"
              label="Borrow Note"
              name="borrow_note"
              placeholder="Enter borrow note..."
              value={form.note}
              onChange={(e) =>
                setForm({
                  ...form,
                  note: e.target.value,
                })
              }
            />
          </div>
        }
      />
    </div>
  );
}