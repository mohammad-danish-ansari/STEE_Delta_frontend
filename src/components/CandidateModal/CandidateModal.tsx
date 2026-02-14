import React from "react";

interface CandidateFormData {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  role: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e:any) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  candidateFormData: CandidateFormData;
}

const CandidateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  handleChange,
  candidateFormData,
}) => {
  return isOpen ? (
    <div
      className={`modal fade ${isOpen ? "show d-block" : ""}`}
      tabIndex={-1}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content border-0 shadow-lg">

          {/* Header */}
          <div className="modal-header bg-dark text-white p-2 d-flex justify-content-between">
            <h5 className="modal-title">
              {candidateFormData._id
                ? "Update Candidate"
                : "Create Candidate"}
            </h5>

            <i
              className="fas fa-xmark fa-lg"
              onClick={onClose}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          {/* Body */}
          <div className="modal-body px-4 pb-2">

            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={candidateFormData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={candidateFormData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={candidateFormData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-control"
                name="role"
                value="CANDIDATE"
                readOnly
              />
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer justify-content-center border-0">
            <button
              type="button"
              className="btn btn-dark w-100"
              onClick={onConfirm}
            >
              {candidateFormData._id
                ? "Update"
                : "Add"} Candidate
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default CandidateModal;
