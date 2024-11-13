import React, { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import { login } from "../api/auth";
import { AuthData } from "../types/auth";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<AuthData>({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      setMessage(`Login successful! Token: ${response.token}`);
    } catch (error) {
      console.error(error);
      setMessage("Login failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          margin="normal"
        />
        <Button fullWidth type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
      {message && (
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Login;
