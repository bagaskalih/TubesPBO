import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../Layout/MainLayout";

interface Survey {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  durationMinutes: number;
  responseCount: number;
}

interface Category {
  id: number;
  name: string;
}

interface SurveyListProps {
  username: string;
  role: string;
}

const SurveyList: React.FC<SurveyListProps> = ({ username, role }) => {
  const [availableSurveys, setAvailableSurveys] = useState<Survey[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("id");
      const [surveysRes, categoriesRes, completedRes] = await Promise.all([
        axios.get("http://localhost:8081/api/surveys"),
        axios.get("http://localhost:8081/api/categories"),
        axios.get(`http://localhost:8081/api/surveys/responses/user/${userId}`),
      ]);
      setCategories(categoriesRes.data);
      setAvailableSurveys(
        surveysRes.data.filter(
          (survey: Survey) =>
            !completedRes.data.some(
              (response: { surveyId: number }) =>
                response.surveyId === survey.id
            )
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getFilteredSurveys = () => {
    if (selectedCategory === "all") return availableSurveys;
    return availableSurveys.filter(
      (survey) => survey.categoryId === parseInt(selectedCategory)
    );
  };

  return (
    <MainLayout username={username} role={role}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Available Surveys
        </Typography>

        <FormControl sx={{ mb: 4, minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={3}>
          {getFilteredSurveys().map((survey) => (
            <Grid item xs={12} md={6} lg={4} key={survey.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {survey.title}
                  </Typography>
                  <Typography color="textSecondary" paragraph>
                    {survey.description}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Chip
                      label={`${survey.durationMinutes} minutes`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={
                        categories.find((c) => c.id === survey.categoryId)?.name
                      }
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/surveys/take/${survey.id}`)}
                  >
                    Start Survey
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default SurveyList;
