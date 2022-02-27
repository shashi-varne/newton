import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CommonCategoryLanding from './CommonCategoryLanding';
import FundDetails from '../fundDetailsV2';
import CompleteKyc from './CompleteKyc';
import InvestmentProcess from './InvestmentProcess';
import getTheme from '../../theme';
import SubCategoryList from './SubCategoryList';
import SubCategoryFunds from './SubCategoryFunds';
import SubCategoryLanding from './SubCategoryFundList';
import MfOrder from '../MfOrder/MfOrder';

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
          <Route path={`${url}/sub-category/fund-list`} component={SubCategoryLanding} />
          <Route exact path={`${url}/:diyType/landing`} component={CommonCategoryLanding} />
          <Route path={`${url}/mf-orders`} component={MfOrder} />
            <Route path={`${url}/complete-kyc`} component={CompleteKyc} />
          <Route path={`${url}/invest-process`} component={InvestmentProcess} />
        </Switch>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default DIY;
