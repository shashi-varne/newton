import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
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
        fontSize: '1rem',
        color: '#444',
        fontWeight: 'normal'
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

const App = () => (
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>
      <div>
        <ScrollToTop />
        <Switch>
          <Route exact path="/" component={ PersonalDetails1 } />
          <Route path="/resume" component={ Summary } />
          <Route path="/personal" component={ PersonalDetails2 } />
          <Route path="/contact" component={ ContactDetails1 } />
          <Route path="/contact1" component={ ContactDetails2 } />
          <Route path="/nominee" component={ NomineeDetails } />
          <Route path="/appointee" component={ AppointeeDetails } />
          <Route path="/professional" component={ ProfessionalDetails1 } />
          <Route path="/professional1" component={ ProfessionalDetails2 } />
          <Route path="/summary" component={ Summary } />
          {/* Edit paths */}
          <Route path="/edit-personal" render={(props) => <PersonalDetails1 {...props} edit={true} /> } />
          <Route path="/edit-personal1" render={(props) => <PersonalDetails2 {...props} edit={true} /> } />
          <Route path="/edit-contact" render={(props) => <ContactDetails1 {...props} edit={true} /> } />
          <Route path="/edit-contact1" render={(props) => <ContactDetails2 {...props} edit={true} /> } />
          <Route path="/edit-nominee" render={(props) => <NomineeDetails {...props} edit={true} /> } />
          <Route path="/edit-appointee" render={(props) => <AppointeeDetails {...props} edit={true} /> } />
          <Route path="/edit-professional" render={(props) => <ProfessionalDetails1 {...props} edit={true} /> } />
          <Route path="/edit-professional1" render={(props) => <ProfessionalDetails2 {...props} edit={true} /> } />
          <Route component={ NotFound }/>
        </Switch>
      </div>
    </BrowserRouter>
  </MuiThemeProvider>
);

export default App;
