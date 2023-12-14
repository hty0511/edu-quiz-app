import React from "react";
import Layout from "../layouts/Layout";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function FeedbackThankYouPage() {
  return (
    <Layout>
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 5, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            感謝您的回饋！
          </Typography>
          <Typography variant="subtitle1" paragraph>
            您的心得已成功提交，我們非常重視每一條回饋。
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  );
}
