import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";

interface Survey {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  responseCount: number;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

interface SurveyManagementProps {
  username: string;
  role: string;
}

const SurveyManagement: React.FC<SurveyManagementProps> = ({
  username,
  role,
}) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveys();
    fetchCategories();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/surveys");
      setSurveys(response.data);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/surveys/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      try {
        await axios.delete(`http://localhost:8081/api/surveys/${id}`);
        fetchSurveys();
      } catch (error) {
        console.error("Error deleting survey:", error);
      }
    }
  };

  const filteredAndSortedSurveys = () => {
    let filtered = surveys;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (survey) => survey.categoryId === parseInt(selectedCategory)
      );
    }

    switch (sortBy) {
      case "responses":
        return [...filtered].sort((a, b) => b.responseCount - a.responseCount);
      case "newest":
        return [...filtered].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return filtered;
    }
  };

  return (
    <MainLayout username={username} role={role}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4">Survey Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/admin/surveys/create")}
          >
            Create Survey
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category Filter</InputLabel>
            <Select
              value={selectedCategory}
              label="Category Filter"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="responses">Most Responses</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Responses</TableCell>
                <TableCell align="right">Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedSurveys().map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>{survey.title}</TableCell>
                  <TableCell>
                    {categories.find((c) => c.id === survey.categoryId)?.name}
                  </TableCell>
                  <TableCell align="right">{survey.responseCount}</TableCell>
                  <TableCell align="right">
                    {new Date(survey.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() =>
                        navigate(`/admin/surveys/edit/${survey.id}`)
                      }
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(survey.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MainLayout>
  );
};

export default SurveyManagement;
