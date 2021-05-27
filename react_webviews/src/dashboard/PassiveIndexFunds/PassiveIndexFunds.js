import "../../common/theme/Style.scss";
import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../../common/components/NotFound";
import Landing from "../Invest/components/BuildWealth/BuildWealth";

const PassiveIndexFunds = (props) => {
  const { url } = props.match;
  return (
    <Switch>
       <Route path={`${url}`}  component={Landing}/>
      <Route component={NotFound} />
    </Switch>
  );
};

export default PassiveIndexFunds;
