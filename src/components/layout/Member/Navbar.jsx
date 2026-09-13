import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUser, { broadcastUserProfile } from "../../../hook/useUsers";
import useUserAuth from "../../../hook/useAuth";
import { getAvatarUrl, handleAvatarError } from "../../../utils/avatar";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { userProfile } = useUser();
  const { logout } = useUserAuth();
  const navigate = useNavigate();

  const displayName = userProfile?.full_name || userProfile?.username || "Member";
  const avatarSrc = getAvatarUrl(userProfile?.profile_image, displayName);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    broadcastUserProfile(null);
    navigate('/login');
  };
  return (
    <>
      <style>{`
        /* ===========================
           CUSTOM ANIMATIONS & HOVERS
        =========================== */
        /* Transparent to Colored Transition */
        .navbar {
          transition: all 0.4s ease-in-out;
        }

        /* Scrolled State */
        .nav-scrolled {
          background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          padding-top: 10px !important;
          padding-bottom: 10px !important;
        }

        /* Transparent Top State */
        .nav-transparent {
          background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
          padding-top: 20px !important;
          padding-bottom: 20px !important;
        }

        /* Nav Links */
        .nav-link {
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          color: #cffafe !important;
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.15);
        }

        /* Dropdown Animation */
        .dropdown-menu {
          animation: drop 0.25s ease;
        }
        @keyframes drop {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-item {
          transition: 0.3s;
        }
        .dropdown-item:hover {
          background: #e0e7ff; 
          color: #4f46e5;      
          padding-left: 26px;
        }

        /* Interactive Elements */
        .notification-btn {
          transition: 0.3s;
        }
        .notification-btn:hover {
          background: white !important;
          color: #4f46e5 !important;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .profile-pill-btn {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
          padding: 4px 12px 4px 5px;
          border-radius: 50px;
        }
        .profile-pill-btn:hover, .profile-pill-btn:focus {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        .profile-dropdown-menu {
          min-width: 275px;
          border-radius: 18px;
          padding: 10px;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2), 0 4px 12px rgba(15, 23, 42, 0.08);
          animation: drop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .profile-user-card {
          background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
          border-radius: 14px;
          padding: 12px;
          border: 1px solid #e2e8f0;
        }
        .profile-img {
          transition: 0.3s;
        }
        .profile-img:hover {
          transform: scale(1.08);
          border-color: #cffafe !important;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }
        .nav-solid {
          background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
        /* Mobile Adjustments */
        @media(max-width: 991px) {
          .navbar-collapse {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-dark fixed-top nav-solid">
        <div className="container">

          {/* Logo */}
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center gap-2.5 fw-bold fs-4 text-white text-decoration-none"
            style={{ letterSpacing: "0.5px" }}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
              style={{
                width: "42px",
                height: "42px",
                padding: "8px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.35)",
                color: "#ffffff",
                transition: "all 0.3s ease",
              }}
            >
              <i className="bi bi-mortarboard-fill fs-5"></i>
            </div>
            <span>LMS</span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler rounded-3 border-white border-opacity-50 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse rounded-4 p-3 p-lg-0 mt-3 mt-lg-0" id="navbarNav">

            {/* Menu Links */}
            <ul className="navbar-nav me-auto ms-lg-4 align-items-center">
              <li className="nav-item">
                <Link to="/" className="nav-link text-white fw-semibold">
                  HOME
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/member/books" className="nav-link text-white fw-semibold">
                  BOOKS
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/member/help" className="nav-link text-white fw-semibold">
                  FAQ & ABOUT US
                </Link>
              </li>
            </ul>

            {/* Actions (Notifications & Profile) */}
            <div className="d-flex align-items-center mt-3 mt-lg-0 justify-content-center">

              {/* Notification */}
              <div className="dropdown me-3">
                <button
                  className="btn notification-btn rounded-circle text-white d-flex align-items-center justify-content-center position-relative border border-white border-opacity-25"
                  data-bs-toggle="dropdown"
                  style={{ width: "45px", height: "45px", background: "rgba(255,255,255,0.1)" }}
                >
                  <i className="bi bi-bell-fill"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-primary" style={{ fontSize: "10px" }}>
                    3
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-3" style={{ width: "320px" }}>
                  <li><h6 className="dropdown-header fw-bold">🔔 Notifications</h6></li>
                  <li>
                    <a className="dropdown-item py-2" href="#">
                      <strong>📚 Programming</strong><br />
                      <small className="text-muted">New course added in Programming.</small>
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <a className="dropdown-item py-2" href="#">
                      <strong>🎨 Design</strong><br />
                      <small className="text-muted">Design category updated.</small>
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item text-center text-primary fw-bold py-2" href="#">View All Notifications</a></li>
                </ul>
              </div>

              {/* Profile Dropdown */}
              <div className="dropdown">
                <button
                  className="btn profile-pill-btn d-flex align-items-center gap-2 shadow-none"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  type="button"
                >
                  <div className="position-relative d-inline-block">
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="rounded-circle border border-2 border-white object-fit-cover shadow-sm"
                      style={{ width: "38px", height: "38px" }}
                      onError={(e) => handleAvatarError(e, displayName)}
                    />
                    <span
                      className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                      style={{ width: "10px", height: "10px" }}
                      title="Active"
                    ></span>
                  </div>

                  <div className="d-none d-sm-flex flex-column text-start me-1" style={{ maxWidth: "125px" }}>
                    <span className="fw-bold text-white text-truncate" style={{ fontSize: "13px", lineHeight: "1.2" }}>
                      {displayName}
                    </span>
                    <span className="text-white-50 text-truncate" style={{ fontSize: "11px", letterSpacing: "0.2px" }}>
                      {userProfile?.role_name || "Member"}
                    </span>
                  </div>

                  <i className="bi bi-chevron-down text-white small opacity-75 ms-1"></i>
                </button>

                <ul className="dropdown-menu dropdown-menu-end profile-dropdown-menu border-0 shadow-lg mt-3">
                  {/* User Profile Header */}
                  <li>
                    <div className="profile-user-card mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={avatarSrc}
                          alt={displayName}
                          className="rounded-circle border border-2 border-white shadow-sm object-fit-cover flex-shrink-0"
                          style={{ width: "44px", height: "44px" }}
                          onError={(e) => handleAvatarError(e, displayName)}
                        />
                        <div className="overflow-hidden flex-grow-1">
                          <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: "14px" }}>
                            {displayName}
                          </h6>
                          <div className="text-muted text-truncate" style={{ fontSize: "12px" }}>
                            {userProfile?.email || "No email available"}
                          </div>
                          <div className="d-flex align-items-center gap-1 mt-1">
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: "10px", padding: "2px 6px" }}>
                              {userProfile?.role_name || "Member"}
                            </span>
                            {userProfile?.member_code && (
                              <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: "10px", padding: "2px 6px" }}>
                                {userProfile.member_code}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li>
                    <Link to="/member/profile" className="dropdown-item py-2 fw-medium d-flex align-items-center gap-2.5 rounded-3">
                      <i className="bi bi-person-circle text-primary fs-6 me-3"></i>
                      <span>My Profile</span>
                    </Link>
                  </li>

                  <li>
                    <Link to="/member/profile/borrowing-history" className="dropdown-item py-2 fw-medium d-flex align-items-center gap-2.5 rounded-3">
                      <i className="bi bi-clock-history text-info fs-6 me-3"></i>
                      <span>Borrowing History</span>
                    </Link>
                  </li>

                  <li>
                    <Link to="/member/profile/due-date" className="dropdown-item py-2 fw-medium d-flex align-items-center gap-2.5 rounded-3">
                      <i className="bi bi-calendar-event text-warning fs-6 me-3"></i>
                      <span>Due Date</span>
                    </Link>
                  </li>

                  <li>
                    <hr className="dropdown-divider my-2" />
                  </li>

                  <li>
                    <button
                      type="button"
                      className="dropdown-item py-2 text-danger fw-semibold d-flex align-items-center gap-2.5 rounded-3 w-100 text-start bg-transparent border-0"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right fs-6 me-3"></i>
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;