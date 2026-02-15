import React, { lazy, Suspense } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Toaster } from "./utils/alerts";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import ProtectedRoute from "./utils/ProtectedRoute";

const AuthSelection = React.lazy(
  () => import("./pages/AuthSelection/AuthSelection"),
);
const AdminSelection = React.lazy(
  () => import("./pages/AdminSelection/AdminSelection"),
);
const AdminLogin = React.lazy(() => import("./pages/AdminLogin/AdminLogin"));
const CandidateLogin = React.lazy(
  () => import("./pages/CandidateLogin/CandidateLogin"),
);
const CandidateDashboard = React.lazy(
  () => import("./pages/components/CandidateDashboard/CandidateDashboard"),
);
const AdminDashboard = React.lazy(
  () => import("./pages/components/AdminDashboard/AdminDashboard"),
);
const Assessment = React.lazy(
  () => import("./pages/components/Assessment/Assessment"),
);
const AssessmentQuestion = React.lazy(
  () => import("./pages/components/AssessmentQuestion/AssessmentQuestion"),
);
const Result = React.lazy(
  () => import("./pages/components/Result/Result"),
);
const AlreadySubmitted = React.lazy(
  () => import("./components/AlreadySubmitted/AlreadySubmitted"),
);



function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner loading={true} />}>
          <Routes>
            <Route path="/" element={<AuthSelection />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* <Route path="/admin/Selection" element={<AdminSelection />} /> */}

            <Route
              path="/admin/Selection"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <AdminSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/candidate/login" element={<CandidateLogin />} />
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute allowedRole="CANDIDATE">
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/already_submitted"
              element={
                <AlreadySubmitted />
              }
            />

            <Route
              path="/candidate/assessment/:attemptId"
              element={
                <ProtectedRoute allowedRole="CANDIDATE">
                  <Assessment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/question"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <AssessmentQuestion />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/result"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <Result />
                </ProtectedRoute>
              }
            />


            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
