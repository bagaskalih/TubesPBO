import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import MainLayout from "../Layout/MainLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface SurveyFormProps {
  username: string;
  role: string;
}

interface Category {
  id: number;
  name: string;
}

interface Question {
  questionText: string;
  questionType: string;
  required: boolean;
  options: string[];
}

const CreateSurvey: React.FC<SurveyFormProps> = ({ username, role }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    durationMinutes: 30,
    questions: [
      { questionText: "", questionType: "TEXT", required: true, options: [""] },
    ] as Question[],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("id");
      const surveyData = {
        ...formData,
        createdBy: { id: userId },
        createdAt: new Date().toISOString(),
      };

      await axios.post("http://localhost:8081/api/surveys", surveyData);
      navigate("/surveys");
    } catch (error) {
      console.error("Error creating survey:", error);
    }
  };

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: any
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push("");
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          questionText: "",
          questionType: "TEXT",
          required: true,
          options: [""],
        },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  return (
    <MainLayout username={username} role={role}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Survey
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Survey Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.categoryId}
                    label="Category"
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Duration (minutes)"
                  value={formData.durationMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationMinutes: parseInt(e.target.value),
                    })
                  }
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                  Questions
                </Typography>
                {formData.questions.map((question, qIndex) => (
                  <Paper
                    key={qIndex}
                    sx={{ p: 2, mt: 2, position: "relative" }}
                  >
                    <IconButton
                      sx={{ position: "absolute", right: 8, top: 8 }}
                      onClick={() => removeQuestion(qIndex)}
                      disabled={formData.questions.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          required
                          label={`Question ${qIndex + 1}`}
                          value={question.questionText}
                          onChange={(e) =>
                            handleQuestionChange(
                              qIndex,
                              "questionText",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Question Type</InputLabel>
                          <Select
                            value={question.questionType}
                            label="Question Type"
                            onChange={(e) =>
                              handleQuestionChange(
                                qIndex,
                                "questionType",
                                e.target.value
                              )
                            }
                          >
                            <MenuItem value="TEXT">Text</MenuItem>
                            <MenuItem value="MULTIPLE_CHOICE">
                              Multiple Choice
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={question.required}
                              onChange={(e) =>
                                handleQuestionChange(
                                  qIndex,
                                  "required",
                                  e.target.checked
                                )
                              }
                            />
                          }
                          label="Required"
                        />
                      </Grid>

                      {question.questionType === "MULTIPLE_CHOICE" && (
                        <Grid item xs={12}>
                          {question.options.map((option, oIndex) => (
                            <Box
                              key={oIndex}
                              sx={{ display: "flex", gap: 1, mb: 1 }}
                            >
                              <TextField
                                fullWidth
                                required
                                label={`Option ${oIndex + 1}`}
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(
                                    qIndex,
                                    oIndex,
                                    e.target.value
                                  )
                                }
                              />
                              <IconButton
                                onClick={() => removeOption(qIndex, oIndex)}
                                disabled={question.options.length === 1}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          ))}
                          <Button onClick={() => addOption(qIndex)}>
                            Add Option
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                ))}
                <Button sx={{ mt: 2 }} onClick={addQuestion}>
                  Add Question
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button type="submit" variant="contained" color="primary">
                    Create Survey
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/surveys")}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default CreateSurvey;
