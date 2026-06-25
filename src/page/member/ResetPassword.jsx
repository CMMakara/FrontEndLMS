import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    console.log("Password updated successfully");
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage:
          "linear-gradient(rgba(13, 16, 23, 0.7), rgba(13, 16, 23, 0.85)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1920&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div
        className="card p-3 shadow-lg border border-secondary border-opacity-25"
        style={{
          width: '100%',
          maxWidth: '380px',
          borderRadius: '16px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
      >
        <div className="card-body p-2 text-white">

          {/* Back Button */}
          <div className="d-flex align-items-center mb-3">
            <button
              type="button"
              className="btn btn-sm btn-dark border-0 d-flex align-items-center gap-2 bg-transparent"
              onClick={() => navigate(-1)}
              style={{
                fontSize: '0.85rem',
                opacity: 0.8,
                transition: '0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseOut={(e) => (e.currentTarget.style.opacity = 0.8)}
            >
              <i className="bi bi-arrow-left"></i>
              Back
            </button>
          </div>

          {/* Header Icon */}
          <div className="text-center mb-3">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-25 text-success"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                color: '#00C18F'
              }}
            >
              <i className="bi bi-book-half fs-4"></i>
            </div>
          </div>

          <h4 className="text-center mb-1 fw-bold">System Password Reset</h4>
          <p className="text-center text-white-50 mb-4 small">
            Library Management System Portal
          </p>

          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="mb-3">
              <label className="form-label small text-white-50 fw-medium mb-1">
                New Password
              </label>

              <Input
                icon="bi bi-lock"
                type="password"
                width="100%"
                placeholder='Please enter new password'
                className="form-control bg-dark bg-opacity-25 text-white border-secondary border-opacity-50 shadow-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  borderRight: 'none',
                  borderRadius: '8px'
                }}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label small text-white-50 fw-medium mb-1">
                Confirm Password
              </label>

              <Input
                icon="bi bi-shield-lock"
                type="password"
                width="100%"
                placeholder='Please enter Confirm Password'
                className="form-control bg-dark bg-opacity-25 text-white border-secondary border-opacity-50 shadow-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  borderRight: 'none',
                  borderRadius: '8px'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100 fw-bold py-2 shadow-sm"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                backgroundColor: '#00C18F',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#090d14',
                transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: isHovered
                  ? '0 4px 12px rgba(0, 193, 143, 0.3)'
                  : 'none',
                transition: 'all 0.15s ease-in-out'
              }}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;