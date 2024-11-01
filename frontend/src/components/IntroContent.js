import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { CircularProgress, Card, CardContent, Typography, Button, Box } from "@mui/material";
import { API_BASE_URL } from "../constants";

export default function IntroContent({ setPageContent }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClickPostLessonPractice1 = () => {
    setPageContent("q4-r1");
  };

  const handleClickPostLessonPractice2 = () => {
    setPageContent("q4-r2");
  };

  const handleClickPostLessonPractice3 = () => {
    setPageContent("q4-r3");
  };

  const handleClick = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem("jwt");
    const API_CURRENT_QUESTION_URL = `${API_BASE_URL}/api/cpp-quizzes/questions/current`;

    axios
      .get(API_CURRENT_QUESTION_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const nextContent = response.data.submitEndpoint.split('/').pop();
        setPageContent(nextContent);
      })
      .catch((err) => {
        console.error("發生錯誤:", err);
        setPageContent("waiting");
      });
  };

  const historyClick = () => {
    navigate(`/cpp-quiz/history`);
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Card sx={{ width: 900, mx: "auto" }}>
      <CardContent>
        <Typography variant="h3" gutterBottom>
          C++ 題目練習
        </Typography>
        <Typography variant="body2" gutterBottom>
          每節課有三題題目，請同學踴躍作答
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 1
          }}
        >
          <Button variant="text" onClick={handleClickPostLessonPractice1}>課後練習 1</Button>
          <Button variant="text" onClick={handleClickPostLessonPractice2}>課後練習 2</Button>
          <Button variant="text" onClick={handleClickPostLessonPractice3}>課後練習 3</Button>
        </Box>

        <Button color="primary" sx={{ mt: 1 }} onClick={historyClick}>歷史答題記錄</Button>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleClick}>開始</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
