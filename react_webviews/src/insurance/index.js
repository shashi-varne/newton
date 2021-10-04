import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import '../common/theme/Style.scss';
// import { getConfig } from 'utils/functions';

import './common/Style.css';
import './components/Style.css';
// import NotFound from '../common/components/NotFound';

import AppUpdateInfo from './components/app_update.js';

const Insurance = (props) => {
  const { url } = props.match;

  return (
    <Switch>
      <Route exact path={`${url}`} component={AppUpdateInfo} />
      <Route component={AppUpdateInfo} />
    </Switch>
  );
};

export default Insurance;
