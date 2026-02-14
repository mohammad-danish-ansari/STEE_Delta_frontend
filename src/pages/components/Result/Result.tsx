import React, { useEffect, useState } from "react";
import { showAlert } from "../../../utils/alerts";
import { candidateAttemptResult, deleteAttemptByAdmin } from './../../../services/attemptService';
import ExitModel from './../../../components/ExitModel/ExitModel';
import { useNavigate } from 'react-router-dom';

interface ResultItem {
  _id: string;
  score: number;
  status: string;
  submittedAt: string;
  userId: {
    name: string;
    email: string;
  };
}

const Result: React.FC = () => {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [deleteAttempt, setDeleteAttempt] = useState(false);
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);


  const navigate = useNavigate();
  const getResults = async () => {
    try {
      setLoading(true);

      const response = await candidateAttemptResult();

      if (response?.data) {
        setResults(response.data);
      }
    } catch (error) {
      showAlert.error("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResults();
  }, []);



  const handleDelete = async (id: string) => {
    try {
      const response = await deleteAttemptByAdmin(id);

      if (response?.message === "Attempt deleted successfully") {
        showAlert.success(response.message);
        getResults();
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.message || "Something went wrong";

      showAlert.error(errorMessage);
    }
  };
  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">

      <ExitModel
        isOpen={deleteAttempt}
        onClose={() => setDeleteAttempt(false)}
        onConfirm={() => {
          if (selectedAttemptId) {
            handleDelete(selectedAttemptId);
          }
          setDeleteAttempt(false);
        }}
        title="Delete Attempt"
        message="Are you sure you want to delete this Attempt?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      <div className="card shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold">Assessment Results</h4>
          </div>
          <div>

            <button
              className="btn btn-secondary"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/candidate/dashboard");
                }
              }}
            >
              Back
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Score</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((r, index) => (
                  <tr key={r._id}>
                    <td className="text-center">{index + 1}</td>
                    <td>{r.userId?.name}</td>
                    <td>{r.userId?.email}</td>
                    <td className="fw-bold text-center">
                      {r.score}
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge ${r.status === "submitted"
                          ? "bg-success"
                          : "bg-warning"
                          }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.submittedAt
                        ? new Date(r.submittedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setSelectedAttemptId(r._id);
                          setDeleteAttempt(true)
                        }}
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No Results Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Result;
