import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Admin/Sidebar";
import Navbar from "../components/layout/Admin/Navbar";

function AdminLayout() {
  return (
    <div className="d-flex vh-100 overflow-hidden">
      {/* Sidebar Wrapper */}
      <div className="h-100 overflow-hidden">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column bg-light" style={{ transition: "all 0.3s ease" }}>
        <Navbar />

        <main className="p-3 flex-grow-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;