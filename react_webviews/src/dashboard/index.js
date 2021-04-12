import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "../common/theme/Style.scss";

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

import MyAccount from "./components/my_account";
import Notification from "./components/notification";
import PaymentCallback from "./invest/components/PaymentCallback";
import SipPaymentCallback from "./invest/components/SipPaymentCallback";
import PageCallback from "./invest/components/PageCallback";
import PaymentOptions from "./invest/components/PaymentOptions";
import DigilockerCallback from "../kyc/digilocker/digilockercallback";
import AccountMerge from "./account-merge";
import AccountMergeOtp from "./account-merge/otp";
import AccountLinked from "./account-merge/linked";

const Invest = (props) => {
  const { url } = props.match;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${url}`} component={Landing} />
        <Route path={`${url}invest`} component={Landing} />
        <Route path={`${url}landing`} component={Landing} />
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

        <Route path={`${url}my-account`} component={MyAccount} />
        <Route path={`${url}notification`} component={Notification} />

        <Route
          path={`${url}payment/callback/:status/:message`}
          component={PaymentCallback}
        />
        <Route
          path={`${url}sip/payment/callback/:status/:message`}
          component={SipPaymentCallback}
        />
        <Route path={`${url}payment/options`} component={PaymentOptions} />
        <Route
          path={[
            `${url}page/callback/:investment_type/:investment_amount`,
            `${url}page/callback/:investment_type/:investment_amount/:status`,
            `${url}page/callback/:investment_type/:investment_amount/:status/:message`,
          ]}
          component={PageCallback}
        />
        <Route
          exact
          path={`${url}digilocker/callback`}
          component={DigilockerCallback}
        />
        <Route exact path={`${url}account/merge/:pan_number`} component={AccountMerge} />
        <Route exact path={`${url}account/merge/otp/:pan_number`} component={AccountMergeOtp} />
        <Route exact path={`${url}account/merge/linked/success`} component={AccountLinked} />
        <Route component={NotFound} />
      </Switch>
    </Fragment>
  );
};

export default Invest;
