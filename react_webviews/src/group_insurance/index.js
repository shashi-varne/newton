import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import '../common/theme/Style.scss';
// import { getConfig } from 'utils/functions';
import { themeConfig } from 'utils/constants';
import { ToastContainer } from 'react-toastify';

import './common/Style.scss';
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


import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

import PersonalDetailsRedirect from './products/term_insurance/quote-selection/personal_details_redirect'

/***********************TERM INSURANCE END   **************/

/* personal Accident */
import AccidentForm from './products/personal_accident/form';
import AccidentSummary from './products/personal_accident/summary';
import AccidentFailed from './products/personal_accident/payment-failed';
import AccidentPaymentSuccess from './products/personal_accident/payment-success';
import AccidentPlanSuccess from './products/personal_accident/plan-success';
import AccidentPlanDetails from './products/personal_accident';
import AccidentPlanPayment from './products/personal_accident/payment';
import AccidentPaymentCallback from './products/personal_accident/payment-callback';


// hospicash
import HospicashPlanDetails from './products/hospicash';
import HospicashForm from './products/hospicash/form';
import HospicashSummary from './products/hospicash/summary';
import HospicashPlanSuccess from './products/hospicash/plan-success';
import HospicashPaymentSuccess from './products/hospicash/payment-success';
import HospicashFailed from './products/hospicash/payment-failed';
import HospicashPlanPayment from './products/hospicash/payment';
import HospicashPaymentCallback from './products/hospicash/payment-callback';

// smart wallet
import SmartwalletForm from './products/smart_wallet/form';
import SmartwalletSummary from './products/smart_wallet/summary';
import SmartwalletPlanSuccess from './products/smart_wallet/plan-success';
import SmartwalletPaymentSuccess from './products/smart_wallet/payment-success';
import SmartwalletFailed from './products/smart_wallet/payment-failed';
import SmartwalletPlanPayment from './products/smart_wallet/payment';
import SmartwalletPlanDetails from './products/smart_wallet';
import SmartwalletPaymentCallback from './products/smart_wallet/payment-callback';

/* Dengue */
import DengueForm from './products/dengue/form';
import DengueSummary from './products/dengue/summary';
import DengueFailed from './products/dengue/payment-failed';
import DenguePaymentSuccess from './products/dengue/payment-success';
import DenguePlanSuccess from './products/dengue/plan-success';
import DenguePlanDetails from './products/dengue';
import DenguePlanPayment from './products/dengue/payment';
import DenguePaymentCallback from './products/dengue/payment-callback';

/* Corona */
import CoronaForm from './products/corona/form';
import CoronaSummary from './products/corona/summary';
import CoronaFailed from './products/corona/payment-failed';
import CoronaPaymentSuccess from './products/corona/payment-success';
import CoronaPlanSuccess from './products/corona/plan-success';
import CoronaPlanDetails from './products/corona';
import CoronaPlanPayment from './products/corona/payment';
import CoronaPaymentCallback from './products/corona/payment-callback';


/*******************  Health ******************/
import HealthInsuranceLanding from './products/health_insurance/landing';


// health suraksha
import HealthSuraksha from './products/health_insurance/health_suraksha/plan_details'
import HealthSurakshaForm from './products/health_insurance/health_suraksha/form'


// critical illness
import HealthCriticalIllness from './products/health_insurance/critical_illness/plan_details'
import HealthCriticalIllnessForm from './products/health_insurance/critical_illness/form'


// super topup 
import HealthSuperTopup from './products/health_insurance/super_topup/plan_details'
import HealthSuperTopupForm from './products/health_insurance/super_topup/form'


/*******************  Home Insurance ******************/
import HomeInsurance from './products/home_insurance/general/plan_details';
import HomeInsuranceForm from './products/home_insurance/general/form';

