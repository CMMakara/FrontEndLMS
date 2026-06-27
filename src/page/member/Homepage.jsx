import React, { useState, useEffect } from "react";
import Card from '../../components/ui/Card'
import useBooks from "../../hook/useBooks";
import useCategory from '../../hook/useCategory'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import useBorrowRequest from "../../hook/useBorrowRequest";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { id: 1, name: "Science", icon: "bi bi-gear", count: 142 },
  { id: 2, name: "History", icon: "bi bi-bank", count: 98 },
  { id: 3, name: "Coding", icon: "bi bi-code-slash", count: 187 },
  { id: 4, name: "Math", icon: "bi bi-calculator", count: 74 },
  { id: 5, name: "Novel", icon: "bi bi-book", count: 213 },
];

const STEPS = [
  { num: "01", icon: "bi-person-plus", title: "Register", desc: "Create an account easily." },
  { num: "02", icon: "bi-search", title: "Discover", desc: "Find books in seconds." },
  { num: "03", icon: "bi-download", title: "Borrow", desc: "Get instant access." },
  { num: "04", icon: "bi-arrow-return-left", title: "Return", desc: "Return them anytime." },
];

function BookCard({ book, showBadge, openModal }) {
  const [borrowed, setBorrowed] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate()

  const imageUrl = `${import.meta.env.VITE_API_URL}${book.thumbnail}`;

  return (
    <div
      className="card border-0 h-100 bg-white"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hover
          ? "0 16px 32px rgba(15, 23, 42, 0.1)"
          : "0 4px 12px rgba(15, 23, 42, 0.04)",
      }}
    >

      <div
        className="position-relative overflow-hidden bg-light d-flex justify-content-center align-items-center"
        style={{ height: "240px", padding: "15px" }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(20px)",
            opacity: 0.3,
            zIndex: 0
          }}
        />

        <img
          src={imageUrl}
          alt={book.book_title || "Book Cover"}
          className="rounded shadow-sm"
          onError={(e) => {
            e.target.src = "https://placehold.co/300x450?text=No+Image";
          }}
          style={{
            height: "100%",
            width: "auto",
            maxWidth: "100%",
            objectFit: "contain",
            position: "relative",
            zIndex: 1,
            transition: "transform 0.4s ease",
            transform: hover ? "scale(1.05)" : "scale(1)",
          }}
        />
        {showBadge && (
          <span
            className="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm"
            style={{ backgroundColor: "#f59e0b", color: "#fff", zIndex: 2 }}
          >
            ✨ New
          </span>
        )}
      </div>
      <div className="card-body d-flex flex-column pt-4 px-4 pb-0">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span
            className="fw-bold text-uppercase tracking-wide"
            style={{ fontSize: "0.75rem", color: "#4f46e5", letterSpacing: "1px" }}
          >
            {book.category_name || "General"}
          </span>

          <span
            className="fw-semibold d-flex align-items-center gap-1"
            style={{ fontSize: "0.75rem", color: book.available_copies > 0 ? "#10b981" : "#ef4444" }}
          >
            <span
              style={{
                width: "8px", height: "8px", borderRadius: "50%",
                backgroundColor: book.available_copies > 0 ? "#10b981" : "#ef4444"
              }}
            ></span>
            {book.available_copies > 0 ? "Available" : "Out"}
          </span>
        </div>
        <h5
          className="fw-bold mb-1 text-truncate"
          title={book.book_title}
          style={{ color: "#0f172a" }}
        >
          {book.book_title || "Unknown Title"}
        </h5>

        <p className="text-muted small mb-3 text-truncate">
          {book.author_name || "Unknown Author"}
        </p>
      </div>

      <div className="card-footer bg-white border-0 pb-4 px-4 pt-1 d-flex gap-2">
        <button onClick={()=> navigate(`/member/books/${book.id}`)}
          className="btn rounded-pill fw-semibold border shadow-none w-50"
          style={{ color: "#475569", backgroundColor: "transparent", borderColor: "#e2e8f0" }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = "#f8fafc"; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = "transparent"; }}
        >
          Details
        </button>

        <button
          className="btn w-50 rounded-pill fw-semibold shadow-sm text-white border-0"
          disabled={book.available_copies <= 0}
          onClick={() => openModal(book)}
          style={{
            background: borrowed
              ? "#10b981"
              : book.available_copies > 0
                ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                : "#cbd5e1",
            transition: "0.3s"
          }}
        >
          {borrowed ? (
            <><i className="bi bi-check-lg me-1"></i> Added</>
          ) : (
            "Borrow"
          )}
        </button>
      </div>
    </div>
  );
}

