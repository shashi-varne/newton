import React from 'react';
import { Route, Switch } from 'react-router-dom';
import InvestmentProcess from './InvestmentProcess';
import SubCategoryList from './SubCategoryList';
import SubCategoryFunds from './SubCategoryFunds';
import SubCategoryFundList from './SubCategoryFundList';
import DiyLandingContainer from '../../containers/diy/diyLandingContainer';
import completeKycContainer from '../../containers/diy/completeKycContainer';
const DIY = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/sub-category-list`} component={SubCategoryList} />
      <Route path={`${url}/sub-category-funds`} component={SubCategoryFunds} />
      <Route exact path={`${url}/:diyType/landing`} component={DiyLandingContainer} />
      <Route path={`${url}/complete-kyc`} component={completeKycContainer} />
      <Route path={`${url}/invest-process`} component={InvestmentProcess} />
      <Route path={`${url}/sub-category/fund-list`} component={SubCategoryFundList} />
    </Switch>
  );
};

export default DIY;
