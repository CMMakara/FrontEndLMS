import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import useBooks from "../../hook/useBooks";
import useCategory from "../../hook/useCategory";
import useBorrowRequest from "../../hook/useBorrowRequest";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

/* ───────── STEP PROCESS DEFINITION ───────── */
const STEPS = [
  {
    num: "01",
    title: "Search & Discover",
    desc: "Browse thousands of books, audiobooks, and journals by title, author, or genre.",
    icon: "bi-search",
    color: "#4f46e5",
  },
  {
    num: "02",
    title: "Request to Borrow",
    desc: "Select your desired book and submit a borrow request in a single click.",
    icon: "bi-book-half",
    color: "#06b6d4",
  },
  {
    num: "03",
    title: "Instant Approval",
    desc: "Our librarians review and approve your request promptly with shelf details.",
    icon: "bi-check2-circle",
    color: "#10b981",
  },
  {
    num: "04",
    title: "Track & Return",
    desc: "Keep track of active loans and due dates from your personal profile dashboard.",
    icon: "bi-arrow-repeat",
    color: "#f59e0b",
  },
];

/* ───────── HELPER: BOOK INITIALS COVER ───────── */
function getInitials(title) {
  if (!title) return "BK";
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* ───────── COMPONENT: MODERN BOOK CARD ───────── */
function BookCard({ book, showBadge, openModal }) {
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const isAvailable = (book?.available_copies ?? 0) > 0;

  // Clean and construct thumbnail URL
  const rawThumbnail = book?.thumbnail || "";
  let cleanThumbnail = rawThumbnail.replace(/^(\/)?uploads\//i, "").replace(/^\/+/, "");
  if (cleanThumbnail && !cleanThumbnail.toLowerCase().startsWith("books/") && !rawThumbnail.startsWith("http")) {
    cleanThumbnail = `books/${cleanThumbnail}`;
  }
  const imageUrl = cleanThumbnail
    ? (rawThumbnail.startsWith("http")
        ? rawThumbnail
        : `${import.meta.env.VITE_API_URL}${cleanThumbnail}`)
    : "";

  return (
    <div
      className="card border-0 h-100 bg-white position-relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hover
          ? "0 20px 35px -10px rgba(79, 70, 229, 0.18), 0 4px 12px rgba(15, 23, 42, 0.05)"
          : "0 4px 18px rgba(15, 23, 42, 0.05)",
        border: "1px solid #eef2f6",
      }}
    >
      {/* Cover Image Area */}
      <div
        className="position-relative overflow-hidden d-flex justify-content-center align-items-center"
        style={{
          height: "250px",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          padding: "16px",
        }}
      >
        {/* Ambient blurred backdrop */}
        {imageUrl && !imgError && (
          <div
            className="position-absolute w-100 h-100"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(24px)",
              opacity: 0.28,
              zIndex: 0,
              transform: "scale(1.2)",
            }}
          />
        )}

        {/* Real Cover Image or Fallback */}
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={book?.book_title || "Book Cover"}
            className="rounded shadow"
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
              width: "150px",
              height: "200px",
              background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
              color: "#ffffff",
              zIndex: 1,
            }}
          >
            <i className="bi bi-book fs-1 mb-2 opacity-75"></i>
            <span className="fw-bold fs-4">{getInitials(book?.book_title)}</span>
            <small className="opacity-75 text-truncate w-100" style={{ fontSize: "10px" }}>
              {book?.category_name || "Library Book"}
            </small>
          </div>
        )}

        {/* Badges */}
        <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1" style={{ zIndex: 2 }}>
          {showBadge && (
            <span
              className="badge px-2.5 py-1.5 rounded-pill shadow-sm fw-semibold"
              style={{
                backgroundColor: "#f59e0b",
                color: "#fff",
                fontSize: "11px",
                letterSpacing: "0.4px",
              }}
            >
              ✨ New Arrival
            </span>
          )}
          {book?.publish_year && (
            <span
              className="badge bg-dark bg-opacity-75 backdrop-blur text-white px-2 py-1 rounded-pill"
              style={{ fontSize: "10.5px" }}
            >
              {book.publish_year}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body d-flex flex-column p-4 pb-2">
        {/* Category & Availability Tag */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span
            className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold text-truncate"
            style={{ fontSize: "11px", maxWidth: "150px", padding: "4px 8px", borderRadius: "8px" }}
          >
            <i className="bi bi-tag-fill me-1" style={{ fontSize: "10px" }}></i>
            {book?.category_name || "General"}
          </span>

          <span
            className="d-inline-flex align-items-center gap-1.5 fw-semibold"
            style={{
              fontSize: "11.5px",
              color: isAvailable ? "#10b981" : "#ef4444",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: isAvailable ? "#10b981" : "#ef4444",
                boxShadow: isAvailable ? "0 0 6px rgba(16, 185, 129, 0.6)" : "none",
              }}
            />
            {isAvailable ? `${book.available_copies} available` : "Out of stock"}
          </span>
        </div>

        {/* Title */}
        <h5
          className="fw-bold mb-1 text-truncate"
          title={book?.book_title}
          style={{ color: "#0f172a", fontSize: "16px", lineHeight: "1.35" }}
        >
          {book?.book_title || "Untitled Book"}
        </h5>

        {/* Author */}
        <p className="text-muted small mb-3 text-truncate d-flex align-items-center gap-1">
          <i className="bi bi-pen small opacity-75"></i>
          <span>{book?.author_name || "Unknown Author"}</span>
        </p>
      </div>

      {/* Card Actions Footer */}
      <div className="card-footer bg-white border-0 pb-4 px-4 pt-1 d-flex gap-2 mt-auto">
        <button
          type="button"
          onClick={() => navigate(`/member/books/${book?.id}`)}
          className="btn rounded-pill fw-semibold border w-50 py-2"
          style={{
            color: "#334155",
            backgroundColor: "#f8fafc",
            borderColor: "#e2e8f0",
            fontSize: "13px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#e2e8f0";
            e.currentTarget.style.borderColor = "#cbd5e1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#f8fafc";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          <i className="bi bi-eye me-1"></i> Details
        </button>

        <button
          type="button"
          className="btn w-50 rounded-pill fw-semibold text-white border-0 py-2 shadow-sm d-flex align-items-center justify-content-center gap-1"
          disabled={!isAvailable}
          onClick={() => openModal && openModal(book)}
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
  );
}

/* ───────── MAIN HOMEPAGE COMPONENT ───────── */
export default function Homepage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [faqOpen, setFaqOpen] = useState(0); // First item open by default
  const [isModal, setIsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [form, setForm] = useState({ note: "" });
  const [borrowSubmitting, setBorrowSubmitting] = useState(false);

  // Data Hooks
  const { books, getAllBooks } = useBooks();
  const { category } = useCategory(1, { per_page: 10000 });
  const { borrowRequest } = useBorrowRequest();

  // Safe data arrays
  const bookList = useMemo(() => (Array.isArray(books) ? books : []), [books]);
  const categoryList = useMemo(() => (Array.isArray(category) ? category : []), [category]);

  // Calculations
  const totalAvailableCopies = useMemo(() => {
    return bookList.reduce((acc, b) => acc + (Number(b.available_copies) || 0), 0);
  }, [bookList]);

  const bookCountByCategory = useMemo(() => {
    return bookList.reduce((acc, book) => {
      if (book?.category_id) {
        acc[book.category_id] = (acc[book.category_id] || 0) + 1;
      }
      return acc;
    }, {});
  }, [bookList]);

  // Tab Filtering
  const filteredBooks = useMemo(() => {
    let list = [...bookList];

    // Filter by tab
    if (activeTab === "trending") {
      list = list.filter((b) => (b.available_copies || 0) > 0 && (b.available_copies || 0) <= 4);
    } else if (activeTab === "new") {
      list = list.slice(-8).reverse();
    } else if (activeTab === "available") {
      list = list.filter((b) => (b.available_copies || 0) > 0);
    }

    // Filter by category dropdown if selected
    if (selectedCategoryFilter !== "all") {
      list = list.filter((b) => String(b.category_id) === String(selectedCategoryFilter));
    }

    // Filter by inline search if typed
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.book_title?.toLowerCase().includes(q) ||
          b.author_name?.toLowerCase().includes(q) ||
          b.category_name?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [bookList, activeTab, selectedCategoryFilter, query]);

  // Search Submit -> Navigates to BookListPage with query
  const handleSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate(`/member/books?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/member/books");
    }
  };

  const handleQuickTagClick = (tag) => {
    setQuery(tag);
    navigate(`/member/books?search=${encodeURIComponent(tag)}`);
  };

  // Modal open
  const openModal = (book) => {
    setForm({ note: "" });
    setSelectedBook(book);
    setIsModal(true);
  };

  // Borrow submission
  const handleBorrow = async () => {
    if (!selectedBook) return;
    setBorrowSubmitting(true);
    try {
      const payload = {
        book_id: selectedBook.id,
        note: form.note || "Member Borrow Request",
      };
      await borrowRequest(payload);
      setIsModal(false);
      setForm({ note: "" });
      await getAllBooks();
    } finally {
      setBorrowSubmitting(false);
    }
  };

  // FAQs list
  const faqs = [
    {
      q: "How many books can I borrow at a time?",
      a: "Standard member accounts are permitted to borrow up to 5 books concurrently. Extended allocations can be requested for academic researchers.",
    },
    {
      q: "What is the standard borrowing duration?",
      a: "The standard loan period is 14 days. You can easily renew your borrow period up to two times directly through your profile if there are no pending reservations.",
    },
    {
      q: "Where do I track my active loans and due dates?",
      a: "Navigate to your 'My Profile' page and click on 'Due Date' or 'Borrowing History'. You'll see real-time countdowns, book statuses, and notifications.",
    },
    {
      q: "What happens if a book is overdue?",
      a: "Overdue reminders are automatically posted to your account notifications. A minor standard fee may apply to ensure all members get timely access to popular library resources.",
    },
    {
      q: "Can I reserve a book that is currently out of stock?",
      a: "Yes! You can view detailed information about the book and check back regularly as copies are checked in daily by our automated system.",
    },
  ];

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        /* ===========================
           HOMEPAGE CUSTOM ANIMATIONS & POLISH
        =========================== */
        .hero-banner {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4f46e5 75%, #06b6d4 100%);
          border-radius: 0 0 2.5rem 2.5rem;
          box-shadow: 0 20px 40px rgba(79, 70, 229, 0.2);
          padding-top: 110px;
          padding-bottom: 75px;
        }

        .stat-pill-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 18px;
          padding: 16px 20px;
          transition: transform 0.25s ease, background 0.25s ease;
        }
        .stat-pill-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.18);
        }

        .quick-tag {
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          padding: 5px 14px;
          border-radius: 50px;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .quick-tag:hover {
          background: #ffffff;
          color: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .filter-tab-btn {
          border: none;
          background: transparent;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 50px;
          font-size: 14px;
          color: #64748b;
          transition: all 0.25s;
        }
        .filter-tab-btn.active {
          background: #4f46e5;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
        }
        .filter-tab-btn:hover:not(.active) {
          background: #e2e8f0;
          color: #1e293b;
        }

        .category-card {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #eef2f6;
          padding: 22px 18px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }
        .category-card:hover {
          transform: translateY(-6px);
          border-color: #c7d2fe;
          box-shadow: 0 16px 28px rgba(79, 70, 229, 0.12);
        }
        .category-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          font-size: 24px;
          transition: transform 0.3s ease;
        }
        .category-card:hover .category-icon-box {
          transform: scale(1.1);
        }

        .step-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #eef2f6;
          padding: 32px 24px;
          transition: all 0.3s;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
          position: relative;
        }
        .step-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 30px rgba(79, 70, 229, 0.12);
          border-color: #c7d2fe;
        }
        .step-num-badge {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 16px;
          margin-bottom: 20px;
        }

        .cta-banner {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%);
          border-radius: 24px;
          padding: 50px 36px;
          color: #ffffff;
          box-shadow: 0 20px 40px rgba(30, 27, 75, 0.25);
          position: relative;
          overflow: hidden;
        }

        .accordion-button:not(.collapsed) {
          color: #4f46e5;
          background-color: #eef2ff;
          font-weight: 600;
        }
        .accordion-button:focus {
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
          border-color: transparent;
        }
      `}</style>

      {/* ───────── 1. HERO SECTION ───────── */}
      <section className="hero-banner position-relative overflow-hidden text-white">
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "-5%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: "450px",
            height: "450px",
            background: "radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container position-relative">
          {/* Badge */}
          <div className="text-center mb-3">
            <span
              className="badge px-3 py-2 rounded-pill shadow-sm"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(10px)",
                color: "#cffafe",
                fontSize: "13px",
                letterSpacing: "0.5px",
              }}
            >
              <i className="bi bi-stars text-warning me-1.5"></i>
              NEXT-GEN DIGITAL LIBRARY • INFINITE KNOWLEDGE
            </span>
          </div>

          {/* Heading */}
          <h1
            className="fw-bolder text-center mb-3 tracking-tight"
            style={{ fontSize: "clamp(2.4rem, 5.2vw, 4.3rem)", lineHeight: 1.15 }}
          >
            Read Without Limits, <br />
            <span
              style={{
                background: "linear-gradient(90deg, #cffafe 0%, #a5f3fc 50%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Discover Without Boundaries
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-center mx-auto mb-4"
            style={{
              maxWidth: "620px",
              fontSize: "1.1rem",
              color: "rgba(255, 255, 255, 0.86)",
              lineHeight: "1.6",
            }}
          >
            Access thousands of curated books, academic journals, and modern releases.
            Borrow instantly, track your loans in real-time, and supercharge your learning journey.
          </p>

          {/* Search Box */}
          <div className="d-flex justify-content-center">
            <form
              onSubmit={handleSearch}
              className="d-flex w-100 shadow-lg align-items-center"
              style={{
                maxWidth: "640px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.35)",
                borderRadius: "50px",
                padding: "7px 9px",
              }}
            >
              <i className="bi bi-search text-white-50 ms-3 fs-5"></i>
              <input
                type="text"
                className="form-control border-0 bg-transparent text-white px-3 shadow-none"
                placeholder="Search by title, author, category, or ISBN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ color: "#ffffff", fontSize: "15px" }}
              />
              {query && (
                <button
                  type="button"
                  className="btn text-white-50 border-0 p-1 me-2"
                  onClick={() => setQuery("")}
                  title="Clear search"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
              <button
                type="submit"
                className="btn btn-light px-4 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-1.5"
                style={{
                  color: "#4f46e5",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
              >
                <span>Search</span>
                <i className="bi bi-arrow-right"></i>
              </button>
            </form>
          </div>

          {/* Quick Search Chips */}
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mt-3 pt-1">
            <small className="text-white-50 fw-semibold me-1" style={{ fontSize: "12px" }}>
              Trending:
            </small>
            {["Technology", "Fiction", "History", "Science", "Business", "Design"].map((tag) => (
              <span
                key={tag}
                className="quick-tag"
                onClick={() => handleQuickTagClick(tag)}
              >
                <i className="bi bi-lightning-charge-fill text-warning" style={{ fontSize: "11px" }}></i>
                {tag}
              </span>
            ))}
          </div>

          {/* Floating Stats Counters */}
          <div className="row gy-3 mt-4 pt-3 mx-auto" style={{ maxWidth: "980px" }}>
            <div className="col-6 col-md-3">
              <div className="stat-pill-card text-center">
                <div className="fw-bold fs-3 text-white">
                  {bookList.length > 0 ? `${bookList.length}+` : "1,200+"}
                </div>
                <div className="text-white-50 small" style={{ fontSize: "12px" }}>
                  <i className="bi bi-book me-1 text-info"></i> Books in Library
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="stat-pill-card text-center">
                <div className="fw-bold fs-3 text-white">
                  {categoryList.length > 0 ? `${categoryList.length}+` : "18+"}
                </div>
                <div className="text-white-50 small" style={{ fontSize: "12px" }}>
                  <i className="bi bi-tags me-1 text-warning"></i> Curated Categories
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="stat-pill-card text-center">
                <div className="fw-bold fs-3 text-white">
                  {totalAvailableCopies > 0 ? `${totalAvailableCopies}+` : "850+"}
                </div>
                <div className="text-white-50 small" style={{ fontSize: "12px" }}>
                  <i className="bi bi-check-circle me-1 text-success"></i> Copies Ready
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="stat-pill-card text-center">
                <div className="fw-bold fs-3 text-white">24/7</div>
                <div className="text-white-50 small" style={{ fontSize: "12px" }}>
                  <i className="bi bi-phone me-1 text-cyan"></i> Digital Access
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 2. FEATURED COLLECTION SECTION WITH FILTER TABS ───────── */}
      <section id="catalog-section" className="container py-5 mt-2">
        {/* Section Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary text-white rounded-pill px-2.5 py-1" style={{ fontSize: "11px" }}>
                EXPLORE CATALOG
              </span>
              <small className="text-muted fw-semibold">Discover your next favorite read</small>
            </div>
            <h2 className="fw-bolder text-dark mb-0" style={{ letterSpacing: "-0.5px" }}>
              Featured Books Collection
            </h2>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              to="/member/books"
              className="btn btn-outline-primary rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 shadow-sm"
              style={{ fontSize: "13.5px" }}
            >
              <span>View Full Catalog ({bookList.length})</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-2 rounded-4 shadow-sm border mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          {/* Tab buttons */}
          <div className="d-flex flex-wrap gap-1 w-100 w-md-auto">
            <button
              type="button"
              className={`filter-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <i className="bi bi-grid-fill me-1.5"></i> All Books
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeTab === "trending" ? "active" : ""}`}
              onClick={() => setActiveTab("trending")}
            >
              <i className="bi bi-fire me-1.5 text-warning"></i> Trending Now
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeTab === "new" ? "active" : ""}`}
              onClick={() => setActiveTab("new")}
            >
              <i className="bi bi-stars me-1.5 text-info"></i> New Arrivals
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeTab === "available" ? "active" : ""}`}
              onClick={() => setActiveTab("available")}
            >
              <i className="bi bi-check-circle-fill me-1.5 text-success"></i> Available Only
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <div className="d-flex align-items-center gap-2 w-100 w-md-auto" style={{ maxWidth: "260px" }}>
            <select
              className="form-select form-select-sm border-0 bg-light rounded-pill px-3 py-2 fw-medium text-dark shadow-none"
              style={{ fontSize: "13px" }}
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories ({categoryList.length})</option>
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name} ({bookCountByCategory[cat.id] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="row g-4">
            {filteredBooks.slice(0, 8).map((book, i) => (
              <div key={book.id} className="col-12 col-sm-6 col-md-4 col-lgy-3">
                <BookCard
                  book={book}
                  showBadge={i < 2 && activeTab !== "trending"}
                  openModal={openModal}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "70px", height: "70px" }}
            >
              <i className="bi bi-book-half fs-2 text-muted"></i>
            </div>
            <h5 className="fw-bold text-dark">No Books Found</h5>
            <p className="text-muted small mb-3">
              We couldn't find any books matching your current filter criteria.
            </p>
            <div>
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4 btn-sm"
                onClick={() => {
                  setActiveTab("all");
                  setSelectedCategoryFilter("all");
                  setQuery("");
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ───────── 3. BROWSE BY CATEGORY SHOWCASE ───────── */}
      <section className="container py-5">
        <div className="text-center mb-4">
          <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-3 py-1 mb-2 fw-semibold">
            EXPLORE GENRES
          </span>
          <h2 className="fw-bolder text-dark mb-1" style={{ letterSpacing: "-0.5px" }}>
            Browse by Category
          </h2>
          <p className="text-muted small mx-auto" style={{ maxWidth: "520px" }}>
            Find books tailored to your academic studies, personal passions, and professional curiosity.
          </p>
        </div>

        <div className="row gy-3 justify-content-center">
          {categoryList.slice(0, 8).map((c, index) => {
            const count = bookCountByCategory[c.id] || 0;
            const colors = [
              { bg: "#eef2ff", icon: "#4f46e5", iconClass: "bi-laptop" },
              { bg: "#ecfdf5", icon: "#10b981", iconClass: "bi-lightbulb" },
              { bg: "#fef3c7", icon: "#f59e0b", iconClass: "bi-book" },
              { bg: "#fce7f3", icon: "#ec4899", iconClass: "bi-palette" },
              { bg: "#e0f2fe", icon: "#0284c7", iconClass: "bi-globe" },
              { bg: "#f3e8ff", icon: "#9333ea", iconClass: "bi-mortarboard" },
              { bg: "#fee2e2", icon: "#ef4444", iconClass: "bi-heart-pulse" },
              { bg: "#f1f5f9", icon: "#475569", iconClass: "bi-journal-code" },
            ];
            const theme = colors[index % colors.length];

            return (
              <div key={c.id} className="col-6 col-md-4 col-lgy-3">
                <div
                  className="category-card h-100"
                  onClick={() => {
                    setSelectedCategoryFilter(c.id);
                    const catalogEl = document.getElementById("catalog-section");
                    if (catalogEl) catalogEl.scrollIntoView({ behavior: "smooth" });
                    else navigate(`/member/books?search=${encodeURIComponent(c.category_name)}`);
                  }}
                >
                  <div
                    className="category-icon-box"
                    style={{ backgroundColor: theme.bg, color: theme.icon }}
                  >
                    <i className={`bi ${theme.iconClass}`}></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-1 text-truncate" title={c.category_name}>
                    {c.category_name}
                  </h6>
                  <span className="badge bg-light text-muted border px-2 py-1 rounded-pill" style={{ fontSize: "11px" }}>
                    {count} {count === 1 ? "book" : "books"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────── 4. HOW IT WORKS (STEPS) ───────── */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container py-4 text-center">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 mb-2 fw-semibold">
            SEAMLESS EXPERIENCE
          </span>
          <h2 className="fw-bolder text-dark mb-2" style={{ letterSpacing: "-0.5px" }}>
            How Library Management Works
          </h2>
          <p className="text-muted small mx-auto mb-5" style={{ maxWidth: "560px" }}>
            Borrowing physical or digital volumes is quick and hassle-free in just 4 simple steps.
          </p>

          <div className="row g-4">
            {STEPS.map((s) => (
              <div key={s.num} className="col-12 col-sm-6 col-lgy-3 text-start">
                <div className="step-card h-100 d-flex flex-column">
                  <div
                    className="step-num-badge"
                    style={{
                      backgroundColor: `${s.color}15`,
                      color: s.color,
                      border: `1.5px solid ${s.color}35`,
                    }}
                  >
                    {s.num}
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className={`bi ${s.icon} fs-5`} style={{ color: s.color }}></i>
                    <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "17px" }}>
                      {s.title}
                    </h5>
                  </div>
                  <p className="text-muted small mb-0 lh-base" style={{ fontSize: "13.5px" }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 5. WHY CHOOSE LMS (BENEFITS) ───────── */}
      <section className="container py-5 my-2">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-lg-5">
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 mb-2 fw-semibold">
              KEY BENEFITS
            </span>
            <h2 className="fw-bolder text-dark mb-3" style={{ letterSpacing: "-0.5px", fontSize: "2.1rem" }}>
              Engineered for Modern Readers & Researchers
            </h2>
            <p className="text-muted mb-4" style={{ lineHeight: "1.7" }}>
              Our digital library bridges physical reading rooms and modern online access. Experience
              smart due-date reminders, instant librarian approvals, and personalized reading logs.
            </p>

            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-start gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "42px", height: "42px", background: "#eef2ff", color: "#4f46e5" }}
                >
                  <i className="bi bi-lightning-charge-fill fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Instant Reservation Queue</h6>
                  <small className="text-muted">Place holds and borrow requests with a single click from any device.</small>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "42px", height: "42px", background: "#ecfdf5", color: "#10b981" }}
                >
                  <i className="bi bi-bell-fill fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Smart Due Date Tracking</h6>
                  <small className="text-muted">Never worry about late returns with automated status countdowns and warnings.</small>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "42px", height: "42px", background: "#fef3c7", color: "#f59e0b" }}
                >
                  <i className="bi bi-shield-check fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Authenticated & Safe</h6>
                  <small className="text-muted">Directly integrated with student and librarian credentials for full account safety.</small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div
              className="p-4 p-md-5 rounded-4 shadow-sm position-relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <i className="bi bi-quote display-1 text-white-50 opacity-25 position-absolute top-0 end-0 me-4 mt-2"></i>
              <div className="position-relative">
                <span className="badge bg-primary text-white rounded-pill px-3 py-1 mb-3" style={{ fontSize: "11px" }}>
                  READER'S INSPIRATION
                </span>
                <h4 className="fw-bold lh-base text-white mb-4" style={{ fontSize: "1.35rem" }}>
                  "A reader lives a thousand lives before he dies. The man who never reads lives only one."
                </h4>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{ width: "44px", height: "44px" }}
                  >
                    GR
                  </div>
                  <div>
                    <div className="fw-bold text-white">George R.R. Martin</div>
                    <small className="text-white-50">Author & Literary Icon</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 6. FREQUENTLY ASKED QUESTIONS ───────── */}
      <section className="container py-5 mb-4">
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          <div className="text-center mb-4">
            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-3 py-1 mb-2 fw-semibold">
              HELP & SUPPORT
            </span>
            <h2 className="fw-bolder text-dark mb-2" style={{ letterSpacing: "-0.5px" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-muted small">
              Got questions? We've got answers. If you need more help, check our full FAQ guide.
            </p>
          </div>

          <div className="accordion accordion-flush" id="faqAccordion">
            {faqs.map((f, i) => (
              <div
                className="accordion-item mb-3 border shadow-sm rounded-4 overflow-hidden bg-white"
                key={i}
              >
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button fw-semibold py-3 px-4 ${faqOpen === i ? "" : "collapsed"}`}
                    type="button"
                    style={{ fontSize: "15px" }}
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  >
                    <i className="bi bi-question-circle me-2 text-primary"></i>
                    {f.q}
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${faqOpen === i ? "show" : ""}`}>
                  <div
                    className="accordion-body text-secondary px-4 pb-4 pt-1"
                    style={{ fontSize: "14px", lineHeight: "1.65" }}
                  >
                    {f.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link
              to="/member/help"
              className="btn btn-link text-primary fw-semibold text-decoration-none d-inline-flex align-items-center gap-1"
            >
              <span>Visit our complete Help & Knowledge Base</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── 7. CALL TO ACTION BANNER ───────── */}
      <section className="container mb-5 pb-4">
        <div className="cta-banner">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <h2 className="fw-bolder text-white mb-2" style={{ fontSize: "2rem" }}>
                Ready to Start Your Next Chapter?
              </h2>
              <p className="text-white-50 mb-0" style={{ fontSize: "1.05rem", maxWidth: "600px" }}>
                Join hundreds of students and faculty members who expand their horizons every day through our digital library.
              </p>
            </div>
            <div className="col-12 col-lg-4 text-lg-end">
              <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                <Link
                  to="/member/books"
                  className="btn btn-light rounded-pill px-4 py-2.5 fw-bold shadow"
                  style={{ color: "#4f46e5" }}
                >
                  <i className="bi bi-book-half me-1"></i> Browse Catalog
                </Link>
                <Link
                  to="/member/profile"
                  className="btn btn-outline-light rounded-pill px-4 py-2.5 fw-semibold"
                >
                  My Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 8. BORROW MODAL ───────── */}
      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title="Borrow Book Request"
        onSave={handleBorrow}
        saveText={borrowSubmitting ? "Submitting..." : "Confirm Borrow"}
        btnColorSave="btn-primary"
      >
        <div className="container-fluid p-0">
          <div className="row gy-3">
            {/* Book Cover */}
            <div className="col-12 col-md-4 text-center">
              <div
                className="rounded-4 overflow-hidden shadow-sm p-2 bg-light d-flex align-items-center justify-content-center"
                style={{ height: "230px" }}
              >
                {selectedBook?.thumbnail ? (
                  <img
                    src={
                      selectedBook.thumbnail.startsWith("http")
                        ? selectedBook.thumbnail
                        : `${import.meta.env.VITE_API_URL}${(() => {
                            let p = selectedBook.thumbnail.replace(/^(\/)?uploads\//i, "").replace(/^\/+/, "");
                            return p.toLowerCase().startsWith("books/") ? p : `books/${p}`;
                          })()}`
                    }
                    alt={selectedBook?.book_title}
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
              placeholder="e.g., Needed for semester research project..."
              value={form.note}
              onChange={(e) =>
                setForm({
                  ...form,
                  note: e.target.value,
                })
              }
            />
            <small className="text-muted d-block mt-1">
              Your request will be submitted to library administrators for review and fulfillment.
            </small>
          </div>
        </div>
      </Modal>
    </div>
  );
}