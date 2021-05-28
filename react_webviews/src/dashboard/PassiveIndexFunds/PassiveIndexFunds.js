import "../../common/theme/Style.scss";
import React from "react";
import { Route, Switch } from "react-router-dom";
import "../../common/theme/Style.scss";
import "./style.scss";
import NotFound from "../../common/components/NotFound";
import Landing from "./components/Landing"
import FundList from "./components/FundList"

const PassiveIndexFunds = (props) => {
  const { url } = props.match;
  return (
    <Switch>
       <Route path={`${url}/landing`} component={Landing}/>
       <Route path={`${url}/:category/fund-list`}  component={FundList}/>
      <Route component={NotFound} />
    </Switch>
  );
};

export default PassiveIndexFunds;
