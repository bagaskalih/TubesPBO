import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null
  );

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (!id) {
      navigate("/login");
    } else {
      fetch(`http://localhost:8081/api/users/${id}`)
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => {
          console.error(error);
          navigate("/login");
        });
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.username}!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Role: {user.role}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          localStorage.removeItem("id");
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default UserDashboard;
