import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Grid,
  MenuItem,
} from "@mui/material";
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  Work,
  School,
  LocationOn,
  CalendarToday,
} from "@mui/icons-material";
import { register } from "../../api/auth";
import { AuthData, AuthError } from "../../types/auth";
import { AxiosError } from "axios";
import AuthLayout from "./AuthLayout";

interface RegisterData extends AuthData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  education: string;
  birthDate: string;
  gender: string;
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    password: "",
    role: "USER",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    occupation: "",
    education: "",
    birthDate: "",
    gender: "",
  });

  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

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

  const renderStep1 = () => (
    <>
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
        autoComplete="new-password"
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
    </>
  );

  const renderStep2 = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          name="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          name="phone"
          label="Phone"
          value={formData.phone}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          name="address"
          label="Address"
          multiline
          rows={2}
          value={formData.address}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          name="occupation"
          label="Occupation"
          value={formData.occupation}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Work />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          name="education"
          label="Education"
          value={formData.education}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <School />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          name="birthDate"
          label="Birth Date"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarToday />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          select
          name="gender"
          label="Gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <MenuItem value="MALE">Male</MenuItem>
          <MenuItem value="FEMALE">Female</MenuItem>
        </TextField>
      </Grid>
    </Grid>
  );

  return (
    <AuthLayout
      title={currentStep === 1 ? "Create Account" : "Personal Information"}
    >
      {message && (
        <Alert
          severity="success"
          sx={{
            width: "100%",
            mb: 3,
            borderRadius: 2,
          }}
        >
          {message}
        </Alert>
      )}

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
        {currentStep === 1 ? renderStep1() : renderStep2()}

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
          {currentStep === 1 ? "Next" : "Create Account"}
        </Button>

        {currentStep === 2 && (
          <Button
            fullWidth
            onClick={() => setCurrentStep(1)}
            sx={{
              mb: 3,
              color: "#667eea",
            }}
          >
            Back
          </Button>
        )}

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
          Already have an account? <a href="/login">Sign In</a>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;
