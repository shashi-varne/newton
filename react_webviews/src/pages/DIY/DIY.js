import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CompleteKyc from './CompleteKyc';
import getTheme from '../../theme';

const DIY = (props) => {
  const theme = getTheme();
  const { url } = props.match;
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Switch>
            <Route path={`${url}/complete-kyc`} component={CompleteKyc} />
        </Switch>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default DIY;