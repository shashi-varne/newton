import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import './common/Style.css';
import NotFound from '../NotFound';
import About from './components/general/about';
import KnowMore from './components/general/know_more';
import GoldSummary from './components/mygold/gold_summary';
import GoldLocker from './components/mygold/gold_locker';
import Transactions from './components/transactions/index';
import GoldRegister from './components/buy/register';
import BuyOrder from './components/buy/order';
import GoldBank from './components/sell/bank';
import SellOrder from './components/sell/order';
import DeliveryAddress from './components/delivery/address';
import DeliveryOrder from './components/delivery/order';
import DeliverySelectedProduct from './components/delivery/selected_product';
import Payment from './components/payment/index';
import Otp from './components/otp/index';

import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'f',
});
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// jss.options.insertionPoint = 'jss-insertion-point';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#4f2da7',
      // dark: will be calculated from palette.primary.main,
      contrastText: '#ffffff',
    },
    secondary: {
      // light: '#0066ff',
      main: '#35cb5d',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffffff',
    },
    // error: will us the default color
  },
  overrides: {
    MuiFormControl: {
      root: {
        width: '100%'
      }
    },
    MuiInput: {
      input: {
        padding: '11px 0 7px',
        fontSize: '14px'
      }
    },
    MuiInputLabel: {
      root: {
        fontSize: '0.9rem',
        color: '#a2a2a2',
        fontWeight: 'normal'
      },
      shrink: {
        transform: 'translate(0, 1.5px) scale(0.85)'
      }
    },
    MuiButton: {
      raisedSecondary: {
        '&:hover': {
          backgroundColor: '#35cb5d'
        }
      }
    },
    MuiIconButton: {
      root: {
        height: '56px'
      }
    }
  }
});

const ScrollToTop = withRouter(
  class ScrollToTopWithoutRouter extends Component {
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0)
      }
    }

    render() {
      return null;
    }
  }
);

const Gold = (props) => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <Switch>
          <Route exact path={`${url}`} component={About} />
          <Route path={`${url}/about`} component={About} />
          <Route path={`${url}/details`} component={KnowMore} />
          <Route path={`${url}/my-gold`} component={GoldSummary} />
          <Route path={`${url}/my-gold-locker`} component={GoldLocker} />
          <Route path={`${url}/gold-transactions`} component={Transactions} />

          <Route path={`${url}/gold-register`} component={GoldRegister} />
          <Route path={`${url}/buy-gold-order`} component={BuyOrder} />
          <Route path={`${url}/bank-details`} component={GoldBank} />
          <Route path={`${url}/sell-gold-order`} component={SellOrder} />
          <Route path={`${url}/gold-delivery-address`} component={DeliveryAddress} />
          <Route path={`${url}/gold-delivery-order`} component={DeliveryOrder} />
          <Route path={`${url}/select-gold-product`} component={DeliverySelectedProduct} />
          <Route path={`${url}/:orderType/payment/:status`} component={Payment} />
          <Route path={`${url}/verify`} component={Otp} />

          {/* Edit paths */}
          {/* <Route path={`${url}/edit-personal`} render={(props) => <PersonalDetails1 {...props} edit={true} />} /> */}
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Gold;
