import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../common/components/NotFound";
import Experience from "./components/Experience";
import StocksStatus from "./components/StocksStatus";
import LocationError from "./components/LocationError";

import Allow from "./Location/Allow";

import "./Style.scss";

const Stocks = (props) => {
  const { url } = props.match;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${url}/allow`} component={Allow} />
        <Route exact path={`${url}/status`} component={StocksStatus} />
        <Route exact path={`${url}/experience`} component={Experience} />
        <Route exact path={`${url}/location-error`} component={LocationError} />
        <Route component={NotFound} />
      </Switch>
    </Fragment>
  );
};

export default Stocks;
