import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import FundDetails from './components/FundDetails';
import { themeConfig } from 'utils/constants';
import { Fragment } from 'react';

const theme = createMuiTheme(themeConfig);

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'f',
});

const jss = create(jssPreset());

const FundInfo = (props) => {
  const { url } = props.match;
  return (
        <Fragment>
        <Switch>
          <Route path={url} exact component={FundDetails} />
        </Switch>
        </Fragment>
  );
};

export default FundInfo;
