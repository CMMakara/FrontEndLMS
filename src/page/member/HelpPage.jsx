import React, { useState, useEffect, useCallback } from "react";
import "../../assets/help.css";
const FAQ_DATA = [
  {
    category: "Borrowing",
    icon: "bi-book",
    id: "borrowing",
    items: [
      {
        q: "How do I borrow a book?",
        a: "Log in to your account, search for the book you want, click 'Borrow', and confirm your request. The system will issue a borrow ticket. You can pick up the book at the library counter by showing your membership card or QR code.",
      },
      {
        q: "How many books can I borrow at once?",
        a: "Standard members can borrow up to 3 books at a time. Premium members can borrow up to 7 books. Academic members have a limit of 10 books concurrently.",
      },
      {
        q: "How long is the borrowing period?",
        a: "The standard loan period is 14 days. Premium members enjoy 21 days. You may renew your borrow once online if no other member has reserved the same book.",
      },
    ],
  },
  {
    category: "Returning",
    icon: "bi-arrow-return-left",
    id: "returning",
    items: [
      {
        q: "What happens if I return a book late?",
        a: "A fine of $0.25 per day applies for each day past the due date. Fines accumulate until the book is returned. Accounts with outstanding fines above $5.00 are suspended from borrowing new books.",
      },
      {
        q: "Can I return a book to a different branch?",
        a: "Yes, you may return books to any of our branch libraries. The system will automatically update your account within 24 hours of the cross-branch return.",
      },
      {
        q: "What if I need more time with a book?",
        a: "You can renew a book once through your online account or by contacting the library before the due date. Renewals are not possible if another member has placed a hold on the book.",
      },
    ],
  },
  {
    category: "Fines",
    icon: "bi-exclamation-triangle",
    id: "fines",
    items: [
      {
        q: "How is the late-return fine calculated?",
        a: "Fines are calculated at $0.25 per book per day after the due date. The maximum fine per book is capped at $10.00. Fines for damaged books are assessed separately based on repair or replacement cost.",
      },
      {
        q: "Is there a discount or waiver program for fines?",
        a: "Yes! The library runs a 'Fine Amnesty Week' twice a year during which fines under $5.00 are waived. Students in financial hardship may also apply for a fine reduction through the Membership Office.",
      },
      {
        q: "How do I pay my fines?",
        a: "Fines can be paid online via the member portal, at any library counter, or through our mobile app. Accepted payment methods include credit/debit cards and cash at the front desk.",
      },
    ],
  },
  {
    category: "Membership",
    icon: "bi-person-badge",
    id: "membership",
    items: [
      {
        q: "How do I register as a new member?",
        a: "Visit the library in person with a valid ID and proof of address, or register online at our website. Fill out the membership form, choose your plan, and your card will be ready within one business day.",
      },
      {
        q: "What membership plans are available?",
        a: "We offer Standard (free), Premium ($5/month), and Academic (verified students/staff, free) plans. Each plan has different borrowing limits and access privileges.",
      },
      {
        q: "How do I upgrade or cancel my membership?",
        a: "You can manage your membership tier from your online profile under 'Account Settings'. Upgrades take effect immediately; cancellations are processed at the end of the current billing cycle.",
      },
    ],
  },
  {
    category: "System / Login",
    icon: "bi-laptop",
    id: "system",
    items: [
      {
        q: "I forgot my password. How do I reset it?",
        a: "Click 'Forgot Password' on the login page and enter your registered email. You'll receive a password reset link within 2 minutes. Check your spam folder if it doesn't arrive.",
      },
      {
        q: "Why is my account locked?",
        a: "Accounts are locked after 5 consecutive failed login attempts (security measure), or if outstanding fines exceed $5.00. Contact library support to unlock your account.",
      },
      {
        q: "Can I access the library system from my phone?",
        a: "Yes, our library system is fully responsive and works on all modern browsers. We also offer a dedicated mobile app for iOS and Android available in their respective app stores.",
      },
    ],
  },
];

