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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
} from "@mui/material";
import { Edit, Delete, Add, Assessment, Visibility } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import { useSnackbar } from "../../context/SnackbarContext";
import { format } from "date-fns";

interface Survey {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  responseCount: number;
  createdAt: string;
  questions: Array<{
    id: number;
    questionText: string;
    questionType: string;
  }>;
}

interface SurveyResponse {
  id: number;
  userId: number;
  username: string;
  completedAt: string;
  answers: Array<{
    questionId: number;
    questionText: string;
    answerText?: string;
    selectedOptionId?: number;
    selectedOptionText?: string;
  }>;
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
  const [responsesDialogOpen, setResponsesDialogOpen] = useState(false);
  const [responseDetailDialogOpen, setResponseDetailDialogOpen] =
    useState(false);
  const [selectedResponse, setSelectedResponse] =
    useState<SurveyResponse | null>(null);

  const [selectedSurveyResponses, setSelectedSurveyResponses] = useState<
    SurveyResponse[]
  >([]);
  const [viewingSurvey, setViewingSurvey] = useState<Survey | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();

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
      const response = await axios.get("http://localhost:8081/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleViewResponses = async (survey: Survey) => {
    try {
      const [surveyDetails, responses] = await Promise.all([
        axios.get(`http://localhost:8081/api/surveys/${survey.id}`),
        axios.get(`http://localhost:8081/api/surveys/${survey.id}/responses`),
      ]);

      setSelectedSurveyResponses(responses.data);
      setViewingSurvey({ ...survey, ...surveyDetails.data });
      setResponsesDialogOpen(true);
    } catch (error) {
      console.error("Error fetching survey responses:", error);
      showSnackbar("Error fetching responses", "error");
    }
  };

  const handleViewResponseDetail = (response: SurveyResponse) => {
    setSelectedResponse(response);
    setResponseDetailDialogOpen(true);
  };

  const getAnswerDisplay = (answer: any, questionType: string) => {
    switch (questionType) {
      case "MULTIPLE_CHOICE":
        return answer.selectedOptionText || "No answer";

      case "RATING":
        return (
          <Rating value={Number(answer.answerText)} readOnly size="small" />
        );

      default:
        return answer.answerText || "No answer";
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      try {
        await axios.delete(`http://localhost:8081/api/surveys/${id}`);
        fetchSurveys();
        showSnackbar("Survey deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting survey:", error);
        showSnackbar("Error deleting survey", "error");
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
                    <IconButton
                      onClick={() => handleViewResponses(survey)}
                      color="primary"
                      title="View Responses"
                    >
                      <Assessment />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog
        open={responsesDialogOpen}
        onClose={() => setResponsesDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {viewingSurvey?.title} - Responses ({selectedSurveyResponses.length})
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Completion Date</TableCell>
                  <TableCell align="right">View Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedSurveyResponses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell>{response.username}</TableCell>
                    <TableCell>
                      {format(new Date(response.completedAt), "PPp")}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleViewResponseDetail(response)}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponsesDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={responseDetailDialogOpen}
        onClose={() => setResponseDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Response Details - {selectedResponse?.username}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Completed on:{" "}
            {selectedResponse &&
              format(new Date(selectedResponse.completedAt), "PPp")}
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Answer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {viewingSurvey?.questions.map((question) => {
                  const answer = selectedResponse?.answers.find(
                    (a) => a.questionId === question.id
                  );

                  return (
                    <TableRow key={question.id}>
                      <TableCell>{question.questionText}</TableCell>
                      <TableCell>
                        {answer
                          ? getAnswerDisplay(answer, question.questionType)
                          : "No answer provided"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDetailDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default SurveyManagement;
