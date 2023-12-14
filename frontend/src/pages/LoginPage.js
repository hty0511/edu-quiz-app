import React, { useState } from "react";
import Login from "../components/Login";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function LoginPage() {
  const [loginError, setLoginError] = useState("");

  const handleLoginAttempt = (error) => {
    setLoginError(error);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {loginError && (
        <Card
          variant="outlined"
          sx={{
            width: 500,
            mx: "auto",
            mb: 3,
            bgcolor: "error.main",
            color: "white"
          }}
        >
          <CardContent>
            <Typography color="inherit" variant="body2">
              {loginError}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card sx={{ width: 500 }}>
        {" "}
        <CardContent>
          <Login onLoginAttempt={handleLoginAttempt} />
        </CardContent>
      </Card>
    </Box>
  );
}
