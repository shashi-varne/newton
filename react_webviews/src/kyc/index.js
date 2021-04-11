import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../common/components/NotFound";

import Journey from "./journey";
import Intro from "./upload/intro";
import Progress from "./upload/progress";
import Pan from "./upload/pan";
import AddressUpload from "./upload/address";
import KycBankDetails from "./bank-kyc/KycBankDetails";
import KycBankVerify from "./bank-kyc/KycBankVerify";

import "./Style.scss";

import AddBank from "./bank/AddBank";
import AddBankVerify from "./bank/AddBankVerify";
import BanksList from "./bank/BanksList";
import BankDetails from "./bank/BankDetails";

import CompliantPersonalDetails1 from "./compliant/PersonalDetails1";
import CompliantPersonalDetails2 from "./compliant/PersonalDetails2";
import CompliantPersonalDetails3 from "./compliant/PersonalDetails3";
import CompliantPersonalDetails4 from "./compliant/PersonalDetails4";
import ConfirmPan from "./compliant/ConfirmPan";
import KycComplete from "./compliant/Complete";
import CompliantReport from "./compliant/Report";
import Verify from "./compliant/Verify";
import RtaCompliantPersonalDetails from "./rta_compliant";

import RegistrationSuccess from "./success";

import Home from "./home";
import Nominee from "./nominee";
import Report from "./report";
import PersonalDetails1 from "./personal_details/Screen1";
import PersonalDetails2 from "./personal_details/Screen2";
import PersonalDetails3 from "./personal_details/Screen3";
import PersonalDetails4 from "./personal_details/Screen4";
import KycUploadDocuments from "./bank-kyc/KycUploadDocuments";
import SampleDocuments from "./bank-kyc/SampleDocuments";
import AddressDetails2 from "./address/AddressDetails2";
import AddressDetails1 from "./address/screen1";
import DigilockerPersonalDetails1 from "./digilocker/screen1";
import ChangeAddressDetails1 from "./address/change_address/ChangeAddressDetails1";
import NriAddressDetails1 from "./address/nri/NRIAddressDetails1";
import NRIAddressDetails2 from "./address/nri/NRIAddressDetails2";
import Success from "./digilocker/success";
import Failed from "./digilocker/failed";
import Sign from "./upload/sign";
import Selfie from "./upload/selfie";
import IpvVideo from "./upload/ipv_video";
import NRIAddressUpload from "./upload/nri_address";
import ChangeAddressDetails2 from "./address/change_address/ChangeAddressDetails2";
import DialogAsPage from './mini_components/DialogAsPage';

const Kyc = (props) => {
  const { url } = props.match;
  return (
    <Fragment>
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
          render={(props) => <PersonalDetails3 {...props} type="default" />}
        />
        <Route
          exact
          path={`${url}/personal-details4`}
          component={PersonalDetails4}
        />
        <Route
          exact
          path={`${url}/address-details1`}
          component={AddressDetails1}
        />
        <Route
          exact
          path={`${url}/change-address-details1`}
          component={ChangeAddressDetails1}
        />
        <Route
          exact
          path={`${url}/change-address-details2`}
          component={ChangeAddressDetails2}
        />
        <Route
          exact
          path={`${url}/nri-address-details1`}
          component={NriAddressDetails1}
        />
        <Route exact path={`${url}/upload/intro`} component={Intro} />
        <Route exact path={`${url}/upload/progress`} component={Progress} />
        <Route exact path={`${url}/upload/pan`} component={Pan} />
        <Route exact path={`${url}/upload/sign`} component={Sign} />
        <Route exact path={`${url}/upload/selfie`} component={Selfie} />
        <Route exact path={`${url}/upload/selfie_video`} component={IpvVideo} />
        <Route exact path={`${url}/upload/address`} component={AddressUpload} />
        <Route
          exact
          path={`${url}/upload/address-nri`}
          component={NRIAddressUpload}
        />
        <Route exact path={`${url}/home`} component={Home} />
        <Route exact path={[`${url}/penny-status`,`${url}/pan-status`]} component={DialogAsPage} />
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
          path={`${url}/compliant-personal-details3`}
          component={CompliantPersonalDetails3}
        />
        <Route
          exact
          path={`${url}/compliant-personal-details4`}
          component={CompliantPersonalDetails4}
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
        <Route
          exact
          path={`${url}/registration/success`}
          component={RegistrationSuccess}
        />
        <Route exact path={`${url}/approved/banks/doc`} component={AddBank} />
        <Route
          exact
          path={`${url}/approved/banks/verify/:bank_id`}
          component={AddBankVerify}
        />
        <Route exact path={`${url}/add-bank`} component={BanksList} />
        <Route
          exact
          path={`${url}/add-bank/details/:bank_id`}
          component={BankDetails}
        />
        <Route
          exact
          path={`${url}/:userType/bank-details`}
          component={KycBankDetails}
        />
        <Route
          exact
          path={`${url}/:userType/bank-verify`}
          component={KycBankVerify}
        />
        <Route
          exact
          path={`${url}/:userType/upload-documents`}
          component={KycUploadDocuments}
        />
        <Route
          exact
          path={`${url}/sample-documents`}
          component={SampleDocuments}
        />
        <Route
          exact
          path={`${url}/address-details2`}
          component={AddressDetails2}
        />
        <Route
          exact
          path={`${url}/dl/personal-details1`}
          component={DigilockerPersonalDetails1}
        />
        <Route
          exact
          path={`${url}/dl/personal-details2`}
          render={(props) => <PersonalDetails3 {...props} type="digilocker" />}
        />
        <Route
          exact
          path={`${url}/dl/personal-details3`}
          render={(props) => <PersonalDetails4 {...props} type="digilocker" />}
        />
        <Route exact path={`${url}/digilocker/success`} component={Success} />
        <Route exact path={`${url}/digilocker/failed`} component={Failed} />
        <Route
          exact
          path={`${url}/nri-address-details1`}
          component={NriAddressDetails1}
        />
        <Route
          exact
          path={`${url}/nri-address-details2`}
          component={NRIAddressDetails2}
        />
        <Route component={NotFound} />
      </Switch>
    </Fragment>
  );
};

export default Kyc;
