import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import "../common/theme/Style.scss";
import { themeConfig } from 'utils/constants';
import { ToastContainer } from 'react-toastify';

import "./components/Style.scss";
import NotFound from "../common/components/NotFound";


import Landing from "./components/general/landing";
import MobileVerify from "./components/forms/mobile_verify";
import OtpVerification from "./components/forms/otp_verify";
import JourneyMap from "./components/general/journey";
import Calculator from "./components/general/calculator";
import KnowMore from "./components/general/know_more";
import IncomeDetails from "./components/general/income_details";
import UploadBankStatements from "./components/forms/upload_bank";
import BasicDetails from "./components/forms/basic_details";
import ProfessionalDetails from "./components/forms/professional_details";
import PersonalDetails from "./components/forms/personal_details";
import AddressDetails from "./components/forms/address_details";
import ApplicationSummary from "./components/forms/application_summary";
import CkycSummary from "./components/forms/ckyc_summary";
import LoanRequirementDetails from "./components/forms/requirements_details";
import BtInformation from "./components/bt_details/bt_info";
import LoanBtDetails from "./components/bt_details/loan_bt";
import CreditBtDetails from "./components/bt_details/credit_bt";
import EligibleLoan from "./components/forms/eligible_loan";
import AdditionalDetails from "./components/forms/additional_details";
import DocumentList from "./components/upload_doc/doc_list";
import LoanEligible from "./components/general/loan_eligible";
import LoanStatus from './components/status/status';
import PerfiosStatus from './components/status/perfios_status';
import SystemError from './components/status/system_error';
import DocumentUpload from './components/upload_doc/doc_upload';
import CommonRenderFaqs from "./components/general/RenderFaqs";
import FinalOffer from "./components/general/final_loan";
import Reports from "./components/general/reports";

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

          <Route path={`${url}/home`} component={Landing} />
          <Route path={`${url}/edit-number`} component={MobileVerify} />
          <Route path={`${url}/otp-verify`} component={OtpVerification} />
          <Route path={`${url}/journey`} component={JourneyMap} />
          <Route path={`${url}/know-more`} component={KnowMore} />
          <Route path={`${url}/calculator`} component={Calculator} />
          <Route path={`${url}/income-details`} component={IncomeDetails} />
          <Route path={`${url}/upload-bank`} component={UploadBankStatements} />
          <Route path={`${url}/basic-details`} component={BasicDetails} />
          <Route path={`${url}/professional-details`} component={ProfessionalDetails} />
          <Route path={`${url}/personal-details`} component={PersonalDetails} />
          <Route path={`${url}/address-details`} component={AddressDetails} />
          <Route path={`${url}/loan-requirement-details`} component={LoanRequirementDetails} />
          <Route path={`${url}/bt-info`} component={BtInformation} />
          <Route path={`${url}/loan-bt`} component={LoanBtDetails} />
          <Route path={`${url}/credit-bt`} component={CreditBtDetails} />
          <Route path={`${url}/application-summary`} component={ApplicationSummary} />
          <Route path={`${url}/ckyc-summary`} component={CkycSummary} />
          <Route path={`${url}/eligible-loan`} component={EligibleLoan} />
          <Route path={`${url}/additional-details`} component={AdditionalDetails} />
          <Route path={`${url}/doc-list`} component={DocumentList} />
          <Route path={`${url}/loan-eligible`} component={LoanEligible} />
          <Route path={`${url}/loan-status`} component={LoanStatus} />
          <Route path={`${url}/perfios-status`} component={PerfiosStatus} />
          <Route path={`${url}/doc-upload`} component={DocumentUpload} />
          <Route path={`${url}/faq`} component={CommonRenderFaqs} />
          <Route path={`${url}/final-offer`} component={FinalOffer} />
          <Route path={`${url}/reports`} component={Reports} />
          <Route path={`${url}/error`} component={SystemError} />

          {/* Edit paths */}
          <Route path={`${url}/edit-basic-details`} 
            render={(props) => <BasicDetails {...props} edit={true} />} />

          <Route path={`${url}/edit-professional-details`} 
            render={(props) => <ProfessionalDetails {...props} edit={true} />} />

          <Route path={`${url}/edit-personal-details`} 
            render={(props) => <PersonalDetails {...props} edit={true} />} />

          <Route path={`${url}/edit-address-details`} 
            render={(props) => <AddressDetails {...props} edit={true} />} />
       
          <Route component={NotFound} />

        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Lending;
