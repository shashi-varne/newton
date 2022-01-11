import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import "./components/Style.scss";
import "./mini-components/Style.scss";

// Component Paths
import EmailEntry from './components/email_entry';
import EmailNotReceived from './components/email_not_received';
import EmailExampleView from './components/email_example_view';
import FundHoldings from './components/fund_holdings';
import ExternalPortfolio from './components/external_portfolio';
import Settings from './components/settings';
import PANSelector from './components/select_PAN';
import Redirect from './components/redirect';
import StatementRequest from './components/StatementRequest';

function external_portfolio(props) {
  const { url } = props.match;
  return (
     <Fragment>
        <Switch>
          <Route path={`${url}/email_entry`} component={EmailEntry} />
          <Route path={`${url}/statement_request/:email?`} component={StatementRequest} />
          <Route path={`${url}/email_not_received`} component={EmailNotReceived} />
          <Route path={`${url}/email_example_view`} component={EmailExampleView} />
          <Route path={`${url}/external_portfolio`} component={ExternalPortfolio} />
          <Route path={`${url}/settings`} component={Settings} />
          <Route path={`${url}/select_pan`} component={PANSelector} />
          <Route path={`${url}/fund_holdings`} component={FundHoldings} />
          <Route path={`${url}/redirect`} component={Redirect} />
        </Switch>
     </Fragment>
 
  );
}

export default external_portfolio;