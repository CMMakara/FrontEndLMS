import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooksAPI } from "../../services/booksService";

/* ─────────────────────────────────────────
   HELPERS (unchanged)
───────────────────────────────────────── */
function getInitials(title) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function availVariant(available, total) {
  if (available === 0) return "unavailable";
  if (available / total <= 0.3) return "limited";
  return "available";
}

const AVAIL_STYLES = {
  available: {
    bg: "#E8F5E9",
    color: "#2E7D32",
    border: "#A5D6A7",
    dot: "#43A047",
    label: "Available",
  },
  limited: {
    bg: "#FFF8E1",
    color: "#E65100",
    border: "#FFE082",
    dot: "#FB8C00",
    label: "Limited",
  },
  unavailable: {
    bg: "#FFEBEE",
    color: "#C62828",
    border: "#EF9A9A",
    dot: "#EF5350",
    label: "Unavailable",
  },
};

const SORT_OPTIONS = [
  { value: "title_asc", label: "Title A–Z" },
  { value: "title_desc", label: "Title Z–A" },
  { value: "year_desc", label: "Newest first" },
  { value: "year_asc", label: "Oldest first" },
  { value: "avail_desc", label: "Most available" },
  { value: "avail_asc", label: "Least available" },
];

function sortBooks(books, sort) {
  return [...books].sort((a, b) => {
    switch (sort) {
      case "title_asc":
        return a.book_title.localeCompare(b.book_title);
      case "title_desc":
        return b.book_title.localeCompare(a.book_title);
      case "year_desc":
        return b.publish_year - a.publish_year;
      case "year_asc":
        return a.publish_year - b.publish_year;
      case "avail_desc":
        return b.available_copies - a.available_copies;
      case "avail_asc":
        return a.available_copies - b.available_copies;
      default:
        return 0;
    }
  });
}

function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{
          background: "#FEF08A",
          color: "inherit",
          borderRadius: 2,
          padding: "0 2px",
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS (enhanced styling)
───────────────────────────────────────── */
function AvailBadge({ available, total }) {
  const v = availVariant(available, total);
  const s = AVAIL_STYLES[v];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 10,
        fontWeight: 600,
        padding: "4px 12px 4px 8px",
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        letterSpacing: 0.2,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
          boxShadow: `0 0 6px ${s.dot}50`,
        }}
      />
      {s.label} · {available}/{total}
    </span>
  );
}

