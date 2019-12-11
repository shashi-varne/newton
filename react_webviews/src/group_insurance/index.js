import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import '../common/theme/Style.css';
// import { getConfig } from 'utils/functions';
import { themeConfig } from 'utils/constants';
import { ToastContainer } from 'react-toastify';

import './common/Style.css';
import './products/term_insurance/Style.css';
import NotFound from '../common/components/NotFound';
import Landing from './home/landing';

/***********************TERM INSURANCE START   **************/
import PersonalDetails1 from './products/term_insurance/personal-details/screen1';
import PersonalDetails2 from './products/term_insurance/personal-details/screen2';
import ContactDetails1 from './products/term_insurance/contact-details/screen1';
import ContactDetails2 from './products/term_insurance/contact-details/screen2';
import NomineeDetails from './products/term_insurance/nominee-details/screen1';
import AppointeeDetails from './products/term_insurance/nominee-details/screen2';
import ProfessionalDetails1 from './products/term_insurance/professional-details/screen1';
import ProfessionalDetails2 from './products/term_insurance/professional-details/screen2';
import AdditionalInfo from './products/term_insurance/additional-info/hdfc';
import Summary from './products/term_insurance/insurance-summary/screen1';
import Journey from './products/term_insurance/insurance-summary/screen3';
import Payment from './products/term_insurance/payment/index';
import Pincode from './products/term_insurance/pincode/screen1';
import Resume from './products/term_insurance/insurance-summary/screen2';

// quote selection
import CoverAmount from './products/term_insurance/quote-selection/cover_amount';
import AnnualIncome from './products/term_insurance/quote-selection/annual_income';
import CoverPeriod from './products/term_insurance/quote-selection/cover_period';
import Intro from './products/term_insurance/quote-selection/intro';
import JourneyIntro from './products/term_insurance/quote-selection/journey';
import LifeStyle from './products/term_insurance/quote-selection/lifestyle';
import PersonalDetailsIntro from './products/term_insurance/quote-selection/personal_details';
import QuoteGeneration from './products/term_insurance/quote-selection/quote_generation';

import AddOnBenefits from './products/term_insurance/add-on-benefits/index'
import FinalReport from './products/term_insurance/report/index'
import InsuranceHome from './products/term_insurance/home/index'

/***********************TERM INSURANCE END   **************/

/* Accident */
import AccidentForm from './products/personal_accident/form';
import AccidentSummary from './products/personal_accident/summary';

import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import AccidentFailed from './products/personal_accident/payment-failed';
import AccidentPaymentSuccess from './products/personal_accident/payment-success';
import AccidentPlanSuccess from './products/personal_accident/plan-success';
import AccidentPlanDetails from './products/personal_accident';
import Report from './report';
import ReportDetails from './ui_components/general_insurance/report_check_details';
import AccidentPlanPayment from './products/personal_accident/payment';
import HospicashPlanDetails from './products/hospicash';
import HospicashForm from './products/hospicash/form';
import HospicashSummary from './products/hospicash/summary';
import HospicashPlanSuccess from './products/hospicash/plan-success';
import HospicashPaymentSuccess from './products/hospicash/payment-success';
import HospicashFailed from './products/hospicash/payment-failed';
import HospicashPlanPayment from './products/hospicash/payment';
import SmartwalletForm from './products/smart_wallet/form';
import SmartwalletSummary from './products/smart_wallet/summary';
import SmartwalletPlanSuccess from './products/smart_wallet/plan-success';
import SmartwalletPaymentSuccess from './products/smart_wallet/payment-success';
import SmartwalletFailed from './products/smart_wallet/payment-failed';
import SmartwalletPlanPayment from './products/smart_wallet/payment';
import SmartwalletPlanDetails from './products/smart_wallet';

/* Dengue */
import DengueForm from './products/dengue/form';
import DengueSummary from './products/dengue/summary';
import DengueFailed from './products/dengue/payment-failed';
import DenguePaymentSuccess from './products/dengue/payment-success';
import DenguePlanSuccess from './products/dengue/plan-success';
import DenguePlanDetails from './products/dengue';
import DenguePlanPayment from './products/dengue/payment';

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'f',
});
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// jss.options.insertionPoint = 'jss-insertion-point';

const theme = createMuiTheme(themeConfig);

const ScrollToTop = withRouter(
  class ScrollToTopWithoutRouter extends Component {
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0)
      }
    }

    render() {
      return null;
    }
  }
);

