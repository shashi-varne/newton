import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { getConfig, getBasePath } from 'utils/functions';
import { storageService, inrFormatDecimal2 } from 'utils/validators';
import { gold_providers } from '../../constants';
import {Imgc} from '../../../common/ui/Imgc';

class DeliveryOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skelton: true,
      openResponseDialog: false,
      disabled: false,
      disabledText: 'MAKE PAYMENT',
      params: qs.parse(props.history.location.search.slice(1)),
      provider: this.props.match.params.provider,
      showAddress: false,
      orderData: storageService().getObject('deliveryData') || {}
    }
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });

    this.setState({
      providerData: gold_providers[this.state.provider]
    })

    if (!this.state.orderData) {
      this.navigate('/gold/delivery-products');
    }
  }

  async componentDidMount() {

    var options = {
      "product_code": this.state.orderData.id,
      "addressId": this.state.orderData.address.id
    }

    let orderData = this.state.orderData;

    try {
      const res = await Api.post('/api/gold/user/redeem/verify/' + this.state.provider, options);
      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.message === 'success') {
        this.setState({
          skelton: false
        })
        let redeem_body = res.pfwresponse.result.redeem_body || {};
        orderData.transact_id = redeem_body.transact_id;

        storageService().setObject('deliveryData', orderData)
        this.setState({
          redeem_body: redeem_body,
          disabled: false
        })

      } else {

        let disabledText = res.pfwresponse.result.message || res.pfwresponse.result.error || 'Insufficient Balance';
        this.setState({
          skelton: false,
          disabled: true,
          disabledText: disabledText
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong');
      }
    } catch (err) {
      console.log(err);
      this.setState({
        skelton: false
      });
      toast('Something went wrong');
    }

  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'delivery_summary',
        'address_check': this.state.address_check ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {
    this.sendEvents('next');

    if (!this.state.redeem_body.payment_link) {
      return;
    }
    this.setState({
      show_loader: true
    })
    let basepath = getBasePath();

    let nativeRedirectUrl = basepath +
      '/gold/' + this.state.provider + '/gold-delivery-order' + getConfig().searchParams;

    let paymentRedirectUrl = encodeURIComponent(
      basepath + '/gold/' + this.state.provider + '/delivery/payment' + getConfig().searchParams
    );

    var pgLink = this.state.redeem_body.payment_link;
    // eslint-disable-next-line
    pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl + '&back_url=' + encodeURIComponent(nativeRedirectUrl) + '&order_type=delivery';
    if (getConfig().generic_callback) {
      pgLink += '&generic_callback=' + getConfig().generic_callback;
    }

    if (getConfig().app === 'ios') {
      nativeCallback({
        action: 'show_top_bar', message: {
          title: 'Payment'
        }
      });
    }

    if (!getConfig().isWebCode && !getConfig().is_secure) {
      nativeCallback({
        action: 'take_control', message: {
          back_url: nativeRedirectUrl,
          back_text: 'Are you sure you want to exit the payment process?'
        }
      });
    } else {
      nativeCallback({
        action: 'take_control', message: {
          back_url: nativeRedirectUrl,
          back_text: ''
        }
      });
    }

    window.location.href = pgLink;
  }

  showHideAddress() {
    this.setState({
      showAddress: !this.state.showAddress,
      address_check: true
    })
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title="Summary"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle={this.state.disabledText}
        disable={this.state.disabled}
        events={this.sendEvents('just_set_events')}
      >

        <div className="gold-delivery-order">
          <div style={{ margin: '30px 0 30px 0' }} className="highlight-text highlight-color-info">
            <div style={{ textAlign: 'right', fontSize: 10, color: getConfig().primary }}>{this.state.providerData.karat}</div>
            <div className="highlight-text1">
              <Imgc className="highlight-text11" style={{ width: 34,height:34 }}
                src={this.state.orderData.media.images[0]} alt="info" />
              <div className="highlight-text12" style={{ display: 'grid' }}>
                <div>{this.state.orderData.description}</div>
              </div>
            </div>
          </div>

          <div className="top-info">
            <div className="top-info-tile">
              <div className="top-info-tile1">Gold coin weight</div>
              <div className="top-info-tile1">{this.state.orderData.metal_weight} gms</div>
            </div>

            <div className="top-info-tile" style={{ background: '#F8F8F8' }}>
              <div className="top-info-tile1"> Gold locker ({this.state.providerData.title})</div>
              <div className="top-info-tile1">- {this.state.orderData.metal_weight} gms</div>
            </div>
          </div>

          <div className='dash-hr'></div>

          <div className="mid-title">
            Order summary
        </div>

          <div className="content">
            <div className="content-points">
              <div className="content-points-inside-text">
                Making charges
                </div>
              <div className="content-points-inside-text">
                {inrFormatDecimal2(this.state.orderData.delivery_minting_cost)}
              </div>
            </div>

            {/* <div className="content-points">
                <div className="content-points-inside-text">
                Gold buying charges
                  (0.125 gms) 
                </div>
                <div className="content-points-inside-text">
                + ₹500
                </div>
            </div> */}

            {/* <div className="content-points">
                <div className="content-points-inside-text">
                GST
                </div>
                <div className="content-points-inside-text">
                ₹50
                </div>
            </div> */}

            <div className="content-points">
              <div className="content-points-inside-text">
                Shipping charges
                </div>
              <div className="content-points-inside-text">
                Free
                </div>
            </div>
          </div>

          <div className="hr"></div>

          <div className="content2">
            <div className="content2-points">
              <div className="content2-points-inside-text">
                Total charges
                </div>
              <div className="content2-points-inside-text">
                {inrFormatDecimal2(this.state.orderData.delivery_minting_cost)}
              </div>
            </div>
          </div>

          <div className="shipping-address" onClick={() => this.showHideAddress()}>
            <div className="top-tile">
              <div className="top-title">
                Shipping address
              </div>
              <div className="top-icon">
                <img src={require(`assets/${this.state.showAddress ? 'minus_icon' : 'plus_icon'}.svg`)} alt="Gold" />
              </div>
            </div>


            {this.state.showAddress &&
              <div className='address'>
                <div className="content">
                  {this.state.orderData.address.name}
                </div>
                <div className="content">
                  {this.state.orderData.address.addressline1}, {this.state.orderData.address.addressline2}
                  , {this.state.orderData.address.city}
                </div>
                <div className="content">
                  {this.state.orderData.address.state} - {this.state.orderData.address.pincode}
                </div>
                <div className="content">
                  Mobile: {this.state.orderData.address.mobile_number}
                </div>
              </div>
            }
          </div>

        </div>
      </Container>
    );
  }
}

export default DeliveryOrder;
