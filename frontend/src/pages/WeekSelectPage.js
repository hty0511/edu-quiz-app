import React from "react";
import { useNavigate } from 'react-router-dom';
import Layout from "../layouts/Layout";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export default function WeekSelectPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const weeks = [
    { name: "2月26日", value: 1 },
    { name: "3月4日", value: 2 },
    { name: "3月11日", value: 3 },
    { name: "3月18日", value: 4 },
    { name: "3月25日", value: 5 },
    { name: "4月1日", value: 6 },
    { name: "4月8日", value: 7 },
    { name: "4月22日", value: 8 },
    { name: "4月29日", value: 9 },
    { name: "5月6日", value: 10 },
    { name: "5月13日", value: 11 },
    { name: "5月20日", value: 12 },
    { name: "5月27日", value: 13 },
    { name: "6月3日", value: 14 },
  ];

  function selectWeek(weekNumber) {
    navigate(`/cpp-quiz/history/week/${weekNumber}`);
  }

  return (
    <Layout>
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 5, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            請選擇第幾周
          </Typography>
          <Box sx={{ textAlign: 'left', mb: 2 }}>
            <Button onClick={handleBack}>{"<= 回到上一頁"}</Button>
          </Box>
          <Grid container spacing={2}>
            {weeks.map(week => (
              <Grid item xs={2.4} key={week.value}>
                <Button onClick={() => selectWeek(week.value)}>
                  {week.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Layout>
  );
}
