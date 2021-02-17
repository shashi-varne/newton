import React from "react";
import { Route, Switch } from "react-router-dom";

import NotFound from "common/components/NotFound";

import Journey from "./journey";
import Address from "./address";
import Upload from "./upload";
import Intro from "./upload/intro";
import Progress from "./upload/progress";
import Pan from "./upload/pan";
import AddressUpload from "./upload/address";

import "./Style.scss";

import CompliantPersonalDetails1 from "./compliant/PersonalDetails1";
import CompliantPersonalDetails2 from "./compliant/PersonalDetails2";
import ConfirmPan from "./compliant/ConfirmPan";
import KycComplete from "./compliant/Complete";
import CompliantReport from "./compliant/Report";
import Verify from "./compliant/Verify";
import RtaCompliantPersonalDetails from "./rta_compliant";

import Nominee from "./nominee";
import Report from "./report";
import PersonalDetails1 from "./personal_details/Screen1";
import PersonalDetails2 from "./personal_details/Screen2";
import PersonalDetails3 from "./personal_details/Screen3";
import PersonalDetails4 from "./personal_details/Screen4";

const Kyc = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route exact path={`${url}/journey`} component={Journey} />
      <Route
        exact
        path={`${url}/personal-details1`}
        component={PersonalDetails1}
      />
      <Route
        exact
        path={`${url}/personal-details2`}
        component={PersonalDetails2}
      />
      <Route
        exact
        path={`${url}/personal-details3`}
        component={PersonalDetails3}
      />
      <Route
        exact
        path={`${url}/personal-details4`}
        component={PersonalDetails4}
      />
      <Route exact path={`${url}/address`} component={Address} />
      <Route exact path={`${url}/upload`} component={Upload} />
      <Route exact path={`${url}/upload/intro`} component={Intro} />
      <Route exact path={`${url}/upload/progress`} component={Progress} />
      <Route exact path={`${url}/upload/pan`} component={Pan} />
      <Route exact path={`${url}/upload/address`} component={AddressUpload} />
      <Route
        exact
        path={`${url}/:userType/nominee-details`}
        component={Nominee}
      />
      <Route exact path={`${url}/report`} component={Report} />
      <Route
        exact
        path={`${url}/compliant-personal-details`}
        component={CompliantPersonalDetails1}
      />
      <Route
        exact
        path={`${url}/compliant-personal-details2`}
        component={CompliantPersonalDetails2}
      />
      <Route
        exact
        path={`${url}/compliant-confirm-pan`}
        component={ConfirmPan}
      />
      <Route
        exact
        path={`${url}/compliant-report-complete`}
        component={KycComplete}
      />
      <Route
        exact
        path={`${url}/compliant-report-details`}
        component={CompliantReport}
      />
      <Route
        exact
        path={`${url}/compliant-report-verified`}
        component={Verify}
      />
      <Route
        exact
        path={`${url}/rta-compliant-personal-details`}
        component={RtaCompliantPersonalDetails}
      />

      <Route component={NotFound} />
    </Switch>
  );
};

export default Kyc;
