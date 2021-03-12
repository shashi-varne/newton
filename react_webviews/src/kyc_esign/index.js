import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "../common/theme/Style.scss";

import "./components/Style.scss";
import NotFound from "../common/components/NotFound";

import DigiStatus from "./components/digilocker";
import NsdlStatus from "./components/nsdl";
import AppUpdate from "./components/app_update";
import ESignInfo from "./components/esign_info";
import FinityAppUpdateInfo from "./components/finity_app_update";

const Kyc_Esign = props => {
  const { url } = props.match;

  return (
    <Fragment>
        <Switch>
          <Route path={`${url}/digilocker`} component={DigiStatus} />
          <Route path={`${url}/nsdl`} component={NsdlStatus} />
          <Route path={`${url}/app-update`} component={AppUpdate} />
          <Route path={`${url}/finity-app-update`} component={FinityAppUpdateInfo} />
          <Route path={`${url}/info`} component={ESignInfo} />
          
          <Route component={NotFound} />
        </Switch>
  </Fragment>
  );
};

export default Kyc_Esign;
