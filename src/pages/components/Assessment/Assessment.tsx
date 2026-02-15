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

interface LogEvent {
  eventType: string;
  timestamp: string;
  attemptId?: string;
  questionId?: string;
  metadata?: any;
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
  const [showWarningMessage, setShowWarningMessage] = useState<boolean>(false);

  const answersRef = useRef<{ [key: string]: string }>({});
  const isSubmittingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ===== Unified Logging =====
  const logsRef = useRef<LogEvent[]>([]);
  const [violationCount, setViolationCount] = useState<number>(0);
  const hasSubmittedRef = useRef(false);

  const logEvent = (type: string, questionId?: string) => {
    const event: LogEvent = {
      eventType: type,
      timestamp: new Date().toISOString(),
      attemptId: attemptId,
      questionId,
      metadata: {
        userAgent: navigator.userAgent,
        visibility: document.visibilityState,
      },
    };

    logsRef.current.push(event);
    localStorage.setItem("assessment_logs", JSON.stringify(logsRef.current));

    if (
      type === "TAB_SWITCH" ||
      type === "WINDOW_BLUR" ||
      type === "COPY_ATTEMPT" ||
      type === "PASTE_ATTEMPT" ||
      type === "FULLSCREEN_EXIT"
    ) {
      setViolationCount((prev) => prev + 1);
    }
  };

  // Keep answers updated
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ===== Prevent Back Button =====
  useEffect(() => {
    const handleBack = (event: PopStateEvent) => {
      event.preventDefault();
      setShowExitModal(true);
      window.history.pushState(null, "", window.location.pathname);
      logEvent("BACK_BUTTON_ATTEMPT");
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  // ===== Initial Load =====
  useEffect(() => {
    if (!attemptId) return;

    const init = async () => {
      try {
        setLoading(true);

        const timerRes = await getTimer(attemptId);

        if (
          timerRes?.data?.status === "submitted" ||
          timerRes?.data?.status === "expired"
        ) {
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

        const questionRes = await getAllCandidateQuestions();
        if (questionRes?.data) {
          setQuestions(questionRes.data);
        }

        logEvent("ASSESSMENT_STARTED");
      } catch (error) {
        showAlert.error("Failed to load assessment");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [attemptId, navigate]);

  // ===== Timer =========
  useEffect(() => {
    if (!timerLoaded) return;
    if (remainingTime <= 0) return;
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === 60) {
          setShowWarningMessage(true);
        }

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

  // ===== Remove Warning ===========
  useEffect(() => {
    if (showWarningMessage) {
      const timer = setTimeout(() => {
        setShowWarningMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWarningMessage]);

  // ===== Anti Cheat Events =======
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) logEvent("TAB_SWITCH");
    };

    const handleBlur = () => logEvent("WINDOW_BLUR");

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logEvent("COPY_ATTEMPT");
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logEvent("PASTE_ATTEMPT");
    };

    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      logEvent("RIGHT_CLICK");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleRightClick);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, []);

  // ===== Fullscreen =====
  useEffect(() => {
    const enterFullscreen = async () => {
      if (document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen();
        } catch {}
      }
    };

    enterFullscreen();

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        logEvent("FULLSCREEN_EXIT");
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // ===== Auto Submit on 3 Violations =====
  useEffect(() => {
    if (violationCount >= 3 && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      autoSubmit();
    }
  }, [violationCount]);

  const handleOptionChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    logEvent("ANSWER_SELECTED", questionId);
  };

  const autoSubmit = async () => {
    if (isSubmittingRef.current) return;
    await handleSubmit();
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    logEvent("SUBMITTED");

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

      localStorage.removeItem("assessment_logs");

      navigate("/candidate/dashboard");
    } catch (error: any) {
      showAlert.error(error?.response?.message || "Submission failed");
      isSubmittingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container-fluid bg-light min-vh-100 py-3">
      {showWarningMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: "90%",
            maxWidth: "600px",
          }}
        >
          <div className="alert alert-warning text-center fw-bold shadow-lg">
            Only 1 minute remaining! Assessment will auto-submit.
          </div>
        </div>
      )}

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
        <div
          className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 shadow-sm rounded-4"
          style={{ position: "sticky", top: 0, zIndex: 1000 }}
        >
          <h4 className="fw-bold">Assessment</h4>
          <div className="badge bg-danger fs-6 p-3">
            <i className="fa-solid fa-hourglass"></i> Time Left:{" "}
            {formatTime(remainingTime)}
          </div>
        </div>

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
