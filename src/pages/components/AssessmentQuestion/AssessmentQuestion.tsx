import React, { useEffect, useState } from "react";
import ExitModel from "../../../components/ExitModel/ExitModel";
import {
  getAdminQuestions,
  createQuestion,
  updateQuestion,
  deleteAdminQuestion,
} from "../../../services/questionService";
import { showAlert } from "../../../utils/alerts";
import { validateFields } from './../../../utils/formValidator';
import { useNavigate } from 'react-router-dom';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

const AssessmentQuestion: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [deleteQuestion, setDeleteQuestion] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });
  const navigate = useNavigate();
  // ================= getQuestion =================
  const getAllQuestions = async () => {
    const res = await getAdminQuestions();
    if (res?.data) setQuestions(res.data);
  };

  useEffect(() => {
    getAllQuestions();
  }, []);

  // ================= handel change =================
  const handleChange = (index: number, value: string) => {
    const updated = [...formData.options];
    updated[index] = value;
    setFormData({ ...formData, options: updated });
  };

  // ================= submit craete and update question=================
  const handleSubmit = async () => {
    try {

      const requiredFields = [
        { name: "question", label: "Question" },
      ];
      const validation = validateFields(requiredFields, formData);
      if (!validation.isValid) {
        showAlert.warning(validation.message);
        return;
      }

      const emptyOption = formData.options.some(
        (opt) => !opt || opt.trim() === ""
      );

      if (emptyOption) {
        showAlert.warning("All 4 options are required");
        return;
      }

      //  Check correct answer selected
      if (!formData.correctAnswer) {
        showAlert.warning("Please select correct answer");
        return;
      }

      let response;

      if (editId) {
        response = await updateQuestion(editId, formData);

        if (response?.message === "Question updated successfully") {
          showAlert.success(response.message);
        }
      } else {
        response = await createQuestion(formData);

        if (response?.message === "Question created successfully") {
          showAlert.success(response.message);
        }
      }

      setShowModal(false);
      setEditId(null);
      setFormData({ question: "", options: ["", "", "", ""], correctAnswer: "" });
      getAllQuestions();
    } catch (error: any) {
      if (error.response) {
        showAlert.error(error.response.message);
      }
      showAlert.error("Something went wrong");
    }
  };
  const handleCreate = () => {
    setEditId(null);
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
    setShowModal(true);
  };
  // ================= patch queation data =================
  const handleEdit = (q: Question) => {
    setEditId(q._id);
    setFormData({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    });
    setShowModal(true);
  };

  // ================= handel delete question =================
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteAdminQuestion(id);

      if (response?.message === "Question deleted successfully") {
        showAlert.success(response.message);
        getAllQuestions();
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.message || "Something went wrong";

      showAlert.error(errorMessage);
    }
  };

  return (
    <div className="container py-4">
      <ExitModel
        isOpen={deleteQuestion}
        onClose={() => setDeleteQuestion(false)}
        onConfirm={() => {
          if (selectedQuestionId) {
            handleDelete(selectedQuestionId);
          }
          setDeleteQuestion(false);
        }}
        title="Delete Question"
        message="Are you sure you want to delete this Question?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      {/* header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Question Management</h4>
        <button
          className="btn btn-dark"
          onClick={handleCreate}
        >
          <i className="fa-solid fa-plus"></i> Create Question
        </button>
      </div>
      <div className="text-end mb-2">

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
      {/* table */}
      <div className="card shadow-sm p-3 rounded-4">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Options</th>
              <th>Correct</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr key={q._id}>
                <td>{index + 1}</td>
                <td>{q.question}</td>
                <td>
                  <ul className="mb-0">
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <span className="badge bg-success">
                    {q.correctAnswer}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(q)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setSelectedQuestionId(q._id);
                      setDeleteQuestion(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {questions.length === 0 && (
          <p className="text-center text-muted">No questions found</p>
        )}
      </div>

      {/* model for questions */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-4 rounded-4">
              <h5 className="mb-3">
                {editId ? "Update Question" : "Create Question"}
              </h5>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter question"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
              />

              {formData.options.map((opt, index) => (
                <input
                  key={index}
                  type="text"
                  className="form-control mb-2"
                  placeholder={`Option ${index + 1}`}
                  value={opt}
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                />
              ))}

              <select
                className="form-select mb-3"
                value={formData.correctAnswer}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    correctAnswer: e.target.value,
                  })
                }
              >
                <option value="">Select Correct Answer</option>
                {formData.options.map((opt, index) => (
                  <option key={index} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-dark"
                  onClick={handleSubmit}
                >
                  {editId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AssessmentQuestion;
