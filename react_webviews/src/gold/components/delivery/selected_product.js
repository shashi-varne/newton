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
import { inrFormatDecimal } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class DeliverySelectedProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      product: {
        product_highlights: []
      },
      openResponseDialog: false,
      disabledText: 'Continue',
      disabled: false,
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  async componentDidMount() {

    if (window.localStorage.getItem('goldProduct')) {
      let product = JSON.parse(window.localStorage.getItem('goldProduct'));
      if (product.in_stock === 'N') {
        this.setState({
          disabled: true,
          disabledText: 'Out of Stock'
        })
      }
      this.setState({
        product: product
      })
    } else {
      this.navigate('my-gold-locker');
      return;
    }

    try {
      const res = await Api.get('/api/gold/user/sell/balance');

      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        let maxWeight = result.sellable_gold_balance || 0;
        let product = this.state.product;
        let disabledText;
        if (parseFloat(product.metal_weight) > maxWeight) {
          disabledText = 'Minimum ' + (parseFloat(product.metal_weight)).toFixed(2) + ' GM gold required';
          this.setState({
            disabled: true,
            disabledText: disabledText
          });
        }
        this.setState({
          show_loader: false,
          maxWeight: maxWeight
        });
      } else {
        this.setState({
          disabled: true,
          disabledText: 'Insufficient Gold Balance'
        });
        // toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
        //   'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }

    this.setState({
      show_loader: false
    });
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
        "screen_name": 'Select Gold Product',
        'product_name': this.state.product.description,
        'in_stock': this.state.product.in_stock
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
    if (this.state.disabled) {
      return;
    }
    if (parseFloat(this.state.product.metal_weight) <= this.state.maxWeight) {
      this.navigate('gold-delivery-address');
    } else {
      toast("Insufficient Gold Balance", 'error');
    }
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

  renderProductHIghlights(props, index) {
    return (
      <li key={index}>{props}</li>
    )
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Select Gold Product"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle={this.state.disabledText}
        disable={this.state.disabled}
        events={this.sendEvents('just_set_events')}
      >
        <div className="delivery block">
          <div className="delivery-select-logo">
            {this.productImgMap()}
          </div>
          <div className="">
            <div>{this.state.product.description}</div>
            <div style={{ fontSize: '16px', color: 'black', marginTop: '5px' }}>Charges : {inrFormatDecimal(this.state.product.delivery_minting_cost)}</div>
          </div>
          <div className="seller-name">
            Seller : {this.state.product.brand}
          </div>
          <div className="instock">
            {this.state.product.in_stock === 'Y' && <span className="green">*(In Stock)</span>}
            {this.state.product.in_stock === 'N' && <span className="red">(Out of Stock)</span>}
          </div>
        </div>

        <div className="delivery block">
          <div className="product-details-heading">
            Product Details
          </div>
          <div className="product-details-content">
            <div className="product-name">Model</div>
            <div className="product-value">: {this.state.product.sku_number}</div>
          </div>
          <div className="product-details-content">
            <div className="product-name">Metal Purity</div>
            <div className="product-value">: {this.state.product.metal_stamp}</div>
          </div>
          <div className="product-details-content">
            <div className="product-name">Packaging</div>
            <div className="product-value">: {this.state.product.packaging}</div>
          </div>
          <div className="product-details-content">
            <div className="product-name">Weight</div>
            <div className="product-value">: {this.state.product.metal_weight} gm</div>
          </div>
          <div className="product-details-content">
            <div className="product-name">Est. Arrival</div>
            <div className="product-value">: {this.state.product.estimated_days_for_dispatch}</div>
          </div>
          <div className="product-details-content">
            <div className="product-name">Refund Policy</div>
            <div className="product-value">: {this.state.product.refund_policy}</div>
          </div>
        </div>

        <div className="delivery block">
          <div className="product-details-heading">
            Product Hightlight
          </div>
          <ul>
            {this.state.product.product_highlights.map(this.renderProductHIghlights)}
          </ul>
          {/* <div className="grey-color">
            *You can place your order for sell/delivery after 2 working day from your buying transaction date
          </div> */}
        </div>
      </Container>
    );
  }
}

export default DeliverySelectedProduct;
