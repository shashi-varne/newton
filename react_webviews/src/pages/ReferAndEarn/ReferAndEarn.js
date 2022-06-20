import React from "react";
import { Route, Switch } from "react-router-dom";
import walletTransfersContainer from "../../containers/referAndEarn/walletTransfersContainer";

const ReferAndEarn = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/wallet-transfers`} component={walletTransfersContainer} />
    </Switch>
  );
};

export default ReferAndEarn;
