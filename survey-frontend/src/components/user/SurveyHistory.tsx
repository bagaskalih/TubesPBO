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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Rating,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import axios from "axios";
import MainLayout from "../Layout/MainLayout";
import { format } from "date-fns";
import { useSnackbar } from "../../context/SnackbarContext";

interface SurveyResponse {
  id: number;
  surveyId: number;
  startedAt: string;
  completedAt: string;
  answers: Array<{
    questionId: number;
    answerText?: string;
    selectedOptionId?: number;
  }>;
}

interface SurveyDetails {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  questions: Array<{
    id: number;
    questionText: string;
    questionType: string;
    options: Array<{
      id: number;
      optionText: string;
    }>;
  }>;
}

interface SurveyHistoryProps {
  username: string;
  role: string;
}

interface SelectedResponse extends SurveyResponse {
  survey: SurveyDetails;
}

interface Category {
  id: number;
  name: string;
}

const SurveyHistory: React.FC<SurveyHistoryProps> = ({ username, role }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [surveys, setSurveys] = useState<{ [key: number]: SurveyDetails }>({});
  const [selectedResponse, setSelectedResponse] =
    useState<SelectedResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const userId = localStorage.getItem("id");
      const responsesRes = await axios.get(
        `http://localhost:8081/api/surveys/responses/user/${userId}`
      );
      const responses: SurveyResponse[] = responsesRes.data;

      const surveyPromises = responses.map((response) =>
        axios.get(`http://localhost:8081/api/surveys/${response.surveyId}`)
      );

      const surveyResponses = await Promise.all(surveyPromises);
      const surveyMap = surveyResponses.reduce(
        (acc, res) => {
          acc[res.data.id] = res.data;
          return acc;
        },
        {} as { [key: number]: SurveyDetails }
      );

      const categoriesRes = await axios.get(
        "http://localhost:8081/api/categories"
      );

      setCategories(categoriesRes.data);

      setResponses(responses);
      setSurveys(surveyMap);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching responses:", error);
      showSnackbar("Error fetching survey history", "error");
      setLoading(false);
    }
  };

  const handleViewResponse = (
    response: SurveyResponse,
    survey: SurveyDetails
  ) => {
    setSelectedResponse({
      ...response,
      survey,
    });
    setDialogOpen(true);
  };

  const getAnswerDisplay = (answer: any, question: any) => {
    switch (question.questionType) {
      case "MULTIPLE_CHOICE":
        const selectedOption = question.options.find(
          (opt: any) => opt.id === answer.selectedOptionId
        );
        return selectedOption ? selectedOption.optionText : "No answer";

      case "RATING":
        return (
          <Rating value={Number(answer.answerText)} readOnly size="small" />
        );

      default:
        return answer.answerText || "No answer";
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
          Survey History
        </Typography>

        {responses.length === 0 ? (
          <Typography
            variant="h6"
            color="textSecondary"
            align="center"
            sx={{ mt: 4 }}
          >
            You haven't completed any surveys yet
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Survey Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Completed Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {responses.map((response) => {
                  const survey = surveys[response.surveyId];
                  if (!survey) return null;

                  return (
                    <TableRow key={response.id}>
                      <TableCell>{survey.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            categories.find((c) => c.id === survey.categoryId)
                              ?.name
                          }
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(response.completedAt), "PPp")}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewResponse(response, survey)}
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedResponse?.survey.title} - Response Details
          </DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Your Answer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedResponse &&
                    surveys[selectedResponse.surveyId]?.questions.map(
                      (question) => {
                        const answer = selectedResponse.answers.find(
                          (a) => a.questionId === question.id
                        );
                        return (
                          <TableRow key={question.id}>
                            <TableCell>{question.questionText}</TableCell>
                            <TableCell>
                              {answer
                                ? getAnswerDisplay(answer, question)
                                : "No answer"}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default SurveyHistory;
