import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import MainLayout from "../Layout/MainLayout";
import axios from "axios";

interface Survey {
  id: number;
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  durationMinutes: number;
  responseCount: number;
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
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [sortByResponses, setSortByResponses] = useState<boolean>(false);

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

  const handleCategoryChange = async (categoryId: number) => {
    setSelectedCategory(categoryId);
    try {
      const url =
        categoryId === 0
          ? "http://localhost:8081/api/surveys"
          : `http://localhost:8081/api/surveys/category/${categoryId}`;
      const response = await axios.get(url);
      setSurveys(response.data);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8081/api/surveys/${id}`);
      fetchSurveys();
    } catch (error) {
      console.error("Error deleting survey:", error);
    }
  };

  const handleSort = () => {
    setSortByResponses(!sortByResponses);
    const sortedSurveys = [...surveys].sort((a, b) =>
      sortByResponses
        ? a.responseCount - b.responseCount
        : b.responseCount - a.responseCount
    );
    setSurveys(sortedSurveys);
  };

  return (
    <MainLayout username={username} role={role}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Survey Management
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button variant="contained" color="primary" href="/surveys/create">
              Create New Survey
            </Button>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value as number)}
                label="Filter by Category"
              >
                <MenuItem value={0}>All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={handleSort}>
              Sort by Responses {sortByResponses ? "↑" : "↓"}
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Duration (min)</TableCell>
                  <TableCell>Responses</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {surveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell>{survey.title}</TableCell>
                    <TableCell>{survey.category.name}</TableCell>
                    <TableCell>{survey.durationMinutes}</TableCell>
                    <TableCell>{survey.responseCount}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          href={`/surveys/${survey.id}`}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(survey.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default SurveyManagement;
