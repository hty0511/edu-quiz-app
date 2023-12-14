import React from "react";
import ReactDOM from "react-dom/client";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import App from "./App";
import { StrictMode } from "react";
import theme from "./themes/basic";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);
