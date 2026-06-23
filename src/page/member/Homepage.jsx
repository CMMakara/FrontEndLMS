import React from "react";
import Navbar from "../../components/layout/Member/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useState, useEffect, useRef } from "react";

const NEW_ARRIVALS = [
  {
    id: 1,
    title: "The Rust Programming Language",
    author: "Steve Klabnik",
    cover: "https://covers.openlibrary.org/b/id/10521270-L.jpg",
    available: true,
    genre: "Coding",
  },
  {
    id: 2,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    cover: "https://covers.openlibrary.org/b/id/8739161-L.jpg",
    available: true,
    genre: "History",
  },
  {
    id: 3,
    title: "Deep Learning",
    author: "Ian Goodfellow",
    cover: "https://covers.openlibrary.org/b/id/8273161-L.jpg",
    available: false,
    genre: "AI",
  },
  {
    id: 4,
    title: "Cosmos",
    author: "Carl Sagan",
    cover: "https://covers.openlibrary.org/b/id/240726-L.jpg",
    available: true,
    genre: "Science",
  },
  {
    id: 5,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    cover: "https://covers.openlibrary.org/b/id/8739120-L.jpg",
    available: true,
    genre: "Math",
  },
  {
    id: 6,
    title: "Clean Code",
    author: "Robert C. Martin",
    cover: "https://covers.openlibrary.org/b/id/8432537-L.jpg",
    available: false,
    genre: "Coding",
  },
];

const POPULAR_BOOKS = [
  {
    id: 7,
    title: "Atomic Habits",
    author: "James Clear",
    cover: "https://covers.openlibrary.org/b/id/10392588-L.jpg",
    borrows: 312,
    rating: 4.8,
    genre: "Novel",
  },
  {
    id: 8,
    title: "The Art of War",
    author: "Sun Tzu",
    cover: "https://covers.openlibrary.org/b/id/8739205-L.jpg",
    borrows: 289,
    rating: 4.7,
    genre: "History",
  },
  {
    id: 9,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    cover: "https://covers.openlibrary.org/b/id/8407985-L.jpg",
    borrows: 261,
    rating: 4.9,
    genre: "Science",
  },
  {
    id: 10,
    title: "Python Crash Course",
    author: "Eric Matthes",
    cover: "https://covers.openlibrary.org/b/id/9255566-L.jpg",
    borrows: 244,
    rating: 4.6,
    genre: "Coding",
  },
  {
    id: 11,
    title: "1984",
    author: "George Orwell",
    cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    borrows: 231,
    rating: 4.8,
    genre: "Novel",
  },
  {
    id: 12,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    cover: "https://covers.openlibrary.org/b/id/8742296-L.jpg",
    borrows: 198,
    rating: 4.5,
    genre: "Science",
  },
];

const CATEGORIES = [
  { id: 1, name: "Science", icon: "🔬", count: 142, color: "#4f8ef7" },
  { id: 2, name: "History", icon: "🏛️", count: 98, color: "#e67e54" },
  { id: 3, name: "Coding", icon: "💻", count: 187, color: "#6c63ff" },
  { id: 4, name: "Math", icon: "📐", count: 74, color: "#2ec4b6" },
  { id: 5, name: "Novel", icon: "📖", count: 213, color: "#f7b731" },
  { id: 6, name: "AI", icon: "🤖", count: 56, color: "#26de81" },
];

