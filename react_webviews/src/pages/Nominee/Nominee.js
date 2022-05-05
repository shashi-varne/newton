import React from "react";

import { Route, Switch } from "react-router-dom";
import manualSignatureContainer from "../../containers/nominee/manualSignatureContainer";

const Nominee = (props) => {
  const { url } = props.match;

  return (
    <Switch>
        <Route path={`${url}/manual-signature`} component={manualSignatureContainer} />
    </Switch>
  );
};

export default Nominee;
