import React from "react";
import { Route, Switch } from "react-router-dom";
import FundList from "./components/FundList";
import Search from "./components/search";
import Checkout from "../invest/components/Checkout/Checkout";

const DIY = (props) => {
  const { url } = props.match;

  return (
    <Switch>
      {/* <Route exact path={`${url}/fundlist`} component={FundList} /> */}
      <Route
        exact
        path={`${url}/invest`}
        render={(props) => <Checkout {...props} type="diy" />}
      />
      <Route exact path={`${url}/invest/search`} component={Search} />
      <Route
        exact
        path={`${url}/fundList/:type/:key`}
        component={FundList}
      />
    </Switch>
  );
};

export default DIY;