function BookCard({ book, onClick, searchQuery }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(book.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        transition:
          "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease",
        boxShadow: hovered
          ? "0 20px 40px -12px rgba(99,102,241,0.25), 0 8px 24px -6px rgba(0,0,0,0.08)"
          : "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        border: "1px solid rgba(99,102,241,0.08)",
      }}
    >
      {/* Cover */}
      <div
        style={{
          height: 160,
          background: book.cover_image ? "#000" : book.cover_color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={book.book_title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: book.cover_text,
              letterSpacing: 4,
              textShadow: "0 2px 12px rgba(0,0,0,0.10)",
            }}
          >
            {getInitials(book.book_title)}
          </span>
        )}
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 12px",
            borderRadius: 8,
            backdropFilter: "blur(8px)",
            letterSpacing: 0.3,
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {book.publish_year}
        </span>
        {book.cover_image && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.20) 100%)",
            }}
          />
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: "16px 18px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#8E8E93",
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          {book.category_name}
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#1C1C1E",
            lineHeight: 1.3,
            flex: 1,
            marginTop: 2,
          }}
        >
          <Highlight text={book.book_title} query={searchQuery} />
        </div>
        <div style={{ fontSize: 13, color: "#8E8E93", marginTop: 1 }}>
          <Highlight text={book.author_name} query={searchQuery} />
        </div>
        <div style={{ marginTop: 10 }}>
          <AvailBadge
            available={book.available_copies}
            total={book.total_copies}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasSearch, searchQuery, onClear }) {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 2rem",
        gap: 16,
        textAlign: "center",
        background: "#fff",
        borderRadius: 28,
        border: "1px solid rgba(99,102,241,0.10)",
        minHeight: 340,
        boxShadow: "0 2px 12px rgba(99,102,241,0.04)",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "#EEF2FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i
          className="bi bi-search"
          style={{ fontSize: 28, color: "#6366F1" }}
        />
      </div>
      <div>
        <p
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#1C1C1E",
            marginBottom: 4,
          }}
        >
          No books found
        </p>
        <p style={{ fontSize: 14, color: "#8E8E93", maxWidth: 380 }}>
          {hasSearch ? (
            <>
              No results for <b style={{ color: "#1C1C1E" }}>“{searchQuery}”</b>
              . Try different keywords.
            </>
          ) : (
            "No books match your current filters."
          )}
        </p>
      </div>
      <button className="bl-btn-outline" onClick={onClear}>
        <i className="bi bi-arrow-counterclockwise" style={{ fontSize: 14 }} />
        Clear filters
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE — with sidebar and color accents
───────────────────────────────────────── */
export default function BookListPage() {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sort, setSort] = useState("title_asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

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
      setError(err.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const categories = useMemo(() => {
    const map = {};
    books.forEach((b) => {
      map[b.category_name] = (map[b.category_name] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [books]);

  const filtered = useMemo(() => {
    let result = books;

    // Search – now includes category name
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.book_title.toLowerCase().includes(q) ||
          b.author_name.toLowerCase().includes(q) ||
          b.category_name.toLowerCase().includes(q),
      );
    }

    // Category filter (multiple selection)
    if (selectedCategories.length > 0) {
      result = result.filter((b) =>
        selectedCategories.includes(b.category_name),
      );
    }

    return sortBooks(result, sort);
  }, [books, searchQuery, selectedCategories, sort]);

  const totalAvailable = books.filter((b) => b.available_copies > 0).length;
  const hasActiveFilter =
    searchQuery.trim() !== "" || selectedCategories.length > 0;

  const handleBookClick = (id) => navigate(`/member/books/${id}`);
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSort("title_asc");
  };

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName],
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((c) => c.name));
    }
  };

  return (
    <>
      <style>{`
        /* ── Design System with Color ── */
        :root {
          --primary: #6366F1;
          --primary-light: #EEF2FF;
          --primary-dark: #4F46E5;
          --bg-page: #F5F5F7;
          --bg-card: #FFFFFF;
          --text-primary: #1C1C1E;
          --text-secondary: #8E8E93;
          --text-tertiary: #AEAEB2;
          --border-light: rgba(99,102,241,0.10);
          --border-medium: rgba(99,102,241,0.20);
          --shadow-sm: 0 1px 3px rgba(99,102,241,0.06);
          --shadow-md: 0 8px 30px rgba(99,102,241,0.10);
          --shadow-lg: 0 20px 60px rgba(99,102,241,0.12);
          --radius-sm: 8px;
          --radius-md: 14px;
          --radius-lg: 20px;
          --radius-xl: 28px;
          --transition: 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: -apple-system, 'Segoe UI', system-ui, sans-serif;
          background: var(--bg-page);
          color: var(--text-primary);
          -webkit-font-smoothing: antialiased;
        }

        @keyframes shimmer {
          0%   { background-position: -800px 0; }
          100% { background-position: 800px 0; }
        }
        .skel-anim {
          background: linear-gradient(90deg, #E5E5EA 25%, #F2F2F7 50%, #E5E5EA 75%);
          background-size: 1600px 100%;
          animation: shimmer 1.6s infinite;
        }

        /* ── Layout ── */
        .bl-page {
          min-height: 100vh;
          padding: 2rem 2rem 4rem;
          background: var(--bg-page);
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }
        .bl-inner {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* ── Sticky Header with gradient ── */
        .bl-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          padding: 1rem 0;
          margin: -1rem 0 0;
          border-bottom: 2px solid transparent;
          border-image: linear-gradient(90deg, var(--primary), #A78BFA, var(--primary)) 1;
        }
        .bl-header-inner {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 0.25rem;
        }
        .bl-heading-group { flex: 1; min-width: 160px; }
        .bl-heading {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
          letter-spacing: -0.3px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .bl-heading span {
          background: var(--primary);
          color: #fff;
          font-size: 0.7rem;
          padding: 2px 10px;
          border-radius: 999px;
          font-weight: 600;
          letter-spacing: 0.4px;
        }
        .bl-subheading {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 2px;
          font-weight: 450;
        }
        .bl-subheading strong { color: var(--text-primary); font-weight: 600; }

        /* ── Search ── */
        .bl-search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 420px;
        }
        .bl-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          color: var(--text-tertiary);
          pointer-events: none;
          transition: color .2s;
        }
        .bl-search-wrap:focus-within .bl-search-icon { color: var(--primary); }
        .bl-search-input {
          width: 100%;
          background: #fff;
          border: 2px solid transparent;
          border-radius: 999px;
          padding: 10px 44px 10px 44px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-shadow: 0 2px 8px rgba(99,102,241,0.06);
          font-weight: 450;
        }
        .bl-search-input::placeholder { color: var(--text-tertiary); }
        .bl-search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12), 0 2px 8px rgba(99,102,241,0.06);
        }
        .bl-search-clear {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 999px;
          transition: color .2s, background .2s;
        }
        .bl-search-clear:hover { color: var(--primary); background: var(--primary-light); }
        .bl-kbd {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: var(--text-tertiary);
          background: #F2F2F7;
          border: 1px solid var(--border-light);
          border-radius: 4px;
          padding: 2px 7px;
          pointer-events: none;
          font-family: ui-monospace, monospace;
          font-weight: 500;
        }

        /* ── Sort ── */
        .bl-select {
          appearance: none;
          background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3E%3Cpath fill='%236366F1' d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E") no-repeat right 14px center;
          background-size: 12px;
          border: 2px solid transparent;
          border-radius: 999px;
          padding: 10px 40px 10px 18px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          transition: border-color .2s, box-shadow .2s;
          flex-shrink: 0;
          min-width: 150px;
          box-shadow: 0 2px 8px rgba(99,102,241,0.06);
        }
        .bl-select:hover { background-color: var(--primary-light); }
        .bl-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
        }

        /* ── Buttons ── */
        .bl-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          border: 1px solid var(--border-medium);
          border-radius: 999px;
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all .2s;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(99,102,241,0.04);
        }
        .bl-btn-outline:hover {
          background: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }

        /* ── Main content ── */
        .bl-main {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        /* ── Sidebar ── */
        .bl-sidebar {
          flex: 0 0 240px;
          background: #fff;
          border-radius: var(--radius-lg);
          padding: 1.5rem 1rem;
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 90px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }
        .bl-sidebar-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 1rem;
          letter-spacing: 0.3px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 0.75rem;
        }
        .bl-sidebar-title button {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: color .2s;
        }
        .bl-sidebar-title button:hover { color: var(--primary); }

        .bl-category-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background .15s;
          font-size: 13px;
          color: var(--text-secondary);
        }
        .bl-category-item:hover { background: var(--primary-light); }
        .bl-category-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: var(--primary);
          cursor: pointer;
          flex-shrink: 0;
        }
        .bl-category-item label {
          flex: 1;
          cursor: pointer;
          font-weight: 450;
          color: var(--text-primary);
        }
        .bl-category-count {
          font-size: 11px;
          color: var(--text-tertiary);
          font-weight: 400;
        }

        /* ── Active filters ── */
        .bl-active-filters {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          font-size: 13px;
          color: var(--text-secondary);
          padding: 0.25rem 0;
        }
        .bl-filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--primary);
          color: #fff;
          border-radius: 999px;
          padding: 4px 14px 4px 14px;
          font-size: 12px;
          font-weight: 500;
        }
        .bl-filter-chip-x {
          background: none;
          border: none;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0 0 0 2px;
          margin-left: 2px;
          font-size: 15px;
          line-height: 1;
          transition: color .15s;
        }
        .bl-filter-chip-x:hover { color: #fff; }

        .bl-stats {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 450;
        }
        .bl-stats b { color: var(--primary); font-weight: 600; }

        /* ── Grid ── */
        .bl-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 24px;
        }

        /* ── Error ── */
        .bl-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem;
          gap: 16px;
          text-align: center;
          background: #fff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          min-height: 340px;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .bl-sidebar { flex: 0 0 200px; }
        }

        @media (max-width: 768px) {
          .bl-page { padding: 1rem 1rem 3rem; }
          .bl-header-inner {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .bl-search-wrap { max-width: 100%; }
          .bl-select { width: 100%; }

          .bl-main {
            flex-direction: column;
            gap: 1rem;
          }
          .bl-sidebar {
            flex: 1 1 auto;
            width: 100%;
            position: static;
            max-height: none;
            padding: 1rem;
            overflow-y: visible;
          }
          .bl-sidebar .bl-category-list {
            display: flex;
            flex-wrap: wrap;
            gap: 4px 12px;
          }
          .bl-category-item {
            flex: 0 1 auto;
            padding: 4px 6px;
          }
          .bl-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .bl-heading { font-size: 1.3rem; }
        }

        @media (max-width: 480px) {
          .bl-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          .bl-page { padding: 0.75rem 0.75rem 2rem; }
          .bl-header { padding: 0.75rem 0; }
        }
      `}</style>

      <div className="bl-page">
        <div className="bl-inner">
          {/* ── Sticky Header ── */}
          <div className="bl-header">
            <div className="bl-header-inner">
              <div className="bl-heading-group">
                <div className="bl-heading">
                  Book Catalog
                  <span>{books.length}</span>
                </div>
                <p className="bl-subheading">
                  {loading ? (
                    "Loading books…"
                  ) : (
                    <>
                      <strong>{books.length}</strong> books ·{" "}
                      <strong>{totalAvailable}</strong> available
                    </>
                  )}
                </p>
              </div>

              <div className="bl-search-wrap">
                <i className="bi bi-search bl-search-icon" />
                <input
                  ref={searchRef}
                  type="text"
                  className="bl-search-input"
                  placeholder="Filter author, or category…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                {searchQuery ? (
                  <button
                    className="bl-search-clear"
                    onClick={() => {
                      setSearchQuery("");
                      searchRef.current?.focus();
                    }}
                  >
                    <i className="bi bi-x" style={{ fontSize: 20 }} />
                  </button>
                ) : (
                  !searchFocused && <span className="bl-kbd">/</span>
                )}
              </div>

              <select
                className="bl-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Active filters chips ── */}
          {!loading && !error && (
            <div className="bl-active-filters">
              {searchQuery.trim() && (
                <span className="bl-filter-chip">
                  <i className="bi bi-search" style={{ fontSize: 10 }} />
                  {searchQuery}
                  <button
                    className="bl-filter-chip-x"
                    onClick={() => setSearchQuery("")}
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategories.map((cat) => (
                <span key={cat} className="bl-filter-chip">
                  <i className="bi bi-tag" style={{ fontSize: 10 }} />
                  {cat}
                  <button
                    className="bl-filter-chip-x"
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.filter((c) => c !== cat),
                      )
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
              <span className="bl-stats">
                {filtered.length === 0 ? (
                  "No results"
                ) : (
                  <>
                    Showing <b>{filtered.length}</b> of {books.length} books
                  </>
                )}
              </span>
              {hasActiveFilter && (
                <button
                  onClick={handleClearFilters}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                    fontWeight: 450,
                    transition: "color .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-tertiary)")
                  }
                >
                  Clear all
                </button>
              )}
            </div>
          )}

          {/* ── Main content ── */}
          <div className="bl-main">
            {/* Sidebar with category checkboxes */}
            {!loading && !error && categories.length > 0 && (
              <aside className="bl-sidebar">
                <div className="bl-sidebar-title">
                  <span>📂 Categories</span>
                  <button onClick={handleSelectAll}>
                    {selectedCategories.length === categories.length
                      ? "Deselect all"
                      : "Select all"}
                  </button>
                </div>
                <div className="bl-category-list">
                  {categories.map((cat) => (
                    <div key={cat.name} className="bl-category-item">
                      <input
                        type="checkbox"
                        id={`cat-${cat.name}`}
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => handleCategoryToggle(cat.name)}
                      />
                      <label htmlFor={`cat-${cat.name}`}>{cat.name}</label>
                      <span className="bl-category-count">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </aside>
            )}

            {/* Book Grid */}
            {error ? (
              <div className="bl-error">
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "#FFEBEE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="bi bi-exclamation-circle"
                    style={{ fontSize: 28, color: "#EF5350" }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    Failed to load books
                  </p>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                    {error}
                  </p>
                </div>
                <button className="bl-btn-outline" onClick={fetchBooks}>
                  <i
                    className="bi bi-arrow-clockwise"
                    style={{ fontSize: 14 }}
                  />
                  Retry
                </button>
              </div>
            ) : (
              <div className="bl-grid">
                {loading ? (
                  Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#fff",
                        borderRadius: 20,
                        overflow: "hidden",
                        border: "1px solid var(--border-light)",
                      }}
                    >
                      <div className="skel-anim" style={{ height: 160 }} />
                      <div
                        style={{
                          padding: "16px 18px 18px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        <div
                          className="skel-anim"
                          style={{ width: 80, height: 10, borderRadius: 4 }}
                        />
                        <div
                          className="skel-anim"
                          style={{ width: "90%", height: 16, borderRadius: 4 }}
                        />
                        <div
                          className="skel-anim"
                          style={{ width: "60%", height: 13, borderRadius: 4 }}
                        />
                        <div
                          className="skel-anim"
                          style={{
                            width: 110,
                            height: 24,
                            borderRadius: 999,
                            marginTop: 4,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : filtered.length === 0 ? (
                  <EmptyState
                    hasSearch={!!searchQuery.trim()}
                    searchQuery={searchQuery}
                    onClear={handleClearFilters}
                  />
                ) : (
                  filtered.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onClick={handleBookClick}
                      searchQuery={searchQuery}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
