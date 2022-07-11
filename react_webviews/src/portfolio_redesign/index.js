import React, { Fragment } from "react";

import { Route, Switch } from "react-router-dom";
import ThemeWrapper from "../theme/ThemeWrapper";
import mfLandingContainer from "./containers/mfLandingContainer";

const PortfolioRedesign = ({ match }) => {
  const { url } = match;
  console.log("url", url);
  return (
    <ThemeWrapper>
      <Fragment>
        <Switch>
          <Route path={`${url}`} component={mfLandingContainer} />
          <Route path={`${url}/mf-landing`} component={mfLandingContainer} />
        </Switch>
      </Fragment>
    </ThemeWrapper>
  );
};

export default PortfolioRedesign;
