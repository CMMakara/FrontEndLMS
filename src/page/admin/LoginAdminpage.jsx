import React from 'react'
import Loginform from '../../components/Loginform'
function LoginAdminpage() {
  return (
    <div>
      <Loginform
      image='https://img.magnific.com/free-vector/online-library-concept-with-reading-people-electronic-devices-book-shelves-3d-isometric_1284-31703.jpg'
      header={
        <div className="text-center mb-4">
            <h2 className="fw-bold text-info">
              Welcome to login Admin
            </h2>
            <p className="text-muted">
              Library Management System
            </p>
        </div>
      }
      />
        

    </div>
  )
}

export default LoginAdminpage
