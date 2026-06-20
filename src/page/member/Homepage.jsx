import React from "react";
import SubjectItem from "../../components/layout/Member/SubjectItem";
import MemberLayout from "../../layouts/MemberLayout";

function HomePage() {
  const learningTracks = [
    { text: "Coding", icon: "bi-code-square", bg: "#0d6efd", count: 142 },
    { text: "Design", icon: "bi-palette2", bg: "#198754", count: 85 },
    { text: "Business", icon: "bi-graph-up-arrow", bg: "#fd7e14", count: 64 },
    { text: "Science", icon: "bi-activity", bg: "#dc3545", count: 110 },
    { text: "Math", icon: "bi-percent", bg: "#0dcaf0", count: 93 },
    { text: "Languages", icon: "bi-translate", bg: "#6f42c1", count: 120 },
    { text: "History", icon: "bi-hourglass-split", bg: "#6c757d", count: 45 },
    { text: "Literature", icon: "bi-book-half", bg: "#20c997", count: 76 },
    { text: "Engineering", icon: "bi-cpu-fill", bg: "#052c65", count: 52 },
    { text: "Marketing", icon: "bi-megaphone-fill", bg: "#d63384", count: 39 },
    { text: "Finance", icon: "bi-cash-coin", bg: "#157347", count: 58 },
    { text: "Music", icon: "bi-music-note-list", bg: "#495057", count: 27 },
  ];
  return (
    <div className="container mt-5">
        
        {/* TOP HERO SECTION */}
        <div className="row g-4 mb-5 equal-height-row">
          {/* LEFT BANNER CAROUSEL */}
          <div className="col-12 col-md-8 col-lg-9 equal-height-col">
            <div
              id="heroBannerCarousel"
              className="carousel slide shadow-sm rounded-4 overflow-hidden"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators mb-3">
                <button
                  type="button"
                  data-bs-target="#heroBannerCarousel"
                  data-bs-slide-to="0"
                  className="active bg-primary"
                  aria-current="true"
                ></button>
                <button
                  type="button"
                  data-bs-target="#heroBannerCarousel"
                  data-bs-slide-to="1"
                  className="bg-primary"
                ></button>
                <button
                  type="button"
                  data-bs-target="#heroBannerCarousel"
                  data-bs-slide-to="2"
                  className="bg-primary"
                ></button>
              </div>

              <div className="carousel-inner h-100">
                {/* Slide 1 */}
                <div
                  className="carousel-item active h-100"
                  data-bs-interval="5000"
                >
                  <div
                    className="p-4 p-md-5 d-flex align-items-center bg-white h-100"
                    style={{ minHeight: "280px" }}
                  >
                    <div className="row align-items-center w-100 m-0">
                      <div className="col-12 col-md-8 text-center text-md-start p-0">
                        <span
                          className="badge bg-primary bg-opacity-10 text-primary fw-bold mb-2 rounded-pill px-3 py-1.5 text-uppercase"
                          style={{ fontSize: "0.75rem" }}
                        >
                          📚 June Book Fair
                        </span>
                        <h1 className="fw-black text-dark mb-2 tracking-tight display-6 animate-title-float">
                          Your Digital Smart Library
                        </h1>
                        <p className="text-secondary small mb-4 col-lg-10">
                          Instantly access over 1,000+ interactive textbooks,
                          study guides, and documentation packages on demand.
                        </p>
                        <button className="btn btn-primary btn-sm rounded-pill px-4 py-2 fw-bold">
                          Open Book Catalog
                        </button>
                      </div>
                      <div className="col-12 col-md-4 d-none d-md-flex justify-content-center align-items-center p-0">
                        <i
                          className="bi bi-book text-primary opacity-25"
                          style={{ fontSize: "8rem" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide 2 */}
                <div className="carousel-item h-100" data-bs-interval="5000">
                  <div
                    className="p-4 p-md-5 d-flex align-items-center bg-white h-100"
                    style={{ minHeight: "280px" }}
                  >
                    <div className="row align-items-center w-100 m-0">
                      <div className="col-12 col-md-8 text-center text-md-start p-0">
                        <span
                          className="badge bg-success bg-opacity-10 text-success fw-bold mb-2 rounded-pill px-3 py-1.5 text-uppercase"
                          style={{ fontSize: "0.75rem" }}
                        >
                          🎧 Live Broadcasts
                        </span>
                        <h1 className="fw-black text-dark mb-2 tracking-tight display-6">
                          Audio & Music Masterclasses
                        </h1>
                        <p className="text-secondary small mb-4 col-lg-10">
                          Tune in live into interactive audio engineering
                          workshops hosted directly by industry professionals.
                        </p>
                        <button className="btn btn-success btn-sm rounded-pill px-4 py-2 fw-bold text-white">
                          Join Broadcast
                        </button>
                      </div>
                      <div className="col-12 col-md-4 d-none d-md-flex justify-content-center align-items-center p-0">
                        <i
                          className="bi bi-headphones text-success opacity-25"
                          style={{ fontSize: "8rem" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide 3 */}
                <div className="carousel-item h-100" data-bs-interval="5000">
                  <div
                    className="p-4 p-md-5 d-flex align-items-center bg-white h-100"
                    style={{ minHeight: "280px" }}
                  >
                    <div className="row align-items-center w-100 m-0">
                      <div className="col-12 col-md-8 text-center text-md-start p-0">
                        <span
                          className="badge bg-warning bg-opacity-10 text-warning fw-bold mb-2 rounded-pill px-3 py-1.5 text-uppercase"
                          style={{ fontSize: "0.75rem" }}
                        >
                          🏆 Certifications
                        </span>
                        <h1 className="fw-black text-dark mb-2 tracking-tight display-6">
                          Earn Verified Badges
                        </h1>
                        <p className="text-secondary small mb-4 col-lg-10">
                          Complete subject milestones to receive international
                          academic and technical certifications.
                        </p>
                        <button className="btn btn-warning btn-sm rounded-pill px-4 py-2 fw-bold text-dark">
                          View Milestones
                        </button>
                      </div>
                      <div className="col-12 col-md-4 d-none d-md-flex justify-content-center align-items-center p-0">
                        <i
                          className="bi bi-trophy text-warning opacity-25"
                          style={{ fontSize: "8rem" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="carousel-control-prev justify-content-start ps-3"
                type="button"
                data-bs-target="#heroBannerCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next justify-content-end pe-3"
                type="button"
                data-bs-target="#heroBannerCarousel"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE WIDGET */}
          <div className="col-12 col-md-4 col-lg-3 equal-height-col">
            <div
              className="card border-0 shadow-sm rounded-4 text-white p-4 text-center d-flex flex-column justify-content-between overflow-hidden position-relative"
              style={{
                background: "linear-gradient(145deg, #ff7e5f 0%, #feb47b 100%)",
                minHeight: "280px",
              }}
            >
              <div className="z-1">
                <span className="badge bg-white text-danger fw-black rounded-pill px-2 py-1 small mb-2 tracking-wider animate-pulse-glow">
                  MID-YEAR SALE
                </span>
                <h4 className="fw-black text-white tracking-tight lh-sm m-0">
                  កាដូពិសេស
                </h4>
                <p className="small text-white-50 mt-1 mb-0">
                  Get full premium access pass to all certification materials.
                </p>
              </div>

              <div className="my-2 z-1">
                <i className="bi bi-journal-check text-warning display-4"></i>
              </div>

              <div className="z-1">
                <button className="btn btn-dark btn-sm w-100 fw-bold rounded-pill py-2 shadow">
                  Claim Access
                </button>
              </div>
              <div
                className="position-absolute rounded-circle bg-white opacity-10"
                style={{
                  width: "130px",
                  height: "130px",
                  top: "-20px",
                  left: "-20px",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: SUBJECT GRID */}
        <div className="mb-5">
          <div className="d-flex align-items-center mb-3">
            <h6
              className="fw-black text-secondary tracking-wider m-0 text-uppercase"
              style={{ letterSpacing: "0.5px" }}
            >
              POPULAR SUBJECTS & COURSES
            </h6>
          </div>

          <div className="row g-3">
            {learningTracks.map((track, idx) => (
              <SubjectItem
                key={idx}
                title={track.text}
                iconClass={track.icon}
                bgColor={track.bg}
                count={track.count}
              />
            ))}
          </div>
        </div>
      </div>
  );
}
export default HomePage;
