import React from "react";
import axios from "axios";
import { CircularProgress, Card, CardContent, Typography, Grid, TextField, Button, CardMedia, Box } from "@mui/material";
import ChatBubble from './ChatBubble';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";

export default function Q1Content({ setPageContent }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const [answerFields, setAnswerFields] = React.useState('');
  const [confidenceLevelField, setConfidenceLevelField] = React.useState('');
  const [error, setError] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    const API_CURRENT_QUESTION_URL = `${API_BASE_URL}/api/cpp-quizzes/questions/current`;

    axios
      .get(API_CURRENT_QUESTION_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setData(response.data);
        setAnswerFields(Array(response.data.answersCount).fill(''));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("發生錯誤:", err);
        setPageContent("waiting");
      });
  }, []);

  const handleAnswerFieldChange = (index, value) => {
    const newFieldValues = [...answerFields];
    if (value === '') {
      newFieldValues[index] = '';
    } else {
      newFieldValues[index] = Number(value);
    }

    setAnswerFields(newFieldValues);
  };

  const handleConfidenceLevelFieldChange = (e) => {
    if (e.target.value === '') {
      setConfidenceLevelField('');
      return;
    }

    const value = parseInt(e.target.value, 10);

    if (!isNaN(value)) {
      setConfidenceLevelField(value);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const isAnswerFieldsValid = answerFields.every(field => field !== '');
    const isConfidenceLevelFieldValid = confidenceLevelField !== '' && confidenceLevelField >= 0 && confidenceLevelField <= 100;

    if (!isAnswerFieldsValid || !isConfidenceLevelFieldValid) {
      setError('請完成正確輸入');
      setIsLoading(false);
      return;
    }
    const answers = answerFields.reduce((obj, currentNumber, index) => {
      obj[index + 1] = currentNumber;
      return obj;
    }, {});

    const token = sessionStorage.getItem("jwt");
    const API_Q3_SUBMIT_URL = `${API_BASE_URL}${data.submitEndpoint}`;
    axios
      .post(
        API_Q3_SUBMIT_URL,
        {
          answers,
          confidenceLevel: confidenceLevelField
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        navigate("/");
      })
      .catch((err) => {
        console.error("提交錯誤:", err);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Card sx={{ width: 900, mx: "auto" }}>
      <CardContent>
        <Box display="flex" flexDirection="column">
          <Typography variant="h4" gutterBottom mb={5}>
            第三題
          </Typography>
          <Box display="flex" height={600} overflow="hidden" mb={3}>
            <CardMedia
              component="img"
              image={`${API_BASE_URL}/express-static/questions${data.imageUrl}`}
              alt="Question Image"
              style={{
                height: 'auto',
                width: '50%',
                objectFit: "contain"
              }}
            />
            <Box style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <ChatBubble text={`請依照cout輸出順序填寫答案以及寫下你的解題過程`} />
              <CardMedia
                component="img"
                image="chatbot.png"
                alt="Chatbot Image"
                style={{
                  height: 'auto',
                  maxWidth: '100%',
                  objectFit: "contain",
                  marginTop: '16px'
                }}
              />
            </Box>
          </Box>
          <Grid container spacing={2}>
            {answerFields.map((value, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <TextField
                  required
                  type="number"
                  fullWidth
                  label={`答案 ${index + 1}`}
                  value={value}
                  onChange={(e) => handleAnswerFieldChange(index, e.target.value)}
                  InputProps={{
                    onWheel: (e) => e.target.blur()
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <TextField
            required
            type="number"
            label="自信度(0~100)"
            value={confidenceLevelField}
            onChange={handleConfidenceLevelFieldChange}
            InputProps={{
              onWheel: (e) => e.target.blur()
            }}
            sx={{ mt: 2 }}
          />
          {error && (
            <Card
              sx={{
                width: '100%',
                mx: "auto",
                mt: 2,
                bgcolor: "error.main",
                color: "white"
              }}
            >
              <CardContent>
                <Typography variant="body1">{error}</Typography>
              </CardContent>
            </Card>
          )}
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>提交</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
