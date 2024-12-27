import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { CheckCircle, Schedule, Assignment } from "@mui/icons-material";
import MainLayout from "./Layout/MainLayout";
import axios from "axios";

interface UserDashboardProps {
  username: string;
  role: string;
}

interface UserStats {
  completedSurveys: number;
  pendingSurveys: number;
  totalSurveys: number;
  recentActivity: { surveyName: string; date: string; status: string }[];
}

const UserDashboard: React.FC<UserDashboardProps> = ({ username, role }) => {
  const [stats, setStats] = useState<UserStats>({
    completedSurveys: 0,
    pendingSurveys: 0,
    totalSurveys: 0,
    recentActivity: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userId = localStorage.getItem("id");
        const response = await axios.get(
          `http://localhost:8081/api/surveys/stats/${userId}`
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
            My Dashboard
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            Track your survey progress and activities
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
            <CheckCircle sx={{ fontSize: 40, color: "success.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Completed Surveys
            </Typography>
            <Typography variant="h4">{stats.completedSurveys}</Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, width: 300 }}>
            <Schedule sx={{ fontSize: 40, color: "warning.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Pending Surveys
            </Typography>
            <Typography variant="h4">{stats.pendingSurveys}</Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, width: 300 }}>
            <Assignment sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Total Surveys
            </Typography>
            <Typography variant="h4">{stats.totalSurveys}</Typography>
          </Paper>
        </Box>

        <Paper elevation={3} sx={{ p: 4, mb: 8 }}>
          <Typography variant="h5" gutterBottom>
            Recent Activity
          </Typography>
          <List>
            {stats.recentActivity.map((activity, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={activity.surveyName}
                  secondary={`${activity.status} - ${activity.date}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default UserDashboard;
