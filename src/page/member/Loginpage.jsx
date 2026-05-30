import React from 'react';
import Loginform from '../../components/Loginform';

function Loginpage() {
  return (
    <div>
      <Loginform
        image="https://www.shriconnect.com/wp-content/uploads/2023/12/books-laptop-1-1024x683.jpg"
        header={
          <div className="text-center mb-4">
            <h2 className="fw-bold text-info">Welcome to</h2>
            <p className="text-muted">Library Management System</p>
          </div>
        }
        footer={
          <div className="text-center mt-4">
            <span className="text-muted">Don't have an account?</span>{' '}
            <a
              href="#"
              className="fw-bold text-decoration-none"
              style={{ color: '#00b4d8' }}
            >
              Sign Up
            </a>
          </div>
        }
      />
    </div>
  );
}

export default Loginpage;
