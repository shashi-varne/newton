import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "../common/theme/Style.scss";

import "./components/Style.scss";
import NotFound from "../common/components/NotFound";


// import Landing from "./components/general/landing";
import Report from "./components/general/report";
import Journey from "./components/general/journey";
import Calculator from "./components/general/calculator";
import Help from "./components/general/help";
import AppUpdate from "./components/general/app_update";
import ScheduleDoc from "./components/general/schedule_doc";
import Permissions from "./components/general/permissions";
import Transaction from "./components/general/transactions";
import RedirectionStatus from "./components/general/redirection_status";

import ReportDetails from "./components/loan/report_details";
import LoanApprvoed from "./components/loan/approved";
import LoanOtp from "./components/loan/otp";
import LoanStatus from "./components/loan/status";
import LoanSummary from "./components/loan/summary";
import LoanEligible from "./components/loan/loan_eligible";

import ContactDetails from "./components/form/contact";
import PersonalDetails from "./components/form/personal";
import ProfessionalDetails from "./components/form/professional";
import AddressDetails from "./components/form/address";
import ReqDetails from "./components/form/requirements";
import FormSummary from "./components/form/summary";
import FormOtp from "./components/form/otp";
import FormCreateProfile from "./components/form/create_profile";


import InstantKycHome from "./components/kyc/instant_kyc";
import KycStatus from "./components/kyc/status";

import Pan from "./components/mandate/pan";
import Bank from "./components/mandate/bank";
import Reference from "./components/mandate/reference";
import MandateStatus from "./components/mandate/status";
import SystemMaintainence from "./components/general/system_maintain";

const Lending = props => {
  const { url } = props.match;

  return (
    <Fragment>
        <Switch>

          {/* <Route path={`${url}/home`} component={Landing} /> */}
          <Route path={`${url}/app-update`} component={AppUpdate} />
          <Route path={`${url}/journey`} component={Journey} />
          <Route path={`${url}/calculator`} component={Calculator} />
          <Route path={`${url}/permissions`} component={Permissions} />
          <Route path={`${url}/help`} component={Help} />
          <Route path={`${url}/report-Details`} component={ReportDetails} />
          <Route path={`${url}/schedule-Doc`} component={ScheduleDoc} />
          <Route path={`${url}/report`} component={Report} />
          <Route path={`${url}/transactions`} component={Transaction} />
          <Route path={`${url}/redirection-status/:flow`} component={RedirectionStatus} />

          <Route path={`${url}/instant-kyc`} component={InstantKycHome} />
          <Route path={`${url}/instant-kyc-status`} component={KycStatus} />

          <Route path={`${url}/loan-Approved`} component={LoanApprvoed} />
          <Route path={`${url}/loan-Otp`} component={LoanOtp} />
          <Route path={`${url}/loan-Status`} component={LoanStatus} />
          <Route path={`${url}/loan-Summary`} component={LoanSummary} />
          <Route path={`${url}/loan-eligible`} component={LoanEligible} />

          <Route path={`${url}/requirements-details`} component={ReqDetails} />
          <Route path={`${url}/personal-details`} component={PersonalDetails} />
          <Route path={`${url}/contact-details`} component={ContactDetails} />
          <Route path={`${url}/professional-details`} component={ProfessionalDetails} />
          <Route path={`${url}/address-details`} component={AddressDetails} />

          <Route path={`${url}/form-otp`} component={FormOtp} />
          <Route path={`${url}/form-create-profile`} component={FormCreateProfile} />

          <Route path={`${url}/reference`} component={Reference} />
          <Route path={`${url}/bank`} component={Bank} />
          <Route path={`${url}/upload-pan`} component={Pan} />
          <Route path={`${url}/mandate-status`} component={MandateStatus} />
          <Route path={`${url}/home`} component={SystemMaintainence} />

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
    </Fragment>
  );
};

export default Lending;
