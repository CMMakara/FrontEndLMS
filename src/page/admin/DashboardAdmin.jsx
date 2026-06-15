import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

/* =========================
   STAT CARD
========================= */
const StatCard = ({ icon, label, value, variant = "primary" }) => (
  <div className="col-6 col-md-3">
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted small mb-1">{label}</p>
            <h3 className="fw-bold mb-0">{value}</h3>
          </div>

          <div className={`bg-${variant}-subtle text-${variant} rounded-4 d-flex align-items-center justify-content-center`}
            style={{ width: 44, height: 44 }}>
            <i className={`bi ${icon} fs-5`}></i>
          </div>
        </div>
      </div>
    </div>
  </div>
)

/* =========================
   CHART CARD
========================= */
const ChartCard = ({ title, children, canvasRef, colSize = "col-md-6" }) => (
  <div className={`col-12 ${colSize}`}>
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">{title}</h6>
        </div>

        {children}

        <div className="mt-3" style={{ minHeight: 220 }}>
          <canvas ref={canvasRef}></canvas>
        </div>

      </div>
    </div>
  </div>
)

/* =========================
   ACTIVITY ITEM
========================= */
const ActivityItem = ({ icon, variant, text, time, isLast }) => (
  <div className={`d-flex gap-3 py-3 ${!isLast ? "border-bottom" : ""}`}>
    <div className={`rounded-circle bg-${variant}-subtle text-${variant} d-flex align-items-center justify-content-center flex-shrink-0`}
      style={{ width: 40, height: 40 }}>
      <i className={`bi ${icon}`}></i>
    </div>

    <div className="flex-grow-1">
      <div className="fw-medium text-dark small mb-1">{text}</div>
      <div className="text-muted small">{time}</div>
    </div>
  </div>
)

/* =========================
   DASHBOARD
========================= */
function DashboardAdmin() {
  const catRef = useRef(null)
  const trendRef = useRef(null)
  const topRef = useRef(null)

  useEffect(() => {
    const charts = []

    const grid = { color: '#eee', borderDash: [4, 4] }
    const ticks = { color: '#888', font: { size: 11 } }

    /* ===== DONUT ===== */
    charts.push(new Chart(catRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Fiction', 'Science', 'History', 'Khmer', 'Other'],
        datasets: [{
          data: [32, 24, 18, 14, 12],
          backgroundColor: ['#7F77DD', '#1D9E75', '#D85A30', '#D4537E', '#888'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: { legend: { display: false } }
      }
    }))

    /* ===== LINE ===== */
    charts.push(new Chart(trendRef.current, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Borrowed',
            data: [380, 410, 395, 440, 470, 490],
            borderColor: '#378ADD',
            tension: 0.4
          },
          {
            label: 'Returned',
            data: [360, 390, 400, 420, 460, 520],
            borderColor: '#1D9E75',
            borderDash: [5, 5],
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks },
          y: { grid, ticks }
        }
      }
    }))

    /* ===== BAR ===== */
    charts.push(new Chart(topRef.current, {
      type: 'bar',
      data: {
        labels: ['Atomic Habits', 'Dune', 'Khmer Lit', 'Gatsby', 'Sapiens'],
        datasets: [{
          data: [142, 118, 105, 96, 88],
          backgroundColor: '#7F77DD',
          borderRadius: 6,
          barThickness: 16
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid, ticks },
          y: { grid: { display: false }, ticks }
        }
      }
    }))

    return () => charts.forEach(c => c.destroy())
  }, [])

  return (
      <div className="container p-4 bg-body-tertiary min-vh-100 w-100">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Library Dashboard</h2>
          <p className="text-muted mb-0 small">Analytics overview & system activity</p>
        </div>

        <div className="d-flex gap-2">
          <span className="badge bg-primary-subtle text-primary border px-3 py-2 d-flex align-items-center gap-1">
            <i className="bi bi-broadcast"></i> Live System
          </span>
          <span className="badge bg-dark-subtle text-dark border px-3 py-2 d-flex align-items-center gap-1">
            <i className="bi bi-clock-history"></i> Updated now
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        <StatCard icon="bi-book" label="Books" value="12,480" variant="primary" />
        <StatCard icon="bi-feather" label="Authors" value="2,134" variant="success" />
        <StatCard icon="bi-tags" label="Categories" value="48" variant="warning" />
        <StatCard icon="bi-building" label="Publishers" value="156" variant="info" />
      </div>

      <div className="row g-4">

        {/* LEFT */}
        <div className="col-lg-8">

          <div className="row g-4">

            <ChartCard title="Books by Category" canvasRef={catRef}>
              <div className="d-flex flex-wrap gap-3 text-muted small">
                <span><i className="bi bi-circle-fill me-1" style={{ color: '#7F77DD' }}></i>Fiction 32%</span>
                <span><i className="bi bi-circle-fill me-1" style={{ color: '#1D9E75' }}></i>Science 24%</span>
                <span><i className="bi bi-circle-fill me-1" style={{ color: '#D85A30' }}></i>History 18%</span>
              </div>
            </ChartCard>

            <ChartCard title="Borrow vs Return Trend" canvasRef={trendRef}>
              <div className="d-flex gap-3 text-muted small">
                <span><i className="bi bi-square-fill me-1" style={{ color: '#378ADD' }}></i>Borrowed</span>
                <span><i className="bi bi-square-fill me-1" style={{ color: '#1D9E75' }}></i>Returned</span>
              </div>
            </ChartCard>

            <ChartCard title="Top Borrowed Books" canvasRef={topRef} colSize="col-12" />

          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-4">

          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between mb-3">
                <h6 className="fw-bold mb-0">Recent Activity</h6>
                <span className="badge bg-success-subtle text-success">
                  <i className="bi bi-circle-fill me-1" style={{ fontSize: 6 }}></i>Live
                </span>
              </div>

              <ActivityItem
                icon="bi-plus-circle"
                variant="success"
                text={<span>New book added <b>Khmer Literature</b></span>}
                time="10 min ago"
              />

              <ActivityItem
                icon="bi-book"
                variant="warning"
                text={<span>Borrowed <b>Atomic Habits</b></span>}
                time="35 min ago"
              />

              <ActivityItem
                icon="bi-arrow-repeat"
                variant="info"
                text={<span>Returned <b>Gatsby</b></span>}
                time="1 hour ago"
                isLast
              />

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default DashboardAdmin