import React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Layout from "../layouts/Layout";
import { CircularProgress, Card, CardContent, CardMedia, Typography, Button, Box, Divider } from "@mui/material";
import { API_BASE_URL } from "../constants";

export default function QuestionDetailPage() {
  const { weekId, sectionId, questionId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    const API_HISTORY_URL = `${API_BASE_URL}/api/cpp-quizzes/history?week=${weekId}&round=${sectionId}&number=${questionId}`;

    axios
      .get(API_HISTORY_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("發生錯誤:", err);
        navigate(`/cpp-quiz/history/not-found`);
      });
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Layout>
      <Card sx={{ width: 1100, mx: "auto", mt: 5, textAlign: "center" }}>
        <CardContent>
          <Box sx={{ textAlign: 'left', mb: 2 }}>
            <Button onClick={handleBack}>{"<= 回到上一頁"}</Button>
          </Box>
          <Box display="flex" height={600} overflow="hidden">
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
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowY: 'auto',
                  maxHeight: '300px',
                  maxWidth: '100%'
                }}
              >
                {`正確答案: ${JSON.stringify(data.correctAnswers)}\n正確解題過程: ${data.correctReasoning}`}
              </Typography>

              <Divider flexItem sx={{ my: 2 }} />

              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowY: 'auto',
                  maxHeight: '300px',
                  maxWidth: '100%'
                }}
              >
                {`你的答案: ${JSON.stringify(data.userAnswers)}${data.userReasoning ? `\n你的解題過程: ${data.userReasoning}` : ''}`}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Layout>
  );
}
