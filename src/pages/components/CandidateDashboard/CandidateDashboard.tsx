import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCandidateProfile } from "../../../services/userService";
import styles from "./CandidateDashboard.module.scss";
import { showAlert } from "../../../utils/alerts";
import { startCandidateAssessment } from "../../../services/attemptService";
import ExitModel from './../../../components/ExitModel/ExitModel';
import img01 from "../../../../src/assest/candidate01.png"

interface CandidateData {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  hasAttempted: boolean;
}

const CandidateDashboard: React.FC = () => {
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [showRulesModal, setShowRulesModal] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getCandidateProfile();
      setCandidate(res.data);
    } catch (error) {
      console.error("candidate error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttempt = async () => {
    try {
      setLoading(true);

      const response = await startCandidateAssessment();

      if (response?.data?.attemptId) {
        navigate(`/candidate/assessment/${response.data.attemptId}`);
      } else {
        showAlert.error(response.message || "Unable to start assessment");
      }
    } catch (error: any) {
      showAlert.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className={styles.container}>
      <ExitModel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          handleLogout();
          setIsOpen(false);
        }}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Yes"
        cancelLabel="No"
      />


      <ExitModel
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        onConfirm={async () => {
          setShowRulesModal(false);
          await handleAttempt();
        }}
        title="Assessment Rules & Regulations"
        message={
          <>
            <ul className="text-start ps-5">
              <li>Total duration is limited.</li>
              <li>Do not switch tabs or minimize window.</li>
              <li>Do not copy/paste.</li>
              <li>3 violations = auto submission.</li>
              <li>Assessment runs in full screen mode.</li>
            </ul>
          </>
        }
        confirmLabel="I Agree & Start"
        cancelLabel="Cancel"
      />
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.avatarSmall}>
            {candidate?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5>Candidate Assessment Dashboard</h5>
            <small>Welcome back, {candidate?.name}</small>
          </div>
        </div>

        <div className={styles.headerRight}>
          <img
            src={img01}
            alt="Profile"
            className={styles.profileImg}
          />
          <span className={styles.roleBadge}>{candidate?.role}</span>
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-sm btn-outline-danger ms-2"
          >
            <i className="fa-solid fa-right-from-bracket me-2"></i>
            Logout
          </button>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className={styles.profileCard}>
        <h4 className={styles.sectionTitle}>Profile Information</h4>

        <div className={styles.infoGrid}>
          <div>
            <label>Name</label>
            <p>{candidate?.name}</p>
          </div>

          <div>
            <label>Email</label>
            <p>{candidate?.email}</p>
          </div>

          <div>
            <label>Phone</label>
            <p>{candidate?.phone}</p>
          </div>

          <div>
            <label>Role</label>
            <p>{candidate?.role}</p>
          </div>
        </div>

        {/* <button
         className={styles.startBtn}
          disabled={candidate?.hasAttempted}
          onClick={handleAttempt}
        >
          {" "}
          {candidate?.hasAttempted
            ? "Assessment Already Submitted"
            : "Start Assessment"}{" "}
        </button> */}
        <button
          className={styles.startBtn}
          disabled={loading || candidate?.hasAttempted}
          onClick={() => setShowRulesModal(true)}
        >
          {loading ? (
            "Starting..."
          ) : candidate?.hasAttempted ? (
            "Assessment Already Submitted"
          ) : (
            <>
              <i className="fa-solid fa-hourglass-half me-2"></i>
              Start Assessment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CandidateDashboard;
