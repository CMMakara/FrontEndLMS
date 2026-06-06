import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../../assets/Sidebar.css";

const menuItems = [
  { to: "/admin", end: true, icon: "bi-speedometer2", label: "Dashboard" },
  { to: "/admin/books", icon: "bi-book", label: "Books" },
  { to: "/admin/users", icon: "bi-people", label: "Users" },
  { to: "/admin/category", icon: "bi-collection-fill", label: "Category" },
  { to: "/admin/authors", icon: "bi bi-person-badge", label: "Authors" },
  { to: "/admin/publishers", icon: "bi bi-building", label: "Publishers" },
  { to: "/admin/reports", icon: "bi-bar-chart-line", label: "Reports" },
  { to: "/admin/settings", icon: "bi-gear", label: "Settings" },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sb-wrap ${collapsed ? "collapsed" : ""}`}>
      {/* Brand */}
      <div className="sb-brand">
        <div
          className="sb-brand-icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          <i className={`bi ${collapsed ? "bi-list" : "bi-x-lg"}`} />
        </div>

        <div className="sb-brand-text">
          <div className="sb-brand-title">Admin Panel</div>
          <div className="sb-brand-sub">Library System</div>
        </div>
      </div>

      {/* Menu */}
      <nav className="sb-nav">
        <div className="sb-section">Menu</div>

        {menuItems.map(({ to, end, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sb-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sb-icon">
              <i className={`bi ${icon}`} />
            </span>

            <span className="sb-label">{label}</span>
            <span className="sb-tooltip">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sb-footer">
        <div className="sb-avatar">A</div>

        <div className="sb-footer-text">
          <div className="sb-footer-name">Admin User</div>
          <div className="sb-footer-copy">Super Admin</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;