/*******************Group  Health ******************/
import GroupHealthLanding from './products/group_health/landing';
import GroupHealthSelectInsureType from './products/group_health/plans/insure_type';
import GroupHealthPlanDob from './products/group_health/plans/dob';
import GroupHealthPlanAddMembers from './products/group_health/plans/add_members';
import GroupHealthPlanSelectCity from './products/group_health/plans/select_city';
import GroupHealthPlanList from './products/group_health/plans/plan_list';
import GroupHealthPlanDetails from './products/group_health/plans/plan_details';
import GroupHealthPlanSelectSumAssured from './products/group_health/plans/select_sum_assured';
import GroupHealthPlanSelectCoverPeriod from './products/group_health/plans/select_cover_period';
import GroupHealthPlanSelectFloater from './products/group_health/plans/select_floater';
import GroupHealthPlanPremiumSummary from './products/group_health/plans/premium_summary';
import GroupHealthPlanHowToClaim from './products/group_health/plans/how_to_claim';
import GroupHealthPlanPersonalDetails from './products/group_health/form/personal_details';
import GroupHealthPlanContactDetails from './products/group_health/form/contact';
import GroupHealthPlanAddressDetails from './products/group_health/form/address';
import GroupHealthPlanNomineeDetails from './products/group_health/form/nominee';
import GroupHealthPlanIsPed from './products/group_health/form/is_ped';
import GroupHealthPlanSelectPed from './products/group_health/form/select_ped';
import GroupHealthPlanFinalSummary from './products/group_health/form/final_summary';
import GroupHealthPayment from './products/group_health/payment/index';

// etli
import EtliPersonalDetails1 from './products/term_insurance/etli/personal_details1';
import EtliPersonalDetails2 from './products/term_insurance/etli/personal_details2';
import EtliPersonalDetails3 from './products/term_insurance/etli/personal_details3';
import EtliAuthFailed from './products/term_insurance/etli/auth_failed';

// common

import Report from './report';
import ReportDetails from './ui_components/general_insurance/report_check_details';
import RenderDiseasesClass from './ui_components/general_insurance/diseases';
import RenderCoverClass from './ui_components/general_insurance/cover';
import RenderNotCoverClass from './ui_components/general_insurance/notcover';
import RenderClaimClass from './ui_components/general_insurance/claim';

import Tooltip from '../common/ui/Tooltip';


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
        <Tooltip />
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
          <Route path={`${url}/term/personal-details-redirect`} component={PersonalDetailsRedirect} />
          {/* Edit paths */}
          <Route path={`${url}/term/edit-personal`} render={(props) => <PersonalDetails1 {...props} edit={true} />} />
          <Route path={`${url}/term/edit-personal1`} render={(props) => <PersonalDetails2 {...props} edit={true} />} />
          <Route path={`${url}/term/edit-contact`} render={(props) => <ContactDetails1 {...props} edit={true} />} />
          <Route path={`${url}/term/edit-contact1`} render={(props) => <ContactDetails2 {...props} edit={true} />} />
          <Route path={`${url}/term/edit-nominee`} render={(props) => <NomineeDetails {...props} edit={true} />} />
          <Route path={`${url}/term/edit-appointee`} render={(props) => <AppointeeDetails {...props} edit={true} />} />
          <Route path={`${url}/term/edit-professional`} render={(props) => <ProfessionalDetails1 {...props} edit={true} />} />
          <Route path={`${url}/term/edit-professional1`} render={(props) => <ProfessionalDetails2 {...props} edit={true} />} />
          

          {/* etli */}
          <Route path={`${url}/term/etli/personal-details1`} component={EtliPersonalDetails1} />
          <Route path={`${url}/term/etli/personal-details2`} component={EtliPersonalDetails2} />
          <Route path={`${url}/term/etli/personal-details3`} component={EtliPersonalDetails3} />
          <Route path={`${url}/term/etli/auth-failed`} component={EtliAuthFailed} />
       
          {/********** Accident **********/}
          <Route path={`${url}/accident/plan`} component={AccidentPlanDetails} />
          <Route path={`${url}/accident/form`} component={AccidentForm} />
          <Route path={`${url}/accident/summary`} component={AccidentSummary} />
          <Route path={`${url}/accident/summary-success`} component={AccidentPlanSuccess} />
          <Route path={`${url}/accident/payment-success`} component={AccidentPaymentSuccess} />
          <Route path={`${url}/accident/payment-failed`} component={AccidentFailed} />
          <Route path={`${url}/accident/payment/:status`} component={AccidentPlanPayment} />
          <Route path={`${url}/accident/payment-callback`} component={AccidentPaymentCallback} />

          {/********** Dengue **********/}
          <Route path={`${url}/dengue/plan`} component={DenguePlanDetails} />
          <Route path={`${url}/dengue/form`} component={DengueForm} />
          <Route path={`${url}/dengue/summary`} component={DengueSummary} />
          <Route path={`${url}/dengue/summary-success`} component={DenguePlanSuccess} />
          <Route path={`${url}/dengue/payment-success`} component={DenguePaymentSuccess} />
          <Route path={`${url}/dengue/payment-failed`} component={DengueFailed} />
          <Route path={`${url}/dengue/payment/:status`} component={DenguePlanPayment} />
          <Route path={`${url}/dengue/payment-callback`} component={DenguePaymentCallback} />

          {/********** Corona **********/}
          <Route path={`${url}/corona/plan`} component={CoronaPlanDetails} />
          <Route path={`${url}/corona/form`} component={CoronaForm} />
          <Route path={`${url}/corona/summary`} component={CoronaSummary} />
          <Route path={`${url}/corona/summary-success`} component={CoronaPlanSuccess} />
          <Route path={`${url}/corona/payment-success`} component={CoronaPaymentSuccess} />
          <Route path={`${url}/corona/payment-failed`} component={CoronaFailed} />
          <Route path={`${url}/corona/payment/:status`} component={CoronaPlanPayment} />
          <Route path={`${url}/corona/payment-callback`} component={CoronaPaymentCallback} />

          {/********** Hospicash **********/}
          <Route path={`${url}/hospicash/plan`} component={HospicashPlanDetails} />
          <Route path={`${url}/hospicash/form`} component={HospicashForm} />
          <Route path={`${url}/hospicash/summary`} component={HospicashSummary} />
          <Route path={`${url}/hospicash/summary-success`} component={HospicashPlanSuccess} />
          <Route path={`${url}/hospicash/payment-success`} component={HospicashPaymentSuccess} />
          <Route path={`${url}/hospicash/payment-failed`} component={HospicashFailed} />
          <Route path={`${url}/hospicash/payment/:status`} component={HospicashPlanPayment} />
          <Route path={`${url}/hospicash/payment-callback`} component={HospicashPaymentCallback} />

          {/********** Smart wallet **********/}
          <Route path={`${url}/wallet/plan`} component={SmartwalletPlanDetails} />
          <Route path={`${url}/wallet/form`} component={SmartwalletForm} />
          <Route path={`${url}/wallet/summary`} component={SmartwalletSummary} />
          <Route path={`${url}/wallet/summary-success`} component={SmartwalletPlanSuccess} />
          <Route path={`${url}/wallet/payment-success`} component={SmartwalletPaymentSuccess} />
          <Route path={`${url}/wallet/payment-failed`} component={SmartwalletFailed} />
          <Route path={`${url}/wallet/payment/:status`} component={SmartwalletPlanPayment} />
          <Route path={`${url}/wallet/payment-callback`} component={SmartwalletPaymentCallback} />

          {/********** Health Insurance **********/}
          <Route path={`${url}/health/landing`} component={HealthInsuranceLanding} />

          {/* health suraksha */}
          <Route path={`${url}/health/health_suraksha/plan`} component={HealthSuraksha} />
          <Route path={`${url}/health/health_suraksha/form-redirection`} component={HealthSurakshaForm} />

          {/* critical illness */}
          <Route path={`${url}/health/critical_illness/plan`} component={HealthCriticalIllness} />
          <Route path={`${url}/health/critical_illness/form-redirection`} component={HealthCriticalIllnessForm} />
          

          {/* super topup */}
          <Route path={`${url}/health/super_topup/plan`} component={HealthSuperTopup} />
          <Route path={`${url}/health/super_topup/form-redirection`} component={HealthSuperTopupForm} />


          {/* home insurance */}
          <Route path={`${url}/home_insurance/general/plan`} component={HomeInsurance} />
          <Route path={`${url}/home_insurance/general/form-redirection`} component={HomeInsuranceForm} />
          


          {/********** Group Health Insurance **********/}
          <Route path={`${url}/group-health/landing`} component={GroupHealthLanding} />
          <Route path={`${url}/group-health/:provider/insure-type`} component={GroupHealthSelectInsureType} />
          <Route path={`${url}/group-health/:provider/plan-dob`} component={GroupHealthPlanDob} />
          <Route path={`${url}/group-health/:provider/plan-add-members`} component={GroupHealthPlanAddMembers} />
          <Route path={`${url}/group-health/:provider/plan-select-city`} component={GroupHealthPlanSelectCity} />
          <Route path={`${url}/group-health/:provider/plan-list`} component={GroupHealthPlanList} />
          <Route path={`${url}/group-health/:provider/plan-details`} component={GroupHealthPlanDetails} />
          <Route path={`${url}/group-health/:provider/plan-select-sum-assured`} component={GroupHealthPlanSelectSumAssured} />
          <Route path={`${url}/group-health/:provider/plan-select-cover-period`} component={GroupHealthPlanSelectCoverPeriod} />
          <Route path={`${url}/group-health/:provider/plan-select-floater`} component={GroupHealthPlanSelectFloater} />
          <Route path={`${url}/group-health/:provider/plan-premium-summary`} component={GroupHealthPlanPremiumSummary} />
          <Route path={`${url}/group-health/:provider/how-to-claim`} component={GroupHealthPlanHowToClaim} />
          <Route path={`${url}/group-health/:provider/personal-details/:member_key`} component={GroupHealthPlanPersonalDetails} />
          <Route path={`${url}/group-health/:provider/contact`} component={GroupHealthPlanContactDetails} />
          <Route path={`${url}/group-health/:provider/address`} component={GroupHealthPlanAddressDetails} />
          <Route path={`${url}/group-health/:provider/nominee`} component={GroupHealthPlanNomineeDetails} />
          <Route path={`${url}/group-health/:provider/is-ped`} component={GroupHealthPlanIsPed} />
          <Route path={`${url}/group-health/:provider/select-ped/:member_key`} component={GroupHealthPlanSelectPed} />
          <Route path={`${url}/group-health/:provider/final-summary`} component={GroupHealthPlanFinalSummary} />
          <Route path={`${url}/group-health/:provider/payment`} component={GroupHealthPayment} />
          
           {/* Edit paths */}

          <Route path={`${url}/group-health/:provider/edit-personal-details/:member_key`} 
          render={(props) => <GroupHealthPlanPersonalDetails {...props} edit={true} />} />

          <Route path={`${url}/group-health/:provider/edit-contact`} 
          render={(props) => <GroupHealthPlanContactDetails  {...props} edit={true}  />} />

          <Route path={`${url}/group-health/:provider/edit-address`} 
          render={(props) => <GroupHealthPlanAddressDetails  {...props} edit={true} />} />

          <Route path={`${url}/group-health/:provider/edit-nominee`} 
          render={(props) => <GroupHealthPlanNomineeDetails  {...props} edit={true} />} />

          <Route path={`${url}/group-health/:provider/edit-is-ped`} 
          render={(props) => <GroupHealthPlanIsPed  {...props} edit={true} />} />

          <Route path={`${url}/group-health/:provider/edit-select-ped/:member_key`}
          render={(props) => <GroupHealthPlanSelectPed  {...props} edit={true} />} />
          
          {/* common */}
          <Route path={`${url}/common/report`} component={Report} />
          <Route path={`${url}/common/reportdetails/:policy_id`} component={ReportDetails} />
          <Route path={`${url}/common/diseases`} component={RenderDiseasesClass} />
          <Route path={`${url}/common/cover`} component={RenderCoverClass} />
          <Route path={`${url}/common/notcover`} component={RenderNotCoverClass} />
          <Route path={`${url}/common/claim`} component={RenderClaimClass} />


          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Insurance;
