import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getAllBooksAPI } from "../../services/booksService";
import useBorrowRequest from "../../hook/useBorrowRequest";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

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
  if (available <= 0) return "danger";
  if (total > 0 && available / total <= 0.3) return "warning";
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

const SORT_OPTIONS = [
  { value: "title_asc", label: "Title: A to Z" },
  { value: "title_desc", label: "Title: Z to A" },
  { value: "year_desc", label: "Year: Newest First" },
  { value: "year_asc", label: "Year: Oldest First" },
  { value: "avail_desc", label: "Copies: Most Available" },
  { value: "avail_asc", label: "Copies: Least Available" },
];

function sortBooks(books, sort) {
  return [...books].sort((a, b) => {
    switch (sort) {
      case "title_asc":
        return (a.book_title || "").localeCompare(b.book_title || "");
      case "title_desc":
        return (b.book_title || "").localeCompare(a.book_title || "");
      case "year_desc":
        return (Number(b.publish_year) || 0) - (Number(a.publish_year) || 0);
      case "year_asc":
        return (Number(a.publish_year) || 0) - (Number(b.publish_year) || 0);
      case "avail_desc":
        return (Number(b.available_copies) || 0) - (Number(a.available_copies) || 0);
      case "avail_asc":
        return (Number(a.available_copies) || 0) - (Number(b.available_copies) || 0);
      default:
        return 0;
    }
  });
}

function Highlight({ text, query }) {
  if (!text) return "";
  if (!query) return <>{text}</>;
  const str = String(text);
  const idx = str.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{str}</>;
  return (
    <>
      {str.slice(0, idx)}
      <mark
        style={{
          backgroundColor: "#fef08a",
          color: "#854d0e",
          padding: "1px 4px",
          borderRadius: "4px",
        }}
      >
        {str.slice(idx, idx + query.length)}
      </mark>
      {str.slice(idx + query.length)}
    </>
  );
}

/* ─────────────────────────────────────────
    SUB-COMPONENT: AVAILABILITY BADGE
───────────────────────────────────────── */
function AvailBadge({ available = 0, total = 0 }) {
  const variant = availVariant(available, total);
  let label = "Available";
  let bgClass = "bg-success-subtle text-success border-success-subtle";
  let dotColor = "#10b981";

  if (variant === "warning") {
    label = "Limited";
    bgClass = "bg-warning-subtle text-warning-emphasis border-warning-subtle";
    dotColor = "#f59e0b";
  } else if (variant === "danger") {
    label = "Out of stock";
    bgClass = "bg-danger-subtle text-danger border-danger-subtle";
    dotColor = "#ef4444";
  }

  return (
    <span
      className={`badge rounded-pill border px-2.5 py-1 d-inline-flex align-items-center gap-1.5 fw-semibold ${bgClass}`}
      style={{ fontSize: "11px" }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: dotColor,
          boxShadow: variant === "success" ? "0 0 6px rgba(16, 185, 129, 0.6)" : "none",
        }}
      />
      {label} ({available}/{total})
    </span>
  );
}

