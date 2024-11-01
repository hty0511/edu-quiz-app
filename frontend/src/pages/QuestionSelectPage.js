import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Layout from "../layouts/Layout";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function QuestionSelectPage() {
  const { weekId, sectionId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  function selectQuestion(questionNumber) {
    navigate(`/cpp-quiz/history/week/${weekId}/section/${sectionId}/question/${questionNumber}`);
  }

  return (
    <Layout>
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 5, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            請選擇第幾題
          </Typography>
          <Box sx={{ textAlign: 'left', mb: 2 }}>
            <Button onClick={handleBack}>{"<= 回到上一頁"}</Button>
          </Box>
          {[1, 2, 3, 4].map(questionNumber => (
            <Button key={questionNumber} onClick={() => selectQuestion(questionNumber)}>
              第{questionNumber}題
            </Button>
          ))}
        </CardContent>
      </Card>
    </Layout>
  );
}
