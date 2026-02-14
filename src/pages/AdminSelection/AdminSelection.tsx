import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExitModel from './../../components/ExitModel/ExitModel';

const AdminSelection: React.FC = () => {
  const [isOepn, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <ExitModel
        isOpen={isOepn}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          handleLogout();
          setIsOpen(false);
        }}
        title="Logout"
        message="Are you sure you want to Logout?"
        confirmLabel="Yes"
        cancelLabel="No"
      />
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            Admin Dashboard
          </span>
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-sm btn-outline-danger ms-2"
          >
            <i className="fa-solid fa-right-from-bracket me-2"></i>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="row w-100 g-4">

          {/* Create Candidate Card */}
          <div className="col-md-4">
            <div
              onClick={() => navigate("/admin/dashboard")}
              className="card shadow-sm border-0 h-100 text-center p-4"
              style={{ cursor: "pointer", transition: "0.3s" }}
            >
              <div className="display-4 text-primary mb-3"><i className="fa-solid fa-user"></i></div>
              <h5 className="fw-bold">Create Candidate</h5>
              <p className="text-muted">
                Add new candidate details and manage candidate records.
              </p>
            </div>
          </div>

          {/* Create Question Card */}
          <div className="col-md-4">
            <div
              onClick={() => navigate("/admin/question")}
              className="card shadow-sm border-0 h-100 text-center p-4"
              style={{ cursor: "pointer", transition: "0.3s" }}
            >
              <div className="display-4 text-success mb-3"><i className="fa-solid fa-file-lines"></i></div>
              <h5 className="fw-bold">Create Question</h5>
              <p className="text-muted">
                Add and manage exam or interview questions easily.
              </p>
            </div>
          </div>

          {/* Candidate Results Card */}
          <div className="col-md-4">
            <div
              onClick={() => navigate("/admin/result")}
              className="card shadow-sm border-0 h-100 text-center p-4"
              style={{ cursor: "pointer", transition: "0.3s" }}
            >
              <div className="display-4 text-warning mb-3"><i className="fa-solid fa-chart-column"></i></div>
              <h5 className="fw-bold">Candidate Results</h5>
              <p className="text-muted">
                View submitted assessments, scores, and candidate performance.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminSelection;