const STEPS = [
  {
    num: "01",
    icon: "👤",
    title: "Register Account",
    desc: "Create a free account in seconds. All you need is an email address and a valid library card number.",
  },
  {
    num: "02",
    icon: "🔍",
    title: "Search a Book",
    desc: "Browse thousands of titles by category, author, or keyword. Filter by availability in real time.",
  },
  {
    num: "03",
    icon: "📥",
    title: "Borrow a Book",
    desc: "Reserve online and pick up in-branch, or access digital editions immediately from any device.",
  },
  {
    num: "04",
    icon: "↩️",
    title: "Return & Review",
    desc: "Return by the due date at any drop point. Leave a review to help other readers discover great reads.",
  },
];
const SUGGESTIONS = ["JavaScript", "History", "Science", "AI", "Math"];
/* ─── STAR RATING ─────────────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <span
      style={{ color: "#f7b731", fontSize: "0.8rem", letterSpacing: "1px" }}
    >
      {"★".repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? "½" : ""}
      {"☆".repeat(5 - Math.ceil(rating))}
      <span style={{ color: "#aaa", marginLeft: 4, fontSize: "0.75rem" }}>
        {rating}
      </span>
    </span>
  );
}
/* ─── SKELETON CARD ──────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="col-6 col-md-4 col-lg-2">
      <div className="skeleton-card">
        <div className="sk-img" />
        <div className="sk-line w-75 mt-2" />
        <div className="sk-line w-50 mt-1" />
        <div className="sk-btn mt-2" />
      </div>
    </div>
  );
}
/* ─── BOOK CARD ──────────────────────────────────────────────────── */
function BookCard({ book, showBadge }) {
  const [borrowed, setBorrowed] = useState(false);
  return (
    <div className="book-card">
      {showBadge && <span className="popular-badge">🔥 Most Popular</span>}
      <div className="book-cover-wrap">
        <img
          src={book.cover}
          alt={book.title}
          className="book-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/160x220/1a1a2e/ffffff?text=${encodeURIComponent(
              book.title.slice(0, 8)
            )}`;
          }}
        />
      </div>
      <div className="book-meta">
        <span className="genre-tag">{book.genre}</span>
        <h6 className="book-title">{book.title}</h6>
        <p className="book-author">{book.author}</p>
        {book.rating && (
          <div className="mb-1">
            <Stars rating={book.rating} />
            <span className="borrow-count ms-1">· {book.borrows} borrows</span>
          </div>
        )}
        <div className="card-actions">
          <button className="btn-view">View Detail</button>
          {book.available !== false && (
            <button
              className={`btn-borrow ${borrowed ? "borrowed" : ""}`}
              onClick={() => setBorrowed((b) => !b)}
            >
              {borrowed ? "✓ Borrowed" : "Borrow"}
            </button>
          )}
          {book.available === false && (
            <span className="unavailable-badge">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
}
/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
export default function Homepage() {
  const [query, setQuery] = useState("");
  // const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const heroRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setToast(`Searching for "${query}"…`);
    setTimeout(() => setToast(null), 2500);
  };
  const faqs = [
    {
      q: "How many books can I borrow at once?",
      a: "Members may borrow up to 5 physical books and 3 digital titles simultaneously.",
    },
    {
      q: "What is the borrowing period?",
      a: "Standard loans are 14 days. Digital titles auto-expire; physical books can be renewed twice.",
    },
    {
      q: "Are there late fees?",
      a: "Physical returns: $0.25/day. Digital titles expire automatically with no fees.",
    },
  ];
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
       :root {
        --primary: #6c63ff;
        --primary-dark: #4f8ef7;
        --text-dark: #1a1a2e;
        --text-light: #6c757d;
        --bg: #ffffff;
        --shadow: 0 8px 25px rgba(0,0,0,0.08);
        --radius: 14px;
      }
      body {
        margin: 0;
        font-family: system-ui, -apple-system, Segoe UI, sans-serif;
        background: #f7f8fc;
        color: var(--text-dark);
      }
        /* ── HERO ─────────────────────────────────── */
       .hero {
        min-height: 88vh;
        background:
          radial-gradient(circle at top, rgba(0,180,216,0.35), transparent 60%),
          linear-gradient(180deg, #0b1320, #0f172a);
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 5rem 1rem 4rem;
        position: relative;
        overflow: hidden;
        }
        .hero::before {
        content: "";
        position: absolute;
        width: 600px;
        height: 600px;
        background: #00b4d8;
        filter: blur(120px);
        opacity: 0.2;
        top: -200px;
        left: 50%;
        transform: translateX(-50%);
        }
        .floating-books {
          position: absolute; inset: 0; pointer-events: none; overflow: hidden;
        }
        .floating-book {
          position: absolute; font-size: 2rem; opacity: 0.07;
          animation: floatBook 14s ease-in-out infinite;
        }
        @keyframes floatBook {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          50% { transform: translateY(-30px) rotate(8deg); }
        }
        .hero-content { position: relative; z-index: 1; max-width: 720px; margin: 0 auto; }
        .hero-eyebrow {
          display: inline-block; background: rgba(247,183,49,0.15);
          border: 1px solid rgba(247,183,49,0.4); color: #f7b731;
          border-radius: 20px; padding: 4px 16px; font-size: 0.78rem;
          letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;
          margin-bottom: 1.25rem;
        }
        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          font-weight: 900; color: #fff; line-height: 1.1;
          margin-bottom: 1rem;
        }
        .hero h1 em { font-style: normal; color: #f7b731; }
        .hero-sub { color: rgba(255,255,255,0.65); font-size: 1.05rem; margin-bottom: 2.25rem; line-height: 1.6; }
        .search-wrap { position: relative; max-width: 560px; margin: 0 auto 1.5rem; }
        .hero-search {
          width: 100%; padding: 1rem 140px 1rem 1.4rem;
          border-radius: 50px; border: none; font-size: 1rem;
          background: rgba(255,255,255,0.97);
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
          outline: none; color: #1a1a2e;
          transition: box-shadow 0.2s;
        }
        .hero-search:focus { box-shadow: 0 8px 40px rgba(108,99,255,0.5); }
        .btn-search {
          position: absolute; right: 5px; top: 50%; transform: translateY(-50%);
          background: linear-gradient(135deg, #6c63ff, #4f8ef7);
          color: #fff; border: none; border-radius: 40px;
          padding: 0.6rem 1.35rem; font-weight: 600; font-size: 0.9rem;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 2px 12px rgba(108,99,255,0.4);
        }
        .btn-search:hover {
         transform: translateY(-50%) scale(1.04);
          }
        .suggestions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .suggestion-chip {
          background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.2); border-radius: 20px;
          padding: 5px 14px; font-size: 0.8rem; cursor: pointer;
          transition: all 0.2s;
        }
        .suggestion-chip:hover { background: rgba(108,99,255,0.4); color: #fff; border-color: #6c63ff; }
        .hero-stats { display: flex; gap: 2.5rem; justify-content: center; margin-top: 3rem; flex-wrap: wrap; }
        .stat { text-align: center; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: #f7b731; }
        .stat-label { color: rgba(255,255,255,0.5); font-size: 0.78rem; letter-spacing: 0.5px; }

        /* ── SECTION WRAPPER ─────────────────────── */
        .section { padding: 5rem 0; }
        .section-alt { background: #fff; }
        .section-dark { background: #0f0c29; }
        .section-label {
          display: inline-block; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase; color: #6c63ff;
          margin-bottom: 0.5rem;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.7rem, 3.5vw, 2.5rem);
          font-weight: 900; color: #1a1a2e; line-height: 1.15;
        }
        .section-dark .section-title { color: #fff; }
        .section-sub { color: #6c757d; max-width: 480px; margin: 0.5rem 0 2.5rem; font-size: 0.95rem; line-height: 1.65; }
        .section-dark .section-sub { color: rgba(255,255,255,0.55); }

        /* ── BOOK CARDS ──────────────────────────── */
        .books-scroll { overflow-x: auto; padding-bottom: 1rem; }
        .books-scroll::-webkit-scrollbar { height: 4px; }
        .books-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 2px; }
        .books-scroll::-webkit-scrollbar-thumb { background: #6c63ff; border-radius: 2px; }
        .books-row-inner { display: flex; gap: 1.25rem; padding: 0.5rem 0.25rem 0.5rem; min-width: max-content; }
        .book-card {
          width: 168px; flex-shrink: 0; background: #fff;
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          position: relative; cursor: pointer;
        }
        .book-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 16px 36px rgba(0,0,0,0.15); }
        .book-cover-wrap { width: 100%; height: 210px; overflow: hidden; background: #eee; }
        .book-cover { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .book-card:hover .book-cover { transform: scale(1.06); }
        .book-meta { padding: 0.75rem; }
        .genre-tag {
          display: inline-block; background: rgba(108,99,255,0.1);
          color: #6c63ff; border-radius: 4px; padding: 2px 7px;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.5px;
          text-transform: uppercase; margin-bottom: 5px;
        }
        .book-title { font-size: 0.8rem; font-weight: 700; color: #1a1a2e; margin: 0 0 2px; line-height: 1.3; }
        .book-author { font-size: 0.72rem; color: #888; margin: 0 0 6px; }
        .borrow-count { font-size: 0.68rem; color: #aaa; }
        .card-actions { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 6px; }
        .btn-view {
          flex: 1; background: transparent; border: 1px solid #6c63ff;
          color: #6c63ff; border-radius: 6px; padding: 4px 6px;
          font-size: 0.7rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s;
        }
        .btn-view:hover { background: #6c63ff; color: #fff; }
        .btn-borrow {
          flex: 1; background: linear-gradient(135deg, #6c63ff, #4f8ef7);
          color: #fff; border: none; border-radius: 6px;
          padding: 4px 6px; font-size: 0.7rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-borrow.borrowed { background: linear-gradient(135deg, #26de81, #20bf6b); }
        .btn-borrow:hover:not(.borrowed) { opacity: 0.88; }
        .unavailable-badge {
          font-size: 0.65rem; color: #e74c3c; background: rgba(231,76,60,0.1);
          border-radius: 4px; padding: 2px 6px; font-weight: 600;
        }
        .popular-badge {
          position: absolute; top: 8px; left: 8px; z-index: 2;
          background: linear-gradient(135deg, #f7b731, #e67e54);
          color: #fff; border-radius: 6px; font-size: 0.62rem;
          padding: 3px 8px; font-weight: 700;
        }

        /* ── SKELETON ────────────────────────────── */
        .skeleton-card {
          width: 168px; flex-shrink: 0; background: #f1f1f1;
          border-radius: 14px; overflow: hidden; padding: 0.75rem;
        }
        .sk-img { width: 100%; height: 210px; background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%); background-size: 200%; animation: shimmer 1.5s infinite; border-radius: 8px; }
        .sk-line { height: 10px; background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%); background-size: 200%; animation: shimmer 1.5s infinite; border-radius: 4px; }
        .sk-btn { height: 28px; background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%); background-size: 200%; animation: shimmer 1.5s infinite; border-radius: 6px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── CATEGORIES ──────────────────────────── */
        .cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.1rem; }
        .cat-card {
          background: #fff; border-radius: 16px;
          padding: 1.75rem 1.25rem;
          text-align: center; cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.25s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .cat-card:hover {
          transform: translateY(-6px);
          border-color: var(--cat-color);
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        }
        .cat-icon {
          font-size: 2.4rem; margin-bottom: 0.75rem;
          display: block;
          transition: transform 0.25s;
        }
        .cat-card:hover .cat-icon { transform: scale(1.15) rotate(-5deg); }
        .cat-name { font-size: 0.95rem; font-weight: 700; color: #1a1a2e; margin: 0 0 4px; }
        .cat-count { font-size: 0.78rem; color: #aaa; }

        /* ── HOW IT WORKS ────────────────────────── */
        .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .step-card {
          background: #fff; border-radius: 18px;
          padding: 2rem 1.5rem; text-align: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: transform 0.25s, box-shadow 0.25s;
          position: relative;
        }
        .step-card:hover { transform: translateY(-5px); box-shadow: 0 16px 36px rgba(108,99,255,0.15); }
        .step-num {
          font-family: 'Playfair Display', serif;
          font-size: 3rem; font-weight: 900;
          color: rgba(108,99,255,0.12); line-height: 1;
          margin-bottom: -0.5rem;
        }
        .step-icon { font-size: 2rem; margin-bottom: 0.75rem; display: block; }
        .step-title { font-size: 1rem; font-weight: 700; margin: 0 0 0.5rem; color: #1a1a2e; }
        .step-desc { font-size: 0.85rem; color: #6c757d; line-height: 1.6; }

        /* ── FAQ ─────────────────────────────────── */
        .faq-item { border-bottom: 1px solid rgba(255,255,255,0.1); }
        .faq-q {
          width: 100%; text-align: left; background: none; border: none;
          color: rgba(255,255,255,0.85); font-size: 0.95rem; font-weight: 600;
          padding: 1.1rem 0; cursor: pointer; display: flex;
          justify-content: space-between; align-items: center;
          transition: color 0.2s;
        }
        .faq-q:hover, .faq-q.open { color: #f7b731; }
        .faq-a {
          max-height: 0; overflow: hidden; transition: max-height 0.35s ease;
          color: rgba(255,255,255,0.55); font-size: 0.88rem; line-height: 1.7;
        }
        .faq-a.open { max-height: 120px; padding-bottom: 1rem; }
        .faq-chevron { transition: transform 0.3s; font-style: normal; }
        .faq-q.open .faq-chevron { transform: rotate(180deg); }

        /* ── FOOTER ──────────────────────────────── */
        .footer { background: #08071a; color: rgba(255,255,255,0.6); padding: 4rem 0 2rem; }
        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem; font-weight: 900; color: #fff;
          margin-bottom: 0.75rem; display: block;
        }
        .footer-logo span { color: #f7b731; }
        .footer-desc { font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.5rem; max-width: 240px; }
        .social-icons { display: flex; gap: 10px; }
        .social-icon {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
          text-decoration: none; color: rgba(255,255,255,0.7);
        }
        .social-icon:hover { background: #6c63ff; border-color: #6c63ff; color: #fff; transform: translateY(-2px); }
        .footer-heading { font-size: 0.8rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #fff; margin-bottom: 1.1rem; }
        .footer-links { list-style: none; padding: 0; margin: 0; }
        .footer-links li { margin-bottom: 0.55rem; }
        .footer-links a { color: rgba(255,255,255,0.55); font-size: 0.85rem; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: #f7b731; }
        .footer-contact { font-size: 0.85rem; line-height: 1.9; }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          margin-top: 3rem; padding-top: 1.5rem;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 0.5rem;
        }
        .footer-bottom span { font-size: 0.8rem; }

        /* ── TOAST ───────────────────────────────── */
        .toast-notify {
          position: fixed; bottom: 1.5rem; right: 1.5rem;
          background: #1a1a2e; color: #fff; border-radius: 10px;
          padding: 0.85rem 1.35rem; font-size: 0.88rem; font-weight: 500;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          z-index: 9999; animation: slideUp 0.3s ease;
          border-left: 3px solid #6c63ff;
        }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        /* ── RESPONSIVE ──────────────────────────── */
        @media (max-width: 991px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cat-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 767px) {
            .hero-stats {
              gap: 1.5rem;
            }

            .footer-bottom {
              flex-direction: column;
              text-align: center;
            }
        }
       @media (max-width: 480px) {
        .steps-grid {
          grid-template-columns: 1fr;
        }

        .cat-grid {
          grid-template-columns: 1fr;
        }

        .hero h1 {
          font-size: 2rem;
        }
      }
      `}</style>
      {/* ── TOAST ── */}
      {toast && <div className="toast-notify">🔍 {toast}</div>}
      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="hero" ref={heroRef}>
        <div className="floating-books" aria-hidden="true">
          {["📚", "📖", "📕", "📗", "📘", "📙"].map((e, i) => (
            <span
              key={i}
              className="floating-book"
              style={{
                left: `${10 + i * 16}%`,
                top: `${15 + (i % 3) * 25}%`,
                animationDelay: `${i * 2.2}s`,
                fontSize: `${1.5 + (i % 3) * 0.8}rem`,
              }}
            >
              {e}
            </span>
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">
            ✦ Open to all members — free forever
          </div>
          <h1>
            Find Your <em>Favourite</em>
            <br />
            Books Here
          </h1>
          <p className="hero-sub">
            Over 12,000 titles across every genre. Search, borrow, and return
            from anywhere — physical or digital.
          </p>

          <form className="search-wrap" onSubmit={handleSearch}>
            <input
              className="hero-search"
              type="text"
              placeholder="Search by title, author, or keyword…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn-search">
              Search →
            </button>
          </form>

          <div className="suggestions">
            <span
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.78rem",
                alignSelf: "center",
              }}
            >
              Try:
            </span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="suggestion-chip"
                onClick={() => {
                  setQuery(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="hero-stats">
            {[
              ["12,400+", "Books Available"],
              ["3,200+", "Active Members"],
              ["98%", "Satisfaction Rate"],
            ].map(([n, l]) => (
              <div className="stat" key={l}>
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEW ARRIVALS
      ══════════════════════════════════════════ */}
      <section className="section">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div className="section-label">📦 Fresh In</div>
              <h2 className="section-title">New Arrivals</h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>
                The latest additions to our collection, sorted by arrival date.
              </p>
            </div>
            <a
              href="#"
              style={{
                color: "#6c63ff",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              View all →
            </a>
          </div>

          <div className="books-scroll">
            <div className="books-row-inner">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="skeleton-card"
                    style={{ width: 168, flexShrink: 0 }}
                  >
                    <div className="sk-img" />
                    <div className="sk-line w-75 mt-2" />
                    <div className="sk-line w-50 mt-1" />
                    <div className="sk-btn mt-2" />
                  </div>
                ))
                : NEW_ARRIVALS.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          </div>
        </div>
      </section>
      {/* ══════════════════════════════════════════
          POPULAR BOOKS
      ══════════════════════════════════════════ */}
      <section className="section section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div className="section-label">🔥 Trending Now</div>
              <h2 className="section-title">Most Popular</h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>
                Ranked by total borrows this month.
              </p>
            </div>
            <a
              href="#"
              style={{
                color: "#6c63ff",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              View all →
            </a>
          </div>

          <div className="books-scroll">
            <div className="books-row-inner">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="skeleton-card"
                    style={{ width: 168, flexShrink: 0 }}
                  >
                    <div className="sk-img" />
                    <div className="sk-line w-75 mt-2" />
                    <div className="sk-line w-50 mt-1" />
                    <div className="sk-btn mt-2" />
                  </div>
                ))
                : POPULAR_BOOKS.map((b) => (
                  <BookCard key={b.id} book={b} showBadge />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════ */}
      <section className="section">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-label">🗂️ Browse by topic</div>
            <h2 className="section-title">Explore Categories</h2>
            <p className="section-sub" style={{ margin: "0.5rem auto 0" }}>
              Jump straight to the genre you love.
            </p>
          </div>

          <div className="cat-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="cat-card"
                style={{ "--cat-color": cat.color }}
                onClick={() => {
                  setToast(`Browsing ${cat.name} (${cat.count} books)`);
                  setTimeout(() => setToast(null), 2000);
                }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">{cat.count} books</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="section section-dark">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label" style={{ color: "#f7b731" }}>
              ⚙️ The process
            </div>
            <h2 className="section-title" style={{ color: "#fff" }}>
              How It Works
            </h2>
            <p
              className="section-sub"
              style={{
                margin: "0.5rem auto 0",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Borrow a book in four simple steps.
            </p>
          </div>

          <div className="steps-grid">
            {STEPS.map((step) => (
              <div className="step-card" key={step.num}>
                <div className="step-num">{step.num}</div>
                <span className="step-icon">{step.icon}</span>
                <div className="step-title">{step.title}</div>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div style={{ maxWidth: 640, margin: "4rem auto 0" }}>
            <h3
              style={{
                color: "#fff",
                fontFamily: "'Playfair Display', serif",
                marginBottom: "1.5rem",
                textAlign: "center",
                fontSize: "1.4rem",
              }}
            >
              Common Questions
            </h3>
            {faqs.map((faq, i) => (
              <div className="faq-item" key={i}>
                <button
                  className={`faq-q ${faqOpen === i ? "open" : ""}`}
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                >
                  {faq.q}
                  <em className="faq-chevron">▾</em>
                </button>
                <div className={`faq-a ${faqOpen === i ? "open" : ""}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="footer">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2.5rem",
            }}
          >
            {/* Brand */}
            <div>
              <span className="footer-logo">
                📚 <span>Library</span> System
              </span>
              <p className="footer-desc">
                Your community library, reimagined for the digital age. Free
                access, always.
              </p>
              <div className="social-icons">
                {["𝕏", "f", "in", "▶"].map((s, i) => (
                  <a key={i} href="#" className="social-icon">
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="footer-heading">Quick Links</div>
              <ul className="footer-links">
                {[
                  "Home",
                  "Browse Books",
                  "My Borrowings",
                  "New Arrivals",
                  "Popular Titles",
                ].map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <div className="footer-heading">Categories</div>
              <ul className="footer-links">
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <a href="#">
                      {c.icon} {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className="footer-heading">Contact Us</div>
              <div className="footer-contact">
                <div>📍 12 Bookshelf Lane, Phnom Penh</div>
                <div>📞 +855 23 456 789</div>
                <div>✉️ hello@librarysystem.kh</div>
                <div>🕐 Mon–Sat 8 am – 8 pm</div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Library System. All rights reserved.</span>
            <span>
              <a
                href="#"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.8rem",
                  marginRight: "1rem",
                  textDecoration: "none",
                }}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.8rem",
                  textDecoration: "none",
                }}
              >
                Terms of Service
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}