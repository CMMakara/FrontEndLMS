import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooksAPI } from "../../services/booksService";
import Input from "../../components/ui/Input";

function getInitials(title) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function availVariant(available, total) {
  if (available === 0) return "danger";
  if (available / total <= 0.3) return "warning";
  return "success";
}

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
      <mark className="bg-warning text-dark rounded px-1">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ─────────────────────────────────────────
    SUB-COMPONENTS (Bootstrap Styles)
───────────────────────────────────────── */
function AvailBadge({ available, total }) {
  const variant = availVariant(available, total);
  let label = "Available";
  if (variant === "warning") label = "Limited";
  if (variant === "danger") label = "Unavailable";

  return (
    <span className={`badge rounded-pill bg-${variant}-subtext text-${variant} border border-${variant} px-3 py-2 d-inline-flex align-items-center gap-2`}
      style={{ fontSize: "11px", fontWeight: "600" }}>
      <span className={`bg-${variant} rounded-circle d-inline-block`} style={{ width: "6px", height: "6px" }} />
      {label} · {available}/{total}
    </span>
  );
}

function BookCard({ book, onClick, searchQuery }) {
  return (
    <div className="col">
      <div
        onClick={() => onClick(book.id)}
        className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative btn text-start p-0 align-items-stretch"
        style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 .5rem 1.5rem rgba(0,0,0,.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
        }}
      >
        {/* Cover Thumbnail Area */}
        <div className="bg-light d-flex align-items-center justify-content-center position-relative overflow-hidden" style={{ height: "180px" }}>
          {book.thumbnail ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${book.thumbnail}`}
              alt={book.book_title}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span className="fs-2 fw-bold text-muted tracking-widest">
              {getInitials(book.book_title)}
            </span>
          )}

          <span className="position-absolute top-0 end-0 m-3 badge bg-dark bg-opacity-70 backdrop-blur text-white px-2 py-1 rounded">
            {book.publish_year}
          </span>
        </div>

        {/* Content Body */}
        <div className="card-body d-flex flex-column p-4">
          <small className="text-uppercase text-muted fw-bold tracking-wider mb-1" style={{ fontSize: "10px" }}>
            {book.category_name}
          </small>
          <h5 className="card-title fw-bold text-dark text-truncate mb-1">
            <Highlight text={book.book_title?.length > 25
              ? book.book_title.slice(0, 25) + "..."
              : book.book_title} query={searchQuery} />
          </h5>
          <p className="card-text text-secondary mb-3 small">
            <Highlight text={book.author_name} query={searchQuery} />
          </p>
          <div className="mt-auto">
            <AvailBadge available={book.available_copies} total={book.total_copies} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasSearch, searchQuery, onClear }) {
  return (
    <div className="w-100 text-center py-5 px-3 bg-white rounded-4 border border-light shadow-sm d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "340px" }}>
      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: "72px", height: "72px" }}>
        <i className="bi bi-search text-primary fs-3" />
      </div>
      <h5 className="fw-bold text-dark mb-1">No books found</h5>
      <p className="text-secondary small mb-4" style={{ maxWidth: "380px" }}>
        {hasSearch ? (
          <>No results for <strong className="text-dark">“{searchQuery}”</strong>. Try using different keywords.</>
        ) : (
          "No books match your selected category filters."
        )}
      </p>
      <button className="btn btn-outline-primary rounded-pill px-4" onClick={onClear}>
        <i className="bi bi-arrow-counterclockwise me-2" />
        Clear filters
      </button>
    </div>
  );
}

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

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.book_title.toLowerCase().includes(q) ||
          b.author_name.toLowerCase().includes(q) ||
          b.category_name.toLowerCase().includes(q),
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((b) =>
        selectedCategories.includes(b.category_name),
      );
    }

    return sortBooks(result, sort);
  }, [books, searchQuery, selectedCategories, sort]);

  const totalAvailable = books.filter((b) => b.available_copies > 0).length;
  const hasActiveFilter = searchQuery.trim() !== "" || selectedCategories.length > 0;

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
    <div className="container bg-light min-vh-100 py-4 px-md-5" style={{ marginTop: "80px" }}>

      {/* ── Sticky Navigation & Filtering Controls Header ── */}
      <div className="sticky-top bg-white shadow-sm rounded-4 p-3 mb-4 border">
        <div className="d-flex flex-wrap align-items-center gap-3">

          {/* Title */}
          <div className="flex-grow-1">
            <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
              Book Catalog
              <span className="badge bg-primary rounded-pill" style={{ fontSize: "0.75rem" }}>
                {books.length}
              </span>
            </h4>

            <p className="text-muted small mb-0 mt-1">
              {loading ? (
                "Loading books..."
              ) : (
                <>
                  <strong>{books.length}</strong> books ·{" "}
                  <strong>{totalAvailable}</strong> available
                </>
              )}
            </p>
          </div>

          {/* Right side controls */}
          <div className="d-flex align-items-center gap-2 ms-auto">

            {/* Search */}
            <div className="position-relative" style={{ width: 320 }}>
              <Input
                ref={searchRef}
                icon="bi-search"
                width="100%"
                placeholder="Search catalog, authors, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />

              {searchQuery && (
                <button
                  type="button"
                  className="btn border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y me-3 p-0"
                  onClick={() => {
                    setSearchQuery("");
                    searchRef.current?.focus();
                  }}
                >
                  <i className="bi bi-x-circle-fill text-secondary fs-5"></i>
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              className="form-select rounded-pill shadow-none"
              style={{ width: 180 }}
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
      </div>

      {/* ── Filter Chips Row ── */}
      {!loading && !error && (
        <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
          {searchQuery.trim() && (
            <span className="badge bg-primary d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill">
              <i className="bi bi-search small" /> "{searchQuery}"
              <button className="btn-close btn-close-white small ms-1" style={{ fontSize: "0.5rem" }} onClick={() => setSearchQuery("")} />
            </span>
          )}
          {selectedCategories.map((cat) => (
            <span key={cat} className="badge bg-secondary d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill">
              <i className="bi bi-tag small" /> {cat}
              <button className="btn-close btn-close-white small ms-1" style={{ fontSize: "0.5rem" }} onClick={() => handleCategoryToggle(cat)} />
            </span>
          ))}

          <span className="text-secondary small ms-2">
            {filtered.length === 0 ? "No records match" : <>Showing <strong>{filtered.length}</strong> of {books.length} books</>}
          </span>

          {hasActiveFilter && (
            <button className="btn btn-link btn-sm text-decoration-underline text-secondary p-0 ms-auto shadow-none" onClick={handleClearFilters}>
              Reset filters
            </button>
          )}
        </div>
      )}

      <div className="row g-4 align-items-start">
        {!loading && !error && categories.length > 0 && (
          <div className="col-12 col-md-3 sticky-md-top" style={{ top: "100px", zIndex: 10 }}>
            <div className="bg-white rounded-4 p-4 border border-light shadow-sm">
              <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                <span className="fw-bold text-dark">📂 Categories</span>
                <button className="btn btn-link btn-sm text-decoration-none text-primary fw-semibold p-0" onClick={handleSelectAll}>
                  {selectedCategories.length === categories.length ? "Clear selection" : "Select all"}
                </button>
              </div>

              <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
                {categories.map((cat) => (
                  <div key={cat.name} className="form-check d-flex align-items-center justify-content-between p-1 rounded hover-bg-light transition-all">
                    <div className="d-flex align-items-center gap-2">
                      <input
                        className="form-check-input my-0 cursor-pointer shadow-none"
                        type="checkbox"
                        id={`cat-${cat.name}`}
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => handleCategoryToggle(cat.name)}
                      />
                      <label className="form-check-label text-dark small cursor-pointer" htmlFor={`cat-${cat.name}`}>
                        {cat.name}
                      </label>
                    </div>
                    <span className="badge bg-light text-secondary rounded-pill border small fw-normal">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Catalog Output Content Container Grid */}
        <div className={!loading && !error && categories.length > 0 ? "col-12 col-md-9" : "col-12"}>
          {error ? (
            <div className="text-center py-5 px-3 bg-white rounded-4 border border-danger border-opacity-20 shadow-sm d-flex flex-column align-items-center justify-content-center">
              <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: "60px", height: "60px" }}>
                <i className="bi bi-exclamation-circle text-danger fs-3" />
              </div>
              <h5 className="fw-bold text-dark mb-1">Failed to load catalog</h5>
              <p className="text-secondary small mb-4">{error}</p>
              <button className="btn btn-primary rounded-pill px-4" onClick={fetchBooks}>
                <i className="bi bi-arrow-clockwise me-2" />
                Retry connection
              </button>
            </div>
          ) : loading ? (
            /* Bootstrap Loading Skeleton Layout Placeholder Grid */
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div className="col" key={idx}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" aria-hidden="true">
                    <div className="bg-secondary placeholder-glow" style={{ height: "180px" }}>
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
          ) : filtered.length === 0 ? (
            <EmptyState hasSearch={hasActiveFilter} searchQuery={searchQuery} onClear={handleClearFilters} />
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
              {filtered.map((book) => (
                <BookCard key={book.id} book={book} onClick={handleBookClick} searchQuery={searchQuery} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}