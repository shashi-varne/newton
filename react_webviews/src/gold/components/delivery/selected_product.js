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

class DeliverySelectedProduct extends Component {
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
        title="Select Gold Product"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="delivery block">
          <div className="delivery-select-logo">
            {this.productImgMap()}
          </div>
          <div className="">
            <div>2gm SafeGold Gold Coin</div>
            <div style={{fontSize: '16px', color: 'black', marginTop: '5px'}}>Charges 390</div>
          </div>          
          <div className="seller-name">
            Seller : Digital Gold India Private Limited
          </div>
          <div className="instock">
            <span className="green">*(In Stock)</span>
            <span className="red">(Out of Stock)</span>
          </div>
        </div>

        <div className="delivery block">
          <div className="product-details-heading">
            Product Details
          </div>
          <div class="product-details-content">
            <div className="product-name">Model</div>
            <div className="product-value">: 21dd</div>
          </div>
          <div class="product-details-content">
            <div className="product-name">Metal Purity</div>
            <div className="product-value">: 21dd</div>
          </div>
          <div class="product-details-content">
            <div className="product-name">Packaging</div>
            <div className="product-value">: 21dd</div>
          </div>
          <div class="product-details-content">
            <div className="product-name">Weight</div>
            <div className="product-value">: 21dd</div>
          </div>
          <div class="product-details-content">
            <div className="product-name">Est. Arrival</div>
            <div className="product-value">: 21dd</div>
          </div>
          <div class="product-details-content">
            <div className="product-name">Refund Policy</div>
            <div className="product-value">: 21dd</div>
          </div>
        </div>

        <div className="delivery block">
          <div className="product-details-heading">
            Product Hightlight
          </div>
          <ul>
            <li>SafeGold coins are set in 24 Karat Yellow Gold</li>
            <li>Guaranteed weight and purity: Specially manufactured in state of the art facilities, independent assay certification  with zero negative tolerance for weight and purity</li>
            <li>Sealed in international quality packaging with a unique serial number, ensures foolproof quality and complete traceability for each coin</li>
          </ul>
          <div className="grey-color">
            *You can place your order for sell/delivery after 2 working day from your buying transaction date
          </div>
        </div>
      </Container>
    );
  }
}

export default DeliverySelectedProduct;
