import React, { useRef } from "react";
import Layout from "../layouts/Layout";
import { Card, CardContent, Typography, TextField, Button, Grid, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";

export default function LessonFeedbackPage() {
  const [feedback, setFeedback] = React.useState("");
  const [error, setError] = React.useState(null);
  const errorTimeoutRef = useRef(null);

  const API_FEEDBACK_URL = `${API_BASE_URL}/api/reflections`;

  const navigate = useNavigate();

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = () => {
    const token = sessionStorage.getItem("jwt");

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    if (!feedback.trim()) {
      setError('心得回饋不得為空!');

      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    axios
      .post(
        API_FEEDBACK_URL,
        {
          text: feedback
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        setError(null);
        navigate("/lesson-feedback/thank-you");
      })
      .catch((err) => {
        console.error("提交錯誤:", err);
        setError("已經填寫過本週的心得");

        errorTimeoutRef.current = setTimeout(() => {
          setError(null);
        }, 5000);
      });
  };

  return (
    <Layout>
      {error && (
        <Card
          sx={{
            width: 900,
            mx: "auto",
            mb: 2,
            bgcolor: "error.main",
            color: "white"
          }}
        >
          <CardContent>
            <Typography variant="body1">{error}</Typography>
          </CardContent>
        </Card>
      )}
      <Card sx={{ width: 900, mx: "auto" }}>
        <CardContent sx={{ textAlign: "left" }}>
          <Typography variant="h6" gutterBottom>
            各位同學，您好！
          </Typography>

          <Typography variant="body1" gutterBottom>
            歡迎使用「上課自評心得系統」！每次課後，請分享您的學習體驗，如：
          </Typography>

          <Box pl={2} mt={1} mb={2}>
            <Typography variant="body2" gutterBottom component="div">
              - 對哪些內容感到有趣或無聊？
            </Typography>
            <Typography variant="body2" gutterBottom component="div">
              - 哪些部分覺得收穫良多或需多加複習？
            </Typography>
            <Typography variant="body2" gutterBottom component="div">
              - 上課速度是否適中？
            </Typography>
            <Typography variant="body2" mb={2} component="div">
              - 或其他對課程的想法與建議。
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            您的心得將匿名收集，用於教學改進和學術研究。請放心，心得不影響成績，感謝您的真誠分享！
          </Typography>

          <div
            style={{
              backgroundColor: "#845EC2",
              padding: "8px",
              color: "white",
              borderRadius: "4px",
              marginBottom: "10px"
            }}
          >
            心得感想
          </div>
          <TextField
            label="Feedback..."
            variant="outlined"
            fullWidth
            multiline
            rows={10}
            margin="normal"
            value={feedback}
            onChange={handleFeedbackChange}
          />

          <Grid container justifyContent="flex-end" mt={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFeedbackSubmit}
            >
              提交
            </Button>
          </Grid>
        </CardContent>
      </Card>
    </Layout>
  );
}
