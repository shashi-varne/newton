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

class DeliveryOrder extends Component {
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
      <img alt="Gold" className="delivery-icon" src={prod_image_map[3]} width="150" />
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
            <span className="float-right order-tile-total1">10000</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Estimated Dispatch Period</span>
            <span className="float-right order-tile-total1">1 day</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Estimated Delivery Period</span>
            <span className="float-right order-tile-other-text">7-10 days</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Product </span>
            <span className="float-right order-tile-other-text">2gm Safegold Gold Coin</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Address</span>
            <span className="float-right order-tile-other-text">Your home</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Pincode</span>
            <span className="float-right order-tile-other-text">560012</span>
          </div>
          <div className="order-tile2" ng-if="redeemProduct.delivery_address.landmark">
            <span className="order-tile-other-text">Landmark</span>
            <span className="float-right order-tile-other-text">Next to your home</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">City</span>
            <span className="float-right order-tile-other-text">Bengaluru</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">State</span>
            <span className="float-right order-tile-other-text">Karnataka</span>
          </div>
        </div>
      </Container>
    );
  }
}

export default DeliveryOrder;
