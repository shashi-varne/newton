import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import getTheme from '../../theme';
import SubCategoryList from './SubCategoryList';

const DIY = (props) => {
  const theme = getTheme();
  const { url } = props.match;
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path={`${url}/sub-category`} component={SubCategoryList} />
        </Switch>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default DIY;