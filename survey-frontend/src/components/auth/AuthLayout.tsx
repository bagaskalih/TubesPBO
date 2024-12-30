import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        margin: -1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          onClick={() => navigate("/")}
          sx={{
            color: "white",
            fontWeight: 700,
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
            mb: 1,
            cursor: "pointer",
          }}
        >
          Survey System
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
          }}
        >
          Create, manage, and analyze surveys with ease
        </Typography>
      </Box>

      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: "450px",
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "#333",
            mb: 3,
          }}
        >
          {title}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
};

export default AuthLayout;
