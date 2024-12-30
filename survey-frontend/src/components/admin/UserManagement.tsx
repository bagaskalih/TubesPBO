import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";
import MainLayout from "../Layout/MainLayout";
import { useSnackbar } from "../../context/SnackbarContext";

interface User {
  id: number;
  username: string;
  role: string;
  active: boolean;
  surveysCompleted: number;
  lastActive: string;
}

interface EditUserData {
  username: string;
  role: string;
  active: boolean;
}

interface UserManagementProps {
  username: string;
  role: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ username, role }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editData, setEditData] = useState<EditUserData>({
    username: "",
    role: "",
    active: true,
  });

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/admin/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      showSnackbar("Error loading users", "error");
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditData({
      username: user.username,
      role: user.role,
      active: user.active,
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedUser) return;

    try {
      await axios.put(
        `http://localhost:8081/api/admin/users/${selectedUser.id}`,
        editData
      );
      showSnackbar("User updated successfully", "success");
      setEditDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      if (error.response.data.message) {
        showSnackbar(error.response.data.message, "error");
      } else {
        showSnackbar("Error updating user", "error");
        console.error(error);
      }
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8081/api/admin/users/${userId}`);
        showSnackbar("User deleted successfully", "success");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        showSnackbar("Error deleting user", "error");
      }
    }
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
          Account Management
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Surveys Completed</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === "ADMIN" ? "secondary" : "primary"}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>{user.surveysCompleted}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEditClick(user)}
                      color="primary"
                      title="Edit user"
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      onClick={() => handleDelete(user.id)}
                      color="error"
                      title="Delete user"
                      disabled={user.role === "ADMIN"}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                fullWidth
                label="Username"
                value={editData.username}
                onChange={(e) =>
                  setEditData({ ...editData, username: e.target.value })
                }
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editData.role}
                  label="Role"
                  onChange={(e) =>
                    setEditData({ ...editData, role: e.target.value })
                  }
                >
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleEditSave}
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default UserManagement;
