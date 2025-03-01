// EventStyles.js
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#3f51b5" },
    secondary: { main: "#f50057" },
    background: { default: "#172439" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export const eventStyleGetter = (backgroundColor) => ({
  style: {
    backgroundColor,
    borderRadius: "4px",
    opacity: 0.8,
    color: "white",
    border: "none",
    display: "block",
    fontSize: "14px",
    fontWeight: "bold",
    height: "100%",
    textAlign: "left",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
});

export const cellStyleGetter = () => ({
    style: {
      border: "1px solid #505050",
    },
});