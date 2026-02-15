import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.scss";
import {
  createCandidate,
  deleteUserByAdmin,
  getAdminProfile,
  getAllCandidates,
} from "../../../services/userService";
import CandidateModal from "../../../components/CandidateModal/CandidateModal";
import { showAlert } from "../../../utils/alerts";
import { validateFields } from "../../../utils/formValidator";
import { useNavigate } from "react-router-dom";
import img01 from "../../../../src/assest/candidate01.png"
import { updateUserByAdmin } from './../../../services/userService';
import ExitModel from './../../../components/ExitModel/ExitModel';

interface AdminData {
  name: string;
  phone: string;
  email: string;
  role: string;
  admin: string;
}

interface Candidate {
  _id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  role: string;
}

const AdminDashboard: React.FC = () => {
  const initialCandidateForm: Candidate = {
    _id: "",
    name: "",
    phone: "",
    email: "",
    role: "",
    status: "",
  };
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  const [candidateFormData, setCandidateFormData] =
    useState<Candidate>(initialCandidateForm);
  const [candidateOpenModel, setCandidateOpenModel] = useState(false);
  const [candidateIdForUpdate, setCandidateIdForUpdate] = useState<
    string | null
  >(null);
  const [deleteCandidate, setDeleteCandidate] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const navigate = useNavigate();

  const resetCandidateForm = () => {
    setCandidateFormData({
      _id: "",
      name: "",
      phone: "",
      email: "",
      status: "",
      role: "CANDIDATE",
    });
  };
  const handleChangeCandidate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCandidateFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    try {
      setLoading(true);

      const profileRes = await getAdminProfile();
      const candidateRes = await getAllCandidates();

      setAdmin(profileRes.data);
      setCandidates(candidateRes.data);
    } catch (error) {
      console.error("dashboard error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCandidate = async (e: any) => {
    e.preventDefault();

    const requiredFields = [
      { name: "name", label: "Name" },
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email" },
    ];

    const validation = validateFields(requiredFields, candidateFormData);

    if (!validation.isValid) {
      showAlert.warning(validation.message);
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(candidateFormData.phone)) {
      showAlert.warning("Phone number must be exactly 10 digits");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidateFormData.email)) {
      showAlert.warning("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      let response;
      if (candidateIdForUpdate) {
        // UPDATE
        response = await updateUserByAdmin(
          candidateIdForUpdate,
          candidateFormData,
        );

        if (response?.message === "Candidate updated successfully") {
          showAlert.success(response.message);
        }
      } else {
        // CREATE
        response = await createCandidate(candidateFormData);
        if (response?.message === "Candidate added successfully & assessment link sent") {
          showAlert.success(response.message);
        }
      }

      resetCandidateForm();
      setCandidateOpenModel(false);
      setCandidateIdForUpdate(null);
      await getAllData();
    } catch (error: any) {
      console.log("Candidate error", error);
      const errorMessage =
        error?.response?.message || "Something went wrong";

      showAlert.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateEdit = (c: Candidate) => {
    setCandidateIdForUpdate(c._id)
    setCandidateFormData(c);
    setCandidateOpenModel(true);
  };

  // ================= handel delete candiadte =================
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteUserByAdmin(id);

      if (response?.message === "Candidate deleted successfully") {
        showAlert.success(response.message);
        getAllData();
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.message || "Something went wrong";

      showAlert.error(errorMessage);
    }
  };
  return (
    <div className={styles.dashboard}>
      <CandidateModal
        isOpen={candidateOpenModel}
        onClose={() => setCandidateOpenModel(false)}
        onConfirm={handleConfirmCandidate}
        candidateFormData={candidateFormData}
        handleChange={handleChangeCandidate}
      />
      <ExitModel
        isOpen={deleteCandidate}
        onClose={() => setDeleteCandidate(false)}
        onConfirm={() => {
          if (selectedCandidateId) {
            handleDelete(selectedCandidateId);
          }
          setDeleteCandidate(false);
        }}
        title="Delete Candidate"
        message="Are you sure you want to delete this Candidate?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.avatarSmall}>
            {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <h5>Admin Dashboard</h5>
            <small>Welcome back, {admin?.role}</small>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button
            className={styles.createBtn}
            onClick={() => {
              resetCandidateForm();
              setCandidateOpenModel(true);
            }}
          >
            <i className="fa-solid fa-plus"></i> Create Candidate
          </button>

          <img
            src={img01}
            alt="Admin"
            className={styles.profileImg}
          />
          <span className={styles.roleBadge}>{admin?.role}</span>
        </div>
      </div>



      {/* Candidate List */}
      <div className={styles.candidateCard}>
        <div className="d-flex justify-content-between align-items-center">
          <div>

            <h5>Candidate List</h5>
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
        {loading ? (
          <p className="text-center mt-5">Loading...</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, index) => (
                  <tr key={candidate._id}>
                    <td>{index + 1}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td>
                      <span
                        className={`badge ${candidate.status === "Pending"
                          ? "bg-secondary"
                          : candidate.status === "in-progress"
                            ? "bg-warning text-dark"
                            : candidate.status === "submitted"
                              ? "bg-success"
                              : "bg-light"
                          }`}
                      >
                        {candidate.status}
                      </span>
                    </td>
                    <td>
                      {/* <button className={styles.viewBtn}>View</button> */}

                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleCandidateEdit(candidate)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={async () => {
                          await setSelectedCandidateId(candidate._id);
                          setTimeout(() => setDeleteCandidate(true), 0);
                        }}
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {candidates.length === 0 && !loading && (
          <p className={styles.noData}>No candidates found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
