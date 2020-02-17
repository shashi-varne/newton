import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import { storageService, inrFormatDecimal2 } from 'utils/validators';
import { gold_providers} from '../../constants';
class DeliveryOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openResponseDialog: false,
      disabled: false,
      disabledText: 'Make payment',
      params: qs.parse(props.history.location.search.slice(1)),
      provider: this.props.match.params.provider,
      showAddress: false,
      redeemProduct:storageService().getObject('deliveryData') || {}
    }
  }

  componentWillMount() {
    console.log(this.state.redeemProduct);
    nativeCallback({ action: 'take_control_reset' });

    this.setState({
      providerData: gold_providers[this.state.provider]
    })

    if (!this.state.redeemProduct) {
      this.navigate('/gold/delivery-products');
    }
  }

  async componentDidMount() {

    var options = {
      "product_code": this.state.redeemProduct.id,
      "addressId": this.state.redeemProduct.address.id

    }

    try {
      const res = await Api.post('/api/gold/user/redeem/verify/' + this.state.provider, options);
      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.message === 'success') {
        this.setState({
          show_loader: false
        })
        let redeem_body = res.pfwresponse.result || {};
        let redeemProduct = redeem_body.product_details;
        redeemProduct.address = redeem_body.delivery_address;
        this.setState({
          redeemProduct: redeemProduct,
          disabled: false
        })

      } else {
        
        let disabledText = res.pfwresponse.result.message || res.pfwresponse.result.error || 'Insufficient Balance';
        this.setState({
          show_loader: false,
          disabled: true,
          disabledText: disabledText
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong', 'error');
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
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Delivery Order Summary'
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

    if(!this.state.redeemProduct.payment_link) {
      return;
    }
    this.setState({
      show_loader: true
    })

    let nativeRedirectUrl = window.location.origin +
      '/gold/' + this.state.provider + '/gold-delivery-order' + getConfig().searchParams;

    // nativeCallback({
    //   action: 'take_control', message: {
    //     back_url: nativeRedirectUrl,
    //     back_text: 'Are you sure you want to exit the payment process?'
    //   }
    // });

    let paymentRedirectUrl = encodeURIComponent(
      window.location.origin + '/gold/' + this.state.provider  + '/delivery/payment' + getConfig().searchParams
    );

    var pgLink = this.state.redeemProduct.payment_link;
    // eslint-disable-next-line
    pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl + '&back_url=' + encodeURIComponent(nativeRedirectUrl) + '&order_type=delivery';
    if (getConfig().generic_callback) {
      pgLink += '&generic_callback=' + getConfig().generic_callback;
    }
    window.location = pgLink;
  }

  showHideAddress() {
    this.setState({
      showAddress: !this.state.showAddress
    })
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Summary"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle={this.state.disabledText}
        disable={this.state.disabled}
        events={this.sendEvents('just_set_events')}
      >

      <div className="gold-delivery-order">
        <div style={{ margin: '30px 0 30px 0' }} className="highlight-text highlight-color-info">
        <div  style={{textAlign: 'right', fontSize:10, color: getConfig().primary}}>{this.state.providerData.karat}</div>
          <div className="highlight-text1">
            <img className="highlight-text11" style={{width: 34}} 
            src={this.state.redeemProduct.media.images[0]} alt="info" />
            <div className="highlight-text12" style={{display:'grid'}}>
              <div>{this.state.redeemProduct.description}</div>
            </div>
          </div>
        </div>

        <div className="top-info">
          <div className="top-info-tile">
            <div className="top-info-tile1">Gold coin weight</div>
            <div className="top-info-tile1">{this.state.redeemProduct.metal_weight} gms</div>
          </div>

          <div className="top-info-tile" style={{background: '#F8F8F8',paddingLeft: 8}}>
            <div className="top-info-tile1">- Gold in locker ({this.state.providerData.title})</div>
            <div className="top-info-tile1">- {this.state.redeemProduct.metal_weight} gms</div>
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
                {inrFormatDecimal2(this.state.redeemProduct.delivery_minting_cost)}
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

            <div className="content-points">
                <div className="content-points-inside-text">
                GST
                </div>
                <div className="content-points-inside-text">
                ₹50
                </div>
            </div>

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
                  ₹200.00
                </div>
            </div>
        </div>

        <div className="shipping-address" onClick={() => this.showHideAddress()}>
            <div className="top-tile">
              <div className="top-title">
                Shipping address
              </div>
              <div className="top-icon">
                <img src={ require(`assets/${this.state.showAddress ? 'minus_icon' : 'plus_icon'}.svg`)} alt="Gold" />
              </div>
            </div>


           {this.state.showAddress &&
            <div className='address'>
              <div className="content">
                {this.state.redeemProduct.address.name}
              </div>
              <div className="content">
              {this.state.redeemProduct.address.addressline1}, {this.state.redeemProduct.address.addressline2}, 
              , {this.state.redeemProduct.address.city}
              </div>
              <div className="content">
                {this.state.redeemProduct.address.state} - {this.state.redeemProduct.address.pincode}
              </div>
              <div className="content">
                Mobile: {this.state.redeemProduct.address.mobile_number}
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
