import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-white-50 py-4 mt-auto border-top border-secondary border-opacity-25">
      <div className="container">
        <div className="row align-items-center justify-content-between g-3">
          <div className="col-12 col-md-6 text-center text-md-start">
            <span className="small fw-medium">
              &copy; 2026 LMS Library Platform. All rights reserved.
            </span>
          </div>
          <div className="col-12 col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-4">
              <a
                href="#"
                className="text-white-50 text-decoration-none small transition-all"
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffc107")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white-50 text-decoration-none small transition-all"
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffc107")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;