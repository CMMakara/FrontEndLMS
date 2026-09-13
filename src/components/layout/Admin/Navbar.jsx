import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import useUser from "../../../hook/useUsers";
import useUserAuth from "../../../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../../../utils/avatar";

function Navbar() {
  const [notifications] = useState(3);
  const { userProfile } = useUser();
  const {logout} = useUserAuth()
  const navigate = useNavigate()

  const profileImage = getAvatarUrl(userProfile?.profile_image, userProfile?.full_name || "Admin");

  const handleLogout = async () =>{
    await logout()
    navigate('/login')
  }
  return (
    <header
      className="navbar navbar-expand-lg sticky-top px-4"
      style={{
        height: "68px",
        background: "#0f172a",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        zIndex: 1000,
      }}
    >
      <style>{`
        .custom-dropdown {
          min-width: 240px;
          background: #111827;
          border-radius: 14px;
          overflow: hidden;
          padding: 6px;
        }
        .custom-dropdown .dropdown-item {
          color: #cbd5e1;
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 13.5px;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .custom-dropdown .dropdown-item:hover,
        .custom-dropdown .dropdown-item:focus {
          background: rgba(255,255,255,0.06);
          color: #f8fafc;
        }
        .custom-dropdown .dropdown-item.text-danger:hover,
        .custom-dropdown .dropdown-item.text-danger:focus {
          background: rgba(220,53,69,0.12);
          color: #f87171;
        }
        .custom-dropdown .dropdown-divider {
          border-color: rgba(255,255,255,0.08);
          margin: 6px 0;
        }
      `}</style>

      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
        {/* LEFT */}
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-grid-1x2-fill text-info fs-5"></i>
          <h5
            className="mb-0 fw-semibold"
            style={{ color: "#f8fafc", fontSize: "17px", letterSpacing: "0.3px" }}
          >
            Library Dashboard
          </h5>
        </div>

        {/* RIGHT */}
        <div className="d-flex align-items-center gap-3">
          {/* NOTIFICATION */}
          <button
            type="button"
            className="btn position-relative border-0"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.04)",
              color: "#cbd5e1",
            }}
          >
            <i className="bi bi-bell-fill fs-6"></i>
            {notifications > 0 && (
              <span
                className="position-absolute badge rounded-pill bg-danger"
                style={{ top: "5px", right: "5px", fontSize: "9px" }}
              >
                {notifications}
              </span>
            )}
          </button>

          {/* DIVIDER */}
          <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.08)" }} />

          {/* PROFILE DROPDOWN */}
          <div className="dropdown">
            <button
              type="button"
              className="btn d-flex align-items-center gap-3 border-0 px-2 py-1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ background: "rgba(255,255,255,0.04)", borderRadius: "14px" }}
            >
              {/* AVATAR */}
              <img
                src={profileImage}
                alt="profile"
                width="40"
                height="40"
                style={{
                  borderRadius: "12px",
                  objectFit: "cover",
                  border: "2px solid rgba(255,255,255,0.1)",
                }}
              />

              {/* USER INFO */}
              <div className="text-start d-none d-md-block">
                <div className="fw-semibold" style={{ color: "#f8fafc", fontSize: "13.5px" }}>
                  {userProfile?.full_name || "Loading..."}
                </div>

                <span className="text-info text-uppercase"
                  style={{ fontSize: "10px", borderRadius: "8px" }}
                >
                  Super Admin
                </span>
              </div>

              <i className="bi bi-chevron-down text-secondary"></i>
            </button>

            {/* DROPDOWN MENU */}
            <ul className="dropdown-menu dropdown-menu-end border-0 shadow custom-dropdown">
              {/* User info */}
              <li>
                <div className="px-3 py-2">
                  <div className="fw-semibold text-white">
                    {userProfile?.full_name}
                  </div>
                  <small className="text-secondary">
                    {userProfile?.email}
                  </small>
                </div>
              </li>

              <li><hr className="dropdown-divider" /></li>

              {/* Profile */}
              <li>
                <button type="button" className="dropdown-item" onClick={()=> navigate('/admin/profile')}>
                  <i className="bi bi-person me-2"></i> Profile
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>

              {/* Logout */}
              <li>
                <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;