import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FundDetails from '../fundDetailsV2';
import getTheme from '../../theme';

const DIY = (props) => {
  const theme = getTheme();
  const { url } = props.match;
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path={`${url}/fund-details`} component={FundDetails} />
        </Switch>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default DIY;