import React from "react";
import { Route, Switch } from "react-router-dom";
import tncContainer from "../../containers/referAndEarn/tncContainer";
import successDetailsContainer from "../../containers/referAndEarn/successDetailsContainer";
import walletTransfersContainer from "../../containers/referAndEarn/walletTransfersContainer";

const ReferAndEarn = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/tnc`} component={tncContainer} />
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
