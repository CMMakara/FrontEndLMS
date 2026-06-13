import React, { useState } from "react";

function Navbar() {
  const [hover, setHover] = useState("");

  const navStyle = (item) => ({
    transition: "all 0.3s ease",
    transform: hover === item ? "translateY(-2px)" : "translateY(0)",
    color: hover === item ? "#ffc107" : "white",
  });

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary shadow"
      style={{
        padding: "12px 0",
        transition: "all .4s ease",
      }}
    >
      <div className="container">

        {/* Logo */}
        <a
          className="navbar-brand fw-bold fs-3"
          href="#"
          style={{
            transition: ".3s",
          }}
        >
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

            {/* "My Learning" has been removed from this array */}
            {["Home", "Courses", "About"].map((item) => (
              <li className="nav-item" key={item}>
                <a
                  href="#"
                  className="nav-link fw-semibold"
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
                className="nav-link dropdown-toggle fw-semibold"
                href="#"
                data-bs-toggle="dropdown"
                style={navStyle("cat")}
                onMouseEnter={() => setHover("cat")}
                onMouseLeave={() => setHover("")}
              >
                Categories
              </a>

              <ul className="dropdown-menu shadow border-0 rounded-3">
                <li><a className="dropdown-item" href="#">Programming</a></li>
                <li><a className="dropdown-item" href="#">Design</a></li>
                <li><a className="dropdown-item" href="#">Business</a></li>
                <li><a className="dropdown-item" href="#">Marketing</a></li>
              </ul>
            </li>

          </ul>

          {/* Notification */}
          <button
            className="btn btn-outline-light rounded-circle me-3 position-relative"
            style={{
              width: "45px",
              height: "45px",
              transition: ".3s",
            }}
          >
            <i className="bi bi-bell"></i>

            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </button>

          {/* Profile */}
          <div className="dropdown">
            <button
              className="btn btn-light rounded-pill px-3 dropdown-toggle"
              data-bs-toggle="dropdown"
              style={{
                transition: ".3s",
              }}
            >
              <i className="bi bi-person-circle me-2"></i>
              Student
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
              <li><a className="dropdown-item" href="#">Profile</a></li>
              <li><a className="dropdown-item" href="#">Dashboard</a></li>
              <li><a className="dropdown-item" href="#">Settings</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item text-danger" href="#">
                  Logout
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;