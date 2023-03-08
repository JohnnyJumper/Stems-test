import React from "react";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
  },
});

export default theme;
