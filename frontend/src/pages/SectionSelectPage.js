import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Layout from "../layouts/Layout";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function SectionSelectPage() {
  const { weekId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const sections = weekId === '1' ? [1] : [1, 2, 3];

  function selectSection(sectionNumber) {
    navigate(`/cpp-quiz/history/week/${weekId}/section/${sectionNumber}`);
  }

  return (
    <Layout>
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 5, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            請選擇第幾節課
          </Typography>
          <Box sx={{ textAlign: 'left', mb: 2 }}>
            <Button onClick={handleBack}>{"<= 回到上一頁"}</Button>
          </Box>
          {sections.map(sectionNumber => (
            <Button key={sectionNumber} onClick={() => selectSection(sectionNumber)}>
              第{sectionNumber}節
            </Button>
          ))}
        </CardContent>
      </Card>
    </Layout>
  );
}
