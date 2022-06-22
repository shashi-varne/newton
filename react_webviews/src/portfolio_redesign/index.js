import React, { Fragment } from "react";

import { Route, Switch } from "react-router-dom";
import ThemeWrapper from "../theme/ThemeWrapper";
import MfLanding from "./mutualFund/MFLanding";

const PortfolioRedesign = ({ match }) => {
  const { url } = match;
  console.log("url", url);
  return (
    <ThemeWrapper>
      <Fragment>
        <Switch>
          <Route path={`${url}`} component={MfLanding} />
          <Route path={`${url}/mf-landing`} component={MfLanding} />
        </Switch>
      </Fragment>
    </ThemeWrapper>
  );
};

export default PortfolioRedesign;
