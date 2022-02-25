import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import getTheme from '../../theme';
import MfOrder from '../MfOrder/MfOrder';

const DIY = (props) => {
  const theme = getTheme();
  const { url } = props.match;
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path={`${url}/mf-orders`} component={MfOrder} />
        </Switch>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default DIY;