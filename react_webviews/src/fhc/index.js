import React, { Fragment } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import '../common/theme/Style.scss';

import './common/Style.css';
import "./components/Style.scss";
import NotFound from '../common/components/NotFound';
import Landing from './home/landing';


import PersonalDetails1 from './components/personal-details/screen1';
import PersonalDetails2 from './components/personal-details/screen2';
import PersonalDetails3 from './components/personal-details/screen3';
import PersonalDetails4 from './components/personal-details/screen4';
import PersonalComplete from './components/personal-details/success';
import LoanDetails1 from './components/loan-details/screen1';
import LoanDetails2 from './components/loan-details/screen2';
import LoanDetails3 from './components/loan-details/screen3';
import LoanDetails4 from './components/loan-details/screen4';
import LoanDetailsSummary from './components/loan-details/summary';
import InsuranceDetails1 from './components/insurance-details/screen1';
import InsuranceDetails2 from './components/insurance-details/screen2';
import InsuranceSummary from './components/insurance-details/summary';
import InvestmentDetails2 from './components/investment-details/screen2';
import InvestmentDetails1 from './components/investment-details/screen1';
import InvestmentDetails3 from './components/investment-details/screen3';
import InvestmentDetails4 from './components/investment-details/screen4';
import InvestSuccess from './components/investment-details/success';
import Report from './components/result/report';



const Insurance = (props) => {
  const { url } = props.match;

  return (
      <Fragment>
        <Switch>
          <Route exact path={`${url}`} component={Landing} />
          <Route path={`${url}/landing`} component={Landing} />
          {/* Personal Details */}
          <Route path={`${url}/personal1`} component={PersonalDetails1} />
          <Route path={`${url}/personal2`} component={PersonalDetails2} />
          <Route path={`${url}/personal3`} component={PersonalDetails3} />
          <Route path={`${url}/personal4`} component={PersonalDetails4} />
          <Route path={`${url}/personal-complete`} component={PersonalComplete} />
          {/* Loan Details */}
          <Route path={`${url}/loan1`} component={LoanDetails1} />
          <Route path={`${url}/loan2`} component={LoanDetails2} />
          <Route path={`${url}/loan3`} component={LoanDetails3} />
          <Route path={`${url}/loan4`} component={LoanDetails4} />
          <Route path={`${url}/loan-summary`} component={LoanDetailsSummary} />
          <Route path={`${url}/edit-loan1`} render={(props) => <LoanDetails1 {...props} edit={true} />}/>
          <Route path={`${url}/edit-loan3`} render={(props) => <LoanDetails3 {...props} edit={true} />}/>
          <Route path={`${url}/edit-loan4`} render={(props) => <LoanDetails4 {...props} edit={true} />}/>
          {/* Insurance Details */}
          <Route path={`${url}/insurance1`} component={InsuranceDetails1} />
          <Route path={`${url}/insurance2`} component={InsuranceDetails2} />
          <Route path={`${url}/insurance-summary`} component={InsuranceSummary} />
          <Route path={`${url}/edit-insurance1`} render={(props) => <InsuranceDetails1 {...props} edit={true} />}/>
          <Route path={`${url}/edit-insurance2`} render={(props) => <InsuranceDetails2 {...props} edit={true} />}/>
          {/* Investment Details */}
          <Route path={`${url}/investment1`} component={InvestmentDetails1} />
          <Route path={`${url}/investment2`} component={InvestmentDetails2} />
          <Route path={`${url}/investment3`} component={InvestmentDetails3} />
          <Route path={`${url}/investment4`} component={InvestmentDetails4} />
          <Route path={`${url}/invest-complete`} component={InvestSuccess} />
          {/* Final Report */}
          <Route path={`${url}/final-report`} component={Report} />
          {/* Catch-all */}
          <Route component={NotFound} />
        </Switch>
      </Fragment>
  );
};

export default Insurance;
