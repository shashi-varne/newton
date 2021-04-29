import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../common/components/NotFound";

import Allow from "./Location/Allow";

import "./Style.scss";

const Stocks = (props) => {
  const { url } = props.match;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${url}/allow`} component={Allow} />
        <Route component={NotFound} />
      </Switch>
    </Fragment>
  );
};

export default Stocks;
