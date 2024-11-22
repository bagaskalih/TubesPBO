import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { login } from "../api/auth";
import { AuthData, AuthError } from "../types/auth";
import { AxiosError } from "axios";

const Login = () => {
  const [formData, setFormData] = useState<AuthData>({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(formData);

      localStorage.setItem("id", response.id);
      // console.log(localStorage.getItem("id"));
      window.location.href = "/";
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as AuthError;
        setError(errorData.message || "Invalid credentials");
      } else if (error instanceof AxiosError && error.request) {
        setError("Network error. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 3,
          border: "1px solid black",
          display: "flex",
          width: "25%",
          padding: "60px 20px",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
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
          Sign In
        </Button>
      </Box>
      <Typography variant="body1" sx={{ mt: 3 }} color="textSecondary">
        Don't have an account? <a href="/register">Sign Up</a>
      </Typography>
    </Box>
  );
};

export default Login;
