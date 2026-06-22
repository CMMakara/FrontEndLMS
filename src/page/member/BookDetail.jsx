import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── Sample data — replace with your API fetch ── */
const BOOK = {
  category_id: 2,
  category_name: "Software Engineering",
  author_id: 1,
  author_name: "Robert C. Martin",
  publisher_id: 2,
  publisher_name: "Prentice Hall",
  book_title: "Clean Code",
  isbn: "9780132350900",
  edition: "1st",
  publish_year: 2008,
  total_copies: 10,
  available_copies: 10,
  shelf_location: "A1-01",
  description:
    "A handbook of agile software craftsmanship. Writing clean code is what you must do in order to call yourself a professional. There is no reasonable excuse for doing anything less than your best. This book is a must-read for every developer who wants to level up their craft.",
  language: "English",
  pages: 464,
  cover_image: null,
};

/* ── Recommended books — replace with your API ── */
const RECOMMENDED = [
  {
    id: 101,
    book_title: "The Pragmatic Programmer",
    author_name: "Hunt & Thomas",
    available_copies: 7,
    total_copies: 8,
    cover_color: "#EEEDFE",
    cover_text: "#3C3489",
    initials: "PP",
  },
  {
    id: 102,
    book_title: "Domain-Driven Design",
    author_name: "Eric Evans",
    available_copies: 2,
    total_copies: 6,
    cover_color: "#E1F5EE",
    cover_text: "#085041",
    initials: "DDD",
  },
  {
    id: 103,
    book_title: "Refactoring",
    author_name: "Martin Fowler",
    available_copies: 5,
    total_copies: 5,
    cover_color: "#FAECE7",
    cover_text: "#712B13",
    initials: "RF",
  },
];

/* ── Helpers ── */
function getInitials(title) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function availVariant(available, total) {
  const ratio = available / total;
  if (available === 0) return "unavailable";
  if (ratio <= 0.3) return "limited";
  return "available";
}

/* ── Small components ── */
function AvailDot({ available, total }) {
  const v = availVariant(available, total);
  const colors = {
    available: "#639922",
    limited: "#BA7517",
    unavailable: "#E24B4A",
  };
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: colors[v],
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function AvailBadge({ available, total }) {
  const v = availVariant(available, total);
  const styles = {
    available: {
      background: "#EAF3DE",
      color: "#3B6D11",
      border: "0.5px solid #C0DD97",
    },
    limited: {
      background: "#FAEEDA",
      color: "#633806",
      border: "0.5px solid #FAC775",
    },
    unavailable: {
      background: "#FCEBEB",
      color: "#791F1F",
      border: "0.5px solid #F7C1C1",
    },
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
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 999,
        ...styles[v],
      }}
    >
      <i className={"bi " + icons[v]} style={{ fontSize: 11 }}></i>
      {labels[v]}
    </span>
  );
}

