import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllQuestions, getTimer, submitCandidateAttempt } from "../../../services/attemptService";
import { showAlert } from "../../../utils/alerts";
import { getAllCandidateQuestions } from './../../../services/questionService';
import ExitModel from './../../../components/ExitModel/ExitModel';

interface Question {
  _id: string;
  question: string;
  options: string[];
}


const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const { attemptId } = useParams<{ attemptId: string }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      setShowExitModal(true);

      window.history.pushState(null, "", window.location.pathname);
    };

    window.history.pushState(null, "", window.location.pathname);

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);



  // ================= fetch question =================
  const candidateQuestions = async () => {
    try {
      setLoading(true);

      const response = await getAllCandidateQuestions();

      if (response?.data) {
        setQuestions(response.data);
      }
    } catch (error: any) {
      console.error("question error", error);
      const errorMessage =
        error?.response?.message || "Something went wrong";
    } finally {
      setLoading(false);
    }
  };

  // ================= fetch timer =================
  const candidateTimer = async () => {
    try {
      const response = await getTimer(attemptId!);

      if (response?.data?.remainingTime >= 0) {
        setRemainingTime(response?.data?.remainingTime);
      }
    } catch (error) {
      console.error("timer error", error);
    }
  };


  // ================= timer interval =================
  useEffect(() => {
    candidateQuestions();
    candidateTimer();

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          // Auto submit
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ================= handel asw =================
  const handleOptionChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  // ================= handel submit =================
  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.keys(answers).map((key) => ({
        questionId: key,
        selectedOption: answers[key],
      }));
      setLoading(true);
      const response = await submitCandidateAttempt(attemptId!, {
        answers: formattedAnswers,
      });
      setLoading(false);
      console.log(response, "response data===");

      if (response?.message) {
        showAlert.success(response.message);
        navigate("/candidate/dashboard");
      }
    } catch (error: any) {
      console.log(error?.response?.data);
      showAlert.error(error?.response?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= format timer =================
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container-fluid bg-light min-vh-100 py-3">
      <ExitModel
        isOpen={showExitModal}
        onConfirm={async () => {
          await handleSubmit();
          navigate("/candidate/dashboard");
        }}
        onClose={() => setShowExitModal(false)}
        title="Leave Assessment?"
        message="If you leave now, your assessment will be submitted."
      />
      <div className="container">
        {/* header */}
        <div
          className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 shadow-sm rounded-4"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <h4 className="fw-bold">Assessment</h4>

          <div className="badge bg-danger fs-6 p-3">
            <i className="fa-solid fa-hourglass"></i> Time Left: {formatTime(remainingTime)}
          </div>
        </div>

        {/* questions */}
        <div className="card shadow-sm p-4 rounded-4">
          {questions.map((q, index) => (
            <div key={q._id} className="mb-4">
              <h6 className="fw-bold">
                {index + 1}. {q.question}
              </h6>

              {q.options.map((option, i) => (
                <div className="form-check mt-2" key={i}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={q._id}
                    value={option}
                    checked={answers[q._id] === option}
                    onChange={() =>
                      handleOptionChange(q._id, option)
                    }
                  />
                  <label className="form-check-label">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ))}

          <div className="text-end">
            <button
              className="btn btn-dark px-4 py-2"
              onClick={handleSubmit}
              disabled={loading}
              style={{ transition: "0.3s" }}
            >
              {loading ? " Submit Assessment..." : " Submit Assessment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
