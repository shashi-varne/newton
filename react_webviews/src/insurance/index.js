import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import '../common/theme/Style.css';
import { getConfig } from 'utils/functions';

import './common/Style.css';
import './components/Style.css';
import NotFound from '../common/components/NotFound';
import PersonalDetails1 from './components/personal-details/screen1';
import PersonalDetails2 from './components/personal-details/screen2';
import ContactDetails1 from './components/contact-details/screen1';
import ContactDetails2 from './components/contact-details/screen2';
import NomineeDetails from './components/nominee-details/screen1';
import AppointeeDetails from './components/nominee-details/screen2';
import ProfessionalDetails1 from './components/professional-details/screen1';
import ProfessionalDetails2 from './components/professional-details/screen2';
import AdditionalInfo from './components/additional-info/hdfc';
import Summary from './components/insurance-summary/screen1';
import Journey from './components/insurance-summary/screen3';
import Payment from './components/payment/index';
import Pincode from './components/pincode/screen1';
import Resume from './components/insurance-summary/screen2';

import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

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

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <Switch>
          <Route exact path={`${url}`} component={Journey} />
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
          <Route path={`${url}/payment/:insurance_id/:status`} component={Payment} />
          <Route path={`${url}/Pincode`} component={Pincode} />
          {/* Edit paths */}
          <Route path={`${url}/edit-personal`} render={(props) => <PersonalDetails1 {...props} edit={true} />} />
          <Route path={`${url}/edit-personal1`} render={(props) => <PersonalDetails2 {...props} edit={true} />} />
          <Route path={`${url}/edit-contact`} render={(props) => <ContactDetails1 {...props} edit={true} />} />
          <Route path={`${url}/edit-contact1`} render={(props) => <ContactDetails2 {...props} edit={true} />} />
          <Route path={`${url}/edit-nominee`} render={(props) => <NomineeDetails {...props} edit={true} />} />
          <Route path={`${url}/edit-appointee`} render={(props) => <AppointeeDetails {...props} edit={true} />} />
          <Route path={`${url}/edit-professional`} render={(props) => <ProfessionalDetails1 {...props} edit={true} />} />
          <Route path={`${url}/edit-professional1`} render={(props) => <ProfessionalDetails2 {...props} edit={true} />} />
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Insurance;
