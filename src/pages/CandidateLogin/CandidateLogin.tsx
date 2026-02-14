import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showAlert } from "../../utils/alerts";
import { sendOtp, verifyOtp } from "../../services/userService";
import { validateFields } from "../../utils/formValidator";
import img01 from "../../../src/assest/candidate01.png"

const CandidateLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  React.useEffect(() => {
    let interval: any;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && step === "otp") {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer, step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const sendOtpHandler = async () => {
    const requiredFields = [{ name: "email", label: "Email" }];

    const validation = validateFields(requiredFields, { email });

    if (!validation.isValid) {
      showAlert.warning(validation.message);
      return;
    }

    setLoading(true);

    try {
      const response = await sendOtp({ email });

      if (response.message === "OTP sent successfully") {
        showAlert.success(response.message);
        setStep("otp");

        setTimer(120); 
        setCanResend(false);
      } else {
        showAlert.error(response.message);
      }
    } catch (err: any) {
      showAlert.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpHandler = async () => {
    const requiredFields = [
      { name: "email", label: "Email" },
      { name: "otp", label: "OTP" },
    ];

    const validation = validateFields(requiredFields, { email, otp });

    if (!validation.isValid) {
      showAlert.warning(validation.message);
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOtp({ email, otp });

      if (response.message === "Login successful") {
        showAlert.success(response.message);

        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        localStorage.setItem("userId", response.userId);

        navigate("/candidate/dashboard");
      } else {
        showAlert.error(response.message);
      }
    } catch (err: any) {
      showAlert.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div
          className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
          style={{
            background: "linear-gradient(135deg, #1e3c72, #2a5298)",
          }}
        >
          <div className="text-center text-white px-5">
            <img
              src={img01}
              alt="Candidate Portal"
              style={{ width: "140px", marginBottom: "25px" }}
            />
            <h2 className="fw-bold mb-3">Candidate Assessment Portal</h2>
            <p className="fs-5 opacity-75">
              Secure login using your registered email and OTP verification.
            </p>
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
          <div style={{ width: "380px" }}>
            <h3 className="fw-bold mb-2">Welcome Back</h3>
            <p className="text-muted mb-4">
              {step === "email"
                ? "Enter your registered email to receive OTP"
                : "Enter the OTP sent to your email"}
            </p>

            {step === "email" ? (
              <>
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-3"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                  onClick={sendOtpHandler}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Enter OTP</label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-3 text-center fw-bold"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="text-center mt-3">
                  {timer > 0 ? (
                    <small className="text-muted">
                      OTP expires in {formatTime(timer)}
                    </small>
                  ) : (
                    <button
                      className="btn btn-link p-0"
                      disabled={!canResend}
                      onClick={sendOtpHandler}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
                <button
                  className="btn btn-success btn-lg w-100 rounded-3 fw-semibold"
                  onClick={verifyOtpHandler}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}

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
    </div>
  );
};

export default CandidateLogin;
