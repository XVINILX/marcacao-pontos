import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/HomePage";

import LayoutLandingPage from "./Layouts/LayoutLanding";
import { useAuth } from "contexts/AuthContext";
import EmployeePage from "pages/EmployeePage";
import AdminPage from "pages/AdminPage";

const AppRouter: React.FC = () => {
  const { isAuthenticated, authUser } = useAuth();

  return (
    <Router>
      <LayoutLandingPage>
        <Routes>
          {!isAuthenticated && <Route path="/" element={<HomePage />} />}
          {isAuthenticated && authUser?.userType === "employee" && (
            <Route path="/" element={<EmployeePage />} />
          )}
          {isAuthenticated && authUser?.userType === "admin" && (
            <Route path="/" element={<AdminPage />} />
          )}
        </Routes>
      </LayoutLandingPage>
    </Router>
  );
};

export default AppRouter;