const ANNOUNCEMENTS = [
  {
    icon: "bi-calendar-x",
    color: "#fee2e2",
    iconColor: "#dc2626",
    title: "Library Closed on National Holiday",
    text: "The library will be closed on July 4th for the national holiday. All due dates falling on that day are extended by one day.",
    date: "Jun 28, 2025",
    type: "warning",
  },
  {
    icon: "bi-book-half",
    color: "#d1fae5",
    iconColor: "#059669",
    title: "New Books Added This Week",
    text: "Over 120 new titles across Science, Fiction, and Technology have been added to the catalog. Browse the 'New Arrivals' section in your account.",
    date: "Jun 25, 2025",
    type: "success",
  },
  {
    icon: "bi-gear",
    color: "#fef3c7",
    iconColor: "#d97706",
    title: "Scheduled System Maintenance",
    text: "The system will undergo maintenance on June 30, 2025 from 2:00 AM – 4:00 AM. Some features may be temporarily unavailable during this window.",
    date: "Jun 24, 2025",
    type: "info",
  },
  {
    icon: "bi-tag",
    color: "#ede9fe",
    iconColor: "#7c3aed",
    title: "Fine Discount Campaign – July 2025",
    text: "All fines under $5.00 will be waived during Fine Amnesty Week, July 7–14, 2025. Visit any branch counter or clear them online.",
    date: "Jun 20, 2025",
    type: "primary",
  },
];

const DOWNLOADS = [
  { name: "Library Rules & Regulations", desc: "PDF • Updated Jun 2025", icon: "bi-file-earmark-text" },
  { name: "Membership Guide", desc: "PDF • All plan details inside", icon: "bi-person-lines-fill" },
  { name: "Borrowing Guide", desc: "PDF • Step-by-step borrow process", icon: "bi-book" },
  { name: "Fine Policy Document", desc: "PDF • Rates, waivers & appeals", icon: "bi-receipt" },
];

const SCHEDULE = [
  { day: "Monday", time: "8:00 AM – 6:00 PM" },
  { day: "Tuesday", time: "8:00 AM – 6:00 PM" },
  { day: "Wednesday", time: "8:00 AM – 6:00 PM" },
  { day: "Thursday", time: "8:00 AM – 6:00 PM" },
  { day: "Friday", time: "8:00 AM – 6:00 PM" },
  { day: "Saturday", time: "9:00 AM – 4:00 PM" },
  { day: "Sunday", time: "Closed" },
];

const STEPS = [
  { icon: "bi-search", label: "Search Book", desc: "Find by title, author, or ISBN" },
  { icon: "bi-card-list", label: "Select Book", desc: "View details and availability" },
  { icon: "bi-send", label: "Issue Request", desc: "Submit your borrow request" },
  { icon: "bi-check-circle", label: "Confirm Borrow", desc: "Get your borrow ticket" },
  { icon: "bi-arrow-return-left", label: "Return Book", desc: "Return before the due date" },
];

const POLICIES = [
  {
    icon: "bi-calendar-check",
    color: "#d1fae5",
    iconColor: "#059669",
    title: "Return Policy",
    points: [
      "Books must be returned before or on the due date",
      "Cross-branch returns accepted",
      "One renewal allowed per loan period",
    ],
  },
  {
    icon: "bi-clock-history",
    color: "#fee2e2",
    iconColor: "#dc2626",
    title: "Fine Policy",
    points: [
      "$0.25 per book per day overdue",
      "Maximum fine capped at $10.00 per book",
      "Accounts suspended at $5.00 outstanding",
    ],
  },
  {
    icon: "bi-exclamation-diamond",
    color: "#fef3c7",
    iconColor: "#d97706",
    title: "Damage Policy",
    points: [
      "Minor damage: assessed repair fee",
      "Major damage: partial replacement cost",
      "Report damage at return to avoid full charge",
    ],
  },
  {
    icon: "bi-archive",
    color: "#ede9fe",
    iconColor: "#7c3aed",
    title: "Lost Book Policy",
    points: [
      "Report lost books immediately",
      "Full replacement cost charged",
      "Processing fee: $2.00 per lost report",
    ],
  },
];

const SUPPORT_ACTIONS = [
  {
    icon: "bi-chat-dots",
    color: "#d1fae5",
    iconColor: "#059669",
    title: "Live Chat Support",
    desc: "Chat with a librarian in real time. Available Mon–Fri, 9 AM–5 PM.",
    btn: "Start Chat",
  },
  {
    icon: "bi-ticket-detailed",
    color: "#dbeafe",
    iconColor: "#2563eb",
    title: "Submit a Ticket",
    desc: "Describe your issue and our team will respond within 24 hours.",
    btn: "Open Ticket",
  },
  {
    icon: "bi-telephone",
    color: "#fef3c7",
    iconColor: "#d97706",
    title: "Call the Library",
    desc: "Speak directly with staff. Call +855 23 456 789 during opening hours.",
    btn: "Call Now",
  },
  {
    icon: "bi-envelope",
    color: "#ede9fe",
    iconColor: "#7c3aed",
    title: "Email Support",
    desc: "Send us a detailed message at support@library.gov.kh.",
    btn: "Send Email",
  },
  {
    icon: "bi-flag",
    color: "#fee2e2",
    iconColor: "#dc2626",
    title: "Report a Problem",
    desc: "Found a system bug or content issue? Report it and help us improve.",
    btn: "Report",
  },
];

function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="highlight">{part}</mark> : part
  );
}

function getCurrentDay() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

