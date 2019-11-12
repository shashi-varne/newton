import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import '../common/theme/Style.css';
import { getConfig } from 'utils/functions';
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
import AccidentFailed from './products/personal_accident/failed';
import AccidentPaymentSuccess from './products/personal_accident/success';
import AccidentPlanSuccess from './products/personal_accident/plan-success';
import AccidentPlanDetails from './products/personal_accident';
import Report from './report';
import ReportDetails from './ui_components/general_insurance/report_check_details';


const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'f',
});
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// jss.options.insertionPoint = 'jss-insertion-point';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: getConfig().primary,
      // dark: will be calculated from palette.primary.main,
      contrastText: '#ffffff',
    },
    secondary: {
      // light: '#0066ff',
      main: getConfig().secondary,
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffffff',
    },
    default: {
      // light: '#0066ff',
      main: getConfig().default,
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffffff',
    }
    // error: will us the default color
  },
  overrides: {
    MuiFormControl: {
      root: {
        width: '100%'
      }
    },
    MuiInput: {
      input: {
        padding: '11px 0 7px',
        fontSize: '14px'
      }
    },
    MuiInputLabel: {
      root: {
        fontSize: '0.9rem',
        color: getConfig().label,
        fontWeight: 'normal'
      },
      shrink: {
        transform: 'translate(0, 1.5px) scale(0.85)'
      }
    },
    MuiButton: {
      raisedSecondary: {
        '&:hover': {
          backgroundColor: getConfig().secondary
        }
      }
    },
    MuiIconButton: {
      root: {
        height: '56px'
      }
    }
  }
});

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
  console.log(url)

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route exact path={`${url}`} component={Landing} />

          {/********** TERM INSURANCE **********/}
          <Route path={`${url}/resume`} component={Resume} />
          <Route path={`${url}/personal`} component={PersonalDetails1} />
          <Route path={`${url}/personal1`} component={PersonalDetails2} />
          <Route path={`${url}/contact`} component={ContactDetails1} />
          <Route path={`${url}/contact1`} component={ContactDetails2} />
          <Route path={`${url}/nominee`} component={NomineeDetails} />
          <Route path={`${url}/appointee`} component={AppointeeDetails} />
          <Route path={`${url}/professional`} component={ProfessionalDetails1} />
          <Route path={`${url}/professional1`} component={ProfessionalDetails2} />
          <Route path={`${url}/additional-info`} component={AdditionalInfo} />
          <Route path={`${url}/summary`} component={Summary} />
          <Route path={`${url}/journey`} component={Journey} />
          <Route path={`${url}/payment/:insurance_id/:insurance_v2/:status`} component={Payment} />
          <Route path={`${url}/Pincode`} component={Pincode} />
          {/* quote selection */}
          <Route path={`${url}/cover-amount`} component={CoverAmount} />
          <Route path={`${url}/annual-income`} component={AnnualIncome} />
          <Route path={`${url}/cover-period`} component={CoverPeriod} />
          <Route path={`${url}/intro`} component={Intro} />
          <Route path={`${url}/journey-intro`} component={JourneyIntro} />
          <Route path={`${url}/lifestyle`} component={LifeStyle} />
          <Route path={`${url}/personal-details-intro`} component={PersonalDetailsIntro} />
          <Route path={`${url}/quote`} component={QuoteGeneration} />
          <Route path={`${url}/riders`} component={AddOnBenefits} />
          <Route path={`${url}/report`} component={FinalReport} />
          <Route path={`${url}/home`} component={InsuranceHome} />
          {/* Edit paths */}
          <Route path={`${url}/edit-personal`} render={(props) => <PersonalDetails1 {...props} edit={true} />} />
          <Route path={`${url}/edit-personal1`} render={(props) => <PersonalDetails2 {...props} edit={true} />} />
          <Route path={`${url}/edit-contact`} render={(props) => <ContactDetails1 {...props} edit={true} />} />
          <Route path={`${url}/edit-contact1`} render={(props) => <ContactDetails2 {...props} edit={true} />} />
          <Route path={`${url}/edit-nominee`} render={(props) => <NomineeDetails {...props} edit={true} />} />
          <Route path={`${url}/edit-appointee`} render={(props) => <AppointeeDetails {...props} edit={true} />} />
          <Route path={`${url}/edit-professional`} render={(props) => <ProfessionalDetails1 {...props} edit={true} />} />
          <Route path={`${url}/edit-professional1`} render={(props) => <ProfessionalDetails2 {...props} edit={true} />} />
          
          {/********** Accident **********/}
          <Route path={`${url}/accident/plan`} component={AccidentPlanDetails} />
          <Route path={`${url}/accident/form`} component={AccidentForm} />
          <Route path={`${url}/accident/summary`} component={AccidentSummary} />
          <Route path={`${url}/accident/plan/success`} component={AccidentPlanSuccess} />
          <Route path={`${url}/accident/success`} component={AccidentPaymentSuccess} />
          <Route path={`${url}/accident/failed`} component={AccidentFailed} />
          <Route path={`${url}/accident/report`} component={Report} />
          <Route path={`${url}/accident/reportdetail`} component={ReportDetails} />

          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Insurance;
