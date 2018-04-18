import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import PersonalDetails1 from './components/personal-details/screen1';
import PersonalDetails2 from './components/personal-details/screen2';
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
        <Route component={ NotFound }/>
      </Switch>
    </BrowserRouter>
  </MuiThemeProvider>
);

export default App;
