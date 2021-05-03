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
import {getConfig} from 'utils/functions';

const Home = (props) => {
  const { url } = props.match;
  const isWeb = getConfig().Web;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${url}`} component={isWeb ? Invest : SdkLanding} />
        <Route path={`${url}invest`} component={Invest} />
        <Route path={`${url}landing`} component={Invest} />
        <Route path={`${url}diy`} component={DIY} />
        <Route path={`${url}invest-journey`} component={InvestJourney} />
        <Route path={`${url}nps`} component={NPS} />
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
        <Route exact path={`${url}account/merge/:pan_number`} component={AccountMerge} />
        <Route exact path={`${url}account/merge/otp/:pan_number`} component={AccountMergeOtp} />
        <Route exact path={`${url}account/merge/linked/success`} component={AccountLinked} />
        <Route component={NotFound} />
      </Switch>
    </Fragment>
  );
};

export default Home;
