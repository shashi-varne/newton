import React, { Fragment } from "react";

import { Route, Switch } from "react-router-dom";
import ThemeWrapper from "../theme/ThemeWrapper";
import portfolioLandingContainer from "./containers/portfolioLandingContainer";

const PortfolioRedesign = ({ match }) => {
  const { url } = match;
  console.log("url", url);
  return (
    <ThemeWrapper>
      <Fragment>
        <Switch>
          <Route path={`${url}`} component={portfolioLandingContainer} />
        </Switch>
      </Fragment>
      {/* dispatch(getSummaryV2({ screen: currentScreen, token })); */}
    </ThemeWrapper>
  );
};

export default PortfolioRedesign;
