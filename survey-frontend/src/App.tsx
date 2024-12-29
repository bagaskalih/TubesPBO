// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import axios from "axios";
import UserDashboard from "./components/Dashboard";
import SurveyManagement from "./components/admin/SurveyManagement";
import SurveyEditor from "./components/admin/SurveyEditor";
import { SnackbarProvider } from "./context/SnackbarContext";
import SurveyList from "./components/user/SurveyList";
import TakeSurvey from "./components/user/TakeSurvey";
import SurveyHistory from "./components/user/SurveyHistory";

interface User {
  username: string;
  role: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("id");
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/users/${userId}`
          );
          setUser({
            username: response.data.username,
            role: response.data.role,
          });
        } catch (error) {
          console.error("Error fetching user:", error);
          localStorage.removeItem("id");
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              user ? (
                <LandingPage username={user.username} role={user.role} />
              ) : (
                // <Navigate to="/login" replace />
                <LandingPage username={""} role={""} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? <UserDashboard /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/admin/surveys"
            element={
              user && user.role === "ADMIN" ? (
                <SurveyManagement username={user.username} role={user.role} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/surveys/create"
            element={
              user && user.role === "ADMIN" ? (
                <SurveyEditor username={user.username} role={user.role} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/surveys/edit/:id"
            element={
              user && user.role === "ADMIN" ? (
                <SurveyEditor username={user.username} role={user.role} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* User Routes */}
          <Route
            path="/surveys"
            element={
              user ? (
                <SurveyList username={user.username} role={user.role} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/surveys/take/:id"
            element={
              user ? (
                <TakeSurvey username={user.username} role={user.role} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/surveys/history"
            element={
              user ? (
                <SurveyHistory username={user.username} role={user.role} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* <Route
            path="/rankings"
            element={
              user ? (
                <Rankings username={user.username} role={user.role} />
              ) : (
                <Navigate to="/login" />
              )
            }
          /> */}
        </Routes>
      </Router>
    </SnackbarProvider>
  );
};

export default App;