const Insurance = (props) => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route exact path={`${url}`} component={Landing} />

          {/********** TERM INSURANCE **********/}
          <Route path={`${url}/term/resume`} component={Resume} />
          <Route path={`${url}/term/personal`} component={PersonalDetails1} />
          <Route path={`${url}/term/personal1`} component={PersonalDetails2} />
          <Route path={`${url}/term/contact`} component={ContactDetails1} />
          <Route path={`${url}/term/contact1`} component={ContactDetails2} />
          <Route path={`${url}/term/nominee`} component={NomineeDetails} />
          <Route path={`${url}/term/appointee`} component={AppointeeDetails} />
          <Route path={`${url}/term/professional`} component={ProfessionalDetails1} />
          <Route path={`${url}/term/professional1`} component={ProfessionalDetails2} />
          <Route path={`${url}/term/additional-info`} component={AdditionalInfo} />
          <Route path={`${url}/term/summary`} component={Summary} />
          <Route path={`${url}/term/journey`} component={Journey} />
          <Route path={`${url}/term/payment/:insurance_id/:status`} component={Payment} />
          <Route path={`${url}/term/Pincode`} component={Pincode} />
          {/* quote selection */}
          <Route path={`${url}/term/cover-amount`} component={CoverAmount} />
          <Route path={`${url}/term/annual-income`} component={AnnualIncome} />
          <Route path={`${url}/term/cover-period`} component={CoverPeriod} />
          <Route path={`${url}/term/intro`} component={Intro} />
          <Route path={`${url}/term/journey-intro`} component={JourneyIntro} />
          <Route path={`${url}/term/lifestyle`} component={LifeStyle} />
          <Route path={`${url}/term/personal-details-intro`} component={PersonalDetailsIntro} />
          <Route path={`${url}/term/quote`} component={QuoteGeneration} />
          <Route path={`${url}/term/riders`} component={AddOnBenefits} />
          <Route path={`${url}/term/report`} component={FinalReport} />
          <Route path={`${url}/term/home`} component={InsuranceHome} />
          {/* Edit paths */}
          <Route path={`${url}/term/edit-personal`} render={(props) => <PersonalDetails1 {...props} edit={true} />} />
          <Route path={`${url}/term/edit-personal1`} render={(props) => <PersonalDetails2 {...props} edit={true} />} />
          <Route path={`${url}/term/edit-contact`} render={(props) => <ContactDetails1 {...props} edit={true} />} />
          <Route path={`${url}/term/edit-contact1`} render={(props) => <ContactDetails2 {...props} edit={true} />} />
          <Route path={`${url}/term/edit-nominee`} render={(props) => <NomineeDetails {...props} edit={true} />} />
          <Route path={`${url}/term/edit-appointee`} render={(props) => <AppointeeDetails {...props} edit={true} />} />
          <Route path={`${url}/term/edit-professional`} render={(props) => <ProfessionalDetails1 {...props} edit={true} />} />
          <Route path={`${url}/term/edit-professional1`} render={(props) => <ProfessionalDetails2 {...props} edit={true} />} />
          
          {/********** Accident **********/}
          <Route path={`${url}/accident/plan`} component={AccidentPlanDetails} />
          <Route path={`${url}/accident/form`} component={AccidentForm} />
          <Route path={`${url}/accident/summary`} component={AccidentSummary} />
          <Route path={`${url}/accident/summary-success`} component={AccidentPlanSuccess} />
          <Route path={`${url}/accident/payment-success`} component={AccidentPaymentSuccess} />
          <Route path={`${url}/accident/payment-failed`} component={AccidentFailed} />
          <Route path={`${url}/accident/payment/:status`} component={AccidentPlanPayment} />

          {/********** Dengue **********/}
          <Route path={`${url}/dengue/plan`} component={DenguePlanDetails} />
          <Route path={`${url}/dengue/form`} component={DengueForm} />
          <Route path={`${url}/dengue/summary`} component={DengueSummary} />
          <Route path={`${url}/dengue/summary-success`} component={DenguePlanSuccess} />
          <Route path={`${url}/dengue/payment-success`} component={DenguePaymentSuccess} />
          <Route path={`${url}/dengue/payment-failed`} component={DengueFailed} />
          <Route path={`${url}/dengue/payment/:status`} component={DenguePlanPayment} />

          {/********** Hospicash **********/}
          <Route path={`${url}/hospicash/plan`} component={HospicashPlanDetails} />
          <Route path={`${url}/hospicash/form`} component={HospicashForm} />
          <Route path={`${url}/hospicash/summary`} component={HospicashSummary} />
          <Route path={`${url}/hospicash/summary-success`} component={HospicashPlanSuccess} />
          <Route path={`${url}/hospicash/payment-success`} component={HospicashPaymentSuccess} />
          <Route path={`${url}/hospicash/payment-failed`} component={HospicashFailed} />
          <Route path={`${url}/hospicash/payment/:status`} component={HospicashPlanPayment} />

          {/********** Smart wallet **********/}
          <Route path={`${url}/wallet/plan`} component={SmartwalletPlanDetails} />
          <Route path={`${url}/wallet/form`} component={SmartwalletForm} />
          <Route path={`${url}/wallet/summary`} component={SmartwalletSummary} />
          <Route path={`${url}/wallet/summary-success`} component={SmartwalletPlanSuccess} />
          <Route path={`${url}/wallet/payment-success`} component={SmartwalletPaymentSuccess} />
          <Route path={`${url}/wallet/payment-failed`} component={SmartwalletFailed} />
          <Route path={`${url}/wallet/payment/:status`} component={SmartwalletPlanPayment} />


          {/* common */}
          <Route path={`${url}/common/report`} component={Report} />
          <Route path={`${url}/common/reportdetails/:policy_id`} component={ReportDetails} />

          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Insurance;
