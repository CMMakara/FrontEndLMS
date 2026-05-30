import React from 'react'
import Loginform from '../../components/Loginform';
function LoginLibrarianpage() {
  return (
    <div>
      <div>
        <Loginform
          image="https://img.magnific.com/free-vector/library-online-cocept-layout-chart-print_1284-6709.jpg?semt=ais_hybrid&w=740&q=80"
          header={
            <div className="text-center mb-4">
              <h2 className="fw-bold text-info">Welcome to Librarian</h2>
              <p className="text-muted">Library Management System</p>
            </div>
          }
        />
      </div>
    </div>
  )
}

export default LoginLibrarianpage

