import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import '../common/theme/Style.css';
import './common/Style.css';
import NotFound from '../common/components/NotFound';
import Listing from './components/listing';
import Category from './components/category';
import Question from './components/question';
import Answer from './components/answer';
import Writetous from './components/writetous';
import { themeConfig } from 'utils/constants';
import { ToastContainer } from 'react-toastify';

import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import Thankyou from './components/thankyou';

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

const HelpSupport = (props) => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route exact path={`${url}`} component={Listing} />
          <Route path={`${url}/category`} component={Category} />
          <Route path={`${url}/questions`} component={Question} />
          <Route path={`${url}/answer`} component={Answer} />
          <Route path={`${url}/writetous`} component={Writetous} />
          <Route path={`${url}/thankyou`} component={Thankyou} />
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default HelpSupport;
