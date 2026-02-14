import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/userService";
import { validateFields } from "../../utils/formValidator";
import { showAlert } from "../../utils/alerts";

import img02 from "../../../src/assest/adminLogin.png"
const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "admin@gmail.com",
    password: "Admin@123",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      { name: "email", label: "Email" },
      { name: "password", label: "Password" },
    ];
    const validation = validateFields(requiredFields, formData);
    if (!validation.isValid) {
      showAlert.warning(validation.message);
      return;
    }

    setLoading(true);

    try {
      const response = await adminLogin(formData);
      setLoading(false);

      if (response.message === "Login successful") {
        showAlert.success(response?.message);
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        localStorage.setItem("userId", response.userId);
        navigate("/admin/Selection");
      } else {
        showAlert.error(response?.message);
      }
    } catch (err: any) {
      showAlert.error("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div
    className="container-fluid vh-100 d-flex align-items-center justify-content-center"
    style={{
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    }}
  >
    <div
      className="card shadow-lg border-0 rounded-4 overflow-hidden"
      style={{
        width: "420px",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Top Image Section */}
      <div
        className="text-center p-4"
        style={{
          background: "linear-gradient(135deg, #141E30, #243B55)",
        }}
      >
        <img
         src={img02}
          alt="Admin Secure"
          style={{
            width: "90px",
            marginBottom: "10px",
          }}
        />
        <h4 className="text-white fw-bold mb-0">Admin Portal</h4>
        <small className="text-light">Secure Dashboard Access</small>
      </div>

      {/* Form Section */}
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control form-control-lg rounded-3"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control form-control-lg rounded-3"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark btn-lg w-100 rounded-3 fw-semibold"
            disabled={loading}
            style={{ transition: "0.3s" }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            className="btn btn-link text-decoration-none text-secondary"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default AdminLogin;
