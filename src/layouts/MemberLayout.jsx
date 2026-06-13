import React from "react";
import Navbar from "../components/layout/Member/Navbar";
import Footer from "../components/layout/Member/footer";
function MemberLayout({ children }) {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* ១. របារ Navigation ខាងលើ */}
      <Navbar />

      {/* ២. ផ្ទៃមាតិកា (កន្លែងប្តូរទៅតាមទំព័រនីមួយៗ) */}
      <main className="flex-grow-1 py-4">
        {children} {/* មាតិកាពី Homepage នឹងត្រូវមកបង្ហាញនៅចំចំណុចនេះ */}
      </main>

      {/* ៣. របារ Footer ខាងក្រោម */}
      <Footer />
    </div>
  );
}

export default MemberLayout;