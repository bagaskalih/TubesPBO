import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { People, Assignment, Poll } from "@mui/icons-material";
import MainLayout from "../Layout/MainLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import axios from "axios";

interface AdminDashboardProps {
  username: string;
  role: string;
}

interface DashboardStats {
  totalUsers: number;
  totalSurveys: number;
  totalResponses: number;
  recentSurveys: { name: string; responses: number }[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ username, role }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSurveys: 0,
    totalResponses: 0,
    recentSurveys: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/surveys/stats/admin"
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <MainLayout username={username} role={role}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 8 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Admin Dashboard
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary">
            Overview of survey system statistics and performance
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            mb: 8,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Paper elevation={3} sx={{ p: 3, width: 300 }}>
            <People sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h4">{stats.totalUsers}</Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, width: 300 }}>
            <Assignment sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Total Surveys
            </Typography>
            <Typography variant="h4">{stats.totalSurveys}</Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, width: 300 }}>
            <Poll sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Total Responses
            </Typography>
            <Typography variant="h4">{stats.totalResponses}</Typography>
          </Paper>
        </Box>

        <Paper elevation={3} sx={{ p: 4, mb: 8 }}>
          <Typography variant="h5" gutterBottom>
            Recent Survey Responses
          </Typography>
          <Box sx={{ width: "100%", overflow: "auto" }}>
            <BarChart width={800} height={300} data={stats.recentSurveys}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="responses" fill="#1976d2" />
            </BarChart>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default AdminDashboard;
