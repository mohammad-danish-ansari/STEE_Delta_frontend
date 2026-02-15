import React from "react";
import { useNavigate } from "react-router-dom";

const AlreadySubmitted = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <div className="card p-5 shadow rounded-4">
        <h3 className="text-success mb-3">
          Assessment Already Submitted
        </h3>

        <p className="text-muted">
          You have already submitted your assessment.
          Please wait for the recruiter’s response.
        </p>

        <button
          className="btn btn-dark mt-3"
          onClick={() => navigate("/candidate/dashboard", { replace: true })}
        >
          Go To Dashboard
        </button>
      </div>
    </div>
  );
};

export default AlreadySubmitted;
