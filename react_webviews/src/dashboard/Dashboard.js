import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "../common/theme/Style.scss";

import NotFound from "../common/components/NotFound";
import Invest from "./Invest";
import NfoInfo from "./Invest/components/NFO";
import NfoScheme from "./Invest/components/NFO/Scheme";
import NfoFunds from "./Invest/components/NFO/Funds";
import NfoFundDetail from "./Invest/components/NFO/FundDetail";
import NfoCheckout from "./Invest/components/Checkout/Checkout";
import SipDates from "./SipDates/SipDates";
import InvestJourney from "./InvestJourney";
import DIY from "./DIY";

import MyAccount from "./MyAccount";
import Notification from "./Notification";
import PaymentCallback from "./Invest/components/PaymentCallback";
import SipPaymentCallback from "./Invest/components/SipPaymentCallback";
import PageCallback from "./Invest/components/PageCallback";
import PaymentOptions from "./Invest/components/PaymentOptions";
import DigilockerCallback from "../kyc/Digilocker/DigilockerCallback";
import AccountMerge from "./AccountMerge";
import AccountMergeOtp from "./AccountMerge/Otp";
import AccountLinked from "./AccountMerge/Linked";
import SdkLanding from './Invest/components/SdkLanding';
import NPS from "./nps";
import PassiveIndexFunds from "./PassiveIndexFunds"
import {getConfig} from 'utils/functions';
import BlankMandateUpload from "./MyAccount/BlankMandateUpload";
import InvestmentProof from "./MyAccount/InvestmentProof";
import Refer from "./Invest/components/SdkLanding/Refer";
import CampaignCallback from "./Invest/components/PageCallback/CampaignCallback";
import SecuritySettings from "./MyAccount/2fa/SecuritySettings";
import ForgotPin from "./MyAccount/2fa/ForgotPin";
import VerifyPin from "./MyAccount/2fa/VerifyPin";
import SetPin from "./MyAccount/2fa/SetPin";
import EnterNewPin from "./MyAccount/2fa/EnterNewPin";
import ConfirmNewPin from "./MyAccount/2fa/ConfirmNewPin";
import VerifyPinOtp from "./MyAccount/2fa/VerifyForgotOtp";
import Referral from "../login_and_registration/pages/Referral/Referral.js";
import SecondaryVerification from "../login_and_registration/pages/SecondaryVerification/SecondaryVerification"
import SecondaryOtpVerification from "../login_and_registration/pages/SecondaryVerification/SecondaryOtpVerification"
import StatusCallback from "../kyc/Native/StatusCallback";
import ProductMarketTypes from './ProductMarketTypes';

const Home = (props) => {
  const config = getConfig(); 
  const { url } = props.match;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${url}secondary-verification`} component={SecondaryVerification} />
        <Route exact path={`${url}secondary-otp-verification`} component={SecondaryOtpVerification} />
        <Route path={`${url}referral-code`} component={Referral} />
        <Route
          exact
          path={`${url}`}
          component={
            config.isSdk && config.code !== "moneycontrol" ? SdkLanding : Invest
          }
        />
        <Route exact path={`${url}refer`} component={Refer} />
        <Route path={`${url}invest`} component={Invest} />
        <Route path={`${url}landing`} component={Invest} />
        <Route path={`${url}mf`} component={SdkLanding} />
        <Route path={`${url}diy`} component={DIY} />
        <Route path={`${url}invest-journey`} component={InvestJourney} />
        <Route path={`${url}nps`} component={NPS} />
        <Route path={`${url}passive-index-funds`} component={PassiveIndexFunds} />
        <Route path={`${url}product-types`} component={ProductMarketTypes} />
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
          path={[`${url}advanced-investing/new-fund-offers/fund`,'/direct/new-fund-offers/:isin']}
          component={NfoFundDetail}
        />
        <Route
          path={`${url}advanced-investing/new-fund-offers/funds/checkout`}
          render={(props) => <NfoCheckout {...props} type="nfo" />}
        />
        <Route path={`${url}sipdates`} component={SipDates} />

        <Route path={`${url}my-account`} component={MyAccount} />
        <Route path={`${url}notification`} component={Notification} />

        <Route
          exact
          path={`${url}payment/callback/:status`}
          component={PaymentCallback}
        />
        <Route
          exact
          path={`${url}payment/callback/:status/:message`}
          component={PaymentCallback}
        />
        <Route
          exact
          path={`${url}sip/payment/callback/:status`}
          component={SipPaymentCallback}
        />
        <Route
          exact
          path={`${url}sip/payment/callback/:status/:message`}
          component={SipPaymentCallback}
        />
        <Route path={`${url}payment/options`} component={PaymentOptions} />
        <Route
          exact
          path={`${url}sdk/page/callback`}
          render={(props) => <PageCallback {...props} type="sdk" />} 
        />
        <Route
          exact
          path={`${url}page/callback/:investment_type/:investment_amount`}
          component={PageCallback}
        />
        <Route
          exact
          path={`${url}page/callback/:investment_type/:investment_amount/:status`}
          component={PageCallback}
        />
        <Route
          exact
          path={`${url}page/callback/:investment_type/:investment_amount/:status/:message`}
          component={PageCallback}
        />
        <Route
          exact
          path={`${url}digilocker/callback`}
          component={DigilockerCallback}
        />
        <Route
          exact
          path={`${url}status/callback/native`}
          component={StatusCallback}
        />
        {/* -----------My Account sub-routes ------------- */}
        <Route exact path={`${url}account/merge/:pan_number`} component={AccountMerge} />
        <Route exact path={`${url}account/merge/otp/:pan_number`} component={AccountMergeOtp} />
        <Route exact path={`${url}account/merge/linked/success`} component={AccountLinked} />
        <Route exact path={`${url}account/security-settings`} component={SecuritySettings} />
        <Route exact path={`${url}account/forgot-pin`} component={ForgotPin} />
        <Route exact path={`${url}account/reset-pin-verify`} component={VerifyPin} />
        <Route exact path={`${url}account/new-pin`} component={EnterNewPin} />
        <Route exact path={`${url}account/verify-otp`} component={VerifyPinOtp} />
        <Route path={`${url}account/set-pin/:coming_from?`} component={SetPin} />
        <Route path={`${url}account/confirm-pin/:coming_from?`} component={ConfirmNewPin} />
        {/* ------------------------------------------- */}

        <Route exact path={`${url}blank-mandate/upload`} component={BlankMandateUpload} />
        <Route 
          exact
          path={`${url}investment-proof`} 
          render={(props) => <InvestmentProof {...props} type="investment-proof" />} 
        />
        <Route 
          exact
          path={`${url}capital-gain`} 
          render={(props) => <InvestmentProof {...props} type="capital-gain" />} 
        />
        <Route exact path={`${url}page/invest/campaign/callback`} component={CampaignCallback} />
        <Route component={NotFound} />
      </Switch>
    </Fragment>
  );
};

export default Home;
