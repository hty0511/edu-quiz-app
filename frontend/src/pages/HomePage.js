import React from "react";
import Layout from "../layouts/Layout";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function HomePage() {
  return (
    <Layout>
      <Card sx={{ mt: 3, width: "80%", maxWidth: "600px", mx: "auto" }}>
        <CardContent>
          <Typography variant="h3" gutterBottom>
            歡迎使用我們的網站
          </Typography>
          <Typography paragraph>你可以在左側的drawer找到以下功能：</Typography>
          <Box pl={2} mt={1} mb={2}>
            <Typography variant="body2" gutterBottom component="div">
              - 心得填寫
            </Typography>
            <Typography variant="body2" gutterBottom component="div">
              - C++ Quiz
            </Typography>
          </Box>
          <Typography paragraph>請開始探索和使用，希望你能夠享受!</Typography>
        </CardContent>
      </Card>
    </Layout>
  );
}
