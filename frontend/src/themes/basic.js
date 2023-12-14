import { createTheme } from "@mui/material/styles";

const themeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#673AB7"
    },
    secondary: {
      main: "#303F9F"
    },
    background: {
      default: "#F5F5F5"
    },
    action: {
      active: "#673AB7",
      hover: "#EDE7F6"
    }
  },
  typography: {
    fontFamily: '"Noto Sans TC", sans-serif'
  }
};

const theme = createTheme(themeOptions);

export default theme;
