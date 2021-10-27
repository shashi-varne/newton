import 'common/theme/Style.scss';
import React, { lazy, Suspense } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import ProtectedRoute from './common/components/ProtectedRoute';
import BootSkeleton from './common/components/BootSkeleton';

const NotFound = lazy(() => import(
  /*webpackChunkName: "NotFound"*/ './common/components/NotFound'
));
const Insurance = lazy(() => import(
  /*webpackChunkName: "Insurance"*/ './insurance'
));
const GroupInsurance = lazy(() => import(
  /*webpackChunkName: "GroupInsurance"*/ './group_insurance'
));
const Referral = lazy(() => import(
  /*webpackChunkName: "Referral"*/ './referral'
));
const Gold = lazy(() => import(
  /*webpackChunkName: "Gold"*/ './gold'
));
const Mandate = lazy(() => import(
  /*webpackChunkName: "Mandate"*/ './mandate_address'
));
const Mandate_OTM = lazy(() => import(
  /*webpackChunkName: "Mandate_OTM"*/ './mandate_otm'
));
const EMandate = lazy(() => import(
  /*webpackChunkName: "EMandate"*/ './e_mandate'
));
const RiskProfiler = lazy(() => import(
  /*webpackChunkName: "RiskProfiler"*/ './risk_profiler'
));
const HNI = lazy(() => import(
  /*webpackChunkName: "HNI"*/ './external_portfolio'
));
const IsipBIller = lazy(() => import(
  /*webpackChunkName: "IsipBiller"*/ './isip'
));
const HelpSupport = lazy(() => import(
  /*webpackChunkName: "HelpSupport"*/ './help_support_v2'
));
const CommonLanding = lazy(() => import(
  /*webpackChunkName: "CommonLanding"*/ './common/components/landing'
));
const Withdraw = lazy(() => import(
  /*webpackChunkName: "Withdraw"*/ './withdraw'
));
const Report = lazy(() => import(
  /*webpackChunkName: "Report"*/ './reports'
));

const Fhc = lazy(() => import(
  /*webpackChunkName: "Fhc"*/ './fhc'
));
const Loan = lazy(() => import(
  /*webpackChunkName: "Loan"*/ './loan_idfc'
));
const Payment = lazy(() => import(
  /*webpackChunkName: "Payment"*/ './payment'
));
const KycEsign = lazy(() => import(
  /*webpackChunkName: "KycEsign"*/ './kyc_esign'
));
const PortfolioRebalancing = lazy(() => import(
  /*webpackChunkName: "PortfolioRebalancing"*/ './portfolio_rebalancing'
));
const FundDetails = lazy(() => import(
  /*webpackChunkName: "FundDetails"*/ './fund_details'
));
const Whatsapp = lazy(() => import(
  /*webpackChunkName: "Whatsapp"*/ './whatsapp'
));
const Landing = lazy(() => import(
  /*webpackChunkName: "Landing"*/ './dashboard'
));
const FeedBack = lazy(() => import(
  /*webpackChunkName: "FeedBack"*/ './feedback'
));
const Partner = lazy(() => import(
  /*webpackChunkName: "Partner"*/ "./partner"
));
const TaxFiling = lazy(() => import(
  /*webpackChunkName: "TaxFiling"*/ './tax_filing'
));
const Kyc = lazy(() => import(
  /*webpackChunkName: "Kyc"*/ './kyc'
));
const AccountStatements = lazy(() => import(
  /*webpackChunkName: "AccountStatements"*/ './account_statements'
));
const EquityPayment = lazy(() => import(
  /*webpackChunkName: "EquityPayment"*/ './equity_payment'
));

const Feature = () => {
  // old # route support added
  // start
  const history = useHistory();
  if (window.location.hash.startsWith('#!/')) {
    history.push(window.location.hash.replace('#!', ''))
  }
  // end

  if (window.location.pathname === '/prepare') {
    return null;
  } else {
    return (
      <ErrorBoundary>
        <Suspense fallback={<BootSkeleton />}>
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
            <ProtectedRoute path='/portfolio-rebalancing' component={PortfolioRebalancing} />
            <ProtectedRoute path='/fund-details' component={FundDetails} />
            <ProtectedRoute path='/feedback' component={FeedBack} />
            <ProtectedRoute path='/tax-filing' component={TaxFiling} />
            <Route path='/pg/eq' component={EquityPayment} />
            <ProtectedRoute path='/partner' component={Partner} />
            <ProtectedRoute path='/statements' component={AccountStatements} />
            <ProtectedRoute path='/withdraw' component={Withdraw} />
            <ProtectedRoute path='/reports' component={Report} />
            <ProtectedRoute path='/kyc' component={Kyc} />
            <ProtectedRoute path='/' component={Landing} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </ErrorBoundary>
    );
  }
};

export default Feature;