function DetailRow({ icon, label, value, valueStyle }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "9px 0",
        borderBottom: "0.5px solid var(--bd)",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          fontSize: 13,
          color: "var(--tm)",
        }}
      >
        <i className={"bi " + icon} style={{ fontSize: 14 }}></i>
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--t)",
          textAlign: "right",
          ...valueStyle,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function RecommendedCard({ book, onClick }) {
  return (
    <div
      onClick={() => onClick(book.id)}
      style={{
        background: "var(--bg)",
        border: "0.5px solid var(--bd)",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color .15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--bds)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--bd)")}
    >
      <div
        style={{
          height: 88,
          background: book.cover_color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 500,
          color: book.cover_text,
        }}
      >
        {book.initials}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--t)",
            lineHeight: 1.3,
            marginBottom: 3,
          }}
        >
          {book.book_title}
        </div>
        <div style={{ fontSize: 11, color: "var(--tm)" }}>
          {book.author_name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginTop: 7,
            fontSize: 11,
            color: "var(--tm)",
          }}
        >
          <AvailDot
            available={book.available_copies}
            total={book.total_copies}
          />
          {book.available_copies} / {book.total_copies} available
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function BookDetail() {
  const navigate = useNavigate();
  const [borrowState, setBorrowState] = useState("idle"); // idle | loading | done
  const book = BOOK;

  const handleBorrow = () => {
    if (borrowState !== "idle" || book.available_copies === 0) return;
    setBorrowState("loading");
    // Replace with your real API call:
    // await api.post("/member/borrow", { book_id: book.id })
    setTimeout(() => setBorrowState("done"), 1200);
  };

  const handleRecommendedClick = (id) => {
    navigate(`/member/books/${id}`);
  };

  return (
    <>
      <style>{`
        :root {
          --bg:  #ffffff;
          --bgs: #f5f5f5;
          --t:   #000000;
          --tm:  #6b6b6b;
          --bd:  rgba(0,0,0,0.12);
          --bds: rgba(0,0,0,0.28);
          --acc: #000000;
          --acc-t: #ffffff;
          --hover: #f2f2f2;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          background: var(--bgs);
          color: var(--t);
        }

        /* ── Page layout ── */
        .bd-page {
          min-height: 100vh;
          padding: 2rem 1rem;
          display: flex;
          justify-content: center;
        }
        .bd-inner {
          width: 100%;
          max-width: 980px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* ── Back button ── */
        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg);
          border: 0.5px solid var(--bd);
          border-radius: 8px;
          padding: 6px 13px;
          font-size: 13px;
          color: var(--tm);
          cursor: pointer;
          align-self: flex-start;
          transition: background .15s;
        }
        .btn-back:hover { background: var(--hover); color: var(--t); }

        /* ── Hero card ── */
        .hero-card {
          background: var(--bg);
          border: 0.5px solid var(--bd);
          border-radius: 16px;
          overflow: hidden;
        }
        .hero-top {
          display: flex;
        }

        /* Cover column */
        .cover-col {
          width: 190px;
          flex: 0 0 190px;
          background: #141414;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.25rem 1.5rem;
          min-height: 250px;
        }
        .cover-block {
          width: 110px;
          height: 155px;
          background: #252525;
          border-radius: 6px;
          border: 0.5px solid #333;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        .cover-initials {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 3px;
        }
        .cover-no-label {
          font-size: 9px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .cover-block img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px;
        }

        /* Hero body */
        .hero-body {
          flex: 1;
          padding: 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          justify-content: center;
        }
        .hero-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 999px;
          border: 0.5px solid var(--bd);
          color: var(--tm);
          background: var(--hover);
        }
        .book-title {
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 1.2;
          color: var(--t);
        }
        .book-byline {
          font-size: 13px;
          color: var(--tm);
          margin-top: -6px;
        }
        .book-byline b { color: var(--t); font-weight: 600; }
        .book-desc-short {
          font-size: 13px;
          color: var(--tm);
          line-height: 1.7;
          border-left: 2px solid var(--bds);
          padding-left: 12px;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* Borrow button */
        .btn-borrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--acc);
          color: var(--acc-t);
          border: none;
          border-radius: 10px;
          padding: 10px 22px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .15s, background .2s;
        }
        .btn-borrow:hover:not(:disabled) { opacity: .85; }
        .btn-borrow:disabled { opacity: .55; cursor: default; }
        .btn-borrow.success { background: #27500A; }

        /* Copies pill */
        .copies-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--hover);
          border: 0.5px solid var(--bd);
          border-radius: 10px;
          padding: 9px 14px;
          font-size: 13px;
          color: var(--tm);
        }
        .copies-num {
          font-size: 16px;
          font-weight: 700;
          color: var(--t);
        }

        /* Spinner */
        .spin {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          display: inline-block;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Stats bar ── */
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 0.5px solid var(--bd);
        }
        .stat-cell {
          padding: 1rem 1.5rem;
          border-right: 0.5px solid var(--bd);
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .stat-cell:last-child { border-right: none; }
        .stat-label { font-size: 11px; color: var(--tm); }
        .stat-value { font-size: 14px; font-weight: 600; color: var(--t); }

        /* ── Two column grid ── */
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        @media (max-width: 580px) { .two-col { grid-template-columns: 1fr; } }

        /* ── Info cards ── */
        .info-card {
          background: var(--bg);
          border: 0.5px solid var(--bd);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
        }
        .info-card-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--tm);
          text-transform: uppercase;
          letter-spacing: .07em;
          margin-bottom: 4px;
        }
        .detail-divider { border: none; border-bottom: 0.5px solid var(--bd); }
        .shelf-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #EEEDFE;
          color: #3C3489;
          border: 0.5px solid #AFA9EC;
          border-radius: 8px;
          padding: 4px 12px;
          font-size: 13px;
          font-weight: 600;
        }

        /* ── Description card ── */
        .desc-card {
          background: var(--bg);
          border: 0.5px solid var(--bd);
          border-radius: 16px;
          padding: 1.5rem;
        }
        .desc-text {
          font-size: 13.5px;
          color: var(--tm);
          line-height: 1.8;
          margin-top: 8px;
        }

        /* ── Recommended section ── */
        .rec-section { display: flex; flex-direction: column; gap: .85rem; }
        .rec-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .rec-title { font-size: 15px; font-weight: 700; color: var(--t); }
        .rec-view-all {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--tm);
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .rec-view-all:hover { color: var(--t); }

        .rec-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 580px) { .rec-grid { grid-template-columns: 1fr 1fr; } }

        .rec-card {
          background: var(--bg);
          border: 0.5px solid var(--bd);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color .15s;
        }
        .rec-card:hover { border-color: var(--bds); }
        .rec-thumb {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
        }
        .rec-info { padding: 10px 12px 12px; }
        .rec-book-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--t);
          line-height: 1.3;
          margin-bottom: 3px;
        }
        .rec-author { font-size: 11px; color: var(--tm); }
        .rec-avail {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--tm);
          margin-top: 8px;
        }

        @media (max-width: 640px) {
          .hero-top { flex-direction: column; }
          .cover-col { width: 100%; min-height: 160px; }
          .stats-bar { grid-template-columns: repeat(2, 1fr); }
          .stat-cell:nth-child(2) { border-right: none; }
          .stat-cell:nth-child(3) { border-top: 0.5px solid var(--bd); }
          .stat-cell:nth-child(4) { border-top: 0.5px solid var(--bd); }
        }
      `}</style>

      <div className="bd-page">
        <div className="bd-inner">
          {/* Back */}
          <button className="btn-back" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left" style={{ fontSize: 14 }}></i>
            Back to catalog
          </button>

          {/* ── Hero ── */}
          <div className="hero-card">
            <div className="hero-top">
              {/* Cover */}
              <div className="cover-col">
                <div className="cover-block">
                  {book.cover_image ? (
                    <img src={book.cover_image} alt={book.book_title} />
                  ) : (
                    <>
                      <div className="cover-initials">
                        {getInitials(book.book_title)}
                      </div>
                      <div className="cover-no-label">No Cover</div>
                    </>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="hero-body">
                <div className="hero-tags">
                  <span className="chip">
                    <i className="bi bi-tag" style={{ fontSize: 11 }}></i>
                    {book.category_name}
                  </span>
                  <AvailBadge
                    available={book.available_copies}
                    total={book.total_copies}
                  />
                </div>

                <div>
                  <h1 className="book-title">{book.book_title}</h1>
                  <p className="book-byline" style={{ marginTop: 6 }}>
                    by <b>{book.author_name}</b> &nbsp;·&nbsp;{" "}
                    {book.publisher_name} &nbsp;·&nbsp; {book.publish_year}
                  </p>
                </div>

                <p className="book-desc-short">{book.description}</p>

                <div className="hero-actions">
                  <button
                    className={
                      "btn-borrow" + (borrowState === "done" ? " success" : "")
                    }
                    onClick={handleBorrow}
                    disabled={
                      borrowState !== "idle" || book.available_copies === 0
                    }
                  >
                    {borrowState === "loading" ? (
                      <span className="spin" />
                    ) : (
                      <i
                        className={
                          "bi " +
                          (borrowState === "done" ? "bi-check2" : "bi-book")
                        }
                        style={{ fontSize: 15 }}
                      ></i>
                    )}
                    {borrowState === "idle" && book.available_copies === 0
                      ? "Unavailable"
                      : borrowState === "loading"
                        ? "Processing..."
                        : borrowState === "done"
                          ? "Borrowed!"
                          : "Borrow this book"}
                  </button>

                  <div className="copies-pill">
                    <i
                      className="bi bi-journals"
                      style={{ fontSize: 15, color: "var(--tm)" }}
                    ></i>
                    <span className="copies-num">{book.available_copies}</span>
                    <span>/ {book.total_copies} copies available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="stats-bar">
              <div className="stat-cell">
                <span className="stat-label">ISBN</span>
                <span className="stat-value">{book.isbn}</span>
              </div>
              <div className="stat-cell">
                <span className="stat-label">Edition</span>
                <span className="stat-value">{book.edition} Edition</span>
              </div>
              <div className="stat-cell">
                <span className="stat-label">Pages</span>
                <span className="stat-value">{book.pages} pages</span>
              </div>
              <div className="stat-cell">
                <span className="stat-label">Language</span>
                <span className="stat-value">{book.language}</span>
              </div>
            </div>
          </div>

          {/* ── Two-column detail cards ── */}
          <div className="two-col">
            <div className="info-card">
              <div className="info-card-title">Book details</div>
              <DetailRow
                icon="bi-person-lines-fill"
                label="Author"
                value={book.author_name}
              />
              <DetailRow
                icon="bi-building"
                label="Publisher"
                value={book.publisher_name}
              />
              <DetailRow
                icon="bi-calendar3"
                label="Published"
                value={book.publish_year}
              />
              <DetailRow
                icon="bi-bookmark"
                label="Category"
                value={book.category_name}
              />
              <DetailRow icon="bi-upc-scan" label="ISBN" value={book.isbn} />
            </div>

            <div className="info-card">
              <div className="info-card-title">Library info</div>
              <DetailRow
                icon="bi-journals"
                label="Total copies"
                value={book.total_copies}
              />
              <DetailRow
                icon="bi-check-circle"
                label="Available"
                value={`${book.available_copies} copies`}
                valueStyle={{ color: "#3B6D11" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 0",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 13,
                    color: "var(--tm)",
                  }}
                >
                  <i className="bi bi-geo-alt" style={{ fontSize: 14 }}></i>
                  Shelf location
                </span>
                <span className="shelf-pill">
                  <i className="bi bi-geo-alt" style={{ fontSize: 12 }}></i>
                  {book.shelf_location}
                </span>
              </div>
            </div>
          </div>

          {/* ── Description ── */}
          <div className="desc-card">
            <div className="info-card-title">Description</div>
            <p className="desc-text">{book.description}</p>
          </div>

          {/* ── Recommended books ── */}
          <div className="rec-section">
            <div className="rec-header">
              <span className="rec-title">You might also like</span>
              <button
                className="rec-view-all"
                onClick={() => navigate("/member/books")}
              >
                View all{" "}
                <i className="bi bi-arrow-right" style={{ fontSize: 12 }}></i>
              </button>
            </div>

            <div className="rec-grid">
              {RECOMMENDED.map((rec) => (
                <div
                  key={rec.id}
                  className="rec-card"
                  onClick={() => handleRecommendedClick(rec.id)}
                >
                  <div
                    className="rec-thumb"
                    style={{
                      background: rec.cover_color,
                      color: rec.cover_text,
                    }}
                  >
                    {rec.initials}
                  </div>
                  <div className="rec-info">
                    <div className="rec-book-title">{rec.book_title}</div>
                    <div className="rec-author">{rec.author_name}</div>
                    <div className="rec-avail">
                      <AvailDot
                        available={rec.available_copies}
                        total={rec.total_copies}
                      />
                      {rec.available_copies} / {rec.total_copies} available
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
