import React, { Fragment } from "react";

import { Route, Switch } from "react-router-dom";
import ThemeWrapper from "../theme/ThemeWrapper";
import InfoAction from "./screens/InfoAction/InfoAction";

const PortfolioRedesign = ({ match }) => {
  const { url } = match;
  console.log("url", url);
  return (
    <ThemeWrapper>
      <Fragment>
        <Switch>
          <Route path={`${url}`} component={InfoAction} />
        </Switch>
      </Fragment>
    </ThemeWrapper>
  );
};

export default PortfolioRedesign;
