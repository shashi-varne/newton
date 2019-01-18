import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import one_gm_front from 'assets/1gm_front.png';
import two_gm_front from 'assets/2gm_front.png';
import five_gm_front from 'assets/5gm_front.png';
import five_gmbar_front from 'assets/5gmbar_front.png';
import ten_gm_front from 'assets/10gm_front.png';
import ten_gmbar_front from 'assets/10gmbar_front.png';
import twenty_gmbar_front from 'assets/20gmbar_front.png';
import { ToastContainer } from 'react-toastify';
import toast from '../../ui/Toast';

class DeliveryOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      redeemProduct: {},
      openResponseDialog: false,
      disabled: false,
      product: {},
      address: {},
      redeemProduct: {
        product_details: [],
        delivery_address: []
      },
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }
    this.onload = this.onload.bind(this);
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
        toast('Please verify your mobile number to proceed')
        this.navigate('gold-delivery-address');
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

    const res = await Api.post('/api/gold/user/redeem/verify', options);
    if (res.pfwresponse.status_code == 200 && res.pfwresponse.result.message == 'success') {
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
        show_loader: false, openResponseDialog: true,
        apiError: res.pfwresponse.result.error || res.pfwresponse.result.message,
        disabled: true,
        redeemProduct: redeemProduct
      });
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleClick = async () => {
    this.setState({
      show_loader: true
    })

    let paymentRedirectUrl = encodeURIComponent(
      window.location.protocol + '//' + window.location.host + '/gold/delivery/payment'
    );

    var pgLink = this.state.redeemProduct.payment_link;
    pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl;
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
    };

    return (
      <img alt="Gold" className="delivery-icon" src={prod_image_map[this.state.product.id]} width="150" />
    );
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Gold Delivery Order"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="order-tile">
          <div className="order-heading">
            <div className="order-tile-head">
              Delivery Order Summary
            </div>
          </div>
          <div className="delivery-order-logo">
            {this.productImgMap()}
          </div>
          <div className="order-tile2">
            <span className="order-tile-total1">Total payble amount</span>
            <span className="float-right order-tile-total1">{this.state.redeemProduct.mint_delivery_price}</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Estimated Dispatch Period</span>
            <span className="float-right order-tile-total1">{this.state.redeemProduct.estimated_dispatch_period}</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Estimated Delivery Period</span>
            <span className="float-right order-tile-other-text">{this.state.redeemProduct.product_details.estimated_days_for_dispatch}</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Product </span>
            <span className="float-right order-tile-other-text">{this.state.redeemProduct.product_details.description}</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Address</span>
            <span className="float-right order-tile-other-text">{this.state.redeemProduct.delivery_address.addressline}</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Pincode</span>
            <span className="float-right order-tile-other-text">{this.state.redeemProduct.delivery_address.pincode}</span>
          </div>
          {this.state.redeemProduct.delivery_address.landmark &&
            <div className="order-tile2">
              <span className="order-tile-other-text">Landmark</span>
              <span className="float-right order-tile-other-text">{this.state.redeemProduct.delivery_address.landmark}</span>
            </div>}
          <div className="order-tile2">
            <span className="order-tile-other-text">City</span>
            <span className="float-right order-tile-other-text">{this.state.redeemProduct.delivery_address.city}</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">{this.state.redeemProduct.delivery_address.state}</span>
            <span className="float-right order-tile-other-text">Karnataka</span>
          </div>
        </div>
        <ToastContainer autoClose={3000} />
      </Container>
    );
  }
}

export default DeliveryOrder;
