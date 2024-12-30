import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  Rating,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../Layout/MainLayout";
import { useSnackbar } from "../../context/SnackbarContext";

interface Question {
  id: number;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TEXT" | "RATING";
  options: QuestionOption[];
}

interface QuestionOption {
  id: number;
  optionText: string;
}

interface Answer {
  questionId: number;
  answer: string | number;
}

interface TakeSurveyProps {
  username: string;
  role: string;
}

const TakeSurvey: React.FC<TakeSurveyProps> = ({ username, role }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { showSnackbar } = useSnackbar();
  useEffect(() => {
    fetchSurvey();
  }, [id]);

  useEffect(() => {
    if (survey) {
      const timeLeft = survey.durationMinutes * 60;
      setTimer(timeLeft);

      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            showSnackbar("Time's up!", "error");
            submitSurvey();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [survey]);

  const fetchSurvey = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/surveys/${id}`
      );
      console.log(response.data);
      setSurvey(response.data);
      initializeAnswers(response.data.questions);
    } catch (error) {
      console.error("Error fetching survey:", error);
    }
  };

  const initializeAnswers = (questions: Question[]) => {
    const initialAnswers = questions.map((q) => ({
      questionId: q.id,
      answer: q.questionType === "RATING" ? 0 : "",
    }));
    setAnswers(initialAnswers);
  };

  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: survey.questions[currentQuestion].id,
      answer,
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < survey.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const submitSurvey = async () => {
    try {
      const formattedAnswers = answers.map((ans) => {
        const question = survey.questions.find(
          (q: { id: number }) => q.id === ans.questionId
        );
        return {
          questionId: ans.questionId,
          answerText:
            question?.questionType === "MULTIPLE_CHOICE"
              ? ""
              : ans.answer.toString(),
          selectedOptionId:
            question?.questionType === "MULTIPLE_CHOICE"
              ? parseInt(ans.answer as string)
              : null,
        };
      });

      await axios.post(`http://localhost:8081/api/surveys/${id}/submit`, {
        surveyId: id,
        userId: localStorage.getItem("id"),
        answers: formattedAnswers,
      });

      navigate("/surveys");
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  if (!survey) return <div>Loading...</div>;

  const currentQuestionData = survey.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / survey.questions.length) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <MainLayout username={username} role={role}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4">{survey.title}</Typography>
          <Typography variant="h6" color="error">
            Time remaining: {formatTime(timer)}
          </Typography>
        </Box>

        <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Question {currentQuestion + 1} of {survey.questions.length}
            </Typography>

            <Typography variant="h5" gutterBottom>
              {currentQuestionData.questionText}
            </Typography>

            {currentQuestionData.questionType === "MULTIPLE_CHOICE" && (
              <RadioGroup
                value={answers[currentQuestion]?.answer || ""}
                onChange={(e) => handleAnswer(e.target.value)}
              >
                {currentQuestionData.options.map((option: QuestionOption) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id.toString()}
                    control={<Radio />}
                    label={option.optionText}
                  />
                ))}
              </RadioGroup>
            )}

            {currentQuestionData.questionType === "TEXT" && (
              <TextField
                fullWidth
                multiline
                rows={4}
                value={answers[currentQuestion]?.answer || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Enter your answer"
              />
            )}

            {currentQuestionData.questionType === "RATING" && (
              <Rating
                value={Number(answers[currentQuestion]?.answer) || 0}
                onChange={(_, value) => handleAnswer(value || 0)}
                size="large"
              />
            )}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button variant="contained" onClick={handleNext}>
                {currentQuestion === survey.questions.length - 1
                  ? "Finish"
                  : "Next"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
        >
          <DialogTitle>Submit Survey</DialogTitle>
          <DialogContent>
            Are you sure you want to submit your answers? You won't be able to
            change them later.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={submitSurvey} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default TakeSurvey;
