import React from "react";

function Footer() {
  // Automatically gets the current real year
  const currentYear = new Date().getFullYear();

  const categories = [
    { id: 1, name: "Fiction", iconClass: "bi bi-book" },
    { id: 2, name: "Science", iconClass: "bi bi-lightbulb" },
    { id: 3, name: "History", iconClass: "bi bi-hourglass-split" },
    { id: 4, name: "Coding", iconClass: "bi bi-code-slash" }
  ];

  const socialIcons = [
    { class: "bi bi-twitter-x", label: "Twitter X" },
    { class: "bi bi-facebook", label: "Facebook" },
    { class: "bi bi-linkedin", label: "LinkedIn" },
    { class: "bi bi-youtube", label: "YouTube" }
  ];

  return (
    <>
      <style>{`
        /* ===========================
           MODERN FOOTER STYLES
        =========================== */
        .custom-footer {
          background-color: #0f172a; /* Deep modern slate/indigo */
          border-top: 4px solid #4f46e5; /* Indigo accent border */
        }
        
        .footer-link {
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          font-size: 0.9rem;
        }
        
        .footer-link:hover {
          color: #cffafe; /* Cyan highlight from hero section */
          transform: translateX(4px); /* Slide right effect */
        }

        .footer-social-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .footer-social-btn:hover {
          background: #4f46e5; /* Indigo background on hover */
          color: white;
          transform: translateY(-3px); /* Float up effect */
          box-shadow: 0 5px 15px rgba(79, 70, 229, 0.4);
        }

        .icon-accent {
          color: #06b6d4; /* Vibrant cyan */
        }
      `}</style>

      <footer className="custom-footer text-light pt-5 pb-3">
        <div className="container">
          
          {/* Main Footer Grid */}
          <div className="row g-4 mb-4">
            
            {/* Column 1: Brand & About */}
            <div className="col-sm-6 col-md-3">
              <span className="d-flex align-items-center fs-4 fw-bold mb-3 text-white tracking-tight">
                <i className="bi bi-mortarboard-fill icon-accent me-2"></i> 
                LMS <span className="ms-1" style={{ color: "#cffafe", fontWeight: 400 }}>System</span>
              </span>
              <p className="text-muted small lh-base" style={{ color: "#94a3b8" }}>
                Your modern digital library, reimagined for the future. Free access, limitless boundaries.
              </p>
              
              {/* Social Icons */}
              <div className="d-flex gap-2 mt-4">
                {socialIcons.map((social, i) => (
                  <a key={i} href="#" className="footer-social-btn fs-6" aria-label={social.label}>
                    <i className={social.class}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-sm-6 col-md-3 ps-lg-5">
              <h5 className="text-white mb-3 fw-semibold fs-6">Quick Links</h5>
              <ul className="list-unstyled">
                {[
                  "Home",
                  "Browse Books",
                  "My Borrowings",
                  "New Arrivals",
                  "Popular Titles",
                ].map((link) => (
                  <li key={link} className="mb-2">
                    <a href="#" className="footer-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Categories */}
            <div className="col-sm-6 col-md-3">
              <h5 className="text-white mb-3 fw-semibold fs-6">Categories</h5>
              <ul className="list-unstyled">
                {categories.map((cat) => (
                  <li key={cat.id} className="mb-2">
                    <a href="#" className="footer-link d-flex align-items-center gap-2">
                      <i className={`${cat.iconClass} icon-accent`}></i> {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="col-sm-6 col-md-3">
              <h5 className="text-white mb-3 fw-semibold fs-6">Contact Us</h5>
              <div className="d-flex flex-column gap-3" style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                <div className="d-flex align-items-start gap-3">
                  <i className="bi bi-geo-alt-fill icon-accent fs-5"></i>
                  <span>12 Bookshelf Lane,<br/>Phnom Penh</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-telephone-fill icon-accent fs-5"></i>
                  <span>+855 23 456 789</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-envelope-fill icon-accent fs-5"></i>
                  <span>hello@lms.kh</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Bottom Bar */}
          <div className="pt-4 mt-2 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="small mb-0" style={{ color: "#64748b" }}>
              {/* This automatically gets the real current year! */}
              © {currentYear} LMS. All rights reserved.
            </p>
            <div className="d-flex gap-4">
              <a href="#" className="footer-link" style={{ fontSize: "0.8rem" }}>
                Privacy Policy
              </a>
              <a href="#" className="footer-link" style={{ fontSize: "0.8rem" }}>
                Terms of Service
              </a>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

export default Footer;