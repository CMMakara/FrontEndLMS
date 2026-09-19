import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import "../../assets/Dashbord.css";
import useBooks from "../../hook/useBooks";
import useAuthor from "../../hook/useAuthor";
import useCategory from "../../hook/useCategory";
import usePublishers from "../../hook/usePublishers";
import useUser from "../../hook/useUsers";
import useBorrow from "../../hook/useBorrow";
import useBorrowRequest from "../../hook/useBorrowRequest";

/* ─────────────────────────────────────────
    HELPERS
───────────────────────────────────────── */
const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatTimeAgo(dateStr) {
  if (!dateStr) return "recently";
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${Math.max(1, diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ─────────────────────────────────────────
    SUB-COMPONENT: MODERN STAT CARD
───────────────────────────────────────── */
function ModernStatCard({ title, value, subtext, icon, color = "#4f46e5", bgLight, linkTo, badgeText, badgeVariant = "primary" }) {
  const content = (
    <div
      className="card border-0 rounded-4 h-100 bg-white position-relative overflow-hidden"
      style={{
        padding: "22px 20px",
        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)",
        border: "1px solid #e2e8f0",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: linkTo ? "pointer" : "default",
        background: "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
      }}
      onMouseEnter={(e) => {
        if (linkTo) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = `0 14px 28px -6px rgba(15, 23, 42, 0.09), 0 4px 14px ${color}20`;
          e.currentTarget.style.borderColor = `${color}40`;
        }
      }}
      onMouseLeave={(e) => {
        if (linkTo) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)";
          e.currentTarget.style.borderColor = "#e2e8f0";
        }
      }}
    >
      {/* Decorative ambient radial wash */}
      <div
        className="position-absolute top-0 end-0 pointer-events-none"
        style={{
          width: "90px",
          height: "90px",
          background: `radial-gradient(circle, ${color}16 0%, transparent 70%)`,
          transform: "translate(25%, -25%)",
          borderRadius: "50%",
        }}
      />

      {/* Top row: Padded Icon & Badge */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-xs"
          style={{
            width: "50px",
            height: "50px",
            padding: "12px",
            background: bgLight || `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
            color: color,
            border: `1px solid ${color}28`,
            borderRadius: "14px",
          }}
        >
          <i className={`bi ${icon} fs-5`}></i>
        </div>

        <div className="d-flex align-items-center gap-1.5">
          {badgeText && (
            <span
              className="badge rounded-pill fw-semibold px-2.5 py-1"
              style={{
                fontSize: "11px",
                backgroundColor: `${color}14`,
                color: color,
                border: `1px solid ${color}30`,
              }}
            >
              {badgeText}
            </span>
          )}
          {linkTo && (
            <i
              className="bi bi-arrow-up-right text-muted opacity-50"
              style={{ fontSize: "11px" }}
            ></i>
          )}
        </div>
      </div>

      {/* Title & Value */}
      <div>
        <span
          className="text-muted text-uppercase fw-semibold d-block mb-1"
          style={{ fontSize: "11px", letterSpacing: "0.5px" }}
        >
          {title}
        </span>
        <h3
          className="fw-bold mb-0 text-dark"
          style={{ fontSize: "1.75rem", letterSpacing: "-0.5px", lineHeight: "1.2" }}
        >
          {value}
        </h3>
      </div>

      {/* Bottom Subtext with Dot Indicator */}
      <div
        className="d-flex align-items-center gap-1.5 mt-3 pt-2.5 border-top text-truncate"
        style={{ borderColor: "#f1f5f9" }}
      >
        <span
          className="d-inline-block rounded-circle flex-shrink-0"
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}80`,
          }}
        />
        <span
          className="text-muted small text-truncate"
          style={{ fontSize: "12px", fontWeight: "500" }}
          title={subtext}
        >
          {subtext}
        </span>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="text-decoration-none col-12 col-sm-6 col-lg-4 col-xxl-2">
        {content}
      </Link>
    );
  }

  return <div className="col-12 col-sm-6 col-lg-4 col-xxl-2">{content}</div>;
}

