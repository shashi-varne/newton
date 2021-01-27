import React from "react";
import { Route, Switch } from "react-router-dom";
import NpsInfo from "./components/info";
import PanDetails from "./components/pan";
import EnterAmount from "./components/amount";
import "./style.scss";

const Nps = (props) => {
  const { url } = props.match;

  return (
    <Switch>
      <Route exact path={`${url}/info`} component={NpsInfo} />
      <Route exact path={`${url}/pan`} component={PanDetails} />
      <Route exact path={`${url}/amount`} component={EnterAmount} />
    </Switch>
  );
};

export default Nps;