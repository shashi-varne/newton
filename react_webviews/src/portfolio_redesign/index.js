import React, { Fragment } from "react";

import { Route, Switch } from "react-router-dom";
import ThemeWrapper from "../theme/ThemeWrapper";
import AssetAllocationContainer from "./containers/assetAllocationContainer";
import mfLandingContainer from "./containers/mfLandingContainer";
import portfolioLandingContainer from "./containers/portfolioLandingContainer";
import SomethingsWrong from "./ErrorScreen/SomethingsWrong";

const PortfolioRedesign = ({ match }) => {
  const { url } = match;
  console.log("url", url);
  return (
    <ThemeWrapper>
      <Fragment>
        <Switch>
          <Route exact path={`${url}`} component={portfolioLandingContainer} />
          <Route path={`${url}/mf-landing`} component={mfLandingContainer} />
          <Route
            path={`${url}/asset-allocation`}
            component={AssetAllocationContainer}
          />
          <Route path={`${url}/somethings-wrong`} component={SomethingsWrong} />
        </Switch>
      </Fragment>
    </ThemeWrapper>
  );
};

export default PortfolioRedesign;