/* ─────────────────────────────────────────
    MAIN COMPONENT: DashboardAdmin
───────────────────────────────────────── */
export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Hook Data
  const { books = [], getAllBooks } = useBooks();
  const { author = [], getAllAuthor } = useAuthor({ all: true, per_page: 1000 });
  const { category = [], fetchGetAllCategory } = useCategory(1, { all: true, per_page: 1000 });
  const { publishers = [], getAllPublishers } = usePublishers();
  const { users = [], getAllUsers } = useUser(1, 1000);
  const { borrow = [], getAllBorrowRecord } = useBorrow();
  const { borrowsRequest = [], getAllBorrowRequest } = useBorrowRequest({ perPage: 1000 });

  // Canvas Refs
  const categoryChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const topBooksChartRef = useRef(null);
  const chartInstances = useRef({});

  // Initial Data Fetch
  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        getAllBooks ? getAllBooks() : Promise.resolve(),
        getAllAuthor ? getAllAuthor() : Promise.resolve(),
        fetchGetAllCategory ? fetchGetAllCategory() : Promise.resolve(),
        getAllPublishers ? getAllPublishers() : Promise.resolve(),
        getAllUsers ? getAllUsers() : Promise.resolve(),
        getAllBorrowRecord ? getAllBorrowRecord("", 1, 1000) : Promise.resolve(),
        getAllBorrowRequest ? getAllBorrowRequest() : Promise.resolve(),
      ]);
    } catch (err) {
      console.error("Dashboard refresh error:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  /* ─────────────────────────────────────────
      COMPUTED METRICS
  ───────────────────────────────────────── */
  const totalBooksCount = books.length;
  const availableCopies = books.reduce((sum, b) => sum + (Number(b.available_copies) || 0), 0);
  const totalCopies = books.reduce((sum, b) => sum + (Number(b.total_copies) || 0), 0);

  const activeBorrows = useMemo(() => {
    return borrow.filter((b) => b.status?.toLowerCase() === "borrowed");
  }, [borrow]);

  const overdueBorrows = useMemo(() => {
    const now = new Date();
    return borrow.filter((b) => {
      if (b.status?.toLowerCase() === "returned") return false;
      if (!b.due_date) return false;
      return new Date(b.due_date) < now;
    });
  }, [borrow]);

  const pendingRequests = useMemo(() => {
    if (!Array.isArray(borrowsRequest)) return [];
    return borrowsRequest.filter((r) => r.status?.toLowerCase() === "pending");
  }, [borrowsRequest]);

  const membersCount = useMemo(() => {
    return users.filter((u) => u.role?.toLowerCase() === "member").length;
  }, [users]);

  const librariansCount = useMemo(() => {
    return users.filter((u) => u.role?.toLowerCase() === "librarian").length;
  }, [users]);

  const totalFinesKHR = useMemo(() => {
    return borrow.reduce((sum, b) => sum + (Number(b.fine) || 0), 0);
  }, [borrow]);
  const totalFinesUSD = (totalFinesKHR / 4100).toFixed(2);

  /* ─────────────────────────────────────────
      CHART 1: CATEGORY DISTRIBUTION
  ───────────────────────────────────────── */
  const categoryData = useMemo(() => {
    const counts = {};
    books.forEach((b) => {
      const cat = b.category_name || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const labels = sorted.map(([k]) => k);
    const data = sorted.map(([, v]) => v);

    const colors = [
      "#4f46e5", // Indigo
      "#06b6d4", // Cyan
      "#10b981", // Emerald
      "#f59e0b", // Amber
      "#ec4899", // Pink
      "#8b5cf6", // Purple
    ];

    return {
      labels: labels.length ? labels : ["General"],
      data: data.length ? data : [1],
      colors: colors.slice(0, Math.max(1, labels.length)),
    };
  }, [books]);

  /* ─────────────────────────────────────────
      CHART 2: MONTHLY BORROW VS RETURN TREND
  ───────────────────────────────────────── */
  const monthlyTrendData = useMemo(() => {
    const borrowedByMonth = Array(12).fill(0);
    const returnedByMonth = Array(12).fill(0);

    borrow.forEach((item) => {
      if (item.borrow_date) {
        const m = new Date(item.borrow_date).getMonth();
        if (m >= 0 && m < 12) borrowedByMonth[m]++;
      }
      if (item.return_date) {
        const m = new Date(item.return_date).getMonth();
        if (m >= 0 && m < 12) returnedByMonth[m]++;
      }
    });

    return { borrowedByMonth, returnedByMonth };
  }, [borrow]);

  /* ─────────────────────────────────────────
      CHART 3: TOP CIRCULATED BOOKS
  ───────────────────────────────────────── */
  const topCirculatedBooks = useMemo(() => {
    const counts = {};
    borrow.forEach((b) => {
      const title = b.book_title || "Unknown Book";
      counts[title] = (counts[title] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sorted.length ? sorted.map(([k]) => k) : ["No Borrow History"],
      data: sorted.length ? sorted.map(([, v]) => v) : [0],
    };
  }, [borrow]);

  /* ─────────────────────────────────────────
      CHART.JS RENDERING EFFECT
  ───────────────────────────────────────── */
  useEffect(() => {
    // Clean up existing chart instances
    Object.values(chartInstances.current).forEach((c) => c && c.destroy());
    chartInstances.current = {};

    const gridStyle = { color: "#f1f5f9", drawBorder: false };
    const tickStyle = { color: "#94a3b8", font: { size: 11, family: "'Outfit', sans-serif" } };

    // 1. Category Doughnut Chart
    if (categoryChartRef.current) {
      chartInstances.current.category = new Chart(categoryChartRef.current, {
        type: "doughnut",
        data: {
          labels: categoryData.labels,
          datasets: [
            {
              data: categoryData.data,
              backgroundColor: categoryData.colors,
              borderWidth: 2,
              borderColor: "#ffffff",
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.label}: ${ctx.raw} volumes`,
              },
            },
          },
        },
      });
    }

    // 2. Trend Line Chart
    if (trendChartRef.current) {
      chartInstances.current.trend = new Chart(trendChartRef.current, {
        type: "line",
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: "Borrowed",
              data: monthlyTrendData.borrowedByMonth,
              borderColor: "#4f46e5",
              backgroundColor: "rgba(79, 70, 229, 0.08)",
              borderWidth: 2.5,
              tension: 0.4,
              fill: true,
              pointRadius: 3,
              pointHoverRadius: 6,
            },
            {
              label: "Returned",
              data: monthlyTrendData.returnedByMonth,
              borderColor: "#10b981",
              borderDash: [5, 5],
              borderWidth: 2,
              tension: 0.4,
              fill: false,
              pointRadius: 2,
              pointHoverRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: { grid: { display: false }, ticks: tickStyle },
            y: {
              beginAtZero: true,
              grid: gridStyle,
              ticks: { ...tickStyle, precision: 0 },
            },
          },
        },
      });
    }

    // 3. Top Circulated Books Bar Chart
    if (topBooksChartRef.current) {
      chartInstances.current.topBooks = new Chart(topBooksChartRef.current, {
        type: "bar",
        data: {
          labels: topCirculatedBooks.labels,
          datasets: [
            {
              label: "Loan Frequency",
              data: topCirculatedBooks.data,
              backgroundColor: "#06b6d4",
              borderRadius: 6,
              barThickness: 14,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: gridStyle,
              ticks: { ...tickStyle, precision: 0 },
            },
            y: {
              grid: { display: false },
              ticks: {
                ...tickStyle,
                callback: function (val, index) {
                  const lbl = this.getLabelForValue(val);
                  return lbl.length > 20 ? lbl.slice(0, 18) + "..." : lbl;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      Object.values(chartInstances.current).forEach((c) => c && c.destroy());
    };
  }, [categoryData, monthlyTrendData, topCirculatedBooks]);

  /* ─────────────────────────────────────────
      LATEST ACTIVITY TIMELINE
  ───────────────────────────────────────── */
  const recentActivities = useMemo(() => {
    const list = [];

    // From borrow records
    borrow.forEach((b) => {
      if (b.borrow_date) {
        list.push({
          id: `borrow-${b.id || Math.random()}`,
          icon: "bi-journal-plus",
          color: "#4f46e5",
          bg: "#eef2ff",
          text: (
            <span>
              <b>{b.member_name || "Member"}</b> borrowed{" "}
              <span className="text-dark fw-semibold">"{b.book_title}"</span>
            </span>
          ),
          date: new Date(b.borrow_date),
        });
      }
      if (b.return_date) {
        list.push({
          id: `return-${b.id || Math.random()}`,
          icon: "bi-journal-check",
          color: "#10b981",
          bg: "#ecfdf5",
          text: (
            <span>
              <b>{b.member_name || "Member"}</b> returned{" "}
              <span className="text-dark fw-semibold">"{b.book_title}"</span>
            </span>
          ),
          date: new Date(b.return_date),
        });
      }
    });

    // From pending requests
    if (Array.isArray(borrowsRequest)) {
      borrowsRequest.slice(0, 5).forEach((r) => {
        list.push({
          id: `req-${r.id || Math.random()}`,
          icon: "bi-hourglass-split",
          color: "#f59e0b",
          bg: "#fffbeb",
          text: (
            <span>
              Borrow request for{" "}
              <span className="text-dark fw-semibold">"{r.book_title}"</span> ({r.status || "Pending"})
            </span>
          ),
          date: new Date(r.created_at || Date.now()),
        });
      });
    }

    return list
      .sort((a, b) => b.date - a.date)
      .slice(0, 6);
  }, [borrow, borrowsRequest]);

  return (
    <div className="container-fluid px-3 px-lg-4 py-3 min-vh-100" style={{ backgroundColor: "#f8fafc" }}>
      {/* ─────────────────────────────────────────
          EXECUTIVE HERO HEADER
      ───────────────────────────────────────── */}
      <div
        className="card border-0 rounded-4 p-4 mb-4 bg-white shadow-sm"
        style={{
          border: "1px solid #e2e8f0",
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3.5">
            {/* Header Icon with generous padding */}
            <div
              className="rounded-4 d-flex align-items-center justify-content-center p-3 flex-shrink-0 shadow"
              style={{
                width: "60px",
                height: "60px",
                padding: "14px",
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                color: "#ffffff",
                boxShadow: "0 8px 22px rgba(79, 70, 229, 0.25)",
              }}
            >
              <i className="bi bi-speedometer2 fs-2"></i>
            </div>

            <div>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                <h3 className="fw-bold text-dark mb-0 ms-3" style={{ letterSpacing: "-0.5px" }}>
                  Administrator Dashboard
                </h3>
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 small fw-semibold d-inline-flex align-items-center gap-1.5">
                  <span
                    className="d-inline-block rounded-circle bg-success"
                    style={{ width: "6px", height: "6px" }}
                  />
                  Live System
                </span>
              </div>
              <p className="text-muted small mb-0 ms-3">
                Real-time library statistics, catalog circulation, and administrative control.
              </p>
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            <div className="bg-light border rounded-pill px-3 py-2 text-muted small shadow-xs d-none d-md-flex align-items-center gap-2">
              <i className="bi bi-calendar3 text-primary"></i>
              <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
            </div>

            <button
              type="button"
              className="btn btn-white bg-white border shadow-xs rounded-pill px-3 py-2 text-secondary d-inline-flex align-items-center gap-1.5 fw-medium small"
              onClick={refreshAllData}
              disabled={isRefreshing}
            >
              <i className={`bi bi-arrow-clockwise ${isRefreshing ? "spin-animation" : ""}`}></i>
              <span>{isRefreshing ? "Updating..." : "Refresh Stats"}</span>
            </button>

            <Link
              to="/admin/books"
              className="btn text-white rounded-pill px-3.5 py-2 shadow-sm d-inline-flex align-items-center gap-1.5 fw-semibold small"
              style={{ background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)", border: "none" }}
            >
              <i className="bi bi-plus-lg"></i>
              <span>Add Book</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          6 EXECUTIVE KPI METRIC TILES
      ───────────────────────────────────────── */}
      <div className="row gy-3 mb-4">
        {/* 1. Total Books */}
        <ModernStatCard
          title="Total Catalog"
          value={totalBooksCount}
          subtext={`${availableCopies} in stock • ${totalCopies} total copies`}
          icon="bi-book-half"
          color="#4f46e5"
          bgLight="#eef2ff"
          linkTo="/admin/books"
          badgeText="Catalog"
          badgeVariant="primary"
        />

        {/* 2. Active Loans */}
        <ModernStatCard
          title="Active Loans"
          value={activeBorrows.length}
          subtext={`${overdueBorrows.length} currently overdue`}
          icon="bi-journal-check"
          color="#10b981"
          bgLight="#ecfdf5"
          badgeText="Borrowing"
          badgeVariant="success"
        />

        {/* 3. Registered Users */}
        <ModernStatCard
          title="Users & Staff"
          value={users.length}
          subtext={`${membersCount} Members • ${librariansCount} Staff`}
          icon="bi-people-fill"
          color="#06b6d4"
          bgLight="#ecfeff"
          linkTo="/admin/users"
          badgeText="Accounts"
          badgeVariant="info"
        />

        {/* 4. Pending Requests */}
        <ModernStatCard
          title="Pending Requests"
          value={pendingRequests.length}
          subtext="Awaiting desk review"
          icon="bi-hourglass-split"
          color="#f59e0b"
          bgLight="#fffbeb"
          badgeText={pendingRequests.length > 0 ? "Action Needed" : "All Clear"}
          badgeVariant={pendingRequests.length > 0 ? "warning" : "secondary"}
        />

        {/* 5. Classification Index */}
        <ModernStatCard
          title="Classification"
          value={`${category.length} Cat.`}
          subtext={`${author.length} Authors • ${publishers.length} Pub.`}
          icon="bi-tags-fill"
          color="#8b5cf6"
          bgLight="#f5f3ff"
          linkTo="/admin/category"
          badgeText="Taxonomy"
          badgeVariant="primary"
        />

        {/* 6. Collected Fines */}
        <ModernStatCard
          title="Fine Receipts"
          value={`$${totalFinesUSD}`}
          subtext={`${totalFinesKHR.toLocaleString()} KHR balance`}
          icon="bi-cash-coin"
          color="#f43f5e"
          bgLight="#fff1f2"
          badgeText="Revenue"
          badgeVariant="danger"
        />
      </div>

      {/* ─────────────────────────────────────────
          CHARTS ROW (3 VISUAL ANALYTICS CARDS)
      ───────────────────────────────────────── */}
      <div className="row g-4 mb-4">
        {/* Chart 1: Books by Category */}
        <div className="col-lg-4">
          <div
            className="card border-0 rounded-4 bg-white h-100 p-4"
            style={{
              boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2.5">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
                  style={{ width: "38px", height: "38px", padding: "8px", background: "#eef2ff", color: "#4f46e5" }}
                >
                  <i className="bi bi-pie-chart-fill fs-6"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">Category Breakdown</h6>
                  <small className="text-muted" style={{ fontSize: "11px" }}>Inventory distribution by genre</small>
                </div>
              </div>
              <Link to="/admin/category" className="btn btn-sm btn-link text-primary p-0 text-decoration-none">
                Manage
              </Link>
            </div>

            <div className="position-relative d-flex align-items-center justify-content-center" style={{ height: "210px" }}>
              <canvas ref={categoryChartRef}></canvas>
            </div>

            {/* Custom HTML Legend */}
            <div className="d-flex flex-wrap gap-2 justify-content-center mt-3 pt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
              {categoryData.labels.slice(0, 4).map((lbl, idx) => (
                <span
                  key={lbl}
                  className="badge bg-light text-secondary border rounded-pill px-2.5 py-1 small fw-medium d-inline-flex align-items-center gap-1"
                  style={{ fontSize: "11px" }}
                >
                  <span
                    className="d-inline-block rounded-circle"
                    style={{ width: "8px", height: "8px", backgroundColor: categoryData.colors[idx] }}
                  />
                  {lbl}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Borrowing & Return Trends */}
        <div className="col-lg-4">
          <div
            className="card border-0 rounded-4 bg-white h-100 p-4"
            style={{
              boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2.5">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
                  style={{ width: "38px", height: "38px", padding: "8px", background: "#ecfdf5", color: "#10b981" }}
                >
                  <i className="bi bi-graph-up-arrow fs-6"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">Circulation Trend</h6>
                  <small className="text-muted" style={{ fontSize: "11px" }}>Monthly borrow vs returned volumes</small>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="d-inline-flex align-items-center gap-1 small text-muted" style={{ fontSize: "11px" }}>
                  <span className="d-inline-block rounded-circle bg-primary" style={{ width: 8, height: 8 }} /> Loans
                </span>
                <span className="d-inline-flex align-items-center gap-1 small text-muted" style={{ fontSize: "11px" }}>
                  <span className="d-inline-block rounded-circle bg-success" style={{ width: 8, height: 8 }} /> Returns
                </span>
              </div>
            </div>

            <div style={{ height: "240px" }}>
              <canvas ref={trendChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Chart 3: Most Circulated Titles */}
        <div className="col-lg-4">
          <div
            className="card border-0 rounded-4 bg-white h-100 p-4"
            style={{
              boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2.5">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
                  style={{ width: "38px", height: "38px", padding: "8px", background: "#ecfeff", color: "#06b6d4" }}
                >
                  <i className="bi bi-trophy-fill fs-6"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">High Circulation Titles</h6>
                  <small className="text-muted" style={{ fontSize: "11px" }}>Most requested volumes in loan history</small>
                </div>
              </div>
              <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-2.5 py-1 small">
                Top 5
              </span>
            </div>

            <div style={{ height: "240px" }}>
              <canvas ref={topBooksChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          LOWER SECTION: DATA TABLES & LIVE STREAM
      ───────────────────────────────────────── */}
      <div className="row g-4">
        {/* LEFT COLUMN: Categories & Quick Management */}
        <div className="col-lg-8">
          {/* Category Circulation Breakdown Table */}
          <div
            className="card border-0 rounded-4 bg-white p-4 mb-4"
            style={{
              boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2.5">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
                  style={{ width: "38px", height: "38px", padding: "8px", background: "#f5f3ff", color: "#8b5cf6" }}
                >
                  <i className="bi bi-folder2-open fs-6"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">Category Portfolio Status</h6>
                  <small className="text-muted">Live holdings per classification</small>
                </div>
              </div>
              <Link to="/admin/category" className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1">
                View All Categories <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="text-muted small text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    <th>Category Name</th>
                    <th>Books Count</th>
                    <th>Share of Catalog</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {category.slice(0, 5).map((cat) => {
                    const countInCat = books.filter(
                      (b) => b.category_name === cat.category_name || b.category_id === cat.id
                    ).length;
                    const percent = totalBooksCount > 0 ? Math.round((countInCat / totalBooksCount) * 100) : 0;

                    return (
                      <tr key={cat.id || cat.category_name}>
                        <td className="fw-semibold text-dark">
                          <i className="bi bi-folder2-open text-primary me-2"></i>
                          {cat.category_name}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border px-2.5 py-1">
                            {countInCat} volumes
                          </span>
                        </td>
                        <td style={{ width: "35%" }}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1 rounded-pill" style={{ height: "6px", backgroundColor: "#f1f5f9" }}>
                              <div
                                className="progress-bar rounded-pill bg-primary"
                                role="progressbar"
                                style={{ width: `${percent}%` }}
                                aria-valuenow={percent}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              />
                            </div>
                            <span className="small text-muted font-monospace" style={{ minWidth: "35px" }}>
                              {percent}%
                            </span>
                          </div>
                        </td>
                        <td className="text-end">
                          <Link
                            to={`/admin/books?category=${encodeURIComponent(cat.category_name)}`}
                            className="btn btn-sm btn-white border shadow-xs rounded-pill px-2.5 py-1 text-secondary"
                            title="Filter books"
                          >
                            <i className="bi bi-search"></i>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Management Navigation Cards */}
          <div className="row gy-3">
            <div className="col-6 col-md-4">
              <Link
                to="/admin/books"
                className="card border-0 rounded-4 p-3 bg-white text-decoration-none h-100 shadow-xs"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 p-2 bg-primary bg-opacity-10 text-primary">
                    <i className="bi bi-book fs-4"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark small">Books Catalog</div>
                    <small className="text-muted">Manage all volumes</small>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-6 col-md-4">
              <Link
                to="/admin/users"
                className="card border-0 rounded-4 p-3 bg-white text-decoration-none h-100 shadow-xs"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 p-2 bg-info bg-opacity-10 text-info">
                    <i className="bi bi-people fs-4"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark small">User Accounts</div>
                    <small className="text-muted">Roles & Permissions</small>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-6 col-md-4">
              <Link
                to="/admin/authors"
                className="card border-0 rounded-4 p-3 bg-white text-decoration-none h-100 shadow-xs"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 p-2 bg-success bg-opacity-10 text-success">
                    <i className="bi bi-person-badge fs-4"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark small">Authors Index</div>
                    <small className="text-muted">Biographies & titles</small>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Activity Timeline & System Specs */}
        <div className="col-lg-4">
          {/* Live Activity Feed */}
          <div
            className="card border-0 rounded-4 bg-white p-4 mb-4"
            style={{
              boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2.5">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
                  style={{ width: "38px", height: "38px", padding: "8px", background: "#fef3c7", color: "#d97706" }}
                >
                  <i className="bi bi-activity fs-6"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">System Activity Feed</h6>
                  <small className="text-muted" style={{ fontSize: "11px" }}>Recent events stream</small>
                </div>
              </div>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 small">
                Live
              </span>
            </div>

            {recentActivities.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {recentActivities.map((act) => (
                  <div key={act.id} className="d-flex align-items-start gap-3 pb-2.5 border-bottom" style={{ borderColor: "#f1f5f9" }}>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5"
                      style={{ width: "34px", height: "34px", backgroundColor: act.bg, color: act.color }}
                    >
                      <i className={`bi ${act.icon}`} style={{ fontSize: "14px" }}></i>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="small text-secondary lh-sm text-truncate mb-1">{act.text}</div>
                      <small className="text-muted d-block" style={{ fontSize: "11px" }}>
                        {formatTimeAgo(act.date)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted small">
                <i className="bi bi-clock-history fs-3 d-block mb-2 text-secondary opacity-50"></i>
                No circulation events recorded yet.
              </div>
            )}
          </div>

          {/* System Environment Specs Widget */}
          <div
            className="card border-0 rounded-4 p-4 text-white position-relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
              boxShadow: "0 10px 25px -5px rgba(30, 27, 75, 0.4)",
            }}
          >
            {/* Watermark */}
            <div className="position-absolute top-0 end-0 opacity-10" style={{ transform: "translate(20%, -20%)" }}>
              <i className="bi bi-shield-check" style={{ fontSize: "140px" }}></i>
            </div>

            <h6 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <i className="bi bi-hdd-network text-info"></i>
              Library Core Status
            </h6>
            <p className="text-white-50 small mb-3">Enterprise LMS Environment</p>

            <div className="row g-2 small border-top border-white border-opacity-15 pt-3">
              <div className="col-6">
                <span className="text-white-50 d-block" style={{ fontSize: "11px" }}>Environment</span>
                <span className="fw-semibold">Production API</span>
              </div>
              <div className="col-6">
                <span className="text-white-50 d-block" style={{ fontSize: "11px" }}>Storage Engine</span>
                <span className="fw-semibold">Local & Uploads</span>
              </div>
              <div className="col-6">
                <span className="text-white-50 d-block" style={{ fontSize: "11px" }}>Active Users</span>
                <span className="fw-semibold text-warning">{users.length} registered</span>
              </div>
              <div className="col-6">
                <span className="text-white-50 d-block" style={{ fontSize: "11px" }}>System Health</span>
                <span className="fw-semibold text-success">Optimal 99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}