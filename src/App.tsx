import React, { lazy, Suspense } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Toaster } from "./utils/alerts";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

const UserList = React.lazy(() => import("./components/UserForm"));
const UserForm = React.lazy(() => import("./components/UserList"));

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner loading={false} />}>
        <Route path="/" element={<Navigate to="/usersList" replace />} />
        <Route path="/usersList" element={<UserList />} />
        <Route path="/users" element={<UserForm />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/usersList" replace />} />
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
