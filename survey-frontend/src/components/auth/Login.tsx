import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Person, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "../../api/auth";
import { AuthData, AuthError } from "../../types/auth";
import { AxiosError } from "axios";
import AuthLayout from "./AuthLayout";

const LoginPage = () => {
  const [formData, setFormData] = useState<AuthData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem("id", response.id);
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
    <AuthLayout title="Welcome Back">
      {error && (
        <Alert
          severity="error"
          sx={{
            width: "100%",
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          "& .MuiTextField-root": { mb: 2.5 },
        }}
      >
        <TextField
          variant="outlined"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={formData.username}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: "action.active" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <TextField
          variant="outlined"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: "action.active" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            mb: 3,
            py: 1.5,
            borderRadius: 2,
            fontSize: "1.1rem",
            textTransform: "none",
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
            boxShadow: "0 3px 15px rgba(102, 126, 234, 0.25)",
            "&:hover": {
              background: "linear-gradient(45deg, #5c71d3 30%, #6a439c 90%)",
            },
          }}
        >
          Sign In
        </Button>

        <Typography
          variant="body1"
          align="center"
          sx={{
            color: "text.secondary",
            "& a": {
              color: "#667eea",
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            },
          }}
        >
          Don&apos;t have an account? <a href="/register">Sign Up</a>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
