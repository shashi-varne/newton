import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import './common/Style.css';
import NotFound from '../NotFound';
import PersonalDetails1 from './components/personal-details/screen1';
import PersonalDetails2 from './components/personal-details/screen2';
import ContactDetails1 from './components/contact-details/screen1';
import ContactDetails2 from './components/contact-details/screen2';
import NomineeDetails from './components/nominee-details/screen1';
import AppointeeDetails from './components/nominee-details/screen2';
import ProfessionalDetails1 from './components/professional-details/screen1';
import ProfessionalDetails2 from './components/professional-details/screen2';
import Summary from './components/insurance-summary/screen1';
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
      main: '#4f2da7',
      // dark: will be calculated from palette.primary.main,
      contrastText: '#ffffff',
    },
    secondary: {
      // light: '#0066ff',
      main: '#1bda4e',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffffff',
    },
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
        color: '#444',
        fontWeight: 'normal'
      },
      shrink: {
        transform: 'translate(0, 1.5px) scale(0.85)'
      }
    },
    MuiButton: {
      raisedSecondary: {
        '&:hover': {
          backgroundColor: '#1bda4e'
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
          <Route exact path={`${url}`} component={ PersonalDetails1 } />
          <Route path={`${url}/resume`} component={ Resume } />
          <Route path={`${url}/personal`} component={ PersonalDetails2 } />
          <Route path={`${url}/contact`} component={ ContactDetails1 } />
          <Route path={`${url}/contact1`} component={ ContactDetails2 } />
          <Route path={`${url}/nominee`} component={ NomineeDetails } />
          <Route path={`${url}/appointee`} component={ AppointeeDetails } />
          <Route path={`${url}/professional`} component={ ProfessionalDetails1 } />
          <Route path={`${url}/summary`} component={ Summary } />
          {/* Edit paths */}
          <Route path={`${url}/edit-personal`} render={ (props) => <PersonalDetails1 {...props} edit={true} /> } />
          <Route path={`${url}/edit-personal1`} render={ (props) => <PersonalDetails2 {...props} edit={true} /> } />
          <Route path={`${url}/edit-contact`} render={ (props) => <ContactDetails1 {...props} edit={true} /> } />
          <Route path={`${url}/edit-contact1`} render={ (props) => <ContactDetails2 {...props} edit={true} /> } />
          <Route path={`${url}/edit-nominee`} render={ (props) => <NomineeDetails {...props} edit={true} /> } />
          <Route path={`${url}/edit-appointee`} render={ (props) => <AppointeeDetails {...props} edit={true} /> } />
          <Route path={`${url}/edit-professional`} render={ (props) => <ProfessionalDetails1 {...props} edit={true} /> } />
          <Route component={ NotFound } />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Insurance;
