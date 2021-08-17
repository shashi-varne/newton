import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "../common/theme/Style.scss";

import "./components/Style.scss";
import NotFound from "../common/components/NotFound";


import Home from "./components/index.js";
import Neft from "./components/neft.js";

const Payment = props => {
  const { url } = props.match;

  return (
   <Fragment>
        <Switch>

          <Route path={`${url}/home`} component={Home} />
          <Route path={`${url}/neft`} component={Neft} />
          <Route component={NotFound} />

        </Switch>
  </Fragment>
  );
};

export default Payment;
