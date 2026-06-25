import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// ── Imported your real API services ──
import { getBooksByIdAPI, getAllBooksAPI } from "../../services/booksService";

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

/* ── Small sub-components ── */
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

/* ── Loading Skeleton ── */
function LoadingSkeleton() {
  return (
    <div className="bd-page">
      <div className="bd-inner">
        <div
          style={{
            width: 120,
            height: 34,
            borderRadius: 8,
            background: "var(--skel)",
          }}
        />
        <div className="hero-card">
          <div className="hero-top">
            <div className="cover-col" style={{ background: "#1a1a1a" }} />
            <div className="hero-body" style={{ gap: "1rem" }}>
              <div style={{ display: "flex", gap: 8 }}>
                <div
                  style={{
                    width: 100,
                    height: 24,
                    borderRadius: 999,
                    background: "var(--skel)",
                  }}
                />
                <div
                  style={{
                    width: 80,
                    height: 24,
                    borderRadius: 999,
                    background: "var(--skel)",
                  }}
                />
              </div>
              <div
                style={{
                  width: "70%",
                  height: 36,
                  borderRadius: 8,
                  background: "var(--skel)",
                }}
              />
              <div
                style={{
                  width: "50%",
                  height: 18,
                  borderRadius: 6,
                  background: "var(--skel)",
                }}
              />
              <div
                style={{
                  width: "100%",
                  height: 60,
                  borderRadius: 8,
                  background: "var(--skel)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Error State ── */
function ErrorState({ message, onBack, onRetry }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 16,
        padding: "2rem",
        background: "var(--bgs)",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#FCEBEB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i
          className="bi bi-exclamation-circle"
          style={{ fontSize: 26, color: "#E24B4A" }}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--t)",
            marginBottom: 4,
          }}
        >
          Failed to load book
        </p>
        <p style={{ fontSize: 13, color: "var(--tm)" }}>{message}</p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-back" onClick={onBack}>
          <i className="bi bi-arrow-left" style={{ fontSize: 14 }}></i> Go back
        </button>
        <button
          className="btn-back"
          onClick={onRetry}
          style={{ color: "var(--t)", fontWeight: 600 }}
        >
          <i className="bi bi-arrow-clockwise" style={{ fontSize: 14 }}></i>{" "}
          Retry
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
  const [recommended, setRecommended] = useState([]); // 👈 Hook for recommended books data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowState, setBorrowState] = useState("idle");

  /* ── Fetch Main Book and Recommendations ── */
  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch current book detail
      const bookData = await getBooksByIdAPI(id);

      // Handle wrapped dynamic Spring Boot responses (adjust property names if needed, e.g., bookData.data)
      const currentBook = bookData.data ? bookData.data : bookData;
      setBook(currentBook);

      // 2. Fetch other books dynamically to act as suggestions
      const catalogData = await getAllBooksAPI();
      const allBooks = catalogData.data ? catalogData.data : catalogData;

      // Filter out current book so it doesn't recommend itself, take up to 3 books
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

  /* ── Borrow action handler ── */
  const handleBorrow = () => {
    if (borrowState !== "idle" || book.available_copies === 0) return;
    setBorrowState("loading");

    // Replace with your real endpoints once backend borrow feature is live
    setTimeout(() => {
      setBorrowState("done");
      setBook((prev) => ({
        ...prev,
        available_copies: Math.max(0, prev.available_copies - 1),
      }));
    }, 1200);
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
    <>
      <style>{`
        :root {
          --bg: #ffffff; --bgs: #f5f5f5; --t: #000000; --tm: #6b6b6b;
          --bd: rgba(0,0,0,0.12); --bds: rgba(0,0,0,0.28); --acc: #000000;
          --acc-t:#ffffff; --hover:#f2f2f2; --skel: #e8e8e8;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: var(--bgs); color: var(--t); }
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        [style*="var(--skel)"] { background: linear-gradient(90deg, #e8e8e8 25%, #f0f0f0 50%, #e8e8e8 75%); background-size: 800px 100%; animation: shimmer 1.4s infinite; }
        .bd-page { min-height: 100vh; padding: 2rem 1rem; display: flex; justify-content: center; background: var(--bgs); }
        .bd-inner { 
          width: 100%; 
          max-width: none; /* ← full width */ 
          display: flex; 
          flex-direction: column; 
          gap: 1.25rem; 
        }
        .btn-back { display: inline-flex; align-items: center; gap: 6px; background: var(--bg); border: 0.5px solid var(--bd); border-radius: 8px; padding: 6px 13px; font-size: 13px; color: var(--tm); cursor: pointer; align-self: flex-start; transition: background .15s; }
        .btn-back:hover { background: var(--hover); color: var(--t); }
        .hero-card { background: var(--bg); border: 0.5px solid var(--bd); border-radius: 16px; overflow: hidden; }
        .hero-top { display: flex; }
        .cover-col { width: 190px; flex: 0 0 190px; background: #141414; display: flex; align-items: center; justify-content: center; padding: 2.25rem 1.5rem; min-height: 250px; }
        .cover-block { width: 110px; height: 155px; background: #252525; border-radius: 6px; border: 0.5px solid #333; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; overflow: hidden; }
        .cover-initials { font-size: 28px; font-weight: 700; color: #fff; letter-spacing: 3px; }
        .cover-no-label { font-size: 9px; color: #555; text-transform: uppercase; letter-spacing: 1.5px; }
        .cover-block img { width: 100%; height: 100%; object-fit: cover; }
        .hero-body { flex: 1; padding: 1.75rem 2rem; display: flex; flex-direction: column; gap: 1.1rem; justify-content: center; }
        .hero-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .chip { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 999px; border: 0.5px solid var(--bd); color: var(--tm); background: var(--hover); }
        .book-title { font-size: 1.6rem; font-weight: 700; line-height: 1.2; color: var(--t); }
        .book-byline { font-size: 13px; color: var(--tm); margin-top: -6px; }
        .book-byline b { color: var(--t); font-weight: 600; }
        .book-desc-short { font-size: 13px; color: var(--tm); line-height: 1.7; border-left: 2px solid var(--bds); padding-left: 12px; }
        .hero-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .btn-borrow { display: inline-flex; align-items: center; gap: 8px; background: var(--acc); color: var(--acc-t); border: none; border-radius: 10px; padding: 10px 22px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity .15s, background .2s; }
        .btn-borrow:hover:not(:disabled) { opacity: .85; }
        .btn-borrow:disabled { opacity: .55; cursor: default; }
        .btn-borrow.success { background: #27500A; }
        .copies-pill { display: inline-flex; align-items: center; gap: 7px; background: var(--hover); border: 0.5px solid var(--bd); border-radius: 10px; padding: 9px 14px; font-size: 13px; color: var(--tm); }
        .copies-num { font-size: 16px; font-weight: 700; color: var(--t); }
        .spin { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; display: inline-block; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 0.5px solid var(--bd); }
        .stat-cell { padding: 1rem 1.5rem; border-right: 0.5px solid var(--bd); display: flex; flex-direction: column; gap: 3px; }
        .stat-cell:last-child { border-right: none; }
        .stat-label { font-size: 11px; color: var(--tm); }
        .stat-value { font-size: 14px; font-weight: 600; color: var(--t); }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        @media (max-width: 580px) { .two-col { grid-template-columns: 1fr; } }
        .info-card { background: var(--bg); border: 0.5px solid var(--bd); border-radius: 16px; padding: 1.25rem 1.5rem; }
        .info-card-title { font-size: 11px; font-weight: 700; color: var(--tm); text-transform: uppercase; letter-spacing: .07em; margin-bottom: 4px; }
        .shelf-pill { display: inline-flex; align-items: center; gap: 6px; background: #EEEDFE; color: #3C3489; border: 0.5px solid #AFA9EC; border-radius: 8px; padding: 4px 12px; font-size: 13px; font-weight: 600; }
        .desc-card { background: var(--bg); border: 0.5px solid var(--bd); border-radius: 16px; padding: 1.5rem; }
        .desc-text { font-size: 13.5px; color: var(--tm); line-height: 1.8; margin-top: 8px; }
        .rec-section { display: flex; flex-direction: column; gap: .85rem; }
        .rec-header { display: flex; align-items: center; justify-content: space-between; }
        .rec-title { font-size: 15px; font-weight: 700; color: var(--t); }
        .rec-view-all { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--tm); cursor: pointer; background: none; border: none; padding: 0; }
        .rec-view-all:hover { color: var(--t); }
        .rec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media (max-width: 580px) { .rec-grid { grid-template-columns: 1fr 1fr; } }
        .rec-card { background: var(--bg); border: 0.5px solid var(--bd); border-radius: 12px; overflow: hidden; cursor: pointer; transition: border-color .15s; }
        .rec-card:hover { border-color: var(--bds); }
        .rec-thumb { height: 90px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; background: #eef2f5; color: #4b5563; }
        .rec-info { padding: 10px 12px 12px; }
        .rec-book-title { font-size: 13px; font-weight: 600; color: var(--t); line-height: 1.3; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rec-author { font-size: 11px; color: var(--tm); }
        .rec-avail { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--tm); margin-top: 8px; }
        @media (max-width: 640px) {
          .hero-top { flex-direction: column; } .cover-col { width: 100%; min-height: 160px; }
          .stats-bar { grid-template-columns: repeat(2, 1fr); }
          .stat-cell:nth-child(2) { border-right: none; } .stat-cell:nth-child(3), .stat-cell:nth-child(4) { border-top: 0.5px solid var(--bd); }
        }
      `}</style>

      <div className="bd-page">
        <div className="bd-inner">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left" style={{ fontSize: 14 }}></i> Back
            to catalog
          </button>

          {/* ── Hero Info Section ── */}
          <div className="hero-card">
            <div className="hero-top">
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

              <div className="hero-body">
                <div className="hero-tags">
                  <span className="chip">
                    <i className="bi bi-tag" style={{ fontSize: 11 }}></i>{" "}
                    {book.category_name || "General"}
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

                <p className="book-desc-short">
                  {book.description || "No description provided."}
                </p>

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
                      />
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

            {/* Stats matrix bar */}
            <div className="stats-bar">
              <div className="stat-cell">
                <span className="stat-label">ISBN</span>
                <span className="stat-value">{book.isbn || "N/A"}</span>
              </div>
              <div className="stat-cell">
                <span className="stat-label">Edition</span>
                <span className="stat-value">
                  {book.edition || "1st"} Edition
                </span>
              </div>
              <div className="stat-cell">
                <span className="stat-label">Pages</span>
                <span className="stat-value">{book.pages || "--"} pages</span>
              </div>
              <div className="stat-cell">
                <span className="stat-label">Language</span>
                <span className="stat-value">{book.language || "English"}</span>
              </div>
            </div>
          </div>

          {/* ── Structured Metadata Grid ── */}
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
                value={book.category_name || "Uncategorized"}
              />
              <DetailRow
                icon="bi-upc-scan"
                label="ISBN"
                value={book.isbn || "N/A"}
              />
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
                  <i className="bi bi-geo-alt" style={{ fontSize: 14 }}></i>{" "}
                  Shelf location
                </span>
                <span className="shelf-pill">
                  <i className="bi bi-geo-alt" style={{ fontSize: 12 }}></i>{" "}
                  {book.shelf_location || "Main Stack"}
                </span>
              </div>
            </div>
          </div>

          <div className="desc-card">
            <div className="info-card-title">Description</div>
            <p className="desc-text">
              {book.description || "No extensive summary details available."}
            </p>
          </div>

          {/* ── Dynamic Recommended Section ── */}
          {recommended.length > 0 && (
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
                {recommended.map((rec) => (
                  <div
                    key={rec.id}
                    className="rec-card"
                    onClick={() => handleRecommendedClick(rec.id)}
                  >
                    <div className="rec-thumb">
                      {rec.cover_image ? (
                        <img
                          src={rec.cover_image}
                          alt={rec.book_title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        getInitials(rec.book_title)
                      )}
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
          )}
        </div>
      </div>
    </>
  );
}
