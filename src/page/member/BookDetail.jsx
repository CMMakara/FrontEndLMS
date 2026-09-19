import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getBooksByIdAPI, getAllBooksAPI } from "../../services/booksService";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import useBorrowRequest from "../../hook/useBorrowRequest";
import { useToast } from "../../context/ToastContext";

/* ─────────────────────────────────────────
    HELPERS & UTILITIES
───────────────────────────────────────── */
function getInitials(title) {
  if (!title) return "BK";
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function availVariant(available, total) {
  const avail = Number(available) || 0;
  const tot = Number(total) || 0;
  if (avail <= 0) return "danger";
  if (tot > 0 && avail / tot <= 0.3) return "warning";
  return "success";
}

function getBookImageUrl(thumbnail) {
  if (!thumbnail || typeof thumbnail !== "string") return "";
  const clean = thumbnail.trim();
  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("data:") ||
    clean.startsWith("blob:")
  ) {
    return clean;
  }

  // Remove leading slashes and any leading 'uploads/'
  let path = clean
    .replace(/^(\/)?uploads\//i, "")
    .replace(/^\\?uploads\\/i, "")
    .replace(/^[/\\]+/, "");

  // Ensure path starts with 'books/' if it's just the filename
  if (!path.toLowerCase().startsWith("books/")) {
    path = `books/${path}`;
  }

  const base = (import.meta.env.VITE_API_URL || "http://localhost:3000/uploads/").replace(/\/?$/, "/");

  // If base already contains /books/, avoid duplicate 'books/'
  if (base.toLowerCase().endsWith("/books/")) {
    path = path.replace(/^books\//i, "");
  }

  return `${base}${path}`;
}

function calculateDueDate(days = 14) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ─────────────────────────────────────────
    SUB-COMPONENT: AVAILABILITY BADGE
───────────────────────────────────────── */
function AvailBadge({ available = 0, total = 0, size = "md" }) {
  const variant = availVariant(available, total);
  let label = "Available";
  let bgClass = "bg-success-subtle text-success border-success-subtle";
  let icon = "bi-check-circle-fill";

  if (variant === "danger") {
    label = "Checked Out";
    bgClass = "bg-danger-subtle text-danger border-danger-subtle";
    icon = "bi-x-circle-fill";
  } else if (variant === "warning") {
    label = "Limited Copies";
    bgClass = "bg-warning-subtle text-warning-emphasis border-warning-subtle";
    icon = "bi-exclamation-triangle-fill";
  }

  const isSmall = size === "sm";

  return (
    <span
      className={`badge rounded-pill border fw-semibold d-inline-flex align-items-center gap-1.5 ${bgClass} ${
        isSmall ? "px-2 py-1" : "px-3 py-1.5"
      }`}
      style={{ fontSize: isSmall ? "11px" : "12px", letterSpacing: "0.2px" }}
    >
      <i className={`bi ${icon}`} style={{ fontSize: isSmall ? "11px" : "12px" }}></i>
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────
    SUB-COMPONENT: STAT TILE
───────────────────────────────────────── */
function StatTile({ icon, label, value, subtext }) {
  return (
    <div
      className="p-3 rounded-3 border bg-white h-100 d-flex flex-column justify-content-between"
      style={{
        borderColor: "#e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
      }}
    >
      <div className="d-flex align-items-center gap-2 mb-2 text-muted small">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: "#f1f5f9",
            color: "#4f46e5",
          }}
        >
          <i className={`bi ${icon}`} style={{ fontSize: "13px" }}></i>
        </div>
        <span className="fw-medium text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
          {label}
        </span>
      </div>
      <div>
        <div className="fw-bold text-dark text-truncate fs-6" title={value}>
          {value || "--"}
        </div>
        {subtext && <small className="text-muted" style={{ fontSize: "11px" }}>{subtext}</small>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
    SUB-COMPONENT: SPEC ROW
───────────────────────────────────────── */
function SpecRow({ label, value, icon, copyable, onCopy }) {
  return (
    <div className="d-flex justify-content-between align-items-center py-2.5 border-bottom" style={{ borderColor: "#f1f5f9" }}>
      <span className="text-muted small d-flex align-items-center gap-2">
        {icon && <i className={`bi ${icon} text-secondary`} style={{ fontSize: "14px" }}></i>}
        <span>{label}</span>
      </span>
      <span className="fw-semibold text-dark small text-end d-flex align-items-center gap-1.5">
        {value || "--"}
        {copyable && value && (
          <button
            type="button"
            className="btn btn-sm btn-link p-0 text-muted ms-1 text-decoration-none"
            title={`Copy ${label}`}
            onClick={() => onCopy && onCopy(value, label)}
          >
            <i className="bi bi-copy" style={{ fontSize: "12px" }}></i>
          </button>
        )}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
    LOADING SKELETON
───────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="min-vh-100 bg-light" style={{ paddingTop: "95px" }}>
      <div className="container py-4">
        {/* Breadcrumb Skeleton */}
        <div className="placeholder-glow mb-4">
          <div className="placeholder col-3 rounded" style={{ height: "24px" }}></div>
        </div>

        <div className="row g-4">
          {/* Cover Skeleton */}
          <div className="col-lg-4 col-md-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center placeholder-glow">
              <div
                className="placeholder rounded-4 w-100 mb-4"
                style={{ height: "380px" }}
              ></div>
              <div className="placeholder col-8 rounded mb-2" style={{ height: "20px" }}></div>
              <div className="placeholder col-10 rounded mb-4" style={{ height: "14px" }}></div>
              <div className="placeholder col-12 rounded-pill" style={{ height: "46px" }}></div>
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="col-lg-8 col-md-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 placeholder-glow">
              <div className="d-flex gap-2 mb-3">
                <span className="placeholder col-2 rounded-pill" style={{ height: "26px" }}></span>
                <span className="placeholder col-2 rounded-pill" style={{ height: "26px" }}></span>
              </div>
              <div className="placeholder col-9 rounded mb-2" style={{ height: "36px" }}></div>
              <div className="placeholder col-5 rounded mb-4" style={{ height: "18px" }}></div>

              <div className="row g-3 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="col-6 col-sm-3">
                    <div className="placeholder rounded-3 w-100" style={{ height: "70px" }}></div>
                  </div>
                ))}
              </div>

              <div className="placeholder col-12 rounded mb-2" style={{ height: "20px" }}></div>
              <div className="placeholder col-12 rounded mb-2" style={{ height: "20px" }}></div>
              <div className="placeholder col-10 rounded mb-4" style={{ height: "20px" }}></div>
              <div className="placeholder col-8 rounded" style={{ height: "20px" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
    ERROR STATE
───────────────────────────────────────── */
function ErrorState({ message, onBack, onRetry }) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4 bg-light text-center"
      style={{ paddingTop: "95px" }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm"
        style={{ width: "64px", height: "64px", backgroundColor: "#fee2e2" }}
      >
        <i className="bi bi-exclamation-triangle text-danger fs-2"></i>
      </div>
      <h4 className="fw-bold text-dark mb-1">Book Not Available</h4>
      <p className="text-muted small mb-4" style={{ maxWidth: "420px" }}>
        {message || "We couldn't retrieve this book from the library catalog. It might have been moved or removed."}
      </p>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-secondary px-3 py-2 rounded-pill fw-medium" onClick={onBack}>
          <i className="bi bi-arrow-left me-1"></i> Back to Catalog
        </button>
        <button
          className="btn text-white px-4 py-2 rounded-pill fw-medium"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)" }}
          onClick={onRetry}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Try Again
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
    MAIN COMPONENT: BookDetail
───────────────────────────────────────── */
export default function BookDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();

  const [book, setBook] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowSubmitting, setBorrowSubmitting] = useState(false);
  const [borrowDone, setBorrowDone] = useState(false);

  // Modal & Form State
  const [isModal, setIsModal] = useState(false);
  const [borrowNote, setBorrowNote] = useState("");
  const [imgError, setImgError] = useState(false);

  // UI Interactive States
  const [activeTab, setActiveTab] = useState("overview"); // overview, specs, guidelines
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { borrowRequest } = useBorrowRequest();

  /* ── Check Bookmark status from localStorage ── */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("lms_bookmarked_books") || "[]");
      if (Array.isArray(saved) && id) {
        setIsBookmarked(saved.includes(String(id)));
      }
    } catch {
      // ignore
    }
  }, [id]);

  const toggleBookmark = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("lms_bookmarked_books") || "[]");
      let updated;
      if (isBookmarked) {
        updated = saved.filter((item) => String(item) !== String(id));
        setIsBookmarked(false);
        showToast("Removed from your saved reading list", "info");
      } else {
        updated = [...saved, String(id)];
        setIsBookmarked(true);
        showToast("Saved to your reading list!", "success");
      }
      localStorage.setItem("lms_bookmarked_books", JSON.stringify(updated));
    } catch {
      setIsBookmarked(!isBookmarked);
    }
  };

  /* ── Copy Share Link ── */
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Book link copied to clipboard!", "success");
    }).catch(() => {
      showToast("Could not copy link", "error");
    });
  };

  /* ── Quick Copy Helper ── */
  const handleCopyText = (val, label) => {
    navigator.clipboard.writeText(val).then(() => {
      showToast(`${label} copied!`, "success");
    });
  };

  /* ── Fetch Main Book and Recommendations ── */
  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setImgError(false);
    setBorrowDone(false);

    try {
      const bookRes = await getBooksByIdAPI(id);
      const currentBook = bookRes?.data ? bookRes.data : bookRes;
      if (!currentBook || (!currentBook.book_title && !currentBook.id)) {
        throw new Error("Book details could not be found.");
      }
      setBook(currentBook);

      // Fetch all books to assemble smart recommendations
      const catalogRes = await getAllBooksAPI();
      const allBooks = catalogRes?.data ? catalogRes.data : catalogRes;

      if (Array.isArray(allBooks)) {
        // Prioritize books in the same category, then fallback to other titles
        const sameCategory = allBooks.filter(
          (b) =>
            String(b.id) !== String(id) &&
            (b.category_name === currentBook.category_name ||
              b.category_id === currentBook.category_id)
        );
        const others = allBooks.filter(
          (b) =>
            String(b.id) !== String(id) &&
            b.category_name !== currentBook.category_name &&
            b.category_id !== currentBook.category_id
        );

        const mergedRecs = [...sameCategory, ...others].slice(0, 4);
        setRecommended(mergedRecs);
      }
    } catch (err) {
      setError(err?.message || "Failed to sync book information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchData();
  }, [id]);

  /* ── Handle Borrow Submit ── */
  const handleBorrow = async () => {
    if (!book || !book.id) return;
    setBorrowSubmitting(true);
    try {
      const payload = {
        book_id: book.id,
        note: borrowNote.trim(),
      };
      const res = await borrowRequest(payload);
      if (res !== false) {
        setBorrowDone(true);
        setIsModal(false);
        setBorrowNote("");
        showToast("Borrow request submitted! Awaiting library desk approval.", "success");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast("Unable to submit borrow request.", "error");
    } finally {
      setBorrowSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) {
    return (
      <ErrorState
        message={error}
        onBack={() => navigate("/member/books")}
        onRetry={fetchData}
      />
    );
  }
  if (!book) return null;

  const avail = Number(book.available_copies) || 0;
  const total = Number(book.total_copies) || 0;
  const isAvailable = avail > 0;
  const availPercent = total > 0 ? Math.min(100, Math.round((avail / total) * 100)) : 0;
  const isLimited = total > 0 && avail / total <= 0.3 && avail > 0;

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor: "#f8fafc",
        paddingTop: "95px",
        paddingBottom: "80px",
      }}
    >
      {/* ─────────────────────────────────────────
          TOP BREADCRUMB & CONTEXT BAR
      ───────────────────────────────────────── */}
      <div className="border-bottom bg-white" style={{ borderColor: "#e2e8f0" }}>
        <div className="container py-3">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            {/* Breadcrumbs */}
            <nav aria-label="breadcrumb" className="d-flex align-items-center gap-2">
              <Link
                to="/member/books"
                className="btn btn-sm btn-white border bg-white shadow-xs rounded-pill px-3 text-secondary d-inline-flex align-items-center gap-1.5 fw-medium"
                style={{ transition: "all 0.2s ease" }}
              >
                <i className="bi bi-arrow-left"></i>
                <span>Catalog</span>
              </Link>

              <span className="text-muted d-none d-sm-inline" style={{ fontSize: "13px" }}>/</span>

              <div className="d-none d-sm-flex align-items-center gap-2 text-muted small">
                <Link to="/" className="text-decoration-none text-secondary">
                  Home
                </Link>
                <span>/</span>
                <Link to="/member/books" className="text-decoration-none text-secondary">
                  Books
                </Link>
                {book.category_name && (
                  <>
                    <span>/</span>
                    <Link
                      to={`/member/books?category=${encodeURIComponent(book.category_name)}`}
                      className="text-decoration-none text-primary fw-medium"
                    >
                      {book.category_name}
                    </Link>
                  </>
                )}
                <span>/</span>
                <span className="text-dark fw-semibold text-truncate" style={{ maxWidth: "220px" }}>
                  {book.book_title}
                </span>
              </div>
            </nav>

            {/* Quick Action Tools */}
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1.5 border ${
                  isBookmarked
                    ? "btn-danger border-danger text-white"
                    : "btn-white bg-white text-dark shadow-xs"
                }`}
                onClick={toggleBookmark}
                title={isBookmarked ? "Remove from Reading List" : "Save to Reading List"}
              >
                <i className={`bi ${isBookmarked ? "bi-heart-fill" : "bi-heart"}`}></i>
                <span className="d-none d-md-inline">{isBookmarked ? "Saved" : "Save"}</span>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-white bg-white border shadow-xs rounded-pill px-3 text-dark d-inline-flex align-items-center gap-1.5"
                onClick={handleShare}
                title="Copy share link"
              >
                <i className="bi bi-share"></i>
                <span className="d-none d-md-inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          MAIN BOOK SHOWCASE HERO
      ───────────────────────────────────────── */}
      <div className="container py-4">
        <div className="row g-4 g-xl-5">
          {/* ── LEFT COLUMN: Physical Book Presentation & Sticky Borrow CTA ── */}
          <div className="col-lg-4 col-md-5">
            <div
              className="position-sticky"
              style={{
                top: "85px",
                zIndex: 10,
              }}
            >
              {/* Cover Showcase Card */}
              <div
                className="card border-0 rounded-4 overflow-hidden mb-4 bg-white"
                style={{
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #e2e8f0",
                }}
              >
                {/* Book Cover Frame */}
                <div
                  className="p-4 d-flex align-items-center justify-content-center position-relative overflow-hidden"
                  style={{
                    background: "radial-gradient(circle at 50% 30%, #f1f5f9 0%, #e2e8f0 100%)",
                    minHeight: "360px",
                  }}
                >
                  {/* Floating Badges */}
                  <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 3 }}>
                    <span className="badge rounded-pill bg-white text-dark shadow-sm border px-3 py-1.5 fw-semibold font-monospace small">
                      <i className="bi bi-tag-fill text-primary me-1"></i>
                      {book.category_name || "General"}
                    </span>
                  </div>

                  {book.publish_year && (
                    <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 3 }}>
                      <span className="badge rounded-pill bg-dark bg-opacity-75 text-white backdrop-blur shadow-sm px-3 py-1.5 fw-medium small">
                        {book.publish_year}
                      </span>
                    </div>
                  )}

                  {/* 3D Physical Book Mockup */}
                  <div
                    className="position-relative"
                    style={{
                      width: "220px",
                      height: "320px",
                      perspective: "1000px",
                    }}
                  >
                    {/* Cover Image or Fallback Cover */}
                    {book.thumbnail && !imgError ? (
                      <div
                        className="w-100 h-100 rounded-3 overflow-hidden position-relative"
                        style={{
                          boxShadow:
                            "0 22px 35px -10px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(0,0,0,0.05)",
                          transform: "rotateY(-4deg)",
                          transition: "transform 0.4s ease",
                        }}
                      >
                        {/* Book Spine Crease Effect */}
                        <div
                          className="position-absolute top-0 start-0 h-100"
                          style={{
                            width: "18px",
                            background:
                              "linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.2) 35%, transparent 100%)",
                            zIndex: 2,
                            pointerEvents: "none",
                          }}
                        />
                        <img
                          src={getBookImageUrl(book.thumbnail)}
                          alt={book.book_title}
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                          onError={() => setImgError(true)}
                        />
                      </div>
                    ) : (
                      /* Elegant Fallback Cover */
                      <div
                        className="w-100 h-100 rounded-3 p-4 d-flex flex-column justify-content-between text-white position-relative overflow-hidden text-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338ca 100%)",
                          boxShadow:
                            "0 22px 35px -10px rgba(30, 27, 75, 0.4), 0 0 0 1px rgba(255,255,255,0.1)",
                          transform: "rotateY(-4deg)",
                        }}
                      >
                        {/* Spine Crease */}
                        <div
                          className="position-absolute top-0 start-0 h-100"
                          style={{
                            width: "16px",
                            background:
                              "linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.2) 40%, transparent 100%)",
                            zIndex: 2,
                          }}
                        />
                        {/* Geometric Pattern Watermark */}
                        <div
                          className="position-absolute top-0 end-0 opacity-10"
                          style={{ transform: "translate(30%, -30%)" }}
                        >
                          <i className="bi bi-book-half" style={{ fontSize: "180px" }}></i>
                        </div>

                        <div>
                          <span
                            className="badge bg-white bg-opacity-20 text-white rounded-pill px-2.5 py-1 mb-3 text-uppercase fw-bold"
                            style={{ fontSize: "10px", letterSpacing: "1px" }}
                          >
                            {book.category_name || "Library Edition"}
                          </span>
                          <div
                            className="fw-bold fs-5 text-white lh-sm mb-2"
                            style={{ fontFamily: "'Outfit', serif" }}
                          >
                            {book.book_title}
                          </div>
                          <div className="small text-white-50" style={{ fontSize: "12px" }}>
                            {book.author_name}
                          </div>
                        </div>

                        <div className="pt-3 border-top border-white border-opacity-15">
                          <div
                            className="rounded-circle bg-white bg-opacity-15 mx-auto d-flex align-items-center justify-content-center mb-1"
                            style={{ width: "42px", height: "42px" }}
                          >
                            <i className="bi bi-journal-bookmark-fill fs-5 text-warning"></i>
                          </div>
                          <div className="font-monospace text-white-50" style={{ fontSize: "10px" }}>
                            {book.isbn || "LMS LIBRARY"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stock & Availability Card Body */}
                <div className="card-body p-4">
                  {/* Availability Metric */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1.5">
                      <span className="text-muted small fw-medium">Availability Status</span>
                      <AvailBadge available={avail} total={total} size="sm" />
                    </div>

                    {/* Progress Gauge */}
                    <div
                      className="progress rounded-pill mb-2"
                      style={{ height: "8px", backgroundColor: "#f1f5f9" }}
                    >
                      <div
                        className={`progress-bar rounded-pill ${
                          avail === 0
                            ? "bg-danger"
                            : isLimited
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                        role="progressbar"
                        style={{ width: `${availPercent}%`, transition: "width 0.6s ease" }}
                        aria-valuenow={availPercent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center text-muted small">
                      <span>
                        <b className="text-dark">{avail}</b> copies in library
                      </span>
                      <span>Total: {total}</span>
                    </div>
                  </div>

                  {/* Shelf Location info pill */}
                  <div
                    className="p-2.5 rounded-3 d-flex align-items-center justify-content-between mb-3"
                    style={{ backgroundColor: "#f8fafc", border: "1px dashed #cbd5e1" }}
                  >
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <i className="bi bi-geo-alt-fill text-primary"></i>
                      <span>Shelf Placement</span>
                    </div>
                    <span className="fw-semibold text-dark small font-monospace">
                      {book.shelf_location || "Main Stack"}
                    </span>
                  </div>

                  {/* Borrow Action Button */}
                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className={`btn py-2.5 px-4 rounded-pill fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2 ${
                        borrowDone
                          ? "btn-success"
                          : !isAvailable
                          ? "btn-secondary opacity-75"
                          : "text-white"
                      }`}
                      style={{
                        background:
                          borrowDone || !isAvailable
                            ? undefined
                            : "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                        border: "none",
                        transition: "all 0.25s ease",
                      }}
                      onClick={() => setIsModal(true)}
                      disabled={!isAvailable || borrowSubmitting}
                    >
                      {borrowSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                          <span>Processing Request...</span>
                        </>
                      ) : borrowDone ? (
                        <>
                          <i className="bi bi-check2-circle fs-5"></i>
                          <span>Request Placed!</span>
                        </>
                      ) : !isAvailable ? (
                        <>
                          <i className="bi bi-slash-circle fs-6"></i>
                          <span>Currently Checked Out</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-journal-plus fs-5"></i>
                          <span>Request to Borrow</span>
                        </>
                      )}
                    </button>

                    <div className="text-center mt-1">
                      <small className="text-muted d-inline-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                        <i className="bi bi-shield-check text-success"></i>
                        Standard 14-day loan • Free renewals at desk
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Book Meta, Deep Synopsis & Segmented Tabs ── */}
          <div className="col-lg-8 col-md-7">
            {/* Header Identity Card */}
            <div
              className="card border-0 rounded-4 p-4 p-lg-5 mb-4 bg-white"
              style={{
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                border: "1px solid #e2e8f0",
              }}
            >
              {/* Category & Edition Tags */}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1">
                  <i className="bi bi-folder2-open"></i>
                  {book.category_name || "General Collection"}
                </span>

                {book.edition && (
                  <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-3 py-1.5 fw-medium">
                    {book.edition} Edition
                  </span>
                )}

                <span className="badge bg-light text-muted border rounded-pill px-3 py-1.5 font-monospace">
                  ID: #{book.id}
                </span>
              </div>

              {/* Title */}
              <h1 className="h2 fw-bold text-dark mb-2 lh-sm" style={{ letterSpacing: "-0.5px" }}>
                {book.book_title}
              </h1>

              {/* Byline */}
              <div className="d-flex flex-wrap align-items-center gap-2 text-muted small mb-4 pb-3 border-bottom">
                <span className="d-flex align-items-center gap-1.5 text-dark">
                  <i className="bi bi-person-fill text-primary"></i>
                  Written by <strong className="text-dark">{book.author_name || "Unknown Author"}</strong>
                </span>

                {book.publisher_name && (
                  <>
                    <span className="text-muted">•</span>
                    <span>
                      Published by <strong>{book.publisher_name}</strong>
                    </span>
                  </>
                )}

                {book.publish_year && (
                  <>
                    <span className="text-muted">•</span>
                    <span>{book.publish_year}</span>
                  </>
                )}
              </div>

              {/* 4 Quick Stat Metric Tiles */}
              <div className="row gy-3 mb-4">
                <div className="col-6 col-sm-3">
                  <StatTile
                    icon="bi-file-earmark-text"
                    label="Pages"
                    value={book.pages ? `${book.pages} p.` : "Unstated"}
                    subtext="Standard length"
                  />
                </div>
                <div className="col-6 col-sm-3">
                  <StatTile
                    icon="bi-translate"
                    label="Language"
                    value={book.language || "English"}
                    subtext="Original text"
                  />
                </div>
                <div className="col-6 col-sm-3">
                  <StatTile
                    icon="bi-upc-scan"
                    label="ISBN"
                    value={book.isbn || "N/A"}
                    subtext="Catalog code"
                  />
                </div>
                <div className="col-6 col-sm-3">
                  <StatTile
                    icon="bi-geo-alt"
                    label="Location"
                    value={book.shelf_location || "Main Stack"}
                    subtext="Floor 1"
                  />
                </div>
              </div>

              {/* Segmented Navigation Tabs */}
              <div
                className="d-flex p-1 rounded-3 mb-4 border"
                style={{ backgroundColor: "#f1f5f9", borderColor: "#e2e8f0" }}
              >
                <button
                  type="button"
                  className={`btn btn-sm flex-fill py-2 rounded-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2 ${
                    activeTab === "overview"
                      ? "bg-white text-dark shadow-xs"
                      : "text-muted hover-dark"
                  }`}
                  style={{ border: "none", transition: "all 0.2s ease" }}
                  onClick={() => setActiveTab("overview")}
                >
                  <i className="bi bi-text-paragraph"></i>
                  <span>Overview & Summary</span>
                </button>

                <button
                  type="button"
                  className={`btn btn-sm flex-fill py-2 rounded-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2 ${
                    activeTab === "specs"
                      ? "bg-white text-dark shadow-xs"
                      : "text-muted"
                  }`}
                  style={{ border: "none", transition: "all 0.2s ease" }}
                  onClick={() => setActiveTab("specs")}
                >
                  <i className="bi bi-sliders"></i>
                  <span>Specifications</span>
                </button>

                <button
                  type="button"
                  className={`btn btn-sm flex-fill py-2 rounded-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2 ${
                    activeTab === "guidelines"
                      ? "bg-white text-dark shadow-xs"
                      : "text-muted"
                  }`}
                  style={{ border: "none", transition: "all 0.2s ease" }}
                  onClick={() => setActiveTab("guidelines")}
                >
                  <i className="bi bi-info-circle"></i>
                  <span>Borrowing Rules</span>
                </button>
              </div>

              {/* ── TAB CONTENT 1: Overview ── */}
              {activeTab === "overview" && (
                <div className="tab-pane-fade">
                  <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-book-half text-primary"></i>
                    About this Book
                  </h5>

                  <div className="text-secondary lh-lg mb-4" style={{ fontSize: "15px" }}>
                    {book.description ? (
                      <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
                        {book.description}
                      </p>
                    ) : (
                      <p className="text-muted fst-italic mb-0">
                        No publisher description or synopsis has been attached for this volume. Please refer to
                        the library specifications tab or check the shelf index for physical copies.
                      </p>
                    )}
                  </div>

                  {/* Highlights Callout Box */}
                  <div
                    className="p-4 rounded-3 mb-4"
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <h6 className="fw-bold text-dark mb-2.5 d-flex align-items-center gap-2">
                      <i className="bi bi-stars text-warning fs-5"></i>
                      Reader Highlights & Subject Focus
                    </h6>
                    <div className="row g-2">
                      <div className="col-sm-6 d-flex align-items-center gap-2 text-muted small">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <span>Categorized under <b>{book.category_name || "General"}</b></span>
                      </div>
                      <div className="col-sm-6 d-flex align-items-center gap-2 text-muted small">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <span>Full unedited volume ({book.pages || "Standard"} pages)</span>
                      </div>
                      <div className="col-sm-6 d-flex align-items-center gap-2 text-muted small">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <span>Cataloged under ISBN <code>{book.isbn || "LMS"}</code></span>
                      </div>
                      <div className="col-sm-6 d-flex align-items-center gap-2 text-muted small">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <span>Verified physical copy at {book.shelf_location || "Main Stack"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Author / Publisher Note */}
                  <div className="p-3.5 rounded-3 bg-light border d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{
                          width: "44px",
                          height: "44px",
                          background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                        }}
                      >
                        {getInitials(book.author_name)}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{book.author_name}</div>
                        <small className="text-muted">
                          Published by {book.publisher_name || "Independent Publisher"} ({book.publish_year || "N/A"})
                        </small>
                      </div>
                    </div>

                    <Link
                      to={`/member/books?search=${encodeURIComponent(book.author_name || "")}`}
                      className="btn btn-sm btn-white border bg-white rounded-pill px-3 text-secondary text-nowrap"
                    >
                      More by author <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              )}

              {/* ── TAB CONTENT 2: Specifications ── */}
              {activeTab === "specs" && (
                <div className="tab-pane-fade">
                  <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-card-checklist text-primary"></i>
                    Technical & Library Specifications
                  </h5>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="card p-3.5 border rounded-3 bg-white h-100 p-2" style={{ borderColor: "#e2e8f0" }}>
                        <div className="text-uppercase fw-bold text-muted small mb-2" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                          Book Information
                        </div>
                        <SpecRow label="Full Title" value={book.book_title} icon="bi-type" />
                        <SpecRow label="Author" value={book.author_name} icon="bi-person" />
                        <SpecRow label="Publisher" value={book.publisher_name} icon="bi-building" />
                        <SpecRow label="Publication Year" value={book.publish_year} icon="bi-calendar-event" />
                        <SpecRow label="Edition" value={book.edition ? `${book.edition} Edition` : "1st Edition"} icon="bi-award" />
                        <SpecRow label="Category" value={book.category_name} icon="bi-bookmark" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card p-3.5 border rounded-3 bg-white h-100 p-2" style={{ borderColor: "#e2e8f0" }}>
                        <div className="text-uppercase fw-bold text-muted small mb-2" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                          Inventory & Physical Attributes
                        </div>
                        <SpecRow
                          label="ISBN Identifier"
                          value={book.isbn}
                          icon="bi-upc-scan"
                          copyable={true}
                          onCopy={handleCopyText}
                        />
                        <SpecRow label="Page Count" value={book.pages ? `${book.pages} pages` : "Unstated"} icon="bi-files" />
                        <SpecRow label="Language" value={book.language || "English"} icon="bi-globe" />
                        <SpecRow label="Shelf Location" value={book.shelf_location || "Main Stack"} icon="bi-geo-alt" />
                        <SpecRow label="Total Volume Copies" value={`${book.total_copies} total`} icon="bi-stack" />
                        <SpecRow
                          label="Currently On Shelf"
                          value={`${book.available_copies} available`}
                          icon="bi-check-circle"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB CONTENT 3: Borrowing Guidelines ── */}
              {activeTab === "guidelines" && (
                <div className="tab-pane-fade">
                  <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-shield-check text-primary"></i>
                    Library Borrowing Guidelines & Policy
                  </h5>

                  <div className="row gy-3 mb-4">
                    <div className="col-md-4">
                      <div className="p-3 rounded-3 border bg-white h-100" style={{ borderColor: "#e2e8f0" }}>
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white mb-2"
                          style={{ width: "32px", height: "32px", backgroundColor: "#4f46e5" }}
                        >
                          1
                        </div>
                        <div className="fw-bold text-dark small mb-1">Request Online</div>
                        <p className="text-muted small mb-0">
                          Click "Request to Borrow" with any special notes for your semester or research requirements.
                        </p>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="p-3 rounded-3 border bg-white h-100" style={{ borderColor: "#e2e8f0" }}>
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white mb-2"
                          style={{ width: "32px", height: "32px", backgroundColor: "#06b6d4" }}
                        >
                          2
                        </div>
                        <div className="fw-bold text-dark small mb-1">Librarian Review</div>
                        <p className="text-muted small mb-0">
                          Our staff verifies volume readiness and approves your borrowing request within 24 hours.
                        </p>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="p-3 rounded-3 border bg-white h-100" style={{ borderColor: "#e2e8f0" }}>
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white mb-2"
                          style={{ width: "32px", height: "32px", backgroundColor: "#10b981" }}
                        >
                          3
                        </div>
                        <div className="fw-bold text-dark small mb-1">Pickup at Desk</div>
                        <p className="text-muted small mb-0">
                          Collect the physical book at reception ({book.shelf_location || "Main Desk"}). Standard return in 14 days.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-3.5 rounded-3 d-flex align-items-start gap-3"
                    style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
                  >
                    <i className="bi bi-info-circle-fill text-primary fs-5 mt-0.5"></i>
                    <div className="small text-secondary">
                      <strong className="text-dark d-block mb-1">Standard Loan Period Terms:</strong>
                      Borrowing this book grants a 14-day checkout window starting upon librarian sign-off.
                      Renewals can be requested prior to the due date provided there is no pending waitlist for this title.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────
            RECOMMENDED BOOKS SECTION
        ───────────────────────────────────────── */}
        {recommended.length > 0 && (
          <div className="mt-5 pt-4 border-top" style={{ borderColor: "#e2e8f0" }}>
            <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-2">
              <div>
                <span className="text-uppercase text-primary fw-bold small" style={{ fontSize: "11px", letterSpacing: "1px" }}>
                  Related Titles
                </span>
                <h3 className="h4 fw-bold text-dark mb-0">You May Also Like</h3>
              </div>

              <Link
                to="/member/books"
                className="btn btn-sm btn-white border bg-white shadow-xs rounded-pill px-3 text-secondary d-inline-flex align-items-center gap-1.5"
              >
                <span>Browse Full Catalog</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            <div className="row g-4">
              {recommended.map((rec) => {
                const recAvail = Number(rec.available_copies) || 0;
                const recTotal = Number(rec.total_copies) || 0;

                return (
                  <div key={rec.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div
                      className="card h-100 border-0 rounded-4 overflow-hidden position-relative p-0 bg-white"
                      style={{
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        cursor: "pointer",
                        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                        border: "1px solid #e2e8f0",
                      }}
                      onClick={() => navigate(`/member/books/${rec.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow = "0 16px 28px -6px rgba(0,0,0,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                      }}
                    >
                      {/* Image Preview / Gradient Fallback */}
                      <div
                        className="position-relative overflow-hidden"
                        style={{
                          height: "230px",
                          backgroundColor: "#f1f5f9",
                        }}
                      >
                        {rec.thumbnail ? (
                          <img
                            src={getBookImageUrl(rec.thumbnail)}
                            alt={rec.book_title}
                            className="w-100 h-100 position-relative"
                            style={{ objectFit: "cover", zIndex: 1 }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : null}

                        {/* Fallback pattern */}
                        <div
                          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white"
                          style={{
                            background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)",
                            zIndex: 0,
                          }}
                        >
                          <i className="bi bi-book-half fs-2 mb-2 text-white-50"></i>
                          <span className="fs-5 fw-bold">{getInitials(rec.book_title)}</span>
                          <span className="small opacity-75 mt-1">{rec.category_name || "Book"}</span>
                        </div>

                        {/* Badges */}
                        <div className="position-absolute top-0 start-0 m-2" style={{ zIndex: 2 }}>
                          <span className="badge bg-white text-dark shadow-sm rounded-pill px-2 py-1 small fw-semibold">
                            {rec.category_name || "General"}
                          </span>
                        </div>

                        {rec.publish_year && (
                          <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 2 }}>
                            <span className="badge bg-dark bg-opacity-75 text-white backdrop-blur rounded-pill px-2 py-1 small">
                              {rec.publish_year}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="card-body p-3 d-flex flex-column">
                        <h6
                          className="fw-bold text-dark text-truncate mb-1"
                          title={rec.book_title}
                        >
                          {rec.book_title}
                        </h6>

                        <p className="text-muted small mb-3 text-truncate">
                          {rec.author_name || "Unknown Author"}
                        </p>

                        <div className="mt-auto pt-2 border-top d-flex align-items-center justify-content-between">
                          <AvailBadge available={recAvail} total={recTotal} size="sm" />
                          <small className="text-muted font-monospace" style={{ fontSize: "11px" }}>
                            {recAvail}/{recTotal} avail.
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────
          BORROW REQUEST MODAL
      ───────────────────────────────────────── */}
      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title="Submit Borrow Request"
        onSave={handleBorrow}
        saveText={borrowSubmitting ? "Submitting..." : "Confirm Request"}
        btnColorSave="btn-primary"
      >
        <div className="p-1">
          {/* Book Summary Card */}
          <div
            className="p-3 rounded-3 mb-3 d-flex gap-3 align-items-center"
            style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <div
              className="rounded-2 overflow-hidden flex-shrink-0 shadow-xs"
              style={{ width: "65px", height: "90px", backgroundColor: "#e2e8f0" }}
            >
              {book.thumbnail && !imgError ? (
                <img
                  src={getBookImageUrl(book.thumbnail)}
                  alt={book.book_title}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white"
                  style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)" }}
                >
                  <span className="fw-bold fs-6">{getInitials(book.book_title)}</span>
                </div>
              )}
            </div>

            <div className="flex-grow-1 overflow-hidden">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-0.5 small mb-1">
                {book.category_name || "General"}
              </span>
              <h6 className="fw-bold text-dark text-truncate mb-0.5">{book.book_title}</h6>
              <div className="text-muted small text-truncate">by {book.author_name}</div>
              <div className="text-muted small mt-1">
                <i className="bi bi-geo-alt me-1 text-primary"></i>
                Shelf: <b>{book.shelf_location || "Main Stack"}</b>
              </div>
            </div>
          </div>

          {/* Timeline & Due Date Preview */}
          <div
            className="p-3 rounded-3 mb-3"
            style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small fw-medium">Expected Return Due Date:</span>
              <span className="badge bg-primary text-white fw-bold">
                {calculateDueDate(14)}
              </span>
            </div>
            <small className="text-muted d-block" style={{ fontSize: "11px" }}>
              Standard 14-day checkout granted upon library desk approval and item handoff.
            </small>
          </div>

          {/* Form Notes */}
          <div className="mb-2">
            <label className="form-label fw-semibold small text-dark mb-1">
              Borrow Note / Special Request (Optional)
            </label>
            <Input
              width="100%"
              name="borrow_note"
              placeholder="e.g. Needed for final semester thesis, coursework..."
              value={borrowNote}
              onChange={(e) => setBorrowNote(e.target.value)}
            />
            <small className="text-muted d-block mt-1" style={{ fontSize: "11px" }}>
              Notes are visible to the library administrator processing this reservation.
            </small>
          </div>
        </div>
      </Modal>
    </div>
  );
}