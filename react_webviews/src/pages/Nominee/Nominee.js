import React from "react";

import { Route, Switch } from "react-router-dom";
import NomineeVerifiedContainer from "../../containers/nominee/nomineeVerifiedContainer";
import NomineeSubmittedContainer from "../../containers/nominee/nomineeSubmittedContainer";

const Nominee = (props) => {
  const { url } = props.match;

  return (
    <Switch>
      <Route path={`${url}/verified`} component={NomineeVerifiedContainer} />
      <Route path={`${url}/submitted`} component={NomineeSubmittedContainer} />
    </Switch>
  );
};

export default Nominee;
