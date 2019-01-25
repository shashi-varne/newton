import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import safegold_logo from 'assets/safegold_logo_60x60.png';
import error from 'assets/error.png';
import thumpsup from 'assets/thumpsup.png';
import arrow from 'assets/arrow.png';
import { ToastContainer } from 'react-toastify';
import toast from '../../ui/Toast';
import { inrFormatDecimal } from 'utils/validators';
// eslint-disable-next-line
import { nativeCallback } from 'utils/native_callback';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openResponseDialog: false,
      goldInfo: {},
      sellDetails: {},
      weight: "",
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }
    this.sendInvoiceEmail = this.sendInvoiceEmail.bind(this);
    this.trackDelivery = this.trackDelivery.bind(this);
  }

  componentWillMount() {
    // let { params } = this.props.location;
    nativeCallback({ action: 'take_control_reset' });
    let { status, orderType } = this.props.match.params;
    let weight, sellDetails, buyDetails, redeemProduct,
      productDisc, paymentError, paymentMessage, paymentPending, invoiceLink;
    if (orderType === 'sell') {
      let sellDetails = JSON.parse(window.localStorage.getItem('sellDetails'));
      weight = sellDetails.gold_weight;
      invoiceLink = sellDetails.invoice_link;
    } else if (orderType === 'buy') {
      buyDetails = JSON.parse(window.localStorage.getItem('buyData'));
      weight = buyDetails.gold_weight;
    } else if (orderType === 'delivery') {
      redeemProduct = JSON.parse(window.localStorage.getItem('redeemProduct'));
      productDisc = redeemProduct.product_details.description;
    }

    if (status === 'failed' || status === 'error') {
      paymentError = true;
    } else if (status === 'success') {
      paymentError = false;
      if (orderType === 'buy') {
        this.getInvoice(buyDetails.transact_id);
      }
    } else if (status === 'pending') {
      paymentPending = true;
    }
    this.setState({
      status: status,
      orderType: orderType,
      weight: weight,
      sellDetails: sellDetails,
      buyDetails: buyDetails,
      redeemProduct: redeemProduct,
      productDisc: productDisc,
      paymentError: paymentError,
      paymentMessage: paymentMessage,
      paymentPending: paymentPending,
      invoiceLink: invoiceLink
    })

    if (this.state.ismyway) {
      this.setState({
        type: 'myway'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime'
      });
    } else {
      this.setState({
        type: 'fisdom'
      });
    }
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/gold/user/account');
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        let isRegistered = true;
        if (result.gold_user_info.user_info.registration_status === "pending" ||
          !result.gold_user_info.user_info.registration_status ||
          result.gold_user_info.is_new_gold_user) {
          isRegistered = false;
        }
        this.setState({
          goldInfo: result.gold_user_info.safegold_info,
          userInfo: result.gold_user_info.user_info,
          maxWeight: parseFloat(((30 - result.gold_user_info.safegold_info.gold_balance) || 30).toFixed(4)),
          isRegistered: isRegistered
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }

      const res2 = await Api.get('/api/gold/sell/currentprice');
      if (res2.pfwresponse.status_code === 200) {
        let goldInfo = this.state.goldInfo;
        let result = res2.pfwresponse.result;
        goldInfo.sell_value = ((result.sell_info.plutus_rate) * (goldInfo.gold_balance || 0)).toFixed(2) || 0;
        this.setState({
          goldSellInfo: result.sell_info,
          goldInfo: goldInfo,
          show_loader: false,
        });

      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }

  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  trackDelivery() {
    window.localStorage.setItem('deliveryTransaction', 'delivery');
    this.navigate('/gold/gold-transactions')
    this.props.history.push({
      pathname: '/gold/gold-transactions',
      search: '?base_url=' + this.state.params.base_url,
      params: {
        isDelivery: true
      }
    });
  }

  async sendInvoiceEmail(path) {

    this.setState({
      show_loader: true,
    });

    try {
      const res = await Api.get('/api/gold/invoice/download/mail', { url: path });
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        if (result.message === 'success') {
          toast('Invoice has been sent succesfully to your registered email');
        } else {
          toast(result.message || result.error);
        }
        this.setState({
          show_loader: false,
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }
  }

  async getInvoice(txn_id) {

    this.setState({
      show_loader: true,
    });

    try {
      const res = await Api.get('/api/gold/user/getinvoice', { txn_id: txn_id });
      if (res.pfwresponse.status_code === 200) {
        this.setState({
          show_loader: false,
          invoiceLink: res.pfwresponse.result.invoice_link
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }
  }

  handleClick = () => {
    this.navigate('/gold/my-gold');
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Payment Summary"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
        noPadding={true}
      >
        <div className="page home" id="goldSection">
          <div className={`text-center goldheader  ${(this.state.type !== 'fisdom') ? 'blue' : ''}`}>
            <div className="my-gold-header" onClick={() => this.navigate('/gold/my-gold')}>
              <div className="FlexRow row1" >
                <img alt="Gold" className="img-mygold" src={safegold_logo} />
                <span className="my-gold-title-header">Updated Gold Locker</span>
                <img alt="Gold" className="img-mygold2" src={arrow} />
              </div>
              <div className="spacer-header"></div>
              <div className="my-gold-details-header1">
                <div className="my-gold-details-header2">
                  <div className="my-gold-details-header2a">Weight</div>
                  <div className="my-gold-details-header2b">{this.state.goldInfo.gold_balance} gm</div>
                </div>
                <div className="my-gold-details-header3">
                  <div className="my-gold-details-header2a">Selling Value</div>
                  <div className="my-gold-details-header2b">{inrFormatDecimal(this.state.goldInfo.sell_value)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="invest-success container-padding" id="goldPayment">
            {this.state.paymentError === false &&
              <div>
                <div className="success-card">
                  <div className="icon">
                    <img alt="Gold" src={thumpsup} width="80" />
                  </div>
                  {this.state.orderType === 'buy' && <h3>Payment Successful</h3>}
                  {this.state.orderType === 'sell' && <h3>Successful</h3>}
                  {this.state.orderType === 'delivery' && <h3>Order Successful</h3>}

                  {this.state.orderType === 'buy' && <p> {this.state.weight} grams gold has been purchased and the invoice has been sent to your registered email id.</p>}
                  {this.state.orderType === 'sell' && <p> {this.state.weight} grams gold has been sold and the invoice has been sent to your registered email id.</p>}
                  {this.state.orderType === 'delivery' && <p>Your delivery order for {this.state.productDisc} has been placed successfully</p>}
                  {this.state.orderType !== 'delivery' && <div className="invoice">
                    <a onClick={() => this.sendInvoiceEmail(this.state.invoiceLink)}>Download Invoice</a>
                  </div>}
                  {this.state.orderType === 'delivery' && <div className="invoice">
                    <a onClick={() => this.trackDelivery(this.state.invoiceLink)}>Track all Delivery Orders</a>
                  </div>}
                </div>
              </div>
            }
            {this.state.paymentError === true &&
              <div className="invest-error success-card">
                <div className="icon">
                  <img alt="Gold" src={error} width="80" />
                </div>
                <h3>Payment Failed</h3>
                {this.state.orderType === 'buy' && <p>
                  Oops! Your buy order for {this.state.weight} grams could not be placed.
                <br />
                  <br />
                  Sorry for the inconvenience.
                </p>}
                {this.state.orderType === 'sell' &&
                  <p>
                    Oops! Your sell order for {this.state.weight} grams could not be placed.
                <br />
                    <br />
                    Sorry for the inconvenience.
                  </p>}
                {this.state.orderType === 'delivery' &&
                  <p>
                    Oops! Your delivery order for {this.state.productDisc} could not be placed.
                <br />
                    <br />
                    Sorry for the inconvenience.
                </p>}
              </div>}
            {this.state.paymentPending === true &&
              <div className="invest-error success-card">
                <div className="icon">
                  <img alt="Gold" src={error} width="80" height="80" />
                </div>
                <h3>Order Pending</h3>
                {this.state.orderType === 'buy' &&
                  <p>
                    Oops! Your buy order for {this.state.weight} grams is in pending state. We will try placing
                    the order again in the next 24 hrs. The amount will be refunded if the order
                    doesn't go through
                <br />
                    <br />
                    Sorry for the inconvenience.
                </p>}
                {this.state.orderType === 'sell' &&
                  <p>
                    Oops! Your sell order for {this.state.weight} grams could not be placed. We will try placing
                    the order again in the next 24 hrs. The amount will be refunded if the order
                    doesn't go through
                <br />
                    <br />
                    Sorry for the inconvenience.
                </p>}
                {this.state.orderType === 'delivery' &&
                  <p>
                    Oops! Your delivery order for {this.state.productDisc} could not be placed. We will try placing
                    the order again in the next 24 hrs. The amount will be refunded if the order
                    doesn't go through
                <br />
                    <br />
                    Sorry for the inconvenience.
                </p>}
              </div>}
          </div>
        </div>
        <ToastContainer autoClose={3000} />
      </Container>
    );
  }
}

export default Payment;
