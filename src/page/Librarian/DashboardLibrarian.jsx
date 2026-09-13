import React, { useEffect, useMemo, useRef, useState } from "react";
import '../../assets/Dashbord.css'
import useBook from '../../hook/useBooks'
import useMember from '../../hook/useMember'
import useBorrow from '../../hook/useBorrow'
import useBorrowRequest from '../../hook/useBorrowRequest'
import Table from '../../components/ui/Table'
import { getAvatarUrl, handleAvatarError } from '../../utils/avatar'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const activeMembers = [
  { name: "Sophia Lee", type: "Premium", borrowed: 18, max: 20, avatar: "https://i.pravatar.cc/80?img=47" },
  { name: "Daniel Cruz", type: "Standard", borrowed: 12, max: 20, avatar: "https://i.pravatar.cc/80?img=12" },
  { name: "Maria Garcia", type: "Premium", borrowed: 15, max: 20, avatar: "https://i.pravatar.cc/80?img=32" },
  { name: "James Wood", type: "Standard", borrowed: 9, max: 20, avatar: "https://i.pravatar.cc/80?img=15" },
];

const quickActions = [
  { icon: "bi-journal-plus", label: "Add New Book" },
  { icon: "bi-person-plus-fill", label: "Register Member" },
  { icon: "bi-box-arrow-up-right", label: "Issue Book" },
  { icon: "bi-box-arrow-in-down-left", label: "Return Book" },
  { icon: "bi-calculator-fill", label: "Calculate Fine" },
  { icon: "bi-file-earmark-bar-graph-fill", label: "Generate Report" },
];
function DashboardLibrarian() {
  const borrowChartRef = useRef(null);
  const statusChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const fineChartRef = useRef(null);
  const chartInstances = useRef({});
  const [timelineActivities, setTimelineActivities] = useState([]);
  const [showAll, setShowAll] = useState(false)
  const { books } = useBook()
  const { allMembers } = useMember()
  const { borrow, getAllBorrowRecord } = useBorrow()
  const { borrowsRequest } = useBorrowRequest({ perPage: 1000, })
  useEffect(() => {
    getAllBorrowRecord('', 1, 1000);
  }, []);

  const overdueBooks = borrow.filter((item) => {
    const dueDate = new Date(item.due_date);
    const today = new Date();

    return (
      item.status?.toLowerCase() !== "returned" &&
      dueDate < today
    );
  }).length;

  const totalKHR = borrow.reduce(
    (sum, item) => sum + Number(item.fine || 0),
    0
  );
  const totalUSD = totalKHR / 4100;

  const formattedTotal = totalUSD.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const summaryCards = [
    {
      icon: "bi-book-fill",
      label: "Total Books",
      value: books.length,
      suffix: "Books",
      tint: "#00C18F",
    },
    {
      icon: "bi-people-fill",
      label: "Total Members",
      value: allMembers.length,
      suffix: "Members",
      tint: "#3B82F6",
    },
    {
      icon: "bi-journal-bookmark-fill",
      label: "Borrowed Books",
      value: borrow.length,
      suffix: "Books",
      tint: "#F59E0B",
    },
    {
      icon: "bi-exclamation-circle-fill",
      label: "Overdue Books",
      value: overdueBooks,
      suffix: "Books",
      tint: "#EF4444",
    },
    {
      icon: "bi-cash-stack",
      label: "Total Fines",
      value: formattedTotal,
      suffix: "Collected",
      tint: "#8B5CF6",
    },
  ];

  // section 2
  const monthlyBorrowData = useMemo(() => {
    const data = Array(12).fill(0);

    borrow.forEach(item => {
      if (!item.borrow_date) return;

      const month = new Date(item.borrow_date).getMonth();
      data[month]++;
    });

    return data;
  }, [borrow]);

  const statusDistribution = useMemo(() => {
    const counts = {};

    borrow.forEach(item => {
      const status = item.status || "Unknown";

      counts[status] = (counts[status] || 0) + 1;
    });

    return {
      labels: Object.keys(counts),
      values: Object.values(counts),
      colors: [
        "#00C18F",
        "#F59E0B",
        "#EF4444",
        "#8B5CF6",
        "#3B82F6"
      ]
    };
  }, [borrow]);

  const EXCHANGE_RATE = 4100; // 1 USD ≈ 4100 KHR

  const monthlyFineData = useMemo(() => {
    const data = Array(12).fill(0);

    borrow.forEach(item => {
      if (!item.return_date) return;

      const month = new Date(item.return_date).getMonth();

      // Convert KHR to USD
      data[month] += Number(item.fine || 0) / EXCHANGE_RATE;
    });

    return data;
  }, [borrow]);

  const categoryBorrowData = useMemo(() => {
    const counts = {};

    borrow.forEach(item => {
      const category = item.category_name || "Other";

      counts[category] = (counts[category] || 0) + 1;
    });

    return {
      labels: Object.keys(counts),
      values: Object.values(counts)
    };
  }, [borrow]);

  const chartBaseOptions = (prefix = "") => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed.y;

            return prefix
              ? `${ctx.dataset.label}: ${prefix}${value.toFixed(2)}`
              : `${ctx.dataset.label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  });

  useEffect(() => {
    if (!borrowChartRef.current) return;

    Object.values(chartInstances.current).forEach(chart => {
      if (chart) chart.destroy();
    });

    // Borrow
    chartInstances.current.borrow = new Chart(
      borrowChartRef.current,
      {
        type: "line",
        data: {
          labels: monthLabels,
          datasets: [{
            label: "Books Borrowed",
            data: monthlyBorrowData,
            borderColor: "#00C18F",
            backgroundColor: "rgba(0,193,143,.15)",
            fill: true,
            tension: .4
          }]
        },
        options: chartBaseOptions()
      }
    );

    // Status
    chartInstances.current.status = new Chart(
      statusChartRef.current,
      {
        type: "doughnut",
        data: {
          labels: statusDistribution.labels,
          datasets: [{
            data: statusDistribution.values,
            backgroundColor: statusDistribution.colors
          }]
        }
      }
    );

    // Category
    chartInstances.current.category = new Chart(
      categoryChartRef.current,
      {
        type: "bar",
        data: {
          labels: categoryBorrowData.labels,
          datasets: [{
            label: "Books Borrowed",
            data: categoryBorrowData.values,
            backgroundColor: "#00C18F"
          }]
        },
        options: chartBaseOptions("")
      }
    );

    // Fine
    chartInstances.current.fine = new Chart(
      fineChartRef.current,
      {
        type: "line",
        data: {
          labels: monthLabels,
          datasets: [{
            label: "Fine Collected ($)",
            data: monthlyFineData,
            borderColor: "#8B5CF6",
            backgroundColor: "rgba(139,92,246,.2)",
            fill: true,
            tension: .4
          }]
        },
        options: chartBaseOptions("$")
      }
    );

    return () => {
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) chart.destroy();
      });
    };

  }, [
    monthlyBorrowData,
    statusDistribution,
    categoryBorrowData,
    monthlyFineData
  ]);

  // section 3
  const mapBorrowRecordToActivity = (item) => {
    // CASE 1: Borrow event
    if (item.status === "borrowed") {
      return {
        type: "borrow",
        text: `${item.member_name} borrowed "${item.book_title}"`,
        time: item.borrow_date,
      };
    }

    // CASE 2: Returned (future-ready)
    if (item.return_date) {
      return {
        type: "return",
        text: `${item.member_name} returned "${item.book_title}"`,
        time: item.return_date,
      };
    }

    return null;
  };
  const buildTimeline = (data) => {
    return data
      .map(mapBorrowRecordToActivity)
      .filter(Boolean)
      .sort((a, b) => new Date(b.time) - new Date(a.time));
  };

  const getIcon = (type) => {
    switch (type) {
      case "borrow":
        return "bi-bookmark-check-fill";
      case "return":
        return "bi-check2-circle";
      default:
        return "bi-clock-history";
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "borrow":
        return "#00C18F";
      case "return":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };
  useEffect(() => {
    if (!borrow || borrow.length === 0) return;

    const timeline = buildTimeline(borrow);

    setTimelineActivities(
      timeline.slice(0, 5).map((item, index) => ({
        id: item.time + index, // safe key fallback
        icon: getIcon(item.type),
        color: getColor(item.type),
        text: item.text,
        time: formatTime(item.time),
      }))
    );
  }, [borrow]);
  const formatTime = (date) => {
    if (!date) return "";

    const diff = Math.floor((new Date() - new Date(date)) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    return `${Math.floor(diff / 86400)}d ago`;
  };
  // section 04
  const booksAvailable = books.reduce(
    (sum, book) => sum + Number(book.available_copies || 0),
    0
  );
  const booksBorrowed = books.reduce(
    (sum, book) => sum + (book.total_copies - book.available_copies),
    0
  );
  const activeMembersCount = new Set(
    borrow
      .filter(b => b.status === "borrowed")
      .map(b => b.member_code)
  ).size;
  const pendingRequests = Array.isArray(borrowsRequest)
    ? borrowsRequest.filter((r) => r.status?.toLowerCase() === "pending").length
    : 0;
  const quickSummary = [
    { label: "Books Available", value: booksAvailable, icon: "bi-bookshelf" },
    { label: "Books Borrowed", value: booksBorrowed, icon: "bi-journal-bookmark" },
    { label: "Active Members", value: activeMembersCount, icon: "bi-person-check-fill" },
    { label: "Pending Requests", value: pendingRequests, icon: "bi-hourglass-split" },
    { label: "Unpaid Fines", value: "$350", icon: "bi-wallet2" },
  ];

  // section 05

  const columnBorrow = [
    {
      header: '#',
      accessor: 'id',
      render: (row, index) => index + 1
    },
    { header: 'Member Name', accessor: 'member_name' },
    { header: 'Book Title', accessor: 'book_title' },
    {
      header: 'Borrow Date',
      accessor: 'borrow_date',
      render: (row) =>
        new Date(row.borrow_date).toLocaleDateString('en-GB')
    },
    {
      header: 'Due Date',
      accessor: 'due_date',
      render: (row) =>
        new Date(row.due_date).toLocaleDateString('en-GB')
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span
          className={`badge ${row.status === 'borrowed'
            ? 'bg-danger'
            : row.status === 'returned'
              ? 'bg-success'
              : 'bg-warning'
            }`}
        >
          {row.status}
        </span>
      )
    }
  ]

  // section 05
  const topMembers = [...allMembers]
    .sort((a, b) => b.currently_borrowing - a.currently_borrowing)
    .slice(0, 4);

  const maxBorrowing = Math.max(...topMembers.map(m => m.currently_borrowing));



  return (
    <div className="lib-dashboard">
      {/* PAGE HEADER */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Library Dashboard</h1>
          <p className="dash-subtitle">Overview and statistics of the library system.</p>
        </div>
        <div className="dash-actions">
          <button className="btn btn-outline-action p-3">
            <i className="bi bi-arrow-clockwise"></i> Refresh Dashboard
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 g-lg-4 mb-4">
        {summaryCards.map((card, i) => (
          <div className="col-12 col-sm-6 col-xl" key={i}>
            <div className="summary-card">
              <div className="summary-icon" style={{ background: `${card.tint}1A`, color: card.tint }}>
                <i className={`bi ${card.icon}`}></i>
              </div>
              <div className="summary-info">
                <span className="summary-label">{card.label}</span>
                <span className="summary-value">
                  {card.value} <small>{card.suffix}</small>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ROW 1 — CHARTS */}
      <div className="row mb-4">
        <div className="col-12 col-xl-8">
          <div className="dash-card h-100">
            <div className="dash-card-header">
              <h2 className="card-title-text">Monthly Borrow Statistics</h2>
              <span className="card-subtext">Jan – Dec 2026</span>
            </div>
            <div className="chart-wrap chart-tall">
              <canvas ref={borrowChartRef}></canvas>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-4">
          <div className="dash-card h-100">
            <div className="dash-card-header">
              <h2 className="card-title-text">Books Status Distribution</h2>
            </div>
            <div className="chart-wrap chart-tall">
              <canvas ref={statusChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2 — CHARTS */}
      <div className="row g-lg-4 mb-4">
        <div className="col-12 col-xl-6">
          <div className="dash-card h-100">
            <div className="dash-card-header">
              <h2 className="card-title-text">Top Borrowed Categories</h2>
            </div>
            <div className="chart-wrap">
              <canvas ref={categoryChartRef}></canvas>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-6">
          <div className="dash-card h-100">
            <div className="dash-card-header">
              <h2 className="card-title-text">Monthly Fine Collection</h2>
            </div>
            <div className="chart-wrap">
              <canvas ref={fineChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3 — ACTIVITY + SUMMARY */}
      <div className="row g-lg-4 mb-4">
        <div className="col-12 col-xl-7">
          <div className="dash-card h-100">
            <div className="dash-card-header">
              <h2 className="card-title-text">Recent Borrow Activities</h2>
            </div>
            <ul className="timeline">
              {timelineActivities?.map((item) => (
                <li className="timeline-item" key={item.id}>
                  <span
                    className="timeline-icon"
                    style={{
                      background: `${item.color}1A`,
                      color: item.color,
                    }}
                  >
                    <i className={`bi ${item.icon}`}></i>
                  </span>

                  <div className="timeline-content">
                    <p className="timeline-text">{item.text}</p>
                    <span className="timeline-time">{item.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-12 col-xl-5">
          <div className="dash-card h-100">
            <div className="dash-card-header">
              <h2 className="card-title-text">Quick Summary</h2>
            </div>
            <div className="quick-summary-grid">
              {quickSummary.map((item, i) => (
                <div className="mini-card" key={i}>
                  <div className="mini-icon">
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div>
                    <div className="mini-value">{item.value}</div>
                    <div className="mini-label">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ROW 4 — TRANSACTIONS TABLE */}
      <div className="row g-3 g-lg-4 mb-4">
        <div className="col-12">
          <div className="dash-card">
            <div className="dash-card-header">
              <h2 className="card-title-text">Latest Borrow Transactions</h2>
              <button className="btn btn-link-action" onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'show Less' : ' View All'}
              </button>
            </div>
            <div className="table-responsive">
              <Table
                columns={columnBorrow}
                data={showAll ? borrow : borrow.slice(0, 5)}
                hover={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ROW 5 — MOST ACTIVE MEMBERS */}
      <div className="row g-3 g-lg-4 mb-4">
        <div className="col-12">
          <div className="dash-card">
            <div className="dash-card-header">
              <h2 className="card-title-text">Most Active Members</h2>
            </div>
            <div className="row g-4">
              {topMembers.map((m) => {
                const maxBorrowing = Math.max(...topMembers.map(x => x.currently_borrowing));

                const progressPercent =
                  maxBorrowing > 0
                    ? (m.currently_borrowing / maxBorrowing) * 100
                    : 0;

                return (
                  <div className="col-12 col-sm-6 col-xl-3" key={m.user_id}>
                    <div className="member-card">

                      <img
                        src={getAvatarUrl(m.profile_image, m.full_name)}
                        alt={m.full_name}
                        className="member-avatar"
                        onError={(e) => handleAvatarError(e, m.full_name)}
                      />

                      <div className="member-name">{m.full_name}</div>

                      <span className="member-type">{m.member_type}</span>

                      <div className="member-footer mt-auto w-100">
                        <div className="member-progress">

                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar bg-success"
                              style={{
                                width: `${Math.min(progressPercent, 100)}%`
                              }}
                            />
                          </div>

                          <span className="member-progress-label">
                            {m.currently_borrowing} books
                          </span>

                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="row g-3 g-lg-4 mb-2">
        <div className="col-12">
          <h2 className="card-title-text mb-3">Quick Actions</h2>
          <div className="row">
            {quickActions.map((a, i) => (
              <div className="col-6 col-sm-4 col-xl-2" key={i}>
                <button className="quick-action-card">
                  <i className={`bi ${a.icon}`}></i>
                  <span>{a.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Shared Chart.js options for line/bar charts */
function chartBaseOptions(prefix = "") {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1F2937",
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `${prefix}${ctx.formattedValue}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748B", font: { size: 12 } },
      },
      y: {
        grid: { color: "#E5E7EB", drawTicks: false },
        border: { display: false },
        ticks: {
          color: "#64748B",
          font: { size: 12 },
          callback: (v) => `${prefix}${v}`,
        },
      },
    },
  };
}

export default DashboardLibrarian
