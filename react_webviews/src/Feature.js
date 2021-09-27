import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

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
import HelpSupport from './help_support_v2';
import CommonLanding from './common/components/landing';
import Withdraw from './withdraw';
import Report from './reports';

// import CommonRenderFaqs from './common/components/RenderFaqs';

import Fhc from './fhc';
import Loan from './loan_idfc';
import Payment from './payment';
import KycEsign from './kyc_esign';
import PortfolioRebalancing from './portfolio_rebalancing';
import FundDetails from './fund_details';
import Whatsapp from './whatsapp';
import Landing from './dashboard';
import ProtectedRoute from './common/components/ProtectedRoute';
import FeedBack from './feedback';
import Partner from "./partner"
import TaxFiling from './tax_filing'

import Kyc from './kyc';
import 'common/theme/Style.scss';

const Feature = () => {
  // old # route support added
  // start
  const history = useHistory();
  if (window.location.hash.startsWith('#!/')) {
    history.push(window.location.hash.replace('#!', ''))
  }
  // end

  return (
    <Switch>
      <ProtectedRoute path='/insurance' component={Insurance} />
      <ProtectedRoute path='/group-insurance' component={GroupInsurance} />
      <ProtectedRoute path='/referral' component={Referral} />
      <ProtectedRoute path={['/gold','/direct/gold']} component={Gold} />
      <ProtectedRoute path='/fhc' component={Fhc} />
      <ProtectedRoute path='/mandate' component={Mandate} />
      <ProtectedRoute path='/mandate-otm' component={Mandate_OTM} />
      <ProtectedRoute path='/e-mandate' component={EMandate} />
      <ProtectedRoute path='/risk' component={RiskProfiler} />
      <ProtectedRoute path='/hni/' component={HNI} />
      <ProtectedRoute path='/isip' component={IsipBIller} />
      <ProtectedRoute path='/help' component={HelpSupport} />
      <ProtectedRoute path='/loan' component={Loan} />
      <ProtectedRoute path='/pg' component={Payment} />
      <ProtectedRoute path='/kyc-esign' component={KycEsign} />
      <ProtectedRoute path='/whatsapp/' component={Whatsapp} />
      <ProtectedRoute path='/webview/:main_module/:sub_module' component={CommonLanding} />
      <ProtectedRoute path='/webview/:main_module' component={CommonLanding} />
      {/* <ProtectedRoute path="/common/render-faqs" component={CommonRenderFaqs} /> */}
      <ProtectedRoute path='/portfolio-rebalancing' component={PortfolioRebalancing} />
      <ProtectedRoute path='/fund-details' component={FundDetails} />
      <ProtectedRoute path='/feedback' component={FeedBack} />
      <ProtectedRoute path='/partner' component={Partner} />
      <ProtectedRoute path='/tax-filing' component={TaxFiling} />
      <ProtectedRoute path='/withdraw' component={Withdraw} />
      <ProtectedRoute path='/reports' component={Report} />
      <ProtectedRoute path='/kyc' component={Kyc} />
      <ProtectedRoute path='/' component={Landing} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Feature;
