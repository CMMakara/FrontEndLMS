import React, { useState } from "react";
import useUser from "../../../hook/useUsers";
import useUserAuth from "../../../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../../../utils/avatar";

function Navbar() {
  const [notifications] = useState(3);
  const { userProfile } = useUser();
  const { logout } = useUserAuth();
  const navigate = useNavigate();

  const userImage = userProfile?.profile_image;
  const imgSrc = getAvatarUrl(userImage, userProfile?.full_name || "Librarian");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header
      className="navbar navbar-expand-lg sticky-top px-4 bg-white"
      style={{
        height: "80px",
        zIndex: 1000,
      }}
    >
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
        
        {/* LEFT: Greeting */}
        <div className="d-flex align-items-center">
          <h5 className="mb-0 fw-bold" style={{ color: "#1e293b", fontSize: "20px" }}>
            Good Morning, 
          </h5>
        </div>

        {/* RIGHT: Search, Notifications, Profile */}
        <div className="d-flex align-items-center gap-4">
          
          {/* Search Bar */}
          <div 
            className="input-group d-none d-md-flex align-items-center px-3" 
            style={{ 
              background: "#f1f5f9", 
              borderRadius: "20px", 
              width: "280px",
              height: "40px"
            }}
          >
            <i className="bi bi-search text-muted" style={{ fontSize: "14px" }}></i>
            <input 
              type="text" 
              className="form-control border-0 bg-transparent shadow-none" 
              placeholder="Search courses or articles..." 
              style={{ fontSize: "13px" }}
            />
          </div>

          {/* Notification Bell */}
          <button className="btn position-relative border-0 p-1 bg-transparent">
            <i className="bi bi-bell fs-5 text-muted"></i>
            {notifications > 0 && (
              <span 
                className="position-absolute translate-middle bg-danger border border-light rounded-circle"
                style={{ width: "10px", height: "10px", top: "10px", right: "-2px" }}
              ></span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="dropdown">
            <button
              type="button"
              className="btn border-0 p-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={imgSrc}
                alt="profile"
                width="40"
                height="40"
                className="rounded-circle shadow-sm"
                style={{ objectFit: "cover" }}
              />
            </button>

            <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm rounded-3 mt-2">
              <li>
                <div className="px-3 py-2">
                  <div className="fw-semibold text-dark">{userProfile?.full_name}</div>
                  <small className="text-muted">{userProfile?.email}</small>
                </div>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={() => navigate("/librarian/profile")}>
                  <i className="bi bi-person me-2"></i> Profile
                </button>
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
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