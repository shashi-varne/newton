import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import getTheme from '.';
import { useSelector } from 'react-redux';
import { getPartner } from "businesslogic/dataStore/reducers/app";

const ThemeWrapper = ({ children }) => {
  const [theme, setTheme] = useState(getTheme());
  const partner = useSelector(getPartner)

  useEffect(() => {
    const updatedTheme = getTheme();
    setTheme(updatedTheme);
  }, [partner]);
  
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeWrapper;
