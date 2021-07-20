import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../common/components/NotFound";

import Journey from "./Journey/Journey";
import Intro from "./Upload/Intro";
import Progress from "./Upload/Progress";
import Pan from "./Upload/Pan";
import AddressUpload from "./Upload/Address";
import KycBankDetails from "./BankKyc/KycBankDetails";
import KycBankVerify from "./BankKyc/KycBankVerify";

import "./Style.scss";

import AddBank from "./Bank/AddBank";
import AddBankVerify from "./Bank/AddBankVerify";
import BanksList from "./Bank/BanksList";
import BankDetails from "./Bank/BankDetails";

import CompliantPersonalDetails1 from "./Compliant/PersonalDetails1";
import CompliantPersonalDetails2 from "./Compliant/PersonalDetails2";
import CompliantPersonalDetails3 from "./Compliant/PersonalDetails3";
import CompliantPersonalDetails4 from "./Compliant/PersonalDetails4";
import ConfirmPan from "./Compliant/ConfirmPan";
import KycComplete from "./Compliant/Complete";
import KycVerified from "./Compliant/KycVerified";
import RtaCompliantPersonalDetails from "./RtaCompliant";

import RegistrationSuccess from "./Success/RegistrationSuccess";

import Home from "./Home/Home";
import Nominee from "./Nominee/Nominee";
import Report from "./Report/KycReport";
import PersonalDetails1 from "./PersonalDetails/Screen1";
import PersonalDetails2 from "./PersonalDetails/Screen2";
import PersonalDetails3 from "./PersonalDetails/Screen3";
import PersonalDetails4 from "./PersonalDetails/Screen4";
import KycUploadDocuments from "./BankKyc/KycUploadDocuments";
import SampleDocuments from "./BankKyc/SampleDocuments";
import AddressDetails2 from "./Address/AddressDetails2";
import AddressDetails1 from "./Address/AddressDetails1";
import DigilockerPersonalDetails1 from "./Digilocker/PersonalDetails1";
import ChangeAddressDetails1 from "./Address/ChangeAddress/ChangeAddressDetails1";
import NriAddressDetails1 from "./Address/Nri/NRIAddressDetails1";
import NRIAddressDetails2 from "./Address/Nri/NRIAddressDetails2";
import Success from "./Digilocker/Success";
import Failed from "./Digilocker/Failed";
import Sign from "./Upload/Sign";
import Selfie from "./Upload/Selfie";
import IpvVideo from "./Upload/IpvVideo";
import NRIAddressUpload from "./Upload/NriAddress";
import ChangeAddressDetails2 from "./Address/ChangeAddress/ChangeAddressDetails2";
import KycNative from "./Native/KycNative";
import StocksNative from "./Native/StocksNative";
import LocationPermission from "./Upload/LocationPermission";
import SelfieSteps from "./Upload/SelfieSteps";
import FnOIncomeProof from "./Upload/FnOIncomeProof";

// Equity Components
import TradingExperience from "./Equity/components/TradingExperience";
import StocksStatus from "./Equity/components/StocksStatus";
import NriError from "./Equity/components/NriError";
import AccountInfo from "./Equity/components/AccountInfo";
import UploadInstructions from "./Equity/components/UploadInstructions";
import DocumentVerification from "./Equity/components/DocumentVerification";
import ManualSignature from "./Equity/components/ManualSignature";
import CommunicationDetails from "./Equity/components/CommunicationDetails";
import CommunicationCallback from "./Equity/components/CommunicationCallback";
import FnOSampleDocuments from "./Upload/FnOSampleDocuments";
import DialogAsPage from './mini_components/DialogAsPage';

const Kyc = (props) => {
  const { url } = props.match;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${url}/journey`} component={Journey} />
        <Route exact path={`${url}/native`} component={KycNative} />
        <Route exact path={`${url}/stocks/native`} component={StocksNative} />
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
        <Route 
          exact
          path={`${url}/upload/intro`} 
          component={Intro} 
        />
        <Route 
          exact 
          path={`${url}/upload/progress`} 
          component={Progress} 
        />
        <Route 
          exact 
          path={`${url}/upload/pan`} 
          component={Pan} 
        />
        <Route 
          exact 
          path={`${url}/upload/sign`} 
          component={Sign} 
        />
        <Route 
          exact 
          path={`${url}/upload/selfie-location/:type?`} 
          component={LocationPermission}
        />
        <Route 
          exact 
          path={`${url}/upload/selfie-steps`} 
          component={SelfieSteps}
        />
        <Route 
          exact 
          path={`${url}/upload/selfie`} 
          component={Selfie}
        />
        <Route 
          exact 
          path={`${url}/upload/selfie_video`} 
          component={IpvVideo} 
        />
        <Route
          exact 
          path={`${url}/upload/address`} 
          component={AddressUpload} 
        />
        <Route
          exact
          path={`${url}/upload/address-nri`}
          component={NRIAddressUpload}
        />
        <Route
          exact
          path={`${url}/upload/fno-income-proof`}
          component={FnOIncomeProof}
        />
        <Route
          exact
          path={`${url}/upload/fno-sample-documents`}
          component={FnOSampleDocuments}
        />
        <Route 
          exact 
          path={`${url}/home`} 
          component={Home} 
        />
        <Route
          exact
          path={[`${url}/penny-status`,
                 `${url}/pan-status`,
                 `${url}/residence-status`,
                 `${url}/:userType/bank-status`
               ]}
          component={DialogAsPage}
        />
        <Route
          exact
          path={`${url}/:userType/nominee-details`}
          component={Nominee}
        />
        <Route 
          exact 
          path={`${url}/report`} 
          component={Report} 
        />
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
          render={(props) => <Report {...props} type="compliant" />}
        />
        <Route
          exact
          path={`${url}/compliant-report-verified`}
          component={KycVerified}
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
        <Route 
          exact 
          path={`${url}/approved/banks/doc`} 
          component={AddBank} 
        />
        <Route
          exact
          path={`${url}/approved/banks/verify/:bank_id`}
          component={AddBankVerify}
        />
        <Route 
          exact 
          path={`${url}/add-bank`} 
          component={BanksList} 
        />
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
        <Route 
          exact 
          path={`${url}/digilocker/success`} 
          component={Success}
        />
        <Route 
          exact 
          path={`${url}/digilocker/failed`} 
          component={Failed} 
        />
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
        <Route 
          exact 
          path={`${url}/trading-experience`} 
          component={TradingExperience} 
        />
        <Route 
          exact 
          path={`${url}/stocks-status`} 
          component={StocksStatus} 
        />
        <Route 
          exact 
          path={`${url}/nri-error`} 
          component={NriError} 
        />
        <Route 
          exact 
          path={`${url}/account-info`} 
          component={AccountInfo} 
        />
        <Route 
          exact 
          path={`${url}/upload-instructions`} 
          component={UploadInstructions} 
        />
        <Route 
          exact 
          path={`${url}/document-verification`} 
          component={DocumentVerification} 
        />
        <Route 
          exact 
          path={`${url}/manual-signature`} 
          component={ManualSignature} 
        />
        <Route 
          exact 
          path={`${url}/fno-sample-documents`} 
          component={FnOSampleDocuments} 
        />
        <Route 
          exact 
          path={`${url}/communication-details`} 
          component={CommunicationDetails} 
        />
        <Route
          exact
          path={`${url}/communication-details/callback`}
          component={CommunicationCallback}
        />
        <Route component={NotFound} />
      </Switch>
    </Fragment>
  );
};

export default Kyc;
