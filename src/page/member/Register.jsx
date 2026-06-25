import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import { validateRegister } from '../../validations/RegisterSchema'
import useUserAuth from '../../hook/useAuth';
import { useNavigate } from 'react-router-dom';
function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useUserAuth()
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateRegister(formData);

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      let result = await register(payload)
      if (!result) {
        setErrors({ api: "Registration failed" });
        return;
      }
      setErrors({});
      localStorage.setItem("verifyEmail", formData.email);
      navigate("/verify-otp", {
        state: {
          email: formData.email,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center min-vh-100"
    >
      {/* Main Wrapper Box */}
      <div
        className="row g-0 bg-white rounded-5 shadow-lg overflow-hidden w-100"
        style={{ maxWidth: '1000px', minHeight: '600px' }}
      >

        <div
          className="col-md-6 d-none d-md-flex position-relative overflow-hidden"
          style={{ backgroundColor: '#f3e8ff', minHeight: '100%' }}
        >
          <img
            src="https://i.pinimg.com/736x/f7/90/0f/f7900fe480eb22e130d3fe3b37e59d2c.jpg"
            alt="Library Illustration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
        </div>

        <div className="col-md-6 p-4 p-sm-5 d-flex flex-column justify-content-center">
          <div className="mb-4">
            <h2 className="fw-bold text-dark m-0" style={{ fontSize: '2rem' }}>Hello,</h2>
            <h3 className="fw-bold text-muted" style={{ fontSize: '1.5rem' }}>Create Account</h3>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Full Name field */}
            <div className="form-floating mb-3">
              <Input
                width='100%'
                icon="bi-person"
                label='Full Name'
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                error={errors.full_name}
                onChange={handleChange}
              />
            </div>

            {/* Username field */}
            <div className="form-floating mb-3">
              <Input
                width='100%'
                icon="bi-person-badge"
                label='Username'
                name="username"
                placeholder="Username"
                value={formData.username}
                error={errors.username}
                onChange={handleChange}
              />
            </div>

            {/* Email field */}
            <div className="form-floating mb-3">
              <Input
                width='100%'
                icon="bi-envelope"
                label='Email address'
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                error={errors.email}
                onChange={handleChange}
              />
            </div>

            {/* Password field */}
            <div className="form-floating mb-3">
              <Input
                width='100%'
                icon="bi-lock"
                label='Password'
                name="password"
                placeholder="Password"
                value={formData.password}
                error={errors.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password field */}
            <div className="form-floating mb-4">
              <Input
                width='100%'
                icon="bi-shield-lock"
                label='Confirm Password'
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                error={errors.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className="btn text-white w-100 py-2.5 rounded-3 fw-semibold mb-4"
              style={{ backgroundColor: '#5c33cc', backgroundImage: 'linear-gradient(to right, #5c33cc, #7952de)' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>

            {/* Bottom Link redirection */}
            <div className="text-center small text-muted">
              Already have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0 fw-bold"
                style={{ color: "#5c33cc" }}
                onClick={() => navigate("/login")}
              >
                Click here
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;