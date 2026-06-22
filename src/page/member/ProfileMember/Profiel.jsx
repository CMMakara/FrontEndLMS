import React, { useState, useRef } from "react";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const NAV_ITEMS = [
  {
    key: "profile",
    label: "My Profile",
    icon: "bi-person-circle", // User profile
    path: "/member/profile/profileMember",
  },
  {
    key: "orders",
    label: "Borrowing History",
    icon: "bi-journal-bookmark-fill", // Borrowed books history
    path: "/member/profile/borrowing-history",
  },
  {
    key: "address",
    label: "Due Date",
    icon: "bi-calendar-event-fill", // Due dates
    path: "/member/profile/due-date",
  },
  {
    key: "payment",
    label: "Fine",
    icon: "bi-cash-coin", // Money/fines
    path: "/member/profile/fine",
  },
  {
    key: "wishlist",
    label: "Notifications",
    icon: "bi-bell-fill", // Notifications
    path: "/member/profile/notifications",
  },
];

/* ---------------- Sidebar ---------------- */

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar-card d-flex flex-column">
      <nav>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={
              "nav-item-custom" +
              (location.pathname === item.path ? " active" : "")
            }
            onClick={() => navigate(item.path)}
          >
            <i className={"bi " + item.icon}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <hr className="nav-divider" />
      <button
        className="nav-item-custom nav-item-logout"
        onClick={() => navigate("/login")}
      >
        <i className="bi bi-box-arrow-right"></i>
        <span>Logout</span>
      </button>
    </aside>
  );
}

/* ---------------- shared bits ---------------- */

function PageHeader({ title, action }) {
  return (
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
      <h1 className="page-title">{title}</h1>
      {action}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  readOnly = false,
}) {
  return (
    <div className="mb-3">
      <div className="field-label">{label}</div>
      <input
        type={type}
        className={"field-input" + (readOnly ? " field-readonly" : "")}
        value={value}
        disabled={disabled || readOnly}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
}

function StatusBadge({ label, variant }) {
  return (
    <span className={"status-badge status-badge--" + variant}>{label}</span>
  );
}

/* ---------------- My Profile ---------------- */

function ProfileContent() {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);
  const [avatar, setAvatar] = useState(null); // null = show initials
  const fileInputRef = useRef(null);

  // Editable fields (mapped to the users table columns)
  const [form, setForm] = useState({
    full_name: "Meow meow",
    gender: "Female",
    address: "Phnom Penh",
    phone: "096 168 9999",
    email: "meowmeow168@gmail.com",
    username: "meowmeow168",
    password: "",
  });

  // Read-only account meta (fetched from the server, not editable in the UI)
  const accountMeta = {
    role: "Library Member",
    is_active: true,
    is_verified: true,
    status: "active",
    last_login_at: "Jun 20, 2026 · 09:41 AM",
    created_at: "Jan 15, 2025",
    updated_at: "Jun 21, 2026",
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleAvatarClick = () => {
    if (editing) fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveClick = () => {
    if (!editing) {
      setEditing(true);
      return;
    }
    // Replace this block with your real API call:
    // await api.patch("/member/profile", { ...form, profile_image: avatar })
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditing(false);
      setToast(true);
      setTimeout(() => setToast(false), 2500);
    }, 1200);
  };

  return (
    <>
      {toast && (
        <div className="save-toast">
          <i className="bi bi-check-circle-fill"></i>
          Profile saved successfully
        </div>
      )}

      <PageHeader
        title="My Profile"
        action={
          <button
            className="btn-edit"
            onClick={handleSaveClick}
            disabled={saving}
          >
            {saving ? (
              <span className="spinner-sm" />
            ) : (
              <i
                className={"bi " + (editing ? "bi-check2" : "bi-pencil-fill")}
              ></i>
            )}
            {saving ? "Saving..." : editing ? "Save Profile" : "Edit Profile"}
          </button>
        }
      />

      {/* Avatar */}
      <div className="text-center my-4">
        <div
          className={"avatar-outer" + (editing ? " avatar-editable" : "")}
          onClick={handleAvatarClick}
        >
          <div className="avatar-wrap">
            {avatar ? (
              <img src={avatar} alt="Profile avatar" />
            ) : (
              <div className="avatar-initials">
                {getInitials(form.full_name || "U")}
              </div>
            )}
          </div>
          {editing && (
            <button type="button" className="avatar-cam" tabIndex={-1}>
              <i className="bi bi-camera-fill"></i>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="d-none"
          onChange={handleAvatarChange}
        />
        <div className="mt-2 fw-semibold" style={{ fontSize: ".95rem" }}>
          {form.full_name}
        </div>
        <div style={{ fontSize: ".8rem", color: "#6b6b6b" }}>
          {accountMeta.role}
        </div>

        {/* is_active / is_verified badges */}
        <div className="d-flex justify-content-center gap-2 mt-2">
          <StatusBadge
            label={accountMeta.is_active ? "Active" : "Inactive"}
            variant={accountMeta.is_active ? "active" : "inactive"}
          />
          {accountMeta.is_verified && (
            <StatusBadge label="Verified" variant="verified" />
          )}
        </div>

        {editing && (
          <div className="avatar-hint">Click the photo to change it</div>
        )}
      </div>

      {/* ── Section: Personal Information ── */}
      <div className="section-heading">Personal Information</div>

      <div className="row">
        <div className="col-md-6">
          <Field
            label="Full Name"
            value={form.full_name}
            disabled={!editing}
            onChange={update("full_name")}
          />
        </div>
        <div className="col-md-6">
          <Field
            label="Gender"
            value={form.gender}
            disabled={!editing}
            onChange={update("gender")}
          />
        </div>
        <div className="col-12">
          <Field
            label="Address"
            value={form.address}
            disabled={!editing}
            onChange={update("address")}
          />
        </div>
        <div className="col-md-6">
          <Field
            label="Phone Number"
            value={form.phone}
            disabled={!editing}
            onChange={update("phone")}
          />
        </div>
        <div className="col-md-6">
          <Field
            label="Email"
            value={form.email}
            disabled={!editing}
            onChange={update("email")}
            type="email"
          />
        </div>
      </div>

      {/* ── Section: Account Details ── */}
      <div className="section-heading mt-2">Account Details</div>

      <div className="row">
        <div className="col-md-6">
          <Field
            label="Username"
            value={form.username}
            disabled={!editing}
            onChange={update("username")}
          />
        </div>
        <div className="col-md-6">
          <Field
            label="Password"
            value={form.password}
            disabled={!editing}
            onChange={update("password")}
            type="password"
          />
        </div>
      </div>

      {/* ── Section: Account Status (read-only) ── */}
      <div className="section-heading mt-2">Account Status</div>

      <div className="meta-info-grid">
        <div className="meta-info-item">
          <i className="bi bi-clock-history"></i>
          <div>
            <div className="meta-info-label">Last Login</div>
            <div className="meta-info-value">{accountMeta.last_login_at}</div>
          </div>
        </div>
        <div className="meta-info-item">
          <i className="bi bi-calendar-plus"></i>
          <div>
            <div className="meta-info-label">Member Since</div>
            <div className="meta-info-value">{accountMeta.created_at}</div>
          </div>
        </div>
        <div className="meta-info-item">
          <i className="bi bi-arrow-repeat"></i>
          <div>
            <div className="meta-info-label">Last Updated</div>
            <div className="meta-info-value">{accountMeta.updated_at}</div>
          </div>
        </div>
        <div className="meta-info-item">
          <i className="bi bi-shield-check"></i>
          <div>
            <div className="meta-info-label">Account Status</div>
            <div
              className="meta-info-value"
              style={{ textTransform: "capitalize" }}
            >
              {accountMeta.status}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- Borrowing History ---------------- */

const BORROWED_BOOKS = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    borrowedOn: "May 02, 2026",
    dueOn: "May 16, 2026",
    status: "Returned",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    borrowedOn: "Jun 01, 2026",
    dueOn: "Jun 15, 2026",
    status: "Overdue",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    borrowedOn: "Jun 10, 2026",
    dueOn: "Jun 24, 2026",
    status: "Active",
  },
];

function BorrowingHistoryContent() {
  return (
    <>
      <PageHeader title="Borrowing History" />
      <div className="d-flex flex-column gap-2">
        {BORROWED_BOOKS.map((b) => (
          <div className="list-row" key={b.title}>
            <div className="list-row-icon">
              <i className="bi bi-journal-bookmark"></i>
            </div>
            <div className="flex-grow-1">
              <div className="list-row-title">{b.title}</div>
              <div className="list-row-sub">
                {b.author} · Borrowed {b.borrowedOn} · Due {b.dueOn}
              </div>
            </div>
            <span className={"badge-status badge-" + b.status.toLowerCase()}>
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- Due Date ---------------- */

const DUE_ITEMS = [
  { title: "Atomic Habits", dueOn: "Jun 15, 2026", status: "Overdue" },
  { title: "Sapiens", dueOn: "Jun 24, 2026", status: "Due soon" },
  { title: "Deep Work", dueOn: "Jul 02, 2026", status: "Upcoming" },
];

function DueDateContent() {
  return (
    <>
      <PageHeader title="Due Date" />
      <div className="d-flex flex-column gap-2">
        {DUE_ITEMS.map((d) => (
          <div className="list-row" key={d.title}>
            <div className="list-row-icon">
              <i className="bi bi-calendar-event"></i>
            </div>
            <div className="flex-grow-1">
              <div className="list-row-title">{d.title}</div>
              <div className="list-row-sub">Due {d.dueOn}</div>
            </div>
            <span
              className={
                "badge-status badge-" + d.status.toLowerCase().replace(" ", "-")
              }
            >
              {d.status}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- Fine ---------------- */

const FINES = [
  { book: "Atomic Habits", reason: "Overdue (6 days)", amount: 1.2 },
  { book: "1984", reason: "Damaged cover", amount: 3.0 },
];

function FineContent() {
  const total = FINES.reduce((sum, f) => sum + f.amount, 0);
  return (
    <>
      <PageHeader title="Fine" />
      <div className="fine-total-card mb-3">
        <div className="list-row-sub">Total outstanding</div>
        <div className="fine-total-amount">${total.toFixed(2)}</div>
      </div>
      <div className="d-flex flex-column gap-2">
        {FINES.map((f, i) => (
          <div className="list-row" key={i}>
            <div className="list-row-icon">
              <i className="bi bi-cash-coin"></i>
            </div>
            <div className="flex-grow-1">
              <div className="list-row-title">{f.book}</div>
              <div className="list-row-sub">{f.reason}</div>
            </div>
            <span className="fine-amount">${f.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- Notifications ---------------- */

const NOTIFICATIONS = [
  {
    message: '"Atomic Habits" is overdue by 6 days. Please return it soon.',
    time: "2 hours ago",
    unread: true,
  },
  { message: '"Sapiens" is due in 3 days.', time: "1 day ago", unread: true },
  {
    message: "Your fine of $3.00 was added for a damaged book.",
    time: "3 days ago",
    unread: false,
  },
  {
    message: '"The Great Gatsby" was successfully returned.',
    time: "1 week ago",
    unread: false,
  },
];

function NotificationsContent() {
  return (
    <>
      <PageHeader title="Notifications" />
      <div className="d-flex flex-column gap-2">
        {NOTIFICATIONS.map((n, i) => (
          <div className="list-row" key={i}>
            <div className="list-row-icon">
              <i className="bi bi-bell"></i>
            </div>
            <div className="flex-grow-1">
              <div className="list-row-title">
                {n.message}
                {n.unread && <span className="notif-dot" />}
              </div>
              <div className="list-row-sub">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- App shell ---------------- */

export default function Profile() {
  return (
    <>
      <style>{`
:root {
  --bg-page:      #ffffff;
  --card-bg:      #ffffff;
  --card-border:  #e2e2e2;
  --field-bg:     #ffffff;
  --field-border: #d4d4d4;
  --text:         #000000;
  --text-muted:   #6b6b6b;
  --accent:       #000000;
  --accent-text:  #ffffff;
  --hover-bg:     #f2f2f2;
}

body {
  margin: 0;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: var(--text);
  background: var(--bg-page);
}

.app-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: var(--bg-page);
}

.dashboard-shell {
  width: 100%;
  max-width: 1080px;
}

/* ── Sidebar ── */
.sidebar-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 28px;
  padding: 1.75rem 1.1rem;
  box-shadow: 0 10px 30px -18px rgba(0,0,0,.12);
  width: 100%;
}
@media (min-width: 992px) {
  .sidebar-card { width: 260px; flex: 0 0 260px; }
}

.nav-item-custom {
  display: flex;
  align-items: center;
  gap: .65rem;
  padding: .65rem .9rem;
  border-radius: 14px;
  margin-bottom: .4rem;
  color: var(--text);
  font-size: .92rem;
  font-weight: 500;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  transition: background .15s ease, color .15s ease;
  cursor: pointer;
}
.nav-item-custom i { font-size: 1.05rem; width: 20px; text-align: center; color: var(--text-muted); }
.nav-item-custom:hover { background: var(--hover-bg); }
.nav-item-custom.active { background: var(--accent); color: var(--accent-text); }
.nav-item-custom.active i { color: var(--accent-text); }

.nav-divider { border: none; border-top: 1px solid var(--card-border); margin: .9rem .2rem; }
.nav-item-logout { color: var(--text); }
.nav-item-logout i { color: var(--text-muted); }
.nav-item-logout:hover { background: var(--hover-bg); }

/* ── Main card ── */
.main-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 28px;
  padding: 2rem 2.25rem;
  box-shadow: 0 10px 30px -18px rgba(0,0,0,.12);
  min-height: 520px;
  position: relative;
}

.page-title { font-size: 1.45rem; font-weight: 700; margin: 0; color: var(--text); }

/* ── Edit button ── */
.btn-edit {
  background: var(--accent);
  color: var(--accent-text);
  border: none;
  border-radius: 10px;
  padding: .5rem 1.1rem;
  font-size: .88rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  transition: background .15s ease;
  cursor: pointer;
}
.btn-edit:hover { background: #222; color: #fff; }
.btn-edit:disabled { opacity: .7; cursor: default; }

/* ── Spinner ── */
.spinner-sm {
  width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,.35);
  border-top-color: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Toast ── */
.save-toast {
  position: fixed;
  top: 24px; right: 24px;
  z-index: 2000;
  background: #000;
  color: #fff;
  padding: .7rem 1.1rem;
  border-radius: 10px;
  font-size: .88rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: .5rem;
  box-shadow: 0 10px 25px -8px rgba(0,0,0,.4);
  animation: toast-in .25s ease;
}
@keyframes toast-in {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Avatar ── */
.avatar-outer {
  position: relative;
  width: 108px; height: 108px;
  margin: 0 auto;
}
.avatar-wrap {
  width: 108px; height: 108px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 8px 18px rgba(0,0,0,.15);
}
.avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }
.avatar-initials {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: #000;
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: .02em;
}
.avatar-editable { cursor: pointer; }
.avatar-editable:hover .avatar-wrap img,
.avatar-editable:hover .avatar-initials { filter: brightness(.8); }
.avatar-hint { font-size: .78rem; color: var(--text-muted); margin-top: .5rem; }
.avatar-cam {
  position: absolute;
  bottom: -4px; right: -4px;
  width: 30px; height: 30px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-text);
  display: flex; align-items: center; justify-content: center;
  font-size: .8rem;
  border: 3px solid #fff;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,.2);
}

/* ── Status badges (is_active / is_verified) ── */
.status-badge {
  font-size: .72rem;
  font-weight: 700;
  padding: .25rem .65rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: .3rem;
}
.status-badge--active   { background: #e6f4ea; color: #1a7a36; border: 1px solid #b7dfbf; }
.status-badge--inactive { background: #f2f2f2; color: #6b6b6b; border: 1px solid #d4d4d4; }
.status-badge--verified { background: #e8f0fe; color: #1a56a4; border: 1px solid #b3c8f5; }

/* ── Section headings ── */
.section-heading {
  font-size: .78rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: .07em;
  border-top: 1px solid var(--card-border);
  padding-top: 1.25rem;
  margin-bottom: .75rem;
}

/* ── Fields ── */
.field-label { font-size: .82rem; font-weight: 600; color: var(--text); margin-bottom: .35rem; }
.field-input {
  width: 100%;
  background: var(--field-bg);
  border: 1.5px solid var(--field-border);
  border-radius: 12px;
  padding: .6rem .9rem;
  font-size: .9rem;
  color: var(--text);
  outline: none;
  transition: border-color .15s ease, background .15s ease;
}
.field-input:disabled { color: var(--text); opacity: 1; cursor: default; }
.field-input:focus    { border-color: #000; background: #fff; }
.field-readonly       { background: var(--hover-bg) !important; color: var(--text-muted) !important; cursor: not-allowed; }

/* ── Account meta grid ── */
.meta-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: .75rem;
  margin-bottom: .5rem;
}
.meta-info-item {
  display: flex;
  align-items: flex-start;
  gap: .65rem;
  padding: .75rem .9rem;
  border: 1px solid var(--card-border);
  border-radius: 14px;
  background: var(--hover-bg);
}
.meta-info-item > i { font-size: 1.1rem; color: var(--text-muted); margin-top: .1rem; flex: 0 0 auto; }
.meta-info-label { font-size: .75rem; color: var(--text-muted); font-weight: 600; }
.meta-info-value { font-size: .88rem; font-weight: 600; color: var(--text); margin-top: .1rem; }

/* ── List rows (Borrowing / Due Date / Fine / Notifications) ── */
.list-row {
  display: flex;
  align-items: flex-start;
  gap: .85rem;
  padding: .85rem 1rem;
  border: 1px solid var(--card-border);
  border-radius: 14px;
  transition: background .15s ease;
}
.list-row:hover { background: var(--hover-bg); }
.list-row-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  border: 1px solid var(--card-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  color: var(--text);
  flex: 0 0 auto;
}
.list-row-title { font-weight: 600; font-size: .92rem; color: var(--text); position: relative; padding-right: 14px; }
.list-row-sub   { font-size: .8rem; color: var(--text-muted); margin-top: .15rem; }

.badge-status {
  font-size: .72rem;
  font-weight: 700;
  padding: .3rem .65rem;
  border-radius: 999px;
  border: 1px solid var(--text);
  white-space: nowrap;
  align-self: center;
}
.badge-returned, .badge-upcoming { border-color: var(--card-border); color: var(--text-muted); }
.badge-active, .badge-overdue, .badge-due-soon { border-color: var(--text); color: var(--text); font-weight: 800; }

/* ── Fine ── */
.fine-total-card { border: 1px solid var(--card-border); border-radius: 14px; padding: 1rem 1.1rem; }
.fine-total-amount { font-size: 1.6rem; font-weight: 800; color: var(--text); }
.fine-amount { font-weight: 700; color: var(--text); align-self: center; }

/* ── Notification dot ── */
.notif-dot {
  display: inline-block;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--text);
  margin-left: 8px;
  vertical-align: middle;
}
      `}</style>

      <div className="app-wrapper">
        <div className="dashboard-shell d-flex flex-column flex-lg-row gap-3 gap-lg-4">
          <Sidebar />
          <main className="main-card flex-grow-1">
            <Routes>
              <Route index element={<ProfileContent />} />
              <Route path="profileMember" element={<ProfileContent />} />
              <Route
                path="borrowing-history"
                element={<BorrowingHistoryContent />}
              />
              <Route path="due-date" element={<DueDateContent />} />
              <Route path="fine" element={<FineContent />} />
              <Route path="notifications" element={<NotificationsContent />} />
              <Route
                path="*"
                element={<Navigate to="profileMember" replace />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
