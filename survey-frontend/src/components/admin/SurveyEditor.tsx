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
} from "@mui/material";
import { Add, Delete, DragHandle } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";

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

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchSurveyData();
    }
  }, [id]);

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

  const handleSubmit = async () => {
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
      } else {
        await axios.post("http://localhost:8081/api/surveys", surveyData);
      }

      navigate("/admin/surveys");
    } catch (error) {
      console.error("Error saving survey:", error);
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
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
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
