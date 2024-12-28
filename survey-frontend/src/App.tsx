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
import UserDashboard from "./components/UserDashboard";
import SurveyManagement from "./components/Survey/SurveyManagement";
import CreateSurvey from "./components/Survey/CreateSurvey";

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
          element={user ? <UserDashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/surveys"
          element={
            user?.role === "ADMIN" ? (
              <SurveyManagement username={user.username} role={user.role} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/surveys/create"
          element={
            user?.role === "ADMIN" ? (
              <CreateSurvey username={user.username} role={user.role} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
