import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import "../common/theme/Style.scss";
import "./common/Style.css";
import { themeConfig } from 'utils/constants';
import { ToastContainer } from 'react-toastify';

import "./components/Style.scss";
import NotFound from "../common/components/NotFound";


import Landing from "./components/general/landing";
import Journey from "./components/general/journey";
import Calculator from "./components/general/calculator";
import Help from "./components/general/help";
import ScheduleDoc from "./components/general/schedule_doc";
import Permissions from "./components/general/permissions";

import ReportDetails from "./components/loan/report_details";
import LoanApprvoed from "./components/loan/approved";
import LoanOtp from "./components/loan/otp";
import LoanStatus from "./components/loan/status";
import LoanSummary from "./components/loan/summary";

import ContactDetails from "./components/form/contact";
import PersonalDetails from "./components/form/personal";
import ProfessionalDetails from "./components/form/professional";
import AddressDetails from "./components/form/address";
import ReqDetails from "./components/form/requirements";
import FormSummary from "./components/form/summary";
import FormOtp from "./components/form/otp";
import FormCreateProfile from "./components/form/create_profile";


import InstantKycHome from "./components/kyc/instant_kyc";
import KycStatus from "./components/kyc/status"

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

          <Route path={`${url}/landing`} component={Landing} />
          <Route path={`${url}/Journey`} component={Journey} />
          <Route path={`${url}/Calculator`} component={Calculator} />
          <Route path={`${url}/Permissions`} component={Permissions} />
          <Route path={`${url}/Help`} component={Help} />
          <Route path={`${url}/Report-Details`} component={ReportDetails} />
          <Route path={`${url}/Schedule-Doc`} component={ScheduleDoc} />


          <Route path={`${url}/instant-kyc`} component={InstantKycHome} />
          <Route path={`${url}/instant-kyc-status`} component={KycStatus} />

          <Route path={`${url}/Loan-Approved`} component={LoanApprvoed} />
          <Route path={`${url}/Loan-Otp`} component={LoanOtp} />
          <Route path={`${url}/Loan-Status`} component={LoanStatus} />
          <Route path={`${url}/Loan-Summary`} component={LoanSummary} />

          <Route path={`${url}/requirements-details`} component={ReqDetails} />
          <Route path={`${url}/personal-details`} component={PersonalDetails} />
          <Route path={`${url}/contact-details`} component={ContactDetails} />
          <Route path={`${url}/professional-details`} component={ProfessionalDetails} />
          <Route path={`${url}/address-details`} component={AddressDetails} />

          <Route path={`${url}/form-otp`} component={FormOtp} />
          <Route path={`${url}/form-create-profile`} component={FormCreateProfile} />

          {/* Edit paths */}

         <Route path={`${url}/edit-requirements-details`} 
          render={(props) => <ReqDetails {...props} edit={true} />} />

          <Route path={`${url}/edit-personal-details`} 
          render={(props) => <PersonalDetails {...props} edit={true} />} />

          <Route path={`${url}/edit-contact-details`} 
          render={(props) => <ContactDetails {...props} edit={true} />} />

          <Route path={`${url}/edit-professional-details`} 
          render={(props) => <ProfessionalDetails {...props} edit={true} />} />

          <Route path={`${url}/edit-address-details`} 
          render={(props) => <AddressDetails {...props} edit={true} />} />



          <Route path={`${url}/form-summary`} component={FormSummary} />
          
         
          <Route component={NotFound} />

        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Lending;
