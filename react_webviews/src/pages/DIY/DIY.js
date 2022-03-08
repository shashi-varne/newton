import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CommonCategoryLanding from './CommonCategoryLanding';
import FundDetails from '../fundDetailsV2';
import CompleteKyc from './CompleteKyc';
import InvestmentProcess from './InvestmentProcess';
import ThemeWrapper from '../../theme/ThemeWrapper';
import SubCategoryList from './SubCategoryList';
import SubCategoryFunds from './SubCategoryFunds';
import MfOrder from '../MfOrder/MfOrder';
import SubCategoryFundList from './SubCategoryFundList';

const DIY = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/sub-category-list`} component={SubCategoryList} />
      <Route path={`${url}/sub-category-funds`} component={SubCategoryFunds} />
      <Route path={`${url}/fund-details`} component={FundDetails} />
      <Route exact path={`${url}/:diyType/landing`} component={CommonCategoryLanding} />
      <Route path={`${url}/mf-orders`} component={MfOrder} />
      <Route path={`${url}/complete-kyc`} component={CompleteKyc} />
      <Route path={`${url}/invest-process`} component={InvestmentProcess} />
      <Route path={`${url}/sub-category/fund-list`} component={SubCategoryFundList} />
    </Switch>
  );
};

export default DIY;
