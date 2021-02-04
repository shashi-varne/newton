import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import "../common/theme/Style.scss";
import { themeConfig } from 'utils/constants';
import { ToastContainer } from 'react-toastify';

import "./components/Style.scss";
import NotFound from "../common/components/NotFound";


// import LandingIdfc from "./components/general/landing";
import MobileVerify from "./components/forms/mobile_verify";
import OtpVerification from "./components/forms/otp_verify";
import JourneyMap from "./components/general/journey";
import CalculatorIdfc from "./components/general/calculator";
import KnowMore from "./components/general/know_more";
import IncomeDetails from "./components/general/income_details";
import UploadBankStatements from "./components/forms/upload_bank";
import BasicDetails from "./components/forms/basic_details";
import ProfessionalDetailsIdfc from "./components/forms/professional_details";
import PersonalDetailsIdfc from "./components/forms/personal_details";
import AddressDetailsIdfc from "./components/forms/address_details";
import ApplicationSummary from "./components/forms/application_summary";
import CkycSummary from "./components/forms/ckyc_summary";
import LoanRequirementDetails from "./components/forms/requirements_details";
import BtInformation from "./components/bt_details/bt_info";
import LoanBtDetails from "./components/bt_details/loan_bt";
import CreditBtDetails from "./components/bt_details/credit_bt";
import EligibleLoan from "./components/forms/eligible_loan";
import AdditionalDetails from "./components/forms/additional_details";
import DocumentList from "./components/upload_doc/doc_list";
import LoanEligibleIdfc from "./components/general/loan_eligible";
import LoanStatusIdfc from './components/status/status';
import PerfiosStatus from './components/status/perfios_status';
import SystemError from './components/status/system_error';
import DocumentUpload from './components/upload_doc/doc_upload';
import CommonRenderFaqs from "./components/general/RenderFaqs";
import FinalOffer from "./components/general/final_loan";
import Reports from "./components/general/reports";
import Eligibility from './components/general/eligibility';

// import Landing from "../loan/components/general/landing";
// import Report from "../loan/components/general/report";
// import Journey from "../loan/components/general/journey";
// import Calculator from "../loan/components/general/calculator";
// import Help from "../loan/components/general/help";
// import AppUpdate from "../loan/components/general/app_update";
// import ScheduleDoc from "../loan/components/general/schedule_doc";
// import Permissions from "../loan/components/general/permissions";
// import Transaction from "../loan/components/general/transactions";
// import RedirectionStatus from "../loan/components/general/redirection_status";
// import ReportDetails from "../loan/components/loan/report_details";
// import LoanApprvoed from "../loan/components/loan/approved";
// import LoanOtp from "../loan/components/loan/otp";
// import LoanStatus from "../loan/components/loan/status";
// import LoanSummary from "../loan/components/loan/summary";
// import LoanEligible from "../loan/components/loan/loan_eligible";
// import ContactDetails from "../loan/components/form/contact";
// import PersonalDetails from "../loan/components/form/personal";
// import ProfessionalDetails from "../loan/components/form/professional";
// import AddressDetails from "../loan/components/form/address";
// import ReqDetails from "../loan/components/form/requirements";
// import FormSummary from "../loan/components/form/summary";
// import FormOtp from "../loan/components/form/otp";
// import FormCreateProfile from "../loan/components/form/create_profile";
// import InstantKycHome from "../loan/components/kyc/instant_kyc";
// import KycStatus from "../loan/components/kyc/status";
// import Pan from "../loan/components/mandate/pan";
// import Bank from "../loan/components/mandate/bank";
// import Reference from "../loan/components/mandate/reference";
// import MandateStatus from "../loan/components/mandate/status";

import Home from "./components/home/home";
import SelectLoan from "./components/home/select_loan";
import Recommended from "./components/home/recommended";
import LoanKnowMore from "./components/home/know_more";

import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: "f"
});
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// jss.options.insertionPoint = 'jss-insertion-point';

const theme = createMuiTheme(themeConfig);

const ScrollToTop = withRouter(
  class ScrollToTopWithoutRouter extends Component {
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0);
      }
    }

    render() {
      return null;
    }
  }
);

