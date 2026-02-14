import React from 'react'
import styles from "./ExitModel.module.scss";
const ExitModel = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Exit",
  message = "Are you sure you want to exit the application?",
  confirmLabel = "Yes",
  cancelLabel = "No",
}) => {
  return isOpen ? (
    <div
      className={`modal fade ${isOpen ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-primary text-white p-2">
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body text-center pt-3 p-0">
            <p className="m-0">
             {message}
            </p>
          </div>
          <div className="modal-footer justify-content-center border-0">
            <button
              type="button"
              className={`btn btn-sm btn-secondary px-4 ${styles.pointer}`}
              onClick={onClose}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-danger px-4 ${styles.pointer}`}

              onClick={() => {
                onConfirm();
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
      {/* Backdrop to close modal when clicked outside */}
      {/* <div className="modal-backdrop fade show" onClick={onClose}></div> */}
    </div>
  ) : null;
}

export default ExitModel
