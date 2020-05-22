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
import "./components/Style.css";
// import './products/term_insurance/Style.css';
import NotFound from '../common/components/NotFound';
import Landing from './home/landing';
import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';


/***********************TERM INSURANCE START   **************/
// import PersonalDetails1 from '../products/term_insurance/personal-details/screen1';
// import PersonalDetails2 from './products/term_insurance/personal-details/screen2';
import PersonalDetails1 from './components/personal-details/screen1';
import PersonalDetails2 from './components/personal-details/screen2';
import PersonalDetails3 from './components/personal-details/screen3';
import EarningDetails1 from './components/earning-details/screen1';
import LoanDetails1 from './components/loan-details/screen1';
import LoanDetails2 from './components/loan-details/screen2';
import LoanDetails3 from './components/loan-details/screen3';
import LoanDetails4 from './components/loan-details/screen4';
import LoanDetailsSummary from './components/loan-details/summary';
import PersonalComplete from './components/earning-details/success';
// import AdditionalInfo from './products/term_insurance/additional-info/hdfc';
// import Summary from './products/term_insurance/insurance-summary/screen1';
// import Journey from './products/term_insurance/insurance-summary/screen3';
// import Resume from './products/term_insurance/insurance-summary/screen2';

/***********************TERM INSURANCE END   **************/

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
          {/* <Route path={`${url}/fhc/resume`} component={Resume} /> */}
          <Route path={`${url}/personal1`} component={PersonalDetails1} />
          <Route path={`${url}/personal2`} component={PersonalDetails2} />
          <Route path={`${url}/personal3`} component={PersonalDetails3} />
          <Route path={`${url}/earnings1`} component={EarningDetails1} />
          <Route path={`${url}/personal-complete`} component={PersonalComplete} />
          <Route path={`${url}/loan1`} component={LoanDetails1} />
          <Route path={`${url}/loan2`} component={LoanDetails2} />
          <Route path={`${url}/loan3`} component={LoanDetails3} />
          <Route path={`${url}/loan4`} component={LoanDetails4} />
          <Route path={`${url}/loan-summary`} component={LoanDetailsSummary} />
          {/* <Route path={`${url}/fhc/additional-info`} component={AdditionalInfo} /> */}
          {/* <Route path={`${url}/fhc/summary`} component={Summary} /> */}
          {/* <Route path={`${url}/fhc/journey`} component={Journey} /> */}

          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Insurance;
