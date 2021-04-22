import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NotFound from './common/components/NotFound';
import Insurance from './insurance';
import GroupInsurance from './group_insurance';
import Referral from './referral';
import Gold from './gold';
import Mandate from './mandate_address';
import Mandate_OTM from './mandate_otm';
import EMandate from './e_mandate';
import RiskProfiler from './risk_profiler';
import HNI from './external_portfolio';
import IsipBIller from './isip';
import HelpSupport from './help_support';
import CommonLanding from './common/components/landing';
// import CommonRenderFaqs from './common/components/RenderFaqs';

import Fhc from './fhc';
import WealthReport from './wealth_report';
import Loan from './loan_idfc';
import Payment from './payment';
import KycEsign from './kyc_esign';
import PortfolioRebalancing from './portfolio_rebalancing';
import FundDetails from './fund_details';
import Whatsapp from './whatsapp';
import FisdomPartnerRedirect from './fisdom_partner_redirect';
import Landing from './dashboard';

import Login from './login_and_registration/Login';
import Register from './login_and_registration/Register';
import Otp from './login_and_registration/Otp';
import ForgotPassword from './login_and_registration/ForgotPassword';
import Logout from './login_and_registration/Logout';
import Kyc from './kyc';
import NavBar from './desktopLayout/NavBar';
import Drawer from './desktopLayout/Drawer';
import 'common/theme/Style.scss';
import './style.scss';

import ProtectedRoute from './common/components/ProtectedRoute';
const Feature = () => {
  const [mobileView, setmobileView] = useState(false);

  const handleMobileView = () => {
    setmobileView(!mobileView);
  };
  return (
    <div className='main-container'>
      <NavBar handleMobileView={handleMobileView} />
      <Drawer mobileView={mobileView} handleMobileView={handleMobileView} />
      <div className="middle-content">


      <div className='feature-container'>
        <Switch>
          <Route path='/insurance' component={Insurance} />
          <Route path='/group-insurance' component={GroupInsurance} />
          <Route path='/referral' component={Referral} />
          <Route path='/gold' component={Gold} />
          <Route path='/fhc' component={Fhc} />
          <Route path='/mandate' component={Mandate} />
          <Route path='/mandate-otm' component={Mandate_OTM} />
          <Route path='/e-mandate' component={EMandate} />
          <Route path='/risk' component={RiskProfiler} />
          <Route path='/hni/' component={HNI} />
          <Route path='/isip' component={IsipBIller} />
          {/* outside the feature component */}
          <Route path='/w-report' component={WealthReport} />
          <Route path='/help' component={HelpSupport} />
          <Route path='/loan' component={Loan} />
          <Route path='/pg' component={Payment} />
          <Route path='/kyc-esign' component={KycEsign} />
          <Route path='/whatsapp/' component={Whatsapp} />
          <Route path='/webview/:main_module/:sub_module' component={CommonLanding} />
          <Route path='/webview/:main_module' component={CommonLanding} />
          {/* <Route path="/common/render-faqs" component={CommonRenderFaqs} /> */}
          <Route path='/portfolio-rebalancing' component={PortfolioRebalancing} />
          <Route path='/fund-details' component={FundDetails} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/mobile/verify' component={Otp} />
          <Route path='/forgot-password' component={ForgotPassword} />
          <Route path='/logout' component={Logout} />
          <Route path='/partner-landing' component={FisdomPartnerRedirect} />
          <ProtectedRoute path='/kyc' component={Kyc} />
          <ProtectedRoute path='/' component={Landing} />
          <Route component={NotFound} />
        </Switch>
      </div>
        <div className='right-content'>
          <h1>I am the right side</h1>
        </div>
      </div>
    </div>
  );
};

export default Feature;
