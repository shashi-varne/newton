import React, { Fragment } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import '../common/theme/Style.scss';
import './common/Style.css';

import NotFound from '../common/components/NotFound';
import Details from './components/details';
import Earnings from './components/earnings';
import Terms from './components/terms';
import GiveIndiaRefferal from './components/giveindia'

const Referral = (props) => {
  const { url } = props.match;

  return (
    <Fragment>
        <Switch>
          <Route exact path={`${url}`} component={Details} />
          <Route path={`${url}/earnings`} component={Earnings} />
          <Route path={`${url}/terms`} component={Terms} />
          <Route path={`${url}/giveindia`} component={GiveIndiaRefferal} />
          <Route component={NotFound} />
        </Switch>
   </Fragment>
  );
};

export default Referral;
