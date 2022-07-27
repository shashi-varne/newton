import React, { Fragment } from "react";

import { Route, Switch } from "react-router-dom";
import ThemeWrapper from "../theme/ThemeWrapper";
import AllInvestmentsContainer from "./containers/AllInvestmentsContainer";
import AssetAllocationContainer from "./containers/assetAllocationContainer";
import mfLandingContainer from "./containers/mfLandingContainer";
import portfolioLandingContainer from "./containers/portfolioLandingContainer";
import SomethingsWrong from "./ErrorScreen/SomethingsWrong";
import InfoAction from "./screens/InfoAction/InfoAction";

const PortfolioRedesign = ({ match }) => {
  const { url } = match;
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
          <Route
            path={`${url}/all-investments`}
            component={AllInvestmentsContainer}
          />
          <Route path={`${url}/info-action`} component={InfoAction} />
          <Route path={`${url}/somethings-wrong`} component={SomethingsWrong} />
        </Switch>
      </Fragment>
    </ThemeWrapper>
  );
};

export default PortfolioRedesign;
