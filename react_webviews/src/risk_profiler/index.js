import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import '../common/theme/Style.scss';
import './components/Style.css';
import { themeConfig } from 'utils/constants';
import { ToastContainer } from 'react-toastify';

import './common/Style.css';
import NotFound from '../common/components/NotFound';
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

const RiskProfiler = (props) => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route exact path={`${url}`} component={Intro} />
          <Route path={`${url}/intro`} component={Intro} />
          <Route path={`${url}/question1`} component={QuestionScreen1} />
          <Route path={`${url}/question2`} component={QuestionScreen2} />
          <Route path={`${url}/question3`} component={QuestionScreen3} />
          <Route path={`${url}/question4`} component={QuestionScreen4} />
          <Route path={`${url}/question5`} component={QuestionScreen5} />
          <Route path={`${url}/recommendation`} component={Recommendation} />
          <Route path={`${url}/result/v1`} component={Result} />
          <Route path={`${url}/result`} component={Result} />
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default RiskProfiler;