/* ─────────────────────────────────────────
    SUB-COMPONENT: BOOK GRID CARD
───────────────────────────────────────── */
function BookGridCard({ book, onClick, onBorrow, searchQuery }) {
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isAvailable = (book?.available_copies ?? 0) > 0;
  const imageUrl = getBookImageUrl(book?.thumbnail);

  return (
    <div className="col">
      <div
        className="card h-100 border-0 bg-white position-relative d-flex flex-column"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hover ? "translateY(-7px)" : "translateY(0)",
          boxShadow: hover
            ? "0 20px 35px -10px rgba(79, 70, 229, 0.18), 0 4px 12px rgba(15, 23, 42, 0.06)"
            : "0 4px 16px rgba(15, 23, 42, 0.04)",
          border: "1px solid #eef2f6",
        }}
      >
        {/* Cover Container */}
        <div
          className="position-relative overflow-hidden d-flex justify-content-center align-items-center"
          style={{
            height: "235px",
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            padding: "16px",
            cursor: "pointer",
          }}
          onClick={() => onClick(book.id)}
        >
          {/* Ambient blurred backdrop */}
          {imageUrl && !imgError && (
            <div
              className="position-absolute w-100 h-100"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(20px)",
                opacity: 0.28,
                zIndex: 0,
                transform: "scale(1.2)",
              }}
            />
          )}

          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={book.book_title}
              className="rounded shadow-sm"
              onError={() => setImgError(true)}
              style={{
                height: "100%",
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
                position: "relative",
                zIndex: 1,
                transition: "transform 0.4s ease",
                transform: hover ? "scale(1.06)" : "scale(1)",
              }}
            />
          ) : (
            <div
              className="d-flex flex-column align-items-center justify-content-center rounded shadow p-3 text-center"
              style={{
                width: "135px",
                height: "185px",
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                color: "#ffffff",
                zIndex: 1,
              }}
            >
              <i className="bi bi-book fs-1 mb-2 opacity-75"></i>
              <span className="fw-bold fs-4">{getInitials(book.book_title)}</span>
              <small className="opacity-75 text-truncate w-100" style={{ fontSize: "10px" }}>
                {book.category_name || "Library Book"}
              </small>
            </div>
          )}

          {/* Badges */}
          <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1" style={{ zIndex: 2 }}>
            {book.publish_year && (
              <span
                className="badge bg-dark bg-opacity-75 backdrop-blur text-white px-2 py-1 rounded-pill"
                style={{ fontSize: "10.5px" }}
              >
                {book.publish_year}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="card-body d-flex flex-column p-4 pb-2">
          {/* Category & Status */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span
              className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold text-truncate"
              style={{ fontSize: "11px", maxWidth: "140px", padding: "4px 8px", borderRadius: "8px" }}
            >
              <i className="bi bi-tag-fill me-1" style={{ fontSize: "10px" }}></i>
              <Highlight text={book.category_name || "General"} query={searchQuery} />
            </span>

            <AvailBadge available={book.available_copies} total={book.total_copies} />
          </div>

          {/* Title */}
          <h5
            className="fw-bold mb-1 text-truncate cursor-pointer"
            title={book.book_title}
            onClick={() => onClick(book.id)}
            style={{ color: "#0f172a", fontSize: "16px", lineHeight: "1.35" }}
          >
            <Highlight text={book.book_title} query={searchQuery} />
          </h5>

          {/* Author */}
          <p className="text-muted small mb-2 text-truncate d-flex align-items-center gap-1">
            <i className="bi bi-pen small opacity-75"></i>
            <span><Highlight text={book.author_name || "Unknown Author"} query={searchQuery} /></span>
          </p>

          {/* Shelf location */}
          {book.shelf_location && (
            <div className="mb-2">
              <span className="badge bg-light text-secondary border fw-normal" style={{ fontSize: "10.5px" }}>
                <i className="bi bi-geo-alt me-1 text-primary"></i>
                Shelf: {book.shelf_location}
              </span>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="card-footer bg-white border-0 pb-4 px-4 pt-1 d-flex gap-2 mt-auto">
          <button
            type="button"
            className="btn rounded-pill fw-semibold border w-50 py-2"
            onClick={() => onClick(book.id)}
            style={{
              color: "#334155",
              backgroundColor: "#f8fafc",
              borderColor: "#e2e8f0",
              fontSize: "13px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e2e8f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f8fafc";
            }}
          >
            <i className="bi bi-eye me-1"></i> Details
          </button>

          <button
            type="button"
            className="btn w-50 rounded-pill fw-semibold text-white border-0 py-2 shadow-sm d-flex align-items-center justify-content-center gap-1"
            disabled={!isAvailable}
            onClick={() => onBorrow(book)}
            style={{
              background: isAvailable
                ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                : "#cbd5e1",
              fontSize: "13px",
              cursor: isAvailable ? "pointer" : "not-allowed",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              if (isAvailable) e.currentTarget.style.opacity = "0.92";
            }}
            onMouseLeave={(e) => {
              if (isAvailable) e.currentTarget.style.opacity = "1";
            }}
          >
            <i className="bi bi-bookmark-plus"></i> Borrow
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
    SUB-COMPONENT: BOOK LIST ROW (LIST VIEW)
───────────────────────────────────────── */
function BookListRow({ book, onClick, onBorrow, searchQuery }) {
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isAvailable = (book?.available_copies ?? 0) > 0;
  const imageUrl = getBookImageUrl(book?.thumbnail);

  return (
    <div
      className="card border-0 bg-white rounded-4 p-3 shadow-sm mb-3 transition-all"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: "1px solid #eef2f6",
        boxShadow: hover
          ? "0 14px 28px rgba(79, 70, 229, 0.12)"
          : "0 2px 8px rgba(15, 23, 42, 0.04)",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.25s ease",
      }}
    >
      <div className="row g-3 align-items-center">
        {/* Cover image */}
        <div className="col-auto">
          <div
            className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center cursor-pointer shadow-sm position-relative"
            style={{
              width: "90px",
              height: "120px",
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            }}
            onClick={() => onClick(book.id)}
          >
            {imageUrl && !imgError ? (
              <img
                src={imageUrl}
                alt={book.book_title}
                className="w-100 h-100 object-fit-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="text-center p-2 text-primary">
                <i className="bi bi-book fs-3"></i>
                <div className="fw-bold small">{getInitials(book.book_title)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Info Column */}
        <div className="col">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
            <span
              className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold"
              style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "6px" }}
            >
              <Highlight text={book.category_name || "General"} query={searchQuery} />
            </span>
            <AvailBadge available={book.available_copies} total={book.total_copies} />
            {book.publish_year && (
              <span className="badge bg-light text-secondary border" style={{ fontSize: "11px" }}>
                Year: {book.publish_year}
              </span>
            )}
          </div>

          <h5
            className="fw-bold text-dark mb-1 cursor-pointer"
            onClick={() => onClick(book.id)}
            style={{ fontSize: "17px" }}
          >
            <Highlight text={book.book_title} query={searchQuery} />
          </h5>

          <p className="text-muted small mb-2 d-flex align-items-center gap-1">
            <i className="bi bi-pen small opacity-75"></i>
            <span><Highlight text={book.author_name || "Unknown Author"} query={searchQuery} /></span>
            {book.isbn && (
              <span className="ms-2 text-secondary">
                • ISBN: {book.isbn}
              </span>
            )}
          </p>

          {book.description && (
            <p
              className="text-muted small mb-0 text-truncate"
              style={{ maxWidth: "680px", fontSize: "12.5px" }}
            >
              {book.description}
            </p>
          )}
        </div>

        {/* Actions Column */}
        <div className="col-12 col-md-auto d-flex flex-row flex-md-column gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-3 py-1.5 fw-semibold btn-sm"
            onClick={() => onClick(book.id)}
          >
            <i className="bi bi-eye me-1"></i> Details
          </button>
          <button
            type="button"
            className="btn btn-primary rounded-pill px-3 py-1.5 fw-semibold btn-sm text-white shadow-sm border-0"
            disabled={!isAvailable}
            onClick={() => onBorrow(book)}
            style={{
              background: isAvailable
                ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                : "#cbd5e1",
            }}
          >
            <i className="bi bi-bookmark-plus me-1"></i> Borrow
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
    SUB-COMPONENT: EMPTY STATE
───────────────────────────────────────── */
function EmptyState({ hasSearch, searchQuery, onClear }) {
  return (
    <div
      className="w-100 text-center py-5 px-4 bg-white rounded-4 border shadow-sm d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "360px" }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center mb-3"
        style={{ width: "76px", height: "76px", background: "#eef2ff", color: "#4f46e5" }}
      >
        <i className="bi bi-search fs-2" />
      </div>
      <h5 className="fw-bold text-dark mb-1">No Matching Books Found</h5>
      <p className="text-secondary small mb-4" style={{ maxWidth: "420px" }}>
        {hasSearch ? (
          <>
            No records match <strong className="text-dark">“{searchQuery}”</strong>. Check your spelling or try broader keywords.
          </>
        ) : (
          "No books match the selected category or availability filters."
        )}
      </p>
      <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={onClear}>
        <i className="bi bi-arrow-counterclockwise me-2" />
        Reset All Filters
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
    MAIN COMPONENT: BOOK LIST PAGE
───────────────────────────────────────── */
export default function BookListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Parse URL search params (?search=... & ?category=...)
  const queryParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || location.state?.search || "";
  }, [location.search, location.state]);

  const categoryParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || location.state?.category || "";
  }, [location.search, location.state]);

  // Main State
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sort, setSort] = useState("title_asc");
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [availFilter, setAvailFilter] = useState("all"); // 'all', 'available', 'limited'
  const [categorySearch, setCategorySearch] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Borrow Modal State
  const [isModal, setIsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowNote, setBorrowNote] = useState("");
  const [borrowSubmitting, setBorrowSubmitting] = useState(false);
  const { borrowRequest } = useBorrowRequest();

  // Keep search synchronized with URL param updates
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  // Keep category synchronized with URL param
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [categoryParam]);

  // Fetch Catalog Data
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBooksAPI();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.books)
            ? data.books
            : Array.isArray(data?.result)
              ? data.result
              : Array.isArray(data?.items)
                ? data.items
                : [];
      setBooks(list);
    } catch (err) {
      setError(err.message || "Failed to load library books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Compute Categories from Books
  const categories = useMemo(() => {
    const map = {};
    books.forEach((b) => {
      if (b.category_name) {
        map[b.category_name] = (map[b.category_name] || 0) + 1;
      }
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [books]);

  // Filter categories in sidebar
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase().trim())
    );
  }, [categories, categorySearch]);

  // Filter & Sort Books
  const filteredBooks = useMemo(() => {
    let result = books;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (b) =>
          (b.book_title || "").toLowerCase().includes(q) ||
          (b.author_name || "").toLowerCase().includes(q) ||
          (b.category_name || "").toLowerCase().includes(q) ||
          (b.isbn || "").toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((b) => selectedCategories.includes(b.category_name));
    }

    // Availability filter
    if (availFilter === "available") {
      result = result.filter((b) => (Number(b.available_copies) || 0) > 0);
    } else if (availFilter === "limited") {
      result = result.filter(
        (b) => (Number(b.available_copies) || 0) > 0 && (Number(b.available_copies) || 0) <= 3
      );
    }

    return sortBooks(result, sort);
  }, [books, searchQuery, selectedCategories, availFilter, sort]);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, availFilter, sort, itemsPerPage]);

  // Paginated books slice
  const paginatedBooks = useMemo(() => {
    if (itemsPerPage === "all") return filteredBooks;
    const count = Number(itemsPerPage) || 12;
    const startIndex = (currentPage - 1) * count;
    return filteredBooks.slice(startIndex, startIndex + count);
  }, [filteredBooks, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    if (itemsPerPage === "all" || filteredBooks.length === 0) return 1;
    return Math.ceil(filteredBooks.length / Number(itemsPerPage));
  }, [filteredBooks, itemsPerPage]);

  const totalAvailable = useMemo(() => {
    return books.filter((b) => (Number(b.available_copies) || 0) > 0).length;
  }, [books]);

  const hasActiveFilter =
    searchQuery.trim() !== "" || selectedCategories.length > 0 || availFilter !== "all";

  // Actions
  const handleBookClick = (id) => navigate(`/member/books/${id}`);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setAvailFilter("all");
    setSort("title_asc");
    setCurrentPage(1);
  };

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((c) => c.name));
    }
  };

  // Open Borrow Modal
  const handleOpenBorrowModal = (book) => {
    setSelectedBook(book);
    setBorrowNote("");
    setIsModal(true);
  };

  // Submit Borrow Request
  const handleSubmitBorrow = async () => {
    if (!selectedBook) return;
    setBorrowSubmitting(true);
    try {
      const payload = {
        book_id: selectedBook.id,
        note: borrowNote.trim() || "Member Borrow Request",
      };
      await borrowRequest(payload);
      setIsModal(false);
      setBorrowNote("");
      await fetchBooks();
    } finally {
      setBorrowSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        /* ===========================
           BOOK LIST PAGE CUSTOM STYLES
        =========================== */
        .catalog-hero {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%);
          border-radius: 0 0 2rem 2rem;
          padding-top: 105px;
          padding-bottom: 45px;
          color: #ffffff;
          box-shadow: 0 16px 32px rgba(79, 70, 229, 0.15);
        }

        .hero-stat-pill {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 50px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .sticky-toolbar {
          position: sticky;
          top: 75px;
          z-index: 1020;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
          padding: 12px 18px;
        }

        .search-field-wrap {
          position: relative;
          flex-grow: 1;
        }

        .search-field-wrap input {
          width: 100%;
          height: 44px;
          padding-left: 42px;
          padding-right: 75px;
          border-radius: 50px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .search-field-wrap input:focus {
          outline: none;
          background: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
        }

        .search-field-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .search-shortcut-hint {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: #e2e8f0;
          color: #64748b;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 7px;
          pointer-events: none;
        }

        .view-toggle-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .view-toggle-btn.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
        }

        .category-filter-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #eef2f6;
          padding: 22px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        }

        .category-item-row {
          padding: 6px 10px;
          border-radius: 10px;
          transition: background 0.15s ease;
          cursor: pointer;
        }
        .category-item-row:hover {
          background: #f1f5f9;
        }

        .chip-badge {
          background: #eef2ff;
          color: #4f46e5;
          border: 1px solid #c7d2fe;
          border-radius: 50px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>

      {/* ───────── 1. TOP HERO BANNER ───────── */}
      <section className="catalog-hero mb-4">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <span className="hero-stat-pill mb-2">
                <i className="bi bi-mortarboard-fill text-warning"></i>
                DISCOVER & BORROW • ACADEMIC ARCHIVES
              </span>
              <h1 className="fw-bolder mb-1" style={{ fontSize: "2.3rem", letterSpacing: "-0.5px" }}>
                Book Catalog & Resources
              </h1>
              <p className="text-white-50 mb-0 small" style={{ maxWidth: "560px", fontSize: "14px" }}>
                Browse our complete collection of textbooks, research volumes, fiction, and journals.
                Reserve your books in seconds with real-time stock updates.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="d-flex flex-wrap gap-2">
              <div className="hero-stat-pill">
                <i className="bi bi-book text-info"></i>
                <span><strong>{books.length}</strong> Total Titles</span>
              </div>
              <div className="hero-stat-pill">
                <i className="bi bi-check-circle-fill text-success"></i>
                <span><strong>{totalAvailable}</strong> Available Copies</span>
              </div>
              <div className="hero-stat-pill">
                <i className="bi bi-tags-fill text-warning"></i>
                <span><strong>{categories.length}</strong> Categories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 2. MAIN CATALOG CONTENT AREA ───────── */}
      <div className="container pb-5">
        {/* Sticky Toolbar Bar */}
        <div className="sticky-toolbar mb-4">
          <div className="d-flex flex-wrap align-items-center gap-3">
            {/* Search Input Box */}
            <div className="search-field-wrap">
              <i className="bi bi-search search-field-icon"></i>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by title, author, category, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery ? (
                <button
                  type="button"
                  className="btn border-0 p-0 text-secondary position-absolute top-50 translate-middle-y"
                  style={{ right: "15px" }}
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  title="Clear search"
                >
                  <i className="bi bi-x-circle-fill fs-5"></i>
                </button>
              ) : (
                <span className="search-shortcut-hint d-none d-sm-block">/</span>
              )}
            </div>

            {/* Quick Availability Filter Button */}
            <button
              type="button"
              className={`btn rounded-pill px-3 py-2 fw-semibold btn-sm d-flex align-items-center gap-1.5 shadow-none ${
                availFilter === "available"
                  ? "btn-success text-white"
                  : "btn-outline-secondary"
              }`}
              style={{ fontSize: "13px" }}
              onClick={() => setAvailFilter(availFilter === "available" ? "all" : "available")}
            >
              <i className="bi bi-check2-circle"></i>
              <span>Available Only</span>
            </button>

            {/* Sort Select */}
            <div style={{ width: "195px" }}>
              <select
                className="form-select form-select-sm rounded-pill border py-2 px-3 fw-medium text-dark shadow-none"
                style={{ fontSize: "13px" }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid vs List View Toggles */}
            <div className="d-flex align-items-center gap-1">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <i className="bi bi-grid-fill"></i>
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List View"
              >
                <i className="bi bi-view-list"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Summary Chips Bar */}
        {!loading && !error && (
          <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
            {searchQuery.trim() && (
              <span className="chip-badge">
                <i className="bi bi-search small" /> "{searchQuery}"
                <button
                  type="button"
                  className="btn-close ms-1"
                  style={{ fontSize: "0.55rem" }}
                  onClick={() => setSearchQuery("")}
                />
              </span>
            )}

            {availFilter !== "all" && (
              <span className="chip-badge" style={{ backgroundColor: "#ecfdf5", color: "#065f46", borderColor: "#a7f3d0" }}>
                <i className="bi bi-check-circle small" />
                {availFilter === "available" ? "In-Stock Only" : "Limited Stock"}
                <button
                  type="button"
                  className="btn-close ms-1"
                  style={{ fontSize: "0.55rem" }}
                  onClick={() => setAvailFilter("all")}
                />
              </span>
            )}

            {selectedCategories.map((cat) => (
              <span key={cat} className="chip-badge">
                <i className="bi bi-tag small" /> {cat}
                <button
                  type="button"
                  className="btn-close ms-1"
                  style={{ fontSize: "0.55rem" }}
                  onClick={() => handleCategoryToggle(cat)}
                />
              </span>
            ))}

            <span className="text-secondary small ms-2">
              {filteredBooks.length === 0 ? (
                "No books match current filters"
              ) : (
                <>
                  Showing <strong>{filteredBooks.length}</strong> of {books.length} books
                </>
              )}
            </span>

            {hasActiveFilter && (
              <button
                type="button"
                className="btn btn-link btn-sm text-primary text-decoration-none fw-semibold p-0 ms-auto"
                onClick={handleClearFilters}
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i>
                Reset All Filters
              </button>
            )}
          </div>
        )}

        {/* Main Body Columns */}
        <div className="row g-4 align-items-start">
          {/* Left Sidebar Filter Panel */}
          {!loading && !error && categories.length > 0 && (
            <div className="col-12 col-md-3 sticky-md-top" style={{ top: "165px", zIndex: 10 }}>
              <div className="category-filter-card">
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                  <span className="fw-bold text-dark d-flex align-items-center gap-1.5">
                    <i className="bi bi-funnel text-primary"></i>
                    Categories
                  </span>
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-decoration-none text-primary fw-semibold p-0"
                    onClick={handleSelectAllCategories}
                  >
                    {selectedCategories.length === categories.length ? "Clear" : "All"}
                  </button>
                </div>

                {/* Category Search Filter Input */}
                {categories.length > 6 && (
                  <div className="mb-2.5">
                    <input
                      type="text"
                      className="form-control form-control-sm bg-light border-0 rounded-pill px-3 shadow-none"
                      placeholder="Filter categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      style={{ fontSize: "12px" }}
                    />
                  </div>
                )}

                {/* Category Checkboxes List */}
                <div
                  className="d-flex flex-column gap-1 overflow-auto pe-1"
                  style={{ maxHeight: "calc(100vh - 360px)" }}
                >
                  {filteredCategories.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.name);
                    return (
                      <div
                        key={cat.name}
                        className="category-item-row d-flex align-items-center justify-content-between"
                        onClick={() => handleCategoryToggle(cat.name)}
                      >
                        <div className="form-check d-flex align-items-center gap-2 mb-0">
                          <input
                            className="form-check-input my-0 cursor-pointer shadow-none"
                            type="checkbox"
                            id={`cat-${cat.name}`}
                            checked={isChecked}
                            onChange={() => {}} // Handled by container row click
                          />
                          <label
                            className="form-check-label text-dark small cursor-pointer text-truncate"
                            style={{ maxWidth: "140px", fontSize: "13px" }}
                            htmlFor={`cat-${cat.name}`}
                          >
                            {cat.name}
                          </label>
                        </div>
                        <span
                          className="badge rounded-pill border small fw-normal"
                          style={{
                            backgroundColor: isChecked ? "#e0e7ff" : "#f1f5f9",
                            color: isChecked ? "#4f46e5" : "#64748b",
                            fontSize: "11px",
                          }}
                        >
                          {cat.count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Availability Filter Block */}
                <div className="border-top pt-3 mt-3">
                  <div className="fw-semibold text-dark small mb-2 d-flex align-items-center gap-1">
                    <i className="bi bi-box-seam text-secondary"></i> Stock Status
                  </div>
                  <div className="d-flex flex-column gap-1.5 small">
                    <div
                      className="category-item-row d-flex align-items-center gap-2"
                      onClick={() => setAvailFilter("all")}
                    >
                      <input
                        type="radio"
                        name="availFilter"
                        checked={availFilter === "all"}
                        onChange={() => {}}
                        className="form-check-input my-0 cursor-pointer shadow-none"
                      />
                      <span>All Statuses</span>
                    </div>

                    <div
                      className="category-item-row d-flex align-items-center gap-2"
                      onClick={() => setAvailFilter("available")}
                    >
                      <input
                        type="radio"
                        name="availFilter"
                        checked={availFilter === "available"}
                        onChange={() => {}}
                        className="form-check-input my-0 cursor-pointer shadow-none"
                      />
                      <span className="text-success fw-medium">Available Now ({totalAvailable})</span>
                    </div>

                    <div
                      className="category-item-row d-flex align-items-center gap-2"
                      onClick={() => setAvailFilter("limited")}
                    >
                      <input
                        type="radio"
                        name="availFilter"
                        checked={availFilter === "limited"}
                        onChange={() => {}}
                        className="form-check-input my-0 cursor-pointer shadow-none"
                      />
                      <span className="text-warning-emphasis">Limited Copies (≤ 3)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Catalog View Column */}
          <div className={!loading && !error && categories.length > 0 ? "col-12 col-md-9" : "col-12"}>
            {error ? (
              <div className="text-center py-5 px-4 bg-white rounded-4 border border-danger border-opacity-20 shadow-sm d-flex flex-column align-items-center justify-content-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: "64px", height: "64px", background: "#fee2e2", color: "#ef4444" }}
                >
                  <i className="bi bi-exclamation-triangle-fill fs-3" />
                </div>
                <h5 className="fw-bold text-dark mb-1">Failed to Load Catalog</h5>
                <p className="text-secondary small mb-4">{error}</p>
                <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={fetchBooks}>
                  <i className="bi bi-arrow-clockwise me-2" />
                  Retry Connection
                </button>
              </div>
            ) : loading ? (
              /* Shimmering Loading Skeleton Layout */
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div className="col" key={idx}>
                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" aria-hidden="true">
                      <div className="bg-secondary bg-opacity-25 placeholder-glow" style={{ height: "230px" }}>
                        <div className="placeholder w-100 h-100"></div>
                      </div>
                      <div className="card-body p-4 placeholder-glow">
                        <span className="placeholder col-4 mb-2 small rounded"></span>
                        <h5 className="placeholder col-10 mb-2 rounded"></h5>
                        <p className="placeholder col-6 mb-4 rounded"></p>
                        <span className="placeholder col-5 py-2 rounded-pill"></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <EmptyState
                hasSearch={hasActiveFilter}
                searchQuery={searchQuery}
                onClear={handleClearFilters}
              />
            ) : (
              <>
                {/* Book Rendering: Grid or List */}
                {viewMode === "grid" ? (
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                    {paginatedBooks.map((book) => (
                      <BookGridCard
                        key={book.id}
                        book={book}
                        onClick={handleBookClick}
                        onBorrow={handleOpenBorrowModal}
                        searchQuery={searchQuery}
                      />
                    ))}
                  </div>
                ) : (
                  <div>
                    {paginatedBooks.map((book) => (
                      <BookListRow
                        key={book.id}
                        book={book}
                        onClick={handleBookClick}
                        onBorrow={handleOpenBorrowModal}
                        searchQuery={searchQuery}
                      />
                    ))}
                  </div>
                )}

                {/* ───────── PAGINATION CONTROLS ───────── */}
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-5 pt-3 border-top gap-3">
                  <div className="text-secondary small">
                    Showing{" "}
                    <strong>
                      {itemsPerPage === "all"
                        ? `1–${filteredBooks.length}`
                        : `${(currentPage - 1) * Number(itemsPerPage) + 1}–${Math.min(
                            currentPage * Number(itemsPerPage),
                            filteredBooks.length
                          )}`}
                    </strong>{" "}
                    of <strong>{filteredBooks.length}</strong> items
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {/* Items per page */}
                    <div className="d-flex align-items-center gap-1.5 me-2">
                      <small className="text-muted">Per page:</small>
                      <select
                        className="form-select form-select-sm border-0 bg-white shadow-sm rounded-pill px-3 py-1"
                        style={{ fontSize: "12.5px" }}
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(e.target.value)}
                      >
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="48">48</option>
                        <option value="all">All</option>
                      </select>
                    </div>

                    {/* Pagination buttons */}
                    {totalPages > 1 && (
                      <ul className="pagination pagination-sm mb-0 gap-1">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button
                            type="button"
                            className="page-link rounded-circle border shadow-sm d-flex align-items-center justify-content-center"
                            style={{ width: "34px", height: "34px" }}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                        </li>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (page) =>
                              page === 1 ||
                              page === totalPages ||
                              Math.abs(page - currentPage) <= 1
                          )
                          .map((page, index, array) => {
                            const prev = array[index - 1];
                            return (
                              <React.Fragment key={page}>
                                {prev && page - prev > 1 && (
                                  <li className="page-item disabled">
                                    <span className="page-link border-0 bg-transparent">...</span>
                                  </li>
                                )}
                                <li className={`page-item ${currentPage === page ? "active" : ""}`}>
                                  <button
                                    type="button"
                                    className={`page-link rounded-circle border shadow-sm d-flex align-items-center justify-content-center ${
                                      currentPage === page
                                        ? "bg-primary border-primary text-white"
                                        : "bg-white text-dark"
                                    }`}
                                    style={{ width: "34px", height: "34px" }}
                                    onClick={() => setCurrentPage(page)}
                                  >
                                    {page}
                                  </button>
                                </li>
                              </React.Fragment>
                            );
                          })}

                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button
                            type="button"
                            className="page-link rounded-circle border shadow-sm d-flex align-items-center justify-content-center"
                            style={{ width: "34px", height: "34px" }}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ───────── 3. BORROW MODAL ───────── */}
      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title="Borrow Book Request"
        onSave={handleSubmitBorrow}
        saveText={borrowSubmitting ? "Submitting..." : "Confirm Borrow"}
        btnColorSave="btn-primary"
      >
        <div className="container-fluid p-0">
          <div className="row g-3">
            {/* Book Cover */}
            <div className="col-12 col-md-4 text-center">
              <div
                className="rounded-4 overflow-hidden shadow-sm p-2 bg-light d-flex align-items-center justify-content-center"
                style={{ height: "230px" }}
              >
                {selectedBook?.thumbnail ? (
                  <img
                    src={getBookImageUrl(selectedBook.thumbnail)}
                    alt={selectedBook.book_title}
                    className="w-100 h-100 rounded object-fit-contain"
                  />
                ) : (
                  <div className="text-center p-3">
                    <i className="bi bi-book fs-1 text-primary mb-2"></i>
                    <div className="fw-bold text-dark">{getInitials(selectedBook?.book_title)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="col-12 col-md-8">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1 mb-1">
                {selectedBook?.category_name || "General"}
              </span>
              <h5 className="fw-bold text-dark mb-1">{selectedBook?.book_title}</h5>
              <p className="text-muted small mb-3">By {selectedBook?.author_name || "Unknown"}</p>

              <div className="row g-2 small text-muted">
                <div className="col-6">
                  <strong>ISBN:</strong> {selectedBook?.isbn || "N/A"}
                </div>
                <div className="col-6">
                  <strong>Published:</strong> {selectedBook?.publish_year || "N/A"}
                </div>
                <div className="col-6">
                  <strong>Language:</strong> {selectedBook?.language || "English"}
                </div>
                <div className="col-6">
                  <strong>Copies:</strong>{" "}
                  <span className="text-success fw-semibold">
                    {selectedBook?.available_copies} available
                  </span>
                </div>
                <div className="col-12">
                  <strong>Shelf Location:</strong>{" "}
                  <span className="badge bg-light text-dark border">
                    <i className="bi bi-geo-alt me-1 text-primary"></i>
                    {selectedBook?.shelf_location || "Main Stack"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-3" />

          {/* Borrow Form Notes */}
          <div>
            <label className="form-label fw-semibold small text-dark mb-1">
              Borrow Note (Optional)
            </label>
            <Input
              width="100%"
              name="borrow_note"
              placeholder="e.g., Needed for coursework or semester reading..."
              value={borrowNote}
              onChange={(e) => setBorrowNote(e.target.value)}
            />
            <small className="text-muted d-block mt-1">
              Your request will be placed in queue for the library administrator to approve and issue.
            </small>
          </div>
        </div>
      </Modal>
    </div>
  );
}