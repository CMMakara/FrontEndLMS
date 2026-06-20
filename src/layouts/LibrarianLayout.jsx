import React from 'react';
import Sidebar from '../components/layout/Librarian/Sidebar';
import Navbar from '../components/layout/Librarian/Navbar';
import { Outlet } from "react-router-dom";
function LibrarianLayout() {
  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ background: "#f8fafc" }}>
      
      {/* Sidebar Wrapper */}
      <div className="h-100 overflow-hidden z-2">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column h-100">
        <Navbar />

        {/* The inner main section where your dashboard cards go */}
        <main className="flex-grow-1 overflow-auto p-4 p-md-5">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
}

export default LibrarianLayout;
