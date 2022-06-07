import React from "react";
import { Route, Switch } from "react-router-dom";
import claimCashRewardsContainer from "../../containers/referAndEarn/claimCashRewardsContainer";

const ReferAndEarn = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/claim-cash-rewards`} component={claimCashRewardsContainer} />
    </Switch>
  );
};

export default ReferAndEarn;
