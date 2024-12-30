import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import axios from "axios";
import MainLayout from "../Layout/MainLayout";
import { useSnackbar } from "../../context/SnackbarContext";
import { format } from "date-fns";

interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  education: string;
  birthDate: string;
  gender: string;
  role: string;
  active: boolean;
  surveysCompleted: number;
  lastActive: string;
}

interface UserBioViewProps {
  username: string;
  role: string;
}

const UserBioView: React.FC<UserBioViewProps> = ({ username, role }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/admin/users/profiles"
      );
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      showSnackbar("Error loading user profiles", "error");
      setLoading(false);
    }
  };

  const handleViewDetails = (user: UserProfile) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <MainLayout username={username} role={role}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout username={username} role={role}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Profiles
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Surveys Completed</TableCell>
                <TableCell>Last Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.surveysCompleted}</TableCell>
                  <TableCell>
                    {user.lastActive
                      ? format(new Date(user.lastActive), "PPp")
                      : "Never"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleViewDetails(user)}
                      color="primary"
                      title="View Details"
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>User Profile Details</DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Username
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.username}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{selectedUser.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{selectedUser.phone}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.address}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Occupation
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.occupation}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Education
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.education}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Birth Date
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.birthDate}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Gender
                  </Typography>
                  <Typography variant="body1">{selectedUser.gender}</Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default UserBioView;
