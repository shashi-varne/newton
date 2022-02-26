import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CommonCategoryLanding from './CommonCategoryLanding';
import FundDetails from '../fundDetailsV2';
import getTheme from '../../theme';
import SubCategoryList from './SubCategoryList';
import SubCategoryFunds from './SubCategoryFunds';
import SubCategoryLanding from './SubCategoryLanding';

const DIY = (props) => {
  const theme = getTheme();
  const { url } = props.match;
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path={`${url}/sub-category-list`} component={SubCategoryList} />
          <Route path={`${url}/sub-category-funds`} component={SubCategoryFunds} />
          <Route path={`${url}/fund-details`} component={FundDetails} />
          <Route path={`${url}/sub-category/funds-list`} component={SubCategoryLanding} />
          <Route exact path={`${url}/:diyType/landing`} component={CommonCategoryLanding} />
        </Switch>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default DIY;
