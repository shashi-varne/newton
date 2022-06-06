import React from "react";
import { Route, Switch } from "react-router-dom";
import myReferralsContainer from "../../containers/referAndEarn/myReferralsContainer";

const ReferAndEarn = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/my-referrals`} component={myReferralsContainer} />
    </Switch>
  );
};

export default ReferAndEarn;
