import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { register } from "../api/auth";
import { AuthData } from "../types/auth";

const RegisterPage = () => {
  const [formData, setFormData] = useState<AuthData>({
    username: "",
    password: "",
    role: "USER",
  });

  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(formData);
      setMessage("Registration successful!");
    } catch (error) {
      console.error(error);
      setMessage("Registration failed");
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
          Sign Up
        </Typography>
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
      {message && (
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      )}
      <Typography variant="body1" color="textSecondary">
        Already have an account? <a href="/login">Login</a>
      </Typography>
    </Box>
  );
};

export default RegisterPage;
