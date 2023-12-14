import React from "react";
import axios from "axios";
import { CircularProgress, Card, CardContent, Typography, Button } from "@mui/material";
import { API_BASE_URL } from "../constants";

export default function WaitingContent({ setPageContent }) {
  const [isLoading, setIsLoading] = React.useState(false);

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
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Card sx={{ width: 900, mx: "auto" }}>
      <CardContent>
        <Typography variant="h3" gutterBottom>
          系統暫未開放
        </Typography>
        <Typography variant="body2" gutterBottom>
          請等待系統開放或是等待老師講解完前兩題再繼續第三題的作答
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleClick}>繼續</Button>
      </CardContent>
    </Card>
  );
}
