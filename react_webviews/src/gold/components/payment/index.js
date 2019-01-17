import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import safegold_logo from 'assets/safegold_logo_60x60.png';
import error from 'assets/error.png';
import thumpsup from 'assets/thumpsup.png';
import arrow from 'assets/arrow.png';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }
  }

  componentWillMount() {
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

  componentDidMount() {
    this.setState({
      show_loader: false,
    });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleClick = async () => {
    this.navigate('my-gold');
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
      >
        <div className="page home" id="goldSection">
          <div className="text-center goldheader">
            <div className="my-gold-header">
              <div className="FlexRow row1" >
                <img className="img-mygold" src={safegold_logo} />
                <span className="my-gold-title-header">Updated Gold Locker</span>
                <img className="img-mygold2" src={arrow} />
              </div>
              <div className="spacer-header"></div>
              <div className="my-gold-details-header1">
                <div className="my-gold-details-header2">
                  <div className="my-gold-details-header2a">Weight</div>
                  <div className="my-gold-details-header2b">3.3266 gm</div>
                </div>
                <div className="my-gold-details-header3">
                  <div className="my-gold-details-header2a">Selling Value</div>
                  <div className="my-gold-details-header2b">₹ 10,325.64</div>
                </div>
              </div>
            </div>
          </div>
          <div className="invest-success container-padding" id="goldPayment">
            <div className="success-card">
              <div className="icon">
                <img src={thumpsup} width="80" />
              </div>
              <h3>Payment Successful</h3>
              <h3>Successful</h3>
              <h3>Order Successful</h3>

              <p> 2.134 grams gold has been purchased and the invoice has been sent to your registered email id.</p>
              <p> 2.134 grams gold has been sold and the invoice has been sent to your registered email id.</p>
              <p>Your delivery order for 'PRODUCTDISC' has been placed successfully</p>
            </div>
            <div className="invoice">
              <a>Download Invoice</a>
            </div>
            <div className="invoice">
              <a>Track Now</a>
            </div>
            <div className="invest-error success-card">
              <div className="icon">
                <img src={error} width="80" />
              </div>
              <h3>Payment Failed</h3>
              <p>
                Oops! Your buy order for 2.134 grams could not be placed.
                <br/>
                <br/>
                Sorry for the inconvenience.
              </p>
              <p>
                Oops! Your sell order for 2.134 grams could not be placed.
                <br/>
                <br/>
                Sorry for the inconvenience.
              </p>
              <p>
                Oops! Your delivery order for 'PRODUCTDISC' could not be placed.
                <br/>
                <br/>
                Sorry for the inconvenience.
              </p>
            </div>
            <div className="invest-error success-card">
              <div className="icon">
                <img src={error} width="80" height="80" />
              </div>
              <h3>Order Pending</h3>
              <p>
                Oops! Your buy order for 2.134 grams is in pending state. We will try placing
                the order again in the next 24 hrs. The amount will be refunded if the order
                doesn't go through
                <br/>
                <br/>
                Sorry for the inconvenience.
              </p>
              <p>
                Oops! Your sell order for 2.134 grams could not be placed. We will try placing
                the order again in the next 24 hrs. The amount will be refunded if the order
                doesn't go through
                <br/>
                <br/>
                Sorry for the inconvenience.
              </p>
              <p>
                Oops! Your delivery order for 'PRODUCTDISC' could not be placed. We will try placing
                the order again in the next 24 hrs. The amount will be refunded if the order
                doesn't go through
                <br/>
                <br/>
                Sorry for the inconvenience.
              </p>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Payment;
