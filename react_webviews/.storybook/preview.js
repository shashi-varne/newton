import React from "react";
import { ThemeProvider } from "@mui/material";
import getTheme from "../src/theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: "centered",
};

const withThemeProvider = (Story, context) => {
  return (
    <ThemeProvider theme={getTheme()}>
      <Story {...context} />
    </ThemeProvider>
  );
};

export const decorators = [withThemeProvider];
