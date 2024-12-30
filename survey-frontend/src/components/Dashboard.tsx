import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";

interface SurveyStats {
  totalSurveys: number;
  completedSurveys: number;
  availableSurveys: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<SurveyStats>({
    totalSurveys: 0,
    completedSurveys: 0,
    availableSurveys: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("id");
        const userResponse = await axios.get(
          `http://localhost:8081/api/users/${userId}`
        );
        setUserRole(userResponse.data.role);
        setUsername(userResponse.data.username);

        // Fetch survey statistics
        const statsResponse = await axios.get(
          `http://localhost:8081/api/surveys/user-stats/${userId}`
        );
        setStats(statsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <MainLayout username={username} role={userRole}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout username={username} role={userRole}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Survey Application
        </Typography>

        {userRole === "ADMIN" ? (
          <AdminDashboardContent navigate={navigate} />
        ) : (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Available Surveys</Typography>
                    <Typography variant="h3">
                      {stats.availableSurveys}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate("/surveys")}
                      sx={{ mt: 2 }}
                    >
                      Take Survey
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Completed Surveys</Typography>
                    <Typography variant="h3">
                      {stats.completedSurveys}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/surveys/history")}
                      sx={{ mt: 2 }}
                    >
                      View History
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Available</Typography>
                    <Typography variant="h3">{stats.totalSurveys}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

interface AdminDashboardContentProps {
  navigate: (path: string) => void;
}

const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({
  navigate,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">User Management</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Manage system users and their roles
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/admin/users")}
              sx={{ mt: 2 }}
            >
              Manage Users
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Survey Management</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Create and manage surveys
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/admin/surveys")}
              sx={{ mt: 2 }}
            >
              Manage Surveys
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
