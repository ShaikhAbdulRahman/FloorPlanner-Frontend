import React from "react";
import FloorPlanner from "./components/FloorPlanner";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <FloorPlanner />
    </ThemeProvider>
  );
};

export default App;
