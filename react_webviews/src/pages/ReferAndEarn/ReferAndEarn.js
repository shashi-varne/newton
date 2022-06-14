import React from "react";
import { Route, Switch } from "react-router-dom";
import landingContainer from "../../containers/referAndEarn/landingContainer";
import myReferralsContainer from "../../containers/referAndEarn/myReferralsContainer";
import walletTransfersContainer from "../../containers/referAndEarn/walletTransfersContainer";
import claimCashRewardsContainer from "../../containers/referAndEarn/claimCashRewardsContainer";
import tncContainer from "../../containers/referAndEarn/tncContainer";
import successDetailsContainer from "../../containers/referAndEarn/successDetailsContainer";

const ReferAndEarn = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/landing`} component={landingContainer} />
      <Route path={`${url}/my-referrals`} component={myReferralsContainer} />
      <Route
        path={`${url}/wallet-transfers`}
        component={walletTransfersContainer}
      />
      <Route
        path={`${url}/claim-cash-rewards`}
        component={claimCashRewardsContainer}
      />
      <Route path={`${url}/tnc`} component={tncContainer} />
      <Route
        path={`${url}/success-details`}
        component={successDetailsContainer}
      />
    </Switch>
  );
};

export default ReferAndEarn;
