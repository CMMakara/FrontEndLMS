import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar() {
  const [notifications] = useState(3);

  return (
    <header 
      className="navbar navbar-expand px-4 sticky-top"
      style={{
        height: "72px",
        backgroundColor: "#0a1628", // Matches your sidebar perfectly
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        zIndex: 90,
        fontFamily: "'Outfit', sans-serif"
      }}
    >
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
        
        {/* Left Side: Page Title (Replaced the bulky search box) */}
        <div className="d-flex align-items-center">
          <h5 className="text-white m-0 fw-semibold" style={{ fontSize: "16px", letterSpacing: "0.3px" }}>
            Overview Panel
          </h5>
        </div>

        {/* Right Side: Actions & Premium Profile Layout */}
        <div className="d-flex align-items-center gap-2">
          
          {/* Action Icons Group */}
          <div className="d-flex align-items-center gap-1">
            {/* Notification Button */}
            <button 
              className="btn border-0 p-0 d-flex align-items-center justify-content-center position-relative text-white text-opacity-60"
              style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "10px", 
                transition: "all 0.2s ease" 
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.color = "#00b4d8";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <i className="bi bi-bell" style={{ fontSize: "18px" }} />
              {notifications > 0 && (
                <span 
                  className="position-absolute badge rounded-pill bg-danger" 
                  style={{ 
                    fontSize: "9px", 
                    padding: "4px 6px",
                    top: "6px",
                    right: "6px",
                    border: "2px solid #0a1628"
                  }}
                >
                  {notifications}
                </span>
              )}
            </button>

            {/* Help Button */}
            <button 
              className="btn border-0 p-0 d-flex align-items-center justify-content-center text-white text-opacity-60"
              style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "10px", 
                transition: "all 0.2s ease" 
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.color = "#00b4d8";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <i className="bi bi-question-circle" style={{ fontSize: "18px" }} />
            </button>
          </div>

          {/* Clean Divider Line */}
          <div className="vr bg-white bg-opacity-10 my-auto mx-2" style={{ height: "20px", width: "1px" }} />

          {/* Fixed Premium Profile Section */}
          <div 
            className="d-flex align-items-center gap-3 p-1 pe-2 ps-2 rounded-3" 
            style={{ 
              cursor: "pointer", 
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" 
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {/* User Meta Data (Aligned perfectly right) */}
            <div className="d-flex flex-column align-items-end lh-1">
              <span className="text-white fw-semibold mb-1" style={{ fontSize: "13.5px" }}>
                Admin User
              </span>
              <span className="text-info fw-bold" style={{ fontSize: "10px", letterSpacing: "0.6px", opacity: 0.85 }}>
                SUPER ADMIN
              </span>
            </div>
            
            {/* High-End Gradient Avatar Box */}
            <div 
              className="d-flex align-items-center justify-content-center border"
              style={{ 
                width: "38px", 
                height: "38px", 
                borderRadius: "10px",
                background: "linear-gradient(135deg, #00b4d8, #0077b6)",
                borderColor: "rgba(255, 255, 255, 0.15)",
                boxShadow: "0 2px 8px rgba(0, 180, 216, 0.2)"
              }}
            >
              <i className="bi bi-person-fill text-white" style={{ fontSize: "17px" }} />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;