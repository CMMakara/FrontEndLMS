import React, { useState } from "react";

function Navbar() {
  const [hover, setHover] = useState("");

  const navStyle = (item) => ({
    transition: "all .3s ease",
    transform: hover === item ? "translateY(-2px)" : "translateY(0)",
    color: hover === item ? "#ffd60a" : "white",
  });

  return (
    <>
      <style>{`
        /* ===========================
           MAIN NAVBAR
        =========================== */
        .lib-nav{
          background:#175468;
          padding:12px 24px;
          position:sticky;
          top:0;
          z-index:999;
          backdrop-filter:blur(12px);
          box-shadow:0 8px 25px rgba(0,0,0,.12);
          border-bottom:1px solid rgba(255,255,255,.1);
          transition:.4s;
        }

        .lib-nav:hover{
          box-shadow:0 10px 30px rgba(0,180,216,.3);
        }

        /* ===========================
           BRAND
        =========================== */
        .lib-nav .navbar-brand{
          font-size:2rem;
          font-weight:800;
          color:#fff !important;
          letter-spacing:1px;
          transition:.3s;
        }

        .lib-nav .navbar-brand:hover{
          color:#ffd60a !important;
          transform:scale(1.05);
        }

        /* ===========================
           NAV LINKS
        =========================== */
        .lib-nav .nav-link{
          color:white !important;
          font-weight:600;
          padding:10px 18px !important;
          margin:0 4px;
          border-radius:10px;
          transition:.3s;
        }

        .lib-nav .nav-link:hover{
          background:rgba(255,255,255,.15);
          color:#ffd60a !important;
          transform:translateY(-2px);
        }

        .lib-nav .nav-link.active{
          background:rgba(255,255,255,.2);
          color:#ffd60a !important;
        }

        /* ===========================
           DROPDOWN
        =========================== */
        .lib-nav .dropdown-menu{
          border:none;
          border-radius:15px;
          overflow:hidden;
          margin-top:10px;
          box-shadow:0 10px 30px rgba(0,0,0,.15);
          animation:drop .25s ease;
        }

        @keyframes drop{
          from{opacity:0; transform:translateY(10px);}
          to{opacity:1; transform:translateY(0);}
        }

        .lib-nav .dropdown-item{
          padding:12px 18px;
          transition:.3s;
        }

        .lib-nav .dropdown-item:hover{
          background:#caf0f8;
          color:#0077b6;
          padding-left:24px;
        }

        /* ===========================
           NOTIFICATION BUTTON
        =========================== */
       .notification-btn{
        width:45px;
        height:45px;
        border-radius:50% !important;
        border:1px solid white !important;
        transition:.3s;
        color:white;
        display:flex;
        align-items:center;
        justify-content:center;
        }

        .notification-btn:hover{
          background:white !important;
          color:#00b4d8 !important;
          transform:translateY(-2px);
        }

        .notification-btn .badge{
          font-size:9px;
        }

        /* ===========================
           PROFILE
        =========================== */
        .profile-btn{
          border:none !important;
          background:transparent !important;
          padding:0;
        }

        .profile-image{
          width:42px;
          height:42px;
          border-radius:50%;
          border:2px solid white;
          transition:.3s;
          object-fit:cover;
        }

        .profile-image:hover{
          transform:scale(1.1);
          border-color:#ffd60a;
        }

        /* ===========================
           TOGGLER
        =========================== */
        .lib-nav .navbar-toggler{
          border:1px solid rgba(255,255,255,.5);
        }

        .lib-nav .navbar-toggler:focus{
          box-shadow:none;
        }

        /* ===========================
           MOBILE
        =========================== */
        @media(max-width:991px){
          .lib-nav .navbar-collapse{
            background:rgba(255,255,255,.08);
            backdrop-filter:blur(15px);
            padding:15px;
            border-radius:15px;
            margin-top:15px;
          }

          .lib-nav .nav-link{
            margin-bottom:8px;
          }
        }
      `}</style>

      <nav className="lib-nav navbar navbar-expand-lg navbar-dark">
        <div className="container">

          {/* Logo */}
          <a className="navbar-brand" href="#">
            <i className="bi bi-mortarboard-fill me-2"></i>
            LMS
          </a>

          {/* Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">

            {/* Menu */}
            <ul className="navbar-nav me-auto ms-3">
              {["HOME", "COURSES", "ABOUTS"].map((item) => (
                <li className="nav-item" key={item}>
                  <a
                    href="#"
                    className="nav-link"
                    style={navStyle(item)}
                    onMouseEnter={() => setHover(item)}
                    onMouseLeave={() => setHover("")}
                  >
                    {item}
                  </a>
                </li>
              ))}

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  CATEGORIES
                </a>

                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Programming</a></li>
                  <li><a className="dropdown-item" href="#">Design</a></li>
                  <li><a className="dropdown-item" href="#">Business</a></li>
                  <li><a className="dropdown-item" href="#">Marketing</a></li>
                </ul>
              </li>
            </ul>

            {/* Notification */}
            <div className="dropdown me-3">
              <button
                className="btn notification-btn position-relative"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-bell-fill"></i>

                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end shadow border-0"
                style={{ width: "320px" }}
              >
                <li>
                  <h6 className="dropdown-header">🔔 Notifications</h6>
                </li>

                <li>
                  <a className="dropdown-item" href="#">
                    <strong>📚 Programming</strong>
                    <br />
                    <small className="text-muted">
                      New course added in Programming category.
                    </small>
                  </a>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <a className="dropdown-item" href="#">
                    <strong>🎨 Design</strong>
                    <br />
                    <small className="text-muted">
                      Design category updated with new UI lessons.
                    </small>
                  </a>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <a className="dropdown-item text-center text-primary" href="#">
                    View All Notifications
                  </a>
                </li>
              </ul>
            </div>

            {/* Profile */}
            <div className="dropdown">
              <button className="profile-btn" data-bs-toggle="dropdown">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="Profile"
                  className="profile-image"
                />
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" href="#">👤 Profile</a></li>
                <li><a className="dropdown-item" href="#">📊 Dashboard</a></li>
                <li><a className="dropdown-item" href="#">⚙️ Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item text-danger" href="#">
                    🚪 Logout
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;