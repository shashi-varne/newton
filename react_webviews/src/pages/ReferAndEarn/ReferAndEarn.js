import React from "react";
import { Route, Switch } from "react-router-dom";
import landingContainer from "../../containers/referAndEarn/landingContainer";
import myReferralsContainer from "../../containers/referAndEarn/myReferralsContainer";

const ReferAndEarn = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/landing`} component={landingContainer} />
      <Route path={`${url}/my-referrals`} component={myReferralsContainer} />
    </Switch>
  );
};

export default ReferAndEarn;
