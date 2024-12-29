import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Card,
  CardContent,
  Grid,
  FormHelperText,
} from "@mui/material";
import { Add, Delete, DragHandle } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import { useSnackbar } from "../../context/SnackbarContext";

interface Question {
  id?: number;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TEXT" | "RATING";
  orderNumber: number;
  options: QuestionOption[];
}

interface QuestionOption {
  id?: number;
  optionText: string;
  orderNumber: number;
}

interface Category {
  id: number;
  name: string;
}

interface SurveyEditorProps {
  username: string;
  role: string;
}

const SurveyEditor: React.FC<SurveyEditorProps> = ({ username, role }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchSurveyData();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSurveyData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/surveys/${id}`
      );
      const survey = response.data;
      setTitle(survey.title);
      setDescription(survey.description);
      setCategoryId(survey.categoryId);
      setDurationMinutes(survey.durationMinutes);
      setQuestions(survey.questions);
    } catch (error) {
      console.error("Error fetching survey:", error);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "MULTIPLE_CHOICE",
        orderNumber: questions.length,
        options: [],
      },
    ]);
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value,
    };
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({
      optionText: "",
      orderNumber: newQuestions[questionIndex].options.length,
    });
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].optionText = value;
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleDeleteOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
  };

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    questions: {} as {
      [key: number]: {
        text?: string;
        options?: { [key: number]: string };
      };
    },
  });

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      category: "",
      duration: "",
      questions: {} as typeof errors.questions,
    };
    let hasError = false;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      hasError = true;
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
      hasError = true;
    }

    if (!categoryId) {
      newErrors.category = "Category is required";
      hasError = true;
    }

    if (!durationMinutes || durationMinutes <= 0) {
      newErrors.duration = "Valid duration is required";
      hasError = true;
    }

    questions.forEach((question, index) => {
      newErrors.questions[index] = {};

      if (!question.questionText.trim()) {
        newErrors.questions[index].text = "Question text is required";
        hasError = true;
      }

      if (question.questionType === "MULTIPLE_CHOICE") {
        if (question.options.length < 2) {
          newErrors.questions[index].text = "At least 2 options required";
          hasError = true;
        }

        question.options.forEach((option, optIndex) => {
          if (!option.optionText.trim()) {
            if (!newErrors.questions[index].options) {
              newErrors.questions[index].options = {};
            }
            newErrors.questions[index].options![optIndex] =
              "Option text required";
            hasError = true;
          }
        });
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar("Please fix the errors before submitting", "error");
      return;
    }
    const errors = [];

    if (!title.trim()) errors.push("Title is required");
    if (!description.trim()) errors.push("Description is required");
    if (!categoryId) errors.push("Category is required");
    if (questions.length === 0)
      errors.push("At least one question is required");

    questions.forEach((question, index) => {
      if (!question.questionText.trim()) {
        errors.push(`Question ${index + 1} text is required`);
      }
      if (
        question.questionType === "MULTIPLE_CHOICE" &&
        question.options.length < 2
      ) {
        errors.push(`Question ${index + 1} must have at least 2 options`);
      }
      if (question.questionType === "MULTIPLE_CHOICE") {
        question.options.forEach((option, optIndex) => {
          if (!option.optionText.trim()) {
            errors.push(
              `Option ${optIndex + 1} in Question ${index + 1} is required`
            );
          }
        });
      }
    });

    if (errors.length > 0) {
      showSnackbar(errors.join(", "), "error");
      return;
    }

    try {
      const surveyData = {
        id: id ? parseInt(id) : undefined,
        title,
        description,
        categoryId,
        durationMinutes,
        questions,
      };

      if (id) {
        await axios.put(`http://localhost:8081/api/surveys/${id}`, surveyData);
        showSnackbar("Survey updated successfully", "success");
      } else {
        await axios.post("http://localhost:8081/api/surveys", surveyData);
        showSnackbar("Survey created successfully", "success");
      }

      navigate("/admin/surveys");
    } catch (error) {
      console.error("Error saving survey:", error);
      showSnackbar("Error saving survey", "error");
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newQuestions = Array.from(questions);
    const [reorderedQuestion] = newQuestions.splice(result.source.index, 1);
    newQuestions.splice(result.destination.index, 0, reorderedQuestion);

    newQuestions.forEach((q, index) => {
      q.orderNumber = index;
    });

    setQuestions(newQuestions);
  };

  return (
    <MainLayout username={username} role={role}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {id ? "Edit Survey" : "Create Survey"}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Survey Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryId}
                label="Category"
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Duration (minutes)"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Questions
          </Typography>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {questions.map((question, index) => (
                    <Draggable
                      key={index}
                      draggableId={`question-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{ mt: 2 }}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <div {...provided.dragHandleProps}>
                                <DragHandle />
                              </div>
                              <Typography variant="h6" sx={{ ml: 2 }}>
                                Question {index + 1}
                              </Typography>
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteQuestion(index)}
                                sx={{ ml: "auto" }}
                              >
                                <Delete />
                              </IconButton>
                            </Box>

                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Question Text"
                                  value={question.questionText}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      index,
                                      "questionText",
                                      e.target.value
                                    )
                                  }
                                  error={!!errors.questions[index]?.text}
                                  helperText={errors.questions[index]?.text}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <FormControl fullWidth>
                                  <InputLabel>Question Type</InputLabel>
                                  <Select
                                    value={question.questionType}
                                    label="Question Type"
                                    onChange={(e) =>
                                      handleQuestionChange(
                                        index,
                                        "questionType",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <MenuItem value="MULTIPLE_CHOICE">
                                      Multiple Choice
                                    </MenuItem>
                                    <MenuItem value="TEXT">Text</MenuItem>
                                    <MenuItem value="RATING">Rating</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>

                            {question.questionType === "MULTIPLE_CHOICE" && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1">
                                  Options
                                </Typography>
                                {question.options.map((option, optionIndex) => (
                                  <Box
                                    key={optionIndex}
                                    sx={{ display: "flex", gap: 1, mt: 1 }}
                                  >
                                    <TextField
                                      fullWidth
                                      label={`Option ${optionIndex + 1}`}
                                      value={option.optionText}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          index,
                                          optionIndex,
                                          e.target.value
                                        )
                                      }
                                      error={
                                        !!errors.questions[index]?.options?.[
                                          optionIndex
                                        ]
                                      }
                                      helperText={
                                        errors.questions[index]?.options?.[
                                          optionIndex
                                        ]
                                      }
                                    />
                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        handleDeleteOption(index, optionIndex)
                                      }
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Box>
                                ))}
                                <Button
                                  startIcon={<Add />}
                                  onClick={() => handleAddOption(index)}
                                  sx={{ mt: 1 }}
                                >
                                  Add Option
                                </Button>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddQuestion}
            sx={{ mt: 2 }}
          >
            Add Question
          </Button>

          <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {id ? "Update Survey" : "Create Survey"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/admin/surveys")}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default SurveyEditor;
