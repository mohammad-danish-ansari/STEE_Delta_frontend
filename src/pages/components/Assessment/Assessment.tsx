import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTimer,
  submitCandidateAttempt,
} from "../../../services/attemptService";
import { showAlert } from "../../../utils/alerts";
import { getAllCandidateQuestions } from "../../../services/questionService";
import ExitModel from "../../../components/ExitModel/ExitModel";

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
  const [timerLoaded, setTimerLoaded] = useState(false);

  const answersRef = useRef<{ [key: string]: string }>({});
  const isSubmittingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep answers updated
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ================= Prevent Back Button =================
  useEffect(() => {
    const handleBack = (event: PopStateEvent) => {
      event.preventDefault();
      setShowExitModal(true);
      window.history.pushState(null, "", window.location.pathname);
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  // ================= Initial Load =================
  useEffect(() => {
    if (!attemptId) return;

    const init = async () => {
      try {
        setLoading(true);

        //  Get Timer
        const timerRes = await getTimer(attemptId);

        if (timerRes?.data?.status === "submitted") {
          navigate("/candidate/already_submitted", { replace: true });
          return;
        }

        const time = timerRes?.data?.remainingTime ?? 0;

        if (time <= 0) {
          navigate("/candidate/dashboard");
          return;
        }

        setRemainingTime(time);
        setTimerLoaded(true);

        //  Get Questions
        const questionRes = await getAllCandidateQuestions();
        if (questionRes?.data) {
          setQuestions(questionRes.data);
        }
      } catch (error) {
        console.error(error);
        showAlert.error("Failed to load assessment");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [attemptId, navigate]);

  // ================= Timer Logic =================
  useEffect(() => {
    if (!timerLoaded) return;
    if (remainingTime <= 0) return;
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          autoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerLoaded]);

  // ================= Handle Option =================
  const handleOptionChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // ================= Auto Submit =================
  const autoSubmit = async () => {
    if (isSubmittingRef.current) return;
    await handleSubmit();
  };

  // ================= Submit =================
  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      const formattedAnswers = Object.keys(answersRef.current).map((key) => ({
        questionId: key,
        selectedOption: answersRef.current[key],
      }));

      setLoading(true);

      const response = await submitCandidateAttempt(attemptId!, {
        answers: formattedAnswers,
      });

      if (response?.message) {
        showAlert.success(response.message);
      }

      navigate("/candidate/dashboard");
    } catch (error: any) {
      showAlert.error(error?.response?.message || "Submission failed");
      isSubmittingRef.current = false; // allow retry
    } finally {
      setLoading(false);
    }
  };

  // ================= Format Timer =================
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
        }}
        onClose={() => setShowExitModal(false)}
        title="Leave Assessment?"
        message="If you leave now, your assessment will be submitted."
      />

      <div className="container">
        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 shadow-sm rounded-4"
          style={{ position: "sticky", top: 0, zIndex: 1000 }}
        >
          <h4 className="fw-bold">Assessment</h4>
          <div className="badge bg-danger fs-6 p-3">
            <i className="fa-solid fa-hourglass"></i> Time Left: {formatTime(remainingTime)}
          </div>
        </div>

        {/* Questions */}
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
                  <label className="form-check-label">{option}</label>
                </div>
              ))}
            </div>
          ))}

          <div className="text-end">
            <button
              className="btn btn-dark px-4 py-2"
              onClick={handleSubmit}
              disabled={loading || remainingTime === 0}
            >
              {remainingTime === 0
                ? "Time Over"
                : loading
                ? "Submitting..."
                : "Submit Assessment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
