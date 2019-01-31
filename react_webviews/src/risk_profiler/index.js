import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import './common/Style.css';
import NotFound from '../NotFound';
import QuestionScreen1 from './components/questions/screen1';
import QuestionScreen2 from './components/questions/screen2';
import QuestionScreen3 from './components/questions/screen3';
import QuestionScreen4 from './components/questions/screen4';
import QuestionScreen5 from './components/questions/screen5';
import Recommendation from './components/recommendation/index';
import Result from './components/result/index';
import Intro from './components/intro/index';

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


let search = window.location.search;
const isPrime = window.location.search.indexOf("mypro.fisdom.com") >= 0;
const ismyway = window.location.search.indexOf("api.mywaywealth.com") >= 0
let productType = 'fisdom';
if (ismyway) {
  productType = 'myway';
} else if (isPrime) {
  productType = 'Fisdom Prime';
}

let mainColor = '#4f2da7';
if (productType !== 'fisdom') {
  mainColor = '#3792fc';
}

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: mainColor,
      // dark: will be calculated from palette.primary.main,
      contrastText: '#ffffff',
    },
    secondary: {
      // light: '#0066ff',
      main: '#3792fc',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffffff',
    },
    default: {
      // light: '#0066ff',
      main: '#4a4a4a',
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
        fontSize: '14px',
        color: '#4a4a4a',
        fontWeight: 'normal'
      },
      shrink: {
        transform: 'translate(0, 1.5px) scale(0.85)'
      }
    },
    MuiButton: {
      raisedSecondary: {
        '&:hover': {
          backgroundColor: '#35cb5d'
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

const RiskProfiler = (props) => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <Switch>
          <Route exact path={`${url}`} component={Intro} />
          <Route path={`${url}/intro`} component={Intro} />
          <Route path={`${url}/question1`} component={QuestionScreen1} />
          <Route path={`${url}/question2`} component={QuestionScreen2} />
          <Route path={`${url}/question3`} component={QuestionScreen3} />
          <Route path={`${url}/question4`} component={QuestionScreen4} />
          <Route path={`${url}/question5`} component={QuestionScreen5} />
          <Route path={`${url}/recommendation`} component={Recommendation} />
          <Route path={`${url}/result`} component={Result} />
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default RiskProfiler;
