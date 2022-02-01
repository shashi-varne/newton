import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import getTheme from '../../theme';
import SubCategoryLanding from './SubCategoryLanding';

const DIY = (props) => {
  const theme = getTheme();
  const { url } = props.match;
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path={`${url}/sub-category`} component={SubCategoryLanding} />
        </Switch>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default DIY;
