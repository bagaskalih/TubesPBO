import React, { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import { register } from "../api/auth";
import { AuthData } from "../types/auth";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<AuthData>({
    username: "",
    password: "",
    role: "USER",
  });
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Register
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
          Register
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

export default Register;
