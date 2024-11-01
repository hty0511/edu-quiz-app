import React from "react";
import { useNavigate } from 'react-router-dom';
import Layout from "../layouts/Layout";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function HistoryNotFoundPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-2);
  };

  return (
    <Layout>
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 5, textAlign: "center" }}>
        <CardContent>
          <Box sx={{ textAlign: 'left', mb: 2 }}>
            <Button onClick={handleBack}>{"<= 回到上一頁"}</Button>
          </Box>
          <Typography variant="h4" gutterBottom>
            查無歷史作答紀錄
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  );
}
