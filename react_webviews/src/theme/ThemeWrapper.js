import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import React from 'react';
import getTheme from '.';

const ThemeWrapper = ({ children }) => {
  const theme = getTheme();
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeWrapper;
