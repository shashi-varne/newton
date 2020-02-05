import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import point_five_gm from 'assets/05gmImage.png';
import one_gm_front from 'assets/1gm_front.png';
import two_gm_front from 'assets/2gm_front.png';
import five_gm_front from 'assets/5gm_front.png';
import five_gmbar_front from 'assets/5gmbar_front.png';
import ten_gm_front from 'assets/10gm_front.png';
import ten_gmbar_front from 'assets/10gmbar_front.png';
import twenty_gmbar_front from 'assets/20gmbar_front.png';
import toast from '../../../common/ui/Toast';
// import { inrFormatDecimal } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import safegold_logo from 'assets/safegold_logo_60x60.png';

class DeliveryOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openResponseDialog: false,
      disabled: false,
      disabledText: 'Make payment',
      product: {},
      address: {},
      redeemProduct: {
        product_details: [],
        delivery_address: []
      },
      params: qs.parse(props.history.location.search.slice(1)),
      provider: this.props.match.params.provider,
      showAddress: false
    }
    this.onload = this.onload.bind(this);
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
  }

  componentDidMount() {

    if (window.localStorage.getItem('goldProduct')) {
      let product = JSON.parse(window.localStorage.getItem('goldProduct'));
      let address = product.address;
      this.setState({
        product: product,
        address: address
      })
      if (product.isFisdomVerified) {
        this.onload(product, address);
      } else {
        toast('Please verify your mobile number to proceed', 'error')
        this.navigate(this.state.provider + '/gold-delivery-address');
      }
    } else {
      this.navigate('my-gold-locker');
    }
  }

  async onload(product, address) {

    var options = {
      "pincode": address.pincode,
      "addressline": address.addressline,
      "landmark": address.landmark,
      "city": address.city,
      "product_code": product.id,
      "state": address.state

    }

    try {
      const res = await Api.post('/api/gold/user/redeem/verify', options);
      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.message === 'success') {
        this.setState({
          show_loader: false
        })
        let result = res.pfwresponse.result;
        let redeemProduct = result.redeem_body;
        window.localStorage.setItem('redeemProduct', JSON.stringify(redeemProduct));
        this.setState({
          redeemProduct: redeemProduct,
          disabled: false
        })

      } else {
        let product = this.state.product;
        let redeemProduct = this.state.redeemProduct;
        let disabledText = res.pfwresponse.result.message || res.pfwresponse.result.error || 'Insufficient Balance';
        redeemProduct.delivery_address = product.address;
        redeemProduct.product_details = product
        this.setState({
          show_loader: false,
          disabled: true,
          redeemProduct: redeemProduct,
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

  productImgMap = () => {
    const prod_image_map = {
      2: one_gm_front,
      3: two_gm_front,
      1: five_gm_front,
      14: five_gmbar_front,
      8: ten_gm_front,
      12: ten_gmbar_front,
      15: twenty_gmbar_front,
      16: point_five_gm
    };

    return (
      <img alt="Gold" className="delivery-icon" src={prod_image_map[this.state.product.id]} width="150" />
    );
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
          <div  style={{textAlign: 'right', fontSize:10, color: getConfig().primary}}>24K 99.99%</div>
          <div className="highlight-text1">
            <img className="highlight-text11" style={{width: 34}} src={safegold_logo} alt="info" />
            <div className="highlight-text12" style={{display:'grid'}}>
              <div>0.5 gm lotus round coin</div>
            </div>
          </div>
        </div>

        <div className="top-info">
          <div className="top-info-tile">
            <div className="top-info-tile1">Gold coin weight</div>
            <div className="top-info-tile1">0.5 gms</div>
          </div>

          <div className="top-info-tile" style={{background: '#F8F8F8'}}>
            <div className="top-info-tile1">Gold in locker (MMTC)</div>
            <div className="top-info-tile1">- 0.500 gms</div>
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
                ₹295
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
                {!this.state.showAddress && <span>+</span>}
                {this.state.showAddress && <span>-</span>}
              </div>
            </div>


           {this.state.showAddress &&
            <div className='address'>
              <div className="content">
                Uttam Paswan
              </div>
              <div className="content">
                126-G 1st floor, 1st main, 3rd cross, ST Bed 4th Block Koramangala, 
                Bengaluru, Karnataka - 560034
              </div>
              <div className="content">
                Mobile: 8800927468
              </div>
            </div>
          }
        </div>


          {/* <div className="order-tile">
            <div className="order-heading">
              <div className="order-tile-head">
                Delivery Order Summary
              </div>
            </div>
            <div className="delivery-order-logo">
              {this.productImgMap()}
            </div>
            <div className="order-tile2">
              <span className="order-tile-total1-delivery">Total payble amount</span>
              <span className="float-right order-tile-total1-delivery"> &nbsp;&nbsp;{inrFormatDecimal(this.state.redeemProduct.mint_delivery_price)}</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text-delivery">Estimated Dispatch Period</span>
              <span className="float-right order-tile-other-text-delivery">{this.state.redeemProduct.estimated_dispatch_period}</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text-delivery">Estimated Delivery Period</span>
              <span className="float-right order-tile-other-text-delivery">{this.state.redeemProduct.product_details.estimated_days_for_dispatch}</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text-delivery">Product </span>
              <span className="float-right order-tile-other-text-delivery">{this.state.redeemProduct.product_details.description}</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text-delivery">Address</span>
              <span className="float-right order-tile-other-text-delivery">{this.state.redeemProduct.delivery_address.addressline}</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text-delivery">Pincode</span>
              <span className="float-right order-tile-other-text-delivery">{this.state.redeemProduct.delivery_address.pincode}</span>
            </div>
            {this.state.redeemProduct.delivery_address.landmark &&
              <div className="order-tile2">
                <span className="order-tile-other-text-delivery">Landmark</span>
                <span className="float-right order-tile-other-text-delivery">{this.state.redeemProduct.delivery_address.landmark}</span>
              </div>}
            <div className="order-tile2">
              <span className="order-tile-other-text-delivery">City</span>
              <span className="float-right order-tile-other-text-delivery">{this.state.redeemProduct.delivery_address.city}</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text-delivery">{this.state.redeemProduct.delivery_address.state}</span>
              <span className="float-right order-tile-other-text-delivery">Karnataka</span>
            </div>
          </div> */}
        </div>
      </Container>
    );
  }
}

export default DeliveryOrder;
