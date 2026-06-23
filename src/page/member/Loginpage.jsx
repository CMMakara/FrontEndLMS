import React from 'react';
import Loginform from '../../components/Loginform';
import { useNavigate } from 'react-router-dom';

function Loginpage() {
  const navigate = useNavigate()
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
          <>
            {/* Remember */}
            <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember"
                />

                <label
                  htmlFor="remember"
                  className="form-check-label"
                >
                  Remember me
                </label>
              </div>

              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none small"
                style={{ color: "#00b4d8" }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>
            <div className="text-center mt-4">
              <span className="text-muted">Don't have an account?</span>{' '}
              <button
                type="button"
                className="btn btn-link fw-bold text-decoration-none p-0"
                style={{ color: "#00b4d8" }}
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </div>
          </>
        }
      />
    </div>
  );
}

export default Loginpage;
