import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img01 from "../../../src/assest/authSelection.jpeg"
const AuthSelection: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <div
      className="container-fluid vh-100 d-flex align-items-center"
      style={{
        background: "linear-gradient(135deg, #4b79a1, #283e51)",
      }}
    >
      <div className="row w-100 mx-0 align-items-center justify-content-center">

        {/* Illustration / Artwork Section */}
        <div className="col-lg-6 d-none d-lg-flex justify-content-center">
          <img
            src={img01}
            alt="Secure Login Illustration"
            style={{
              maxWidth: "80%",
              borderRadius: "15px",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
            }}
          />
        </div>

        {/* Form Card */}
        <div className="col-md-8 col-lg-4">
          <div
            className="card shadow-lg text-center p-5 rounded-4"
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
            }}
          >
            <h2 className="fw-bold text-dark mb-2">Welcome to Secure Portal</h2>
            <p className="text-muted mb-4">
              Choose your login type to continue securely
            </p>

            <div className="d-grid gap-3">
              <button
                className="btn btn-primary btn-lg rounded-pill fw-semibold"
                onClick={() => navigate("/admin/login")}
              >
                Admin Login
              </button>

              <button
                className="btn btn-outline-secondary btn-lg rounded-pill fw-semibold"
                onClick={() => navigate("/candidate/login")}
              >
                Candidate Login
              </button>
            </div>

            <small className="text-muted mt-4 d-block">
              @ {new Date().getFullYear()} Secure Test Environment
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSelection;
