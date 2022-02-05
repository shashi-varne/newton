import React from "react";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import getTheme from "../src/theme";
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphone6',
  },
  layout: "padded",
};

const withThemeProvider = (Story, context) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={getTheme()}>
        <Story {...context} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export const decorators = [withThemeProvider];
