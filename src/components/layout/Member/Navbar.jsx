import React, { useState, useEffect } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to toggle navbar style
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
          <a className="navbar-brand d-flex align-items-center fw-bold fs-4 text-white" style={{ letterSpacing: "0.5px" }} href="#">
            <i className="bi bi-mortarboard-fill me-2 fs-3"></i>
            LMS
          </a>

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
              {["HOME", "BOOKS", "FAQ & ABOUT US"].map((item) => (
                <li className="nav-item m-1 m-lg-0 mx-lg-1" key={item}>
                  <a href="#" className="nav-link text-white fw-semibold px-3 py-2 rounded-pill">
                    {item}
                  </a>
                </li>
              ))}
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

              {/* Profile */}
              <div className="dropdown">
                <button className="btn p-0 border-0 bg-transparent shadow-none" data-bs-toggle="dropdown">
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="Profile"
                    className="profile-img rounded-circle border border-2 border-white border-opacity-50 object-fit-cover"
                    style={{ width: "45px", height: "45px" }}
                  />
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-3">
                  <li>
                    <a className="dropdown-item py-2 fw-medium d-flex align-items-center gap-2" href="#">
                      <i className="bi bi-person-circle"></i>
                      Profile
                    </a>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <a className="dropdown-item py-2 text-danger fw-bold d-flex align-items-center gap-2" href="#">
                      <i className="bi bi-box-arrow-right"></i>
                      Logout
                    </a>
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