import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { to: "/librarian", end: true, icon: "bi-grid-1x2-fill", label: "Dashboard" },
  { to: "/librarian/borrow-requests", icon: "bi-inbox-fill", label: "Borrow Requests"},
  { to: "/librarian/issueBooks", icon: "bi-book-half", label: "Issue Books"},
  { to: "/librarian/returnBooks", icon: "bi-arrow-return-left", label: "Return Books" },
  { to: "/librarian/calculateFine", icon: "bi-cash-coin", label: "Calculate Fine" },
  { to: "/librarian/Member", icon: "bi-people-fill", label: "Member" },
  { to: "/librarian/register-member", icon: "bi-person-plus-fill", label: "Register Member" },
  { to: "/librarian/borrow-records", icon: "bi-journal-text", label: "Borrow Records" }
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const activeColor = "#00c08b"; // The green from the image

  return (
    <div 
      className="d-flex flex-column bg-white h-100" 
      style={{ 
        width: collapsed ? "80px" : "250px", 
        transition: "all 0.3s ease",
        boxShadow: "2px 0 10px rgba(0,0,0,0.02)"
      }}
    >
      {/* Brand */}
      <div className="d-flex align-items-center justify-content-between p-4 mb-2">
        {!collapsed && (
          <div className="fs-3 fw-bolder" style={{ letterSpacing: "-1px" }}>
            L<span style={{ color: activeColor }}>MS</span>
          </div>
        )}
        <i 
          className={`bi ${collapsed ? "bi-list fs-3 mx-auto" : "bi-list fs-4"}`} 
          style={{ cursor: "pointer", color: "#94a3b8" }}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Menu Navigation */}
      <nav className="flex-grow-1 d-flex flex-column gap-2 px-3">
        {menuItems.map(({ to, end, icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="text-decoration-none d-flex align-items-center justify-content-between px-3 py-2 rounded-3 fw-semibold"
            style={({ isActive }) => ({
              color: isActive ? activeColor : "#64748b",
              background: isActive ? "transparent" : "transparent",
              position: "relative"
            })}
          >
            {({ isActive }) => (
              <>
                {/* Active Left Border Indicator */}
                {isActive && (
                  <div 
                    style={{ 
                      position: "absolute", left: "-16px", top: "10%", height: "80%", width: "4px", 
                      backgroundColor: activeColor, borderRadius: "0 4px 4px 0" 
                    }} 
                  />
                )}
                
                <div className="d-flex align-items-center gap-3">
                  <i className={`bi ${icon} fs-5`}></i>
                  {!collapsed && <span>{label}</span>}
                </div>

                {!collapsed && badge && (
                  <span 
                    className="badge rounded-pill" 
                    style={{ backgroundColor: activeColor, fontSize: "11px" }}
                  >
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 pb-4">
        <NavLink to="/librarian/support" className="text-decoration-none d-flex align-items-center px-3 py-2 rounded-3 fw-semibold mb-1 text-muted">
           <i className="bi bi-chat-dots fs-5 me-3"></i>
           {!collapsed && <span>Support</span>}
        </NavLink>
        <button className="btn border-0 text-decoration-none d-flex align-items-center px-3 py-2 rounded-3 fw-semibold text-muted w-100 text-start">
           <i className="bi bi-box-arrow-right fs-5 me-3"></i>
           {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;