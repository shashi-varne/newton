import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CommonCategoryLanding from './CommonCategoryLanding';
import getTheme from '../../theme';
import SubCategoryList from './SubCategoryList';
import SubCategoryFunds from './SubCategoryFunds';

const DIY = (props) => {
  const theme = getTheme();
  const { url } = props.match;
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path={`${url}/:diyType`} component={CommonCategoryLanding} />
          <Route path={`${url}/sub-category`} component={SubCategoryList} />
          <Route path={`${url}/sub-category-funds`} component={SubCategoryFunds} />
        </Switch>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default DIY;
