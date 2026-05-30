import React, { useState } from "react";
import Input from "../components/ui/Input"
import useUserAuth from "../hook/useAuth";
function Loginform({
  image = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1350&q=80",
  header,
  footer
}) {
  const { handleLogin } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(email , password)
  };

  const styles = {
    primaryBg: {
      backgroundColor: "#00b4d8",
      borderColor: "#00b4d8",
    },

    lightText: {
      color: "#00b4d8",
    },

    imageSection: {
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },

    card: {
      height: "80vh",
      maxWidth: "1200px",
      backgroundColor: "#fff",
      overflow: "hidden",
      borderRadius: "24px",
      boxShadow:
        "0 25px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)",
    },
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light px-3"
      style={{ minHeight: "100vh" }}
    >
      <div className="container p-0" style={styles.card}>
        <div className="row h-100 g-0">
          {/* Left Image */}
          <div
            className="col-lg-6 d-none d-lg-block"
            style={styles.imageSection}
          >
            <div
              className="h-100 w-100"
              style={{
                background:
                  "linear-gradient(rgba(0,180,216,.15), rgba(0,180,216,.15))",
              }}
            />
          </div>

          {/* Right Form */}
          <div className="col-lg-6 bg-white d-flex justify-content-center align-items-center">
            <div className="w-100 px-4" style={{ maxWidth: "450px" }}>

              {header}

              <form onSubmit={handleSubmit}>
                {/* Email */}
                
                <div className="mb-3">
                  <Input 
                  label="Email"
                  width="100%" 
                  placeholder="Enter your email or Username"
                  icon="bi bi-person"
                  value={email}
                  onChange={(e)=> setEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <Input 
                  label="Password"
                  width="100%" 
                  placeholder="Enter your password"
                  icon="bi bi-lock-fill"
                  type="password"
                  value={password}
                  onChange={(e)=> setPassword(e.target.value)}
                  />
                </div>

                {/* Remember */}
                <div className="d-flex justify-content-between align-items-center mb-4">
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

                  <a
                    href="#"
                    className="text-decoration-none"
                    style={styles.lightText}
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="btn btn-lg w-100 text-white fw-semibold"
                  style={styles.primaryBg}
                >
                  Sign In
                </button>
                {/* Footer */}
                {footer}
              </form>
            </div>
          </div>
          {/* End Form */}
        </div>
      </div>
    </div>
  );
}

export default Loginform;