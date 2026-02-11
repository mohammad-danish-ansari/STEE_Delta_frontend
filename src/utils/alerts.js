import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

// Custom transitions for a smoother mobile experience

const showAlert = {
  success: (message) =>
    toast.success(message, {
      style: { maxWidth: "90%", fontSize: "14px" },
    }),
  error: (message) =>
    toast.error(message, {
      style: { maxWidth: "90%", fontSize: "14px" },
    }),
  warning: (message) =>
    toast.warn(message, {
      style: { maxWidth: "90%", fontSize: "14px" },
    }),
  info: (message) =>
    toast.info(message, {
      style: { maxWidth: "90%", fontSize: "14px" },
    }),
};

export const Toaster = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize the state based on the current screen size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ToastContainer
      position={isMobile ? "top-center" : "top-right"} // Use top-center for mobile
      autoClose={2000} // Auto-close after 2 seconds
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      limit={2}
    />
  );
};

export { showAlert };
