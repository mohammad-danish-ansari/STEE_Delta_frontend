import React, { ReactNode } from "react";
import { FadeLoader } from "react-spinners";
import "./LoadingSpinner.scss"; 
interface LoadingSpinnerProps {
  loading: boolean;
  size?: number;
  color?: string;
  children?: ReactNode;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  loading,
  size = 80,
  color = "#0a66c2",
  children,
}) => {
  return loading ? (
    <div className="loading-container">
      <FadeLoader height={size} color={color} />
    </div>
  ) : (
    <>{children}</>
  );
};

export default LoadingSpinner;
