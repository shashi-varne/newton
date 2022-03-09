import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SubCategoryFunds from './SubCategoryFunds';
import SubCategoryFundList from './SubCategoryFundList';
import DiyLandingContainer from '../../containers/diy/diyLandingContainer';
import completeKycContainer from '../../containers/diy/completeKycContainer';
import investmentProcessContainer from '../../containers/diy/investmentProcessContainer';
import subCategoryListContainer from '../../containers/diy/subCategoryListContainer';
const DIY = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/sub-category-list`} component={subCategoryListContainer} />
      <Route path={`${url}/sub-category-funds`} component={SubCategoryFunds} />
      <Route exact path={`${url}/:diyType/landing`} component={DiyLandingContainer} />
      <Route path={`${url}/complete-kyc`} component={completeKycContainer} />
      <Route path={`${url}/invest-process`} component={investmentProcessContainer} />
      <Route path={`${url}/sub-category/fund-list`} component={SubCategoryFundList} />
    </Switch>
  );
};

export default DIY;
