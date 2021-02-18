import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "../common/theme/Style.scss";
import { themeConfig } from "utils/constants";
import { ToastContainer } from "react-toastify";

import NotFound from "../common/components/NotFound";

import "./invest/Style.scss";
import Landing from "./invest";

import NfoInfo from "./invest/components/nfo";
import NfoScheme from "./invest/components/nfo/scheme";
import NfoFunds from "./invest/components/nfo/funds";
import NfoFundDetail from "./invest/components/nfo/FundDetail";
import NfoCheckout from "./invest/components/nfo/checkout";
import SipDates from "./invest/components/nfo/SipDates";
import InvestJourney from "./investJourney";
import DIY from "./diy";
import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";

/////////LOGIN AND REGISTRATION //////////////

import Login from './login_and_registration/login';
import Register from './login_and_registration/register';
import Otp from './login_and_registration/otp';
import ForgotPassword from './login_and_registration/forgot_password';

import MyAccount from './components/my_account';
import Notification from './components/notification';


////////////////////////////// KYC ///////////////////////////////

import Kyc from "./kyc";

import Home from "./kyc/home";

import Aadhar from "./kyc/aadhar";
import AadharConfirmation from "./kyc/aadhar/confirmation";
import AadharCallback from "./kyc/aadhar/callback";

import AddBank from "./kyc/bank/AddBank";
import AddBankVerify from "./kyc/bank/AddBankVerify";
import BanksList from "./kyc/bank/BanksList";
import BankDetails from "./kyc/bank/BankDetails";

import RegistrationSuccess from './kyc/success'

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: "f",
});
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// jss.options.insertionPoint = 'jss-insertion-point';

const theme = createMuiTheme(themeConfig);

const ScrollToTop = withRouter(
  class ScrollToTopWithoutRouter extends Component {
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0);
      }
    }

    render() {
      return null;
    }
  }
);

const Invest = (props) => {
  const { url } = props.match;
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route exact path={`${url}`} component={Landing} />
          <Route path={`${url}invest`} component={Landing} />
          <Route path={`${url}diy`} component={DIY} />
          <Route path={`${url}invest-journey`} component={InvestJourney} />
          <Route
            path={`${url}advanced-investing/new-fund-offers/info`}
            component={NfoInfo}
          />
          <Route
            path={`${url}advanced-investing/new-fund-offers/scheme`}
            component={NfoScheme}
          />
          <Route
            path={`${url}advanced-investing/new-fund-offers/:scheme/funds`}
            component={NfoFunds}
          />
          <Route
            path={`${url}advanced-investing/new-fund-offers/fund`}
            component={NfoFundDetail}
          />
          <Route
            path={`${url}advanced-investing/new-fund-offers/funds/checkout`}
            render={(props) => <NfoCheckout {...props} type="nfo" />}
          />
          <Route path={`${url}sipdates`} component={SipDates} />

        {/* LOGIN AND REGISTRATION */}

          <Route path={`${url}login`} component={Login} /> 
          <Route path={`${url}register`} component={Register} />
          <Route path={`${url}mobile/verify`} component={Otp} />
          <Route path={`${url}forgot-password`} component={ForgotPassword} />
          <Route path={`${url}my-account`} component={MyAccount} />
          <Route path={`${url}notification`} component={Notification} />

         {/* KYC ROUTING */}
          
          <Route path={`${url}kyc`} component={Kyc} />
          <Route exact path={`${url}home-kyc`} component={Home} />
          <Route exact path={`${url}aadhar`} component={Aadhar} />
          <Route exact path={`${url}aadhar/confirmation`} component={AadharConfirmation} />
          <Route exact path={`${url}aadhar/callback/:error`} component={AadharCallback} />
          <Route exact path={`${url}approved/banks/doc`} component={AddBank} />
          <Route exact path={`${url}approved/banks/verify/:bank_id`} component={AddBankVerify} />
          <Route exact path={`${url}add-bank`} component={BanksList} />
          <Route exact path={`${url}add-bank/details/:bank_id`} component={BankDetails} />                
          <Route exact path={`${url}registration/success`} component={RegistrationSuccess} />
          
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Invest;