export default function Homepage() {
  const [query, setQuery] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const { books ,getAllBooks} = useBooks();
  const [isModal, setIsModal] = useState(false)
  const [form, setForm] = useState({ note: '' })
  const { borrowRequest } = useBorrowRequest()
  const [selectedBook, setSelectedBook] = useState(null);
  const { category } = useCategory(1, { per_page: 10000 })
  const trendingBooks = books?.filter(
    (book) => book.available_copies > 0 && book.available_copies < 5
  );
  const bookCountByCategory = books.reduce((acc, book) => {
    acc[book.category_id] = (acc[book.category_id] || 0) + 1;
    return acc;
  }, {});
  const openModal = (book) => {
    form.note = ""
    setSelectedBook(book);
    setIsModal(true)
  }
  const handleBorrow = async () => {
    console.log("book id:", selectedBook?.id);
    if (!selectedBook) return;

    const payload = {
      book_id: selectedBook.id,
      note: form.note
    }
    await borrowRequest(payload)

    setIsModal(false)
    setForm({ note: "" });
    await getAllBooks()
  };
  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  useEffect(() => {
    if (selectedBook) {
      console.log("selected book_id:", selectedBook.id);
    }
  }, [selectedBook]);
  const faqs = [
    { q: "How many books can I borrow?", a: "You can borrow up to 5 books at a time with a standard account." },
    { q: "What is the borrow duration?", a: "The standard borrow duration is 14 days, with an option to renew if there are no holds." },
    { q: "Are there late fees?", a: "Yes, a small daily fee applies for overdue books to encourage timely returns." },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching: ${query}`);
  };

  return (
    <div style={{ backgroundColor: "#f8fafc" }}>
      <section
        className="d-flex align-items-center text-center text-white position-relative overflow-hidden"
        style={{
          minHeight: "75vh",
          background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
          borderRadius: "0 0 2rem 2rem",
          boxShadow: "0 10px 30px rgba(79, 70, 229, 0.15)"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 50%)",
            pointerEvents: "none"
          }}
        />

        <div className="container position-relative py-5">
          <h1
            className="fw-bolder tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.2 }}
          >
            Read without <br />
            <span style={{ color: "#cffafe" }}>limits & boundaries</span>
          </h1>

          <p className="mt-3 mx-auto" style={{ maxWidth: 520, fontSize: "1.1rem", color: "rgba(255,255,255,0.8)" }}>
            Explore thousands of books instantly from our modern digital library.
          </p>

          <form onSubmit={handleSearch} className="d-flex justify-content-center mt-5">
            <div
              className="d-flex w-100 shadow-lg"
              style={{
                maxWidth: 600,
                background: "rgba(255,255,255,0.2)",
                borderRadius: 50,
                padding: "8px",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.3)"
              }}
            >
              <input
                className="form-control border-0 bg-transparent text-white px-4 shadow-none placeholder-white"
                placeholder="Search by title, author, or genre..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ color: "white" }}
              />
              <button className="btn btn-light px-4 rounded-pill fw-bold" style={{ color: "#4f46e5" }}>
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ───────── NEW ARRIVALS ───────── */}
      <section className="container py-5 mt-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h3 className="fw-bold m-0">📦 New Arrivals</h3>
          <a href="#" className="text-decoration-none fw-medium">View All <i className="bi bi-arrow-right"></i></a>
        </div>
        <div className="row g-4">
          {books?.slice(0, 8).map((book, i) => (
            <div key={book.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <BookCard book={book} showBadge={i < 2} openModal={openModal} />
            </div>
          ))}
        </div>
      </section>

      {/* ───────── POPULAR ───────── */}
      {trendingBooks?.length > 0 && (
        <section className="container py-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <h3 className="fw-bold m-0">🔥 Trending Now</h3>
          </div>

          <div className="row g-4">
            {trendingBooks.map((book) => (
              <div key={book.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ───────── CATEGORIES ───────── */}
      <section className="container py-5">
        <h3 className="fw-bold mb-4 text-center">Browse by Category</h3>
        <div className="row g-3 justify-content-center">
          {category.map((c) => (
            <div key={c.id} className="col-6 col-md-4 col-lg-2">
              <div className="card text-center border-0 shadow-sm p-4 h-100">
                <h6 className="fw-bold">{c.category_name}</h6>
                <small className="text-muted">
                  {bookCountByCategory[c.id] || 0} books
                </small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── STEPS ───────── */}
      <section className="py-5 mt-4 bg-white">
        <div className="container text-center">
          <h3 className="fw-bold mb-5">How It Works</h3>
          <div className="row g-4">
            {STEPS.map((s) => (
              <div key={s.num} className="col-12 col-md-6 col-lg-3">
                <div className="p-4 h-100 border-0">
                  <h1 className="display-4 fw-bold text-dark mb-3">{s.num}</h1>
                  <h5 className="fw-bold mt-2">{s.title}</h5>
                  <p className="text-muted">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="container py-5 mb-5">
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          <h3 className="text-center fw-bold mb-4">Frequently Asked Questions</h3>
          <div className="accordion accordion-flush" id="faqAccordion">
            {faqs.map((f, i) => (
              <div className="accordion-item mb-3 border-0 shadow-sm rounded-4 overflow-hidden" key={i}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button fw-medium ${faqOpen === i ? "" : "collapsed"}`}
                    type="button"
                    style={{ backgroundColor: faqOpen === i ? "#f8fafc" : "#fff", boxShadow: "none" }}
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  >
                    {f.q}
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${faqOpen === i ? "show" : ""}`}>
                  <div className="accordion-body text-muted pt-0" style={{ backgroundColor: "#f8fafc" }}>
                    {f.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
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
                  src={`${import.meta.env.VITE_API_URL}${selectedBook?.thumbnail}`}
                  alt={selectedBook?.book_title}
                  className="img-fluid rounded shadow"
                  style={{
                    maxHeight: "260px",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Book Information */}
              <div className="col-md-8">
                <h4 className="fw-bold">{selectedBook?.book_title}</h4>

                <div className="row mt-3">
                  <div className="col-6 mb-2">
                    <strong>Author</strong>
                    <p className="text-muted mb-0">{selectedBook?.author_name}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>Category</strong>
                    <p className="text-muted mb-0">{selectedBook?.category_name}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>ISBN</strong>
                    <p className="text-muted mb-0">{selectedBook?.isbn}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>Edition</strong>
                    <p className="text-muted mb-0">{selectedBook?.edition}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>Published</strong>
                    <p className="text-muted mb-0">{selectedBook?.publish_year}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>Language</strong>
                    <p className="text-muted mb-0">{selectedBook?.language}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>Pages</strong>
                    <p className="text-muted mb-0">{selectedBook?.pages}</p>
                  </div>

                  <div className="col-6 mb-2">
                    <strong>Shelf</strong>
                    <p className="text-muted mb-0">{selectedBook?.shelf_location}</p>
                  </div>

                  <div className="col-12 mb-2">
                    <strong>Status</strong>
                    <span
                      className={`badge ms-2 ${selectedBook?.status === "available"
                        ? "bg-success"
                        : "bg-danger"
                        }`}
                    >
                      {selectedBook?.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <strong>Description</strong>
                  <p className="text-muted">
                    {selectedBook?.description}
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