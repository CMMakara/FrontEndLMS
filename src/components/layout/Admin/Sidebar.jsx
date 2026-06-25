import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../../assets/Sidebar.css";

const menuItems = [
  { to: "/admin", end: true, icon: "bi-speedometer2", label: "Dashboard" },
  { to: "/admin/books", icon: "bi-book", label: "Books" },
  { to: "/admin/users", icon: "bi-people", label: "Users" },
  { to: "/admin/category", icon: "bi-collection-fill", label: "Category" },
  { to: "/admin/authors", icon: "bi-person-badge", label: "Authors" },
  { to: "/admin/publishers", icon: "bi-building", label: "Publishers" },
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
    </div>
  );
}

export default Sidebar;