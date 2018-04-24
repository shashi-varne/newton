import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import PersonalDetails1 from './components/personal-details/screen1';
import PersonalDetails2 from './components/personal-details/screen2';
import ContactDetails1 from './components/contact-details/screen1';
import ContactDetails2 from './components/contact-details/screen2';
import NomineeDetails from './components/nominee-details/screen1';
import AppointeeDetails from './components/nominee-details/screen2';
import ProfessionalDetails1 from './components/professional-details/screen1';
import ProfessionalDetails2 from './components/professional-details/screen2';
import Summary from './components/insurance-summary/screen1';
import NotFound from './components/NotFound';

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
    MuiInputLabel: {
      root: {
        fontSize: '1rem',
        color: '#444'
      }
    }
  }
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ PersonalDetails1 } />
        <Route path="/personal-details" component={ PersonalDetails2 } />
        <Route path="/contact-details-1" component={ ContactDetails1 } />
        <Route path="/contact-details-2" component={ ContactDetails2 } />
        <Route path="/nominee-details" component={ NomineeDetails } />
        <Route path="/appointee-details" component={ AppointeeDetails } />
        <Route path="/professional-details" component={ ProfessionalDetails1 } />
        <Route path="/professional-details-2" component={ ProfessionalDetails2 } />
        <Route path="/summary" component={ Summary } />
        <Route component={ NotFound }/>
      </Switch>
    </BrowserRouter>
  </MuiThemeProvider>
);

export default App;
