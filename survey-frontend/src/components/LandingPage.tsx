import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { Assignment, People, Timer } from "@mui/icons-material";
import MainLayout from "./Layout/MainLayout";
import { useNavigate } from "react-router-dom";

interface LandingPageProps {
  username: string;
  role: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ username, role }) => {
  const navigate = useNavigate();
  return (
    <MainLayout username={username} role={role}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 8 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Welcome to Survey Application
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary">
            A comprehensive platform for creating and participating in surveys
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
            <Assignment sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Diverse Survey Categories
            </Typography>
            <Typography>
              Choose from multiple categories including general knowledge,
              history, mathematics, economics, and trivia.
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, width: 300 }}>
            <Timer sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Flexible Duration
            </Typography>
            <Typography>
              Take surveys at your own pace with customizable time limits set
              for each survey.
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, width: 300 }}>
            <People sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              User Rankings
            </Typography>
            <Typography>
              Track your progress and compare with others through our
              participant ranking system.
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() =>
              navigate(role === "ADMIN" ? "/admin/surveys" : "/surveys")
            }
          >
            {role === "ADMIN" ? "Manage Surveys" : "Start Taking Surveys"}
          </Button>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default LandingPage;
