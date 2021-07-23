import React from "react";
import { Route, Switch } from "react-router-dom";
import FundList from "./components/FundList";
import Search from "./components/Search";
import Checkout from "../Invest/components/Checkout/Checkout";
import FundDetails from "../../fund_details/components/FundDetails";

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
      <Route path={`${url}/fundinfo/direct/:isin`} component={FundDetails} /> 
      <Route exact path={`${url}/invest/search`} component={Search} />
      <Route
        exact
        path={[`${url}/fundList/:type/:key`,`${url}/fundlist/direct/:name/:key/:type`]}
        component={FundList}
      />
    </Switch>
  );
};

export default DIY;