function isLibraryOpen() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  if (day === 0) return false; // Sunday
  if (day === 6) return hour >= 9 && hour < 16; // Saturday
  return hour >= 8 && hour < 18; // Mon–Fri
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [liveSearch, setLiveSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [priority, setPriority] = useState("Medium");
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeUsers] = useState(Math.floor(Math.random() * 80) + 40);
  const [pendingRequests] = useState(Math.floor(Math.random() * 20) + 5);

  const today = getCurrentDay();
  const libraryOpen = isLibraryOpen();

  const allFAQs = FAQ_DATA.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, category: cat.category, icon: cat.icon }))
  );

  const searchResults = liveSearch.length >= 2
    ? allFAQs.filter(
        (item) =>
          item.q.toLowerCase().includes(liveSearch.toLowerCase()) ||
          item.a.toLowerCase().includes(liveSearch.toLowerCase())
      )
    : [];

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setLiveSearch(tag);
    document.getElementById("faq-search-results")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = () => {
    setLiveSearch(searchQuery);
    if (searchQuery.length >= 2) {
      document.getElementById("faq-search-results")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Full name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      e.email = "A valid email address is required.";
    if (!formData.subject) e.subject = "Please choose a subject.";
    if (!formData.message.trim() || formData.message.length < 10)
      e.message = "Please write a message of at least 10 characters.";
    return e;
  };

  const handleSubmit = () => {
    const e = validateForm();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setShowToast(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setPriority("Medium");
      setTimeout(() => setShowToast(false), 4000);
    }, 1800);
  };

  return (
    <div className="help-page" style={{marginTop : '60px'}}>

      {/* Toast */}
      {showToast && (
        <div className="toast-container-custom">
          <div className="toast-custom">
            <i className="bi bi-check-circle-fill" />
            <span>Message sent! We'll reply within 24 hours.</span>
          </div>
        </div>
      )}

      {/* ======= HERO ======= */}
      <section className="help-hero">
        <div className="container text-center position-relative">
          <div className="hero-badge">
            <i className="bi bi-headset" /> Support Center
          </div>
          <h1>Help Center</h1>
          <p>Find answers, get support, and learn how to use the library system.</p>

          <div className="help-search-wrap">
            <i className="bi bi-search search-icon-pos" />
            <input
              type="text"
              placeholder="Search for answers… e.g. 'How to borrow a book'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>

          <div className="popular-tags">
            <span>Popular:</span>
            {["Borrow", "Return", "Fine", "Membership", "Login", "Account"].map((tag) => (
              <span key={tag} className="tag-chip" onClick={() => handleTagClick(tag)}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ======= SECTION 1: QUICK SUPPORT ======= */}
      <section className="section-block">
        <div className="container">
          <div className="text-center mb-4">
            <div className="section-eyebrow">Get Help Fast</div>
            <h2 className="display-5">Quick Support Actions</h2>
            <p >Choose the fastest way to get help from our team.</p>
          </div>
          <div className="row g-3 justify-content-center">
            {SUPPORT_ACTIONS.map((s) => (
              <div key={s.title} className="col-6 col-md-4 col-lg">
                <div className="support-card">
                  <div className="card-icon-wrap" style={{ background: s.color }}>
                    <i className={`bi ${s.icon}`} style={{ color: s.iconColor }} />
                  </div>
                  <h6>{s.title}</h6>
                  <p>{s.desc}</p>
                  <button className="btn-action">{s.btn}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= SECTION 10: SEARCH RESULTS (shown when search active) ======= */}
      {liveSearch.length >= 2 && (
        <section className="section-block" id="faq-search-results">
          <div className="container">
            <div className="text-center mb-4">
              <div className="section-eyebrow">Search Results</div>
              <h2 className="section-title">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{liveSearch}"
              </h2>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="search-results-panel">
                  {searchResults.length === 0 ? (
                    <div className="no-results">
                      <i className="bi bi-search d-block" />
                      <h5 style={{ color: "#1F2937", fontWeight: 700 }}>No results found</h5>
                      <p style={{ color: "#64748B", fontSize: 14 }}>
                        Try different keywords, or{" "}
                        <span style={{ color: "#00C18F", cursor: "pointer", fontWeight: 600 }}
                          onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}>
                          contact support
                        </span>{" "}
                        for help.
                      </p>
                    </div>
                  ) : (
                    searchResults.map((item, i) => (
                      <div key={i} className="result-item">
                        <div className="result-category">{item.category}</div>
                        <h6>{highlightText(item.q, liveSearch)}</h6>
                        <p>{highlightText(item.a.slice(0, 120) + "…", liveSearch)}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======= SECTION 2: FAQ ======= */}
      <section className="section-block faq-section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-eyebrow">FAQ</div>
            <h2 className="display-5">Questions and Answers</h2>
            <p>Frequently asked questions, grouped by topic.</p>
          </div>
          <div className="row g-4">
            {FAQ_DATA.map((cat) => (
              <div key={cat.id} className="col-12 col-lg-6">
                <div className="faq-category-label">
                  <i className={`bi ${cat.icon}`} />
                  {cat.category}
                </div>
                <div className="accordion" id={`acc-${cat.id}`}>
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${idx !== 0 ? "collapsed" : ""}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#${cat.id}-${idx}`}
                        >
                          {item.q}
                        </button>
                      </h2>
                      <div
                        id={`${cat.id}-${idx}`}
                        className={`accordion-collapse collapse ${idx === 0 ? "show" : ""}`}
                        data-bs-parent={`#acc-${cat.id}`}
                      >
                        <div className="accordion-body">{item.a}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= SECTION 3: CONTACT FORM ======= */}
      <section className="section-block" id="contact-form">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="text-center mb-4">
                <div className="section-eyebrow">Direct Support</div>
                <h2 className="text-center display-5">Contact Support Team</h2>
                <p className="text-center">We typically respond within one business day.</p>
              </div>
              <div className="contact-form-card">
                <div className="row gy-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+855 xx xxx xxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Subject *</label>
                    <select
                      className={`form-select ${errors.subject ? "is-invalid" : ""}`}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="">Select a subject…</option>
                      <option>Borrow Issue</option>
                      <option>Return Issue</option>
                      <option>Fine</option>
                      <option>Technical Problem</option>
                      <option>Account & Membership</option>
                    </select>
                    {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Priority Level</label>
                    <div className="priority-selector">
                      {["Low", "Medium", "High"].map((p) => (
                        <button
                          key={p}
                          className={`priority-btn ${priority === p ? `active-${p.toLowerCase()}` : ""}`}
                          onClick={() => setPriority(p)}
                          type="button"
                        >
                          {p === "Low" && <i className="bi bi-arrow-down me-1" />}
                          {p === "Medium" && <i className="bi bi-dash me-1" />}
                          {p === "High" && <i className="bi bi-arrow-up me-1" />}
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Message *</label>
                    <textarea
                      className={`form-control ${errors.message ? "is-invalid" : ""}`}
                      rows={5}
                      placeholder="Describe your issue in detail…"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                  </div>
                  <div className="col-12 text-center mt-2">
                    <button
                      className="btn-primary-custom"
                      onClick={handleSubmit}
                      disabled={sending}
                      type="button"
                    >
                      {sending ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send" /> Send Message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= SECTION 4: ABOUT ======= */}
      <section className="section-block">
        <div className="container">
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <div className="section-eyebrow">About Us</div>
              <h2 className="section-title">Digital Library<br/>Management System</h2>
              <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.8 }}>
                Our Library Management System (LMS) is a modern digital platform designed to streamline
                all library operations — from cataloging and borrowing to fines and member management.
                Built for efficiency, transparency, and ease of use.
              </p>
              <div className="mt-3 p-3" style={{ background: "#f0fdf9", borderRadius: 12, borderLeft: "4px solid #00C18F" }}>
                <p style={{ margin: 0, fontSize: 14, color: "#065f46", fontWeight: 500 }}>
                  <strong>Mission:</strong> To provide every community member with seamless, equitable access
                  to knowledge through technology-driven library services.
                </p>
              </div>
              <div className="mt-2 p-3" style={{ background: "#f0f9ff", borderRadius: 12, borderLeft: "4px solid #2563eb" }}>
                <p style={{ margin: 0, fontSize: 14, color: "#1e3a8a", fontWeight: 500 }}>
                  <strong>Vision:</strong> A fully connected library ecosystem where knowledge is accessible
                  to everyone, anytime, anywhere.
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="row gy-3">
                {[
                  { icon: "bi-display", title: "Digital Library Management", desc: "Manage your entire catalog, members, and operations through one unified digital dashboard." },
                  { icon: "bi-lightning-charge", title: "Fast Borrow & Return", desc: "Issue and process borrow/return transactions in seconds with QR code scanning." },
                  { icon: "bi-calculator", title: "Automatic Fine Calculation", desc: "Fines are calculated and billed automatically — no manual tracking required." },
                ].map((box) => (
                  <div key={box.title} className="col-12">
                    <div className="highlight-box">
                      <i className={`bi ${box.icon}`} />
                      <div>
                        <h6>{box.title}</h6>
                        <p>{box.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= SECTION 5: HOURS + STATUS ======= */}
      <section className="section-block">
        <div className="container">
          <div className="row g-4">
            {/* Hours */}
            <div className="col-lg-5">
              <div className="section-eyebrow">Visit Us</div>
              <h2 className="section-title mb-4">Operating Hours</h2>
              <div className="hours-card">
                <div className="hours-header">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Library Status</div>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>
                        {libraryOpen ? "We're Open" : "Currently Closed"}
                      </div>
                    </div>
                    <span className={`status-badge ${libraryOpen ? "open" : "closed"}`}>
                      <span className="status-dot" />
                      {libraryOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>
                {SCHEDULE.map((row) => (
                  <div key={row.day} className={`hours-row ${row.day === today ? "today" : ""}`}>
                    <span className="day-name">
                      {row.day === today && <i className="bi bi-arrow-right-short" style={{ color: "#00C18F" }} />}
                      {row.day}
                      {row.day === today && (
                        <span style={{ fontSize: 10, fontWeight: 700, background: "#00C18F", color: "#fff", padding: "1px 7px", borderRadius: 50, marginLeft: 6 }}>Today</span>
                      )}
                    </span>
                    <span className="time-text">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="col-lg-7">
              <div className="section-eyebrow">Live Stats</div>
              <h2 className="section-title mb-4">System Status Panel</h2>
              <div className="row gy-3">
                {[
                  { icon: "bi-server", label: "System Status", value: "Online", indicator: true },
                  { icon: "bi-database-check", label: "Database Status", value: "Stable", indicator: true },
                  { icon: "bi-people", label: "Active Users Now", value: `${activeUsers}`, indicator: true },
                  { icon: "bi-clipboard-check", label: "Pending Requests", value: `${pendingRequests}`, indicator: false, yellow: true },
                ].map((s) => (
                  <div key={s.label} className="col-sm-6">
                    <div className="status-card">
                      <div className={`status-indicator ${s.yellow ? "yellow" : ""}`} />
                      <div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                      </div>
                      <i className={`bi ${s.icon} ms-auto`} style={{ fontSize: "1.5rem", color: "#e5e7eb" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Announcements (inside same col) */}
              <div className="mt-4">
                <div className="section-eyebrow">Latest News</div>
                <h4 style={{ fontWeight: 800, color: "#1F2937", marginBottom: 16, letterSpacing: "-0.01em" }}>Announcements</h4>
                {ANNOUNCEMENTS.map((a) => (
                  <div key={a.title} className="announcement-card">
                    <div className="announcement-icon" style={{ background: a.color }}>
                      <i className={`bi ${a.icon}`} style={{ color: a.iconColor }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h6>{a.title}</h6>
                      <p className="text-truncate">{a.text}</p>
                    </div>
                    <span className="date-tag">{a.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= SECTION 6: BORROWING GUIDE ======= */}
      <section className="section-block">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-eyebrow">How It Works</div>
            <h2 className="display-5">Borrowing Guide</h2>
            <p>Five simple steps from search to return.</p>
          </div>
          <div className="steps-timeline">
            {STEPS.map((step, i) => (
              <div key={step.label} className="step-item">
                <div className="step-number">
                  <i className={`bi ${step.icon}`} />
                </div>
                <div className="step-label">{step.label}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= SECTION 7: POLICIES ======= */}
      <section className="section-block">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-eyebrow">Policies</div>
            <h2 className="display-5">Return & Fine Policy</h2>
            <p>Know your responsibilities as a borrower.</p>
          </div>
          <div className="row gy-3">
            {POLICIES.map((p) => (
              <div key={p.title} className="col-sm-6 col-lg-3">
                <div className="policy-card">
                  <div className="policy-icon" style={{ background: p.color }}>
                    <i className={`bi ${p.icon}`} style={{ color: p.iconColor }} />
                  </div>
                  <h6 style={{ fontWeight: 800, fontSize: 15, color: "#1F2937", marginBottom: 12 }}>{p.title}</h6>
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {p.points.map((pt) => (
                      <li key={pt} style={{ fontSize: 13, color: "#64748B", marginBottom: 6, lineHeight: 1.5 }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= SECTION 11 & 12: MAP + DOWNLOADS ======= */}
      <section className="section-block">
        <div className="container">
          <div className="row g-4">
            {/* Map */}
            <div className="col-lg-5">
              <div className="section-eyebrow">Find Us</div>
              <h2 className="section-title mb-3">Library Location</h2>
              <div className="map-placeholder">
                <i className="bi bi-pin-map-fill" />
                <p style={{ fontWeight: 600 }}>National Library of Cambodia</p>
                <p>Street 92, Sangkat Wat Phnom,<br/>Phnom Penh, Cambodia</p>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button className="btn-primary-custom" style={{ flex: 1, justifyContent: "center" }}>
                  <i className="bi bi-map" /> Get Directions
                </button>
                <button style={{ flex: 1, border: "1.5px solid #E5E7EB", borderRadius: 50, background: "transparent", fontWeight: 600, fontSize: 14, color: "#1F2937", padding: "12px 20px" }}>
                  <i className="bi bi-share me-2" />Share Location
                </button>
              </div>
            </div>

            {/* Downloads */}
            <div className="col-lg-7">
              <div className="section-eyebrow">Resources</div>
              <h2 className="section-title mb-3">Downloads & Resources</h2>
              <div className="d-flex flex-column gap-2">
                {DOWNLOADS.map((d) => (
                  <div key={d.name} className="download-card">
                    <div className="dl-icon">
                      <i className={`bi ${d.icon}`} />
                    </div>
                    <div className="dl-info">
                      <h6>{d.name}</h6>
                      <p>{d.desc}</p>
                    </div>
                    <button className="dl-btn">
                      <i className="bi bi-download me-1" /> Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}