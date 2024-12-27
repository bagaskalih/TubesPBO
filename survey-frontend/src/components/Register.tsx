import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { register } from "../api/auth";
import { AuthData, AuthError } from "../types/auth";
import { AxiosError } from "axios";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "400px",
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState<AuthData>({
    username: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(formData);
      setMessage("Registration successful. Please login.");
      setError("");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as AuthError;
        setError(errorData.message || "Username already exists");
        setMessage("");
      } else if (error instanceof AxiosError && error.request) {
        setError("Network error. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      {message && (
        <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
      </Box>
      <Typography variant="body1" sx={{ mt: 2 }} color="textSecondary">
        Already have an account? <a href="/login">Login</a>
      </Typography>
    </AuthLayout>
  );
};

export default RegisterPage;