const Lending = props => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>

          {/* // DMI */}
          {/* <Route path={`${url}/dmi/home`} component={Landing} />
          <Route path={`${url}/dmi/app-update`} component={AppUpdate} />
          <Route path={`${url}/dmi/journey`} component={Journey} />
          <Route path={`${url}/dmi/calculator`} component={Calculator} />
          <Route path={`${url}/dmi/permissions`} component={Permissions} />
          <Route path={`${url}/dmi/help`} component={Help} />
          <Route path={`${url}/dmi/report-Details`} component={ReportDetails} />
          <Route path={`${url}/dmi/schedule-Doc`} component={ScheduleDoc} />
          <Route path={`${url}/dmi/report`} component={Report} />
          <Route path={`${url}/dmi/transactions`} component={Transaction} />
          <Route path={`${url}/dmi/redirection-status/:flow`} component={RedirectionStatus} />
          <Route path={`${url}/dmi/instant-kyc`} component={InstantKycHome} />
          <Route path={`${url}/dmi/instant-kyc-status`} component={KycStatus} />
          <Route path={`${url}/dmi/loan-Approved`} component={LoanApprvoed} />
          <Route path={`${url}/dmi/loan-Otp`} component={LoanOtp} />
          <Route path={`${url}/dmi/loan-Status`} component={LoanStatus} />
          <Route path={`${url}/dmi/loan-Summary`} component={LoanSummary} />
          <Route path={`${url}/dmi/loan-eligible`} component={LoanEligible} />
          <Route path={`${url}/dmi/requirements-details`} component={ReqDetails} />
          <Route path={`${url}/dmi/personal-details`} component={PersonalDetails} />
          <Route path={`${url}/dmi/contact-details`} component={ContactDetails} />
          <Route path={`${url}/dmi/professional-details`} component={ProfessionalDetails} />
          <Route path={`${url}/dmi/address-details`} component={AddressDetails} />
          <Route path={`${url}/dmi/form-otp`} component={FormOtp} />
          <Route path={`${url}/dmi/form-create-profile`} component={FormCreateProfile} />
          <Route path={`${url}/dmi/reference`} component={Reference} />
          <Route path={`${url}/dmi/bank`} component={Bank} />
          <Route path={`${url}/dmi/upload-pan`} component={Pan} />
          <Route path={`${url}/dmi/mandate-status`} component={MandateStatus} /> */}

          {/* Edit paths */}

         {/* <Route path={`${url}/dmi/edit-requirements-details`} 
          render={(props) => <ReqDetails {...props} edit={true} />} />

          <Route path={`${url}/dmi/edit-personal-details`} 
          render={(props) => <PersonalDetails {...props} edit={true} />} />

          <Route path={`${url}/dmi/edit-contact-details`} 
          render={(props) => <ContactDetails {...props} edit={true} />} />

          <Route path={`${url}/dmi/edit-professional-details`} 
          render={(props) => <ProfessionalDetails {...props} edit={true} />} />

          <Route path={`${url}/dmi/edit-address-details`} 
          render={(props) => <AddressDetails {...props} edit={true} />} />

          <Route path={`${url}/dmi/form-summary`} component={FormSummary} /> */}

          {/* // IDFC */}
          {/* <Route path={`${url}/idfc/home`} component={LandingIdfc} /> */}
          <Route path={`${url}/idfc/edit-number`} component={MobileVerify} />
          <Route path={`${url}/idfc/otp-verify`} component={OtpVerification} />
          <Route path={`${url}/idfc/journey`} component={JourneyMap} />
          <Route path={`${url}/idfc/know-more`} component={KnowMore} />
          <Route path={`${url}/idfc/income-details`} component={IncomeDetails} />
          <Route path={`${url}/idfc/upload-bank`} component={UploadBankStatements} />
          <Route path={`${url}/idfc/basic-details`} component={BasicDetails} />
          <Route path={`${url}/idfc/professional-details`} component={ProfessionalDetailsIdfc} />
          <Route path={`${url}/idfc/personal-details`} component={PersonalDetailsIdfc} />
          <Route path={`${url}/idfc/address-details`} component={AddressDetailsIdfc} />
          <Route path={`${url}/idfc/loan-requirement-details`} component={LoanRequirementDetails} />
          <Route path={`${url}/idfc/bt-info`} component={BtInformation} />
          <Route path={`${url}/idfc/loan-bt`} component={LoanBtDetails} />
          <Route path={`${url}/idfc/credit-bt`} component={CreditBtDetails} />
          <Route path={`${url}/idfc/application-summary`} component={ApplicationSummary} />
          <Route path={`${url}/idfc/ckyc-summary`} component={CkycSummary} />
          <Route path={`${url}/idfc/eligible-loan`} component={EligibleLoan} />
          <Route path={`${url}/idfc/additional-details`} component={AdditionalDetails} />
          <Route path={`${url}/idfc/doc-list`} component={DocumentList} />
          <Route path={`${url}/idfc/loan-eligible`} component={LoanEligibleIdfc} />
          <Route path={`${url}/idfc/loan-status`} component={LoanStatusIdfc} />
          <Route path={`${url}/idfc/perfios-status`} component={PerfiosStatus} />
          <Route path={`${url}/idfc/doc-upload`} component={DocumentUpload} />
          <Route path={`${url}/idfc/faq`} component={CommonRenderFaqs} />
          <Route path={`${url}/idfc/final-offer`} component={FinalOffer} />
          <Route path={`${url}/idfc/reports`} component={Reports} />
          <Route path={`${url}/idfc/error`} component={SystemError} />
          <Route path={`${url}/idfc/eligibility`} component={Eligibility} />

          {/* Edit paths */}
          <Route path={`${url}/idfc/edit-basic-details`} 
            render={(props) => <BasicDetails {...props} edit={true} />} />

          <Route path={`${url}/idfc/edit-professional-details`} 
            render={(props) => <ProfessionalDetailsIdfc {...props} edit={true} />} />

          <Route path={`${url}/idfc/edit-personal-details`} 
            render={(props) => <PersonalDetailsIdfc {...props} edit={true} />} />

          <Route path={`${url}/idfc/edit-address-details`} 
            render={(props) => <AddressDetailsIdfc {...props} edit={true} />} />

          {/* <Route path={`${url}/dmi`} component={Loan} /> */}

          <Route path={`${url}/home`} component={Home} />
          <Route path={`${url}/select-loan`} component={SelectLoan} />
          <Route path={`${url}/edit-details`} component={Recommended} />
          <Route path={`${url}/:id/loan-know-more`} component={LoanKnowMore} />
          <Route path={`${url}/calculator`} component={CalculatorIdfc} />
          {/* <Route path={`${url}/system`} component={System} /> */}
       
          <Route component={NotFound} />

        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Lending;
