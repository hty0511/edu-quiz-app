import React from "react";
import axios from "axios";
import { CircularProgress, Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";
import { API_BASE_URL } from "../constants";

export default function ExplanationContent({ setPageContent, roundNumber, questionNumber }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    const API_CORRECT_ANSWERS_URL = `${API_BASE_URL}/api/cpp-quizzes/questions/correct-answers${roundNumber ? `?r_num=${roundNumber}&` : '?'}q_num=${questionNumber}`;

    axios
      .get(API_CORRECT_ANSWERS_URL, {
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
        setPageContent("waiting");
      });
  }, []);

  const handleClick = () => {
    setPageContent("intro");
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Card sx={{ width: 900, mx: "auto" }}>
      <CardContent>
        <Typography variant="h3" gutterBottom>
          解答
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
            <Typography
              variant="body1"
              style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowY: 'auto',
                  maxHeight: '600px',
                  maxWidth: '100%'
              }}
            >
              {`正確答案: ${JSON.stringify(data.correctAnswers)}\n解題過程: ${data.reasoning}`}
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleClick}>繼續</Button>
      </CardContent>
    </Card>
  );
}
