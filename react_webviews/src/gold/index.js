import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import "../common/theme/Style.css";
import "./common/Style.css";
import { themeConfig } from 'utils/constants';
import { ToastContainer } from 'react-toastify';

import "./components/Style.css";
import NotFound from "../common/components/NotFound";
import CheckHow1 from "./components/general/check_how1";
import CheckHow2 from "./components/general/check_how2";
import CheckHow3 from "./components/general/check_how3";
// import About from "./components/general/about";
import KnowMore from "./components/general/know_more";


import GoldSummary from "./components/mygold/gold_summary";
import GoldLanding from "./components/mygold/landing";
import GoldLocker from "./components/mygold/gold_locker";
import Transactions from "./components/transactions/index";
import Payment from "./components/payment/index";
import Otp from "./components/otp/index";



//buy
import GoldPanBuy from "./components/buy/pan";
import GoldRegister from "./components/buy/register";
import BuyOrder from "./components/buy/order";

//sell
import GoldPanSell from "./components/sell/pan";
import GoldBank from "./components/sell/bank";
import SellOrder from "./components/sell/order";
import SellVerifyBank from "./components/sell/verify_bank";
import SellAddEditBank from "./components/sell/add_edit_bank";
import SellSelectBank from "./components/sell/select_bank";


// delivery
import DeliveryAddress from "./components/delivery/address";
import DeliveryOrder from "./components/delivery/order";
import DeliverySelectedProduct from "./components/delivery/selected_product";
import SelectAddressDelivery from "./components/delivery/address_select";
import AddEditAddressDelivery from "./components/delivery/address_add_edit";




import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: "f"
});
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// jss.options.insertionPoint = 'jss-insertion-point';

const theme = createMuiTheme(themeConfig);

const ScrollToTop = withRouter(
  class ScrollToTopWithoutRouter extends Component {
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0);
      }
    }

    render() {
      return null;
    }
  }
);

const Gold = props => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>

          <Route exact path={`${url}`} component={GoldLanding} />

          {/* general */}
          <Route path={`${url}/landing`} component={GoldLanding} />
          <Route path={`${url}/about`} component={GoldSummary} />
          <Route path={`${url}/details`} component={KnowMore} />
          <Route path={`${url}/check-how1`} component={CheckHow1} />
          <Route path={`${url}/check-how2`} component={CheckHow2} />
          <Route path={`${url}/check-how3`} component={CheckHow3} />
          
          

           {/* common */}
           <Route path={`${url}/my-gold`} component={GoldSummary} />
          <Route path={`${url}/my-gold-locker`} component={GoldLocker} />
          <Route path={`${url}/gold-transactions`} component={Transactions} />
          <Route path={`${url}/:provider/:orderType/payment`} component={Payment} />
          <Route path={`${url}/verify`} component={Otp} />
          

          {/* buy */}
          <Route path={`${url}/:provider/gold-register`} component={GoldRegister} />
          <Route path={`${url}/:provider/buy-gold-order`} component={BuyOrder} />
          <Route path={`${url}/:provider/buy-pan`} component={GoldPanBuy} />

          {/* sell */}
          <Route path={`${url}/:provider/bank-details`} component={GoldBank} />
          <Route path={`${url}/:provider/sell-gold-order`} component={SellOrder} />
          <Route path={`${url}/:provider/sell-pan`} component={GoldPanSell} />
          <Route path={`${url}/:provider/sell-verify-bank`} component={SellVerifyBank} />
          <Route path={`${url}/:provider/sell-add-bank`} component={SellAddEditBank} />
          <Route path={`${url}/:provider/sell-edit-bank`} render={(props) => 
              <SellAddEditBank {...props} edit={true} />} />
          <Route path={`${url}/:provider/sell-select-bank`} component={SellSelectBank} />


          {/* delivery */}
          <Route path={`${url}/:provider/gold-delivery-address`}  component={DeliveryAddress} />
          <Route path={`${url}/:provider/gold-delivery-order`} component={DeliveryOrder} />
          <Route path={`${url}/:provider/select-gold-product`}  component={DeliverySelectedProduct} />

          <Route path={`${url}/:provider/select-address-delivery`} component={SelectAddressDelivery} />
          <Route path={`${url}/:provider/add-address-delivery`} component={AddEditAddressDelivery} />
          {/* Edit paths */}
          <Route path={`${url}/:provider/edit-address-delivery`} render={(props) => 
              <AddEditAddressDelivery {...props} edit={true} />} />
         
          <Route component={NotFound} />

        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Gold;
