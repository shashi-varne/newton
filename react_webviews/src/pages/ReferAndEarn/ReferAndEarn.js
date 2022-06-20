import React from "react";
import { Route, Switch } from "react-router-dom";
import withdrawPlacedContainer from "../../containers/referAndEarn/withdrawPlacedContainer";
import claimCashRewardsContainer from "../../containers/referAndEarn/claimCashRewardsContainer";
import landingContainer from "../../containers/referAndEarn/landingContainer";
import tncContainer from "../../containers/referAndEarn/tncContainer";
import successDetailsContainer from "../../containers/referAndEarn/successDetailsContainer";
import walletTransfersContainer from "../../containers/referAndEarn/walletTransfersContainer";

const ReferAndEarn = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/claim-cash-rewards`} component={claimCashRewardsContainer} />
      <Route path={`${url}/landing`} component={landingContainer} />
      <Route path={`${url}/tnc`} component={tncContainer} />
      <Route
        path={`${url}/withdraw-placed`}
        component={withdrawPlacedContainer}
      />
      <Route
        path={`${url}/success-details`}
        component={successDetailsContainer}
      />
      <Route
        path={`${url}/wallet-transfers`}
        component={walletTransfersContainer}
      />
    </Switch>
  );
};

export default ReferAndEarn;
