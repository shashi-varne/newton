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
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import goldOfferImageFisdom from 'assets/gold_offer_fisdom.jpg';
import TextField from 'material-ui/TextField';
import DotDotLoader from '../../../common/ui/DotDotLoader';

class DeliverySelectedProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      product: {
        product_highlights: []
      },
      openResponseDialog: false,
      disabledText: 'Proceed to address selection',
      disabled: false,
      params: qs.parse(props.history.location.search.slice(1)),
      provider: this.props.match.params.provider,
      offerImageData: [],
      pincode: '',
      pincodeRightText: 'CHECK',
      pincodeLoading :false
    }
  }

  async componentDidMount() {

    let offerImageData = [
      {
        src: goldOfferImageFisdom,
        key: '5buy'
      },
      {
        src: goldOfferImageFisdom,
        key: '5buy'
      },
      {
        src: goldOfferImageFisdom,
        key: '5buy'
      }
    ];

    this.setState({
      offerImageData: offerImageData
    })

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
      this.navigate(this.state.provider + '/gold-delivery-address');
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
      <div className="product-de-points" key={index}>
        {index + 1}. {props}
      </div>
    )
  }

  renderOfferImages(props, index) {
    return (
      <div key={index}
        className="gold-offer-slider">
        <img className="gold-offer-slide-img"
          src={props.src} alt="Gold Offer" />
      </div>
    )
  }

  changePincode() {
    this.setState({
      pincode: '',
      pincode_error: '',
      pincodeRightText: 'CHECK',
      pincodeDisabled: false,
      pincode_helper: ''
    })
  }

  checkPincode = async () => {

    if(this.state.pincodeRightText === 'CHANGE') {
      this.changePincode();
      return;
    }

    let pincode = this.state.pincode;
    if (pincode && pincode.length === 6) {
      try {

        this.setState({
          pincodeLoading: true,
          pincode_helper: ''
        })
        const res = await Api.get('/api/pincode/' + pincode);
        this.setState({
          pincodeLoading: false
        })
        if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
          this.setState({
            city: res.pfwresponse.result[0].district_name || res.pfwresponse.result[0].taluk,
            state: res.pfwresponse.result[0].state_name,
            pincodeRightText: 'CHANGE',
            pincodeDisabled: true,
            pincode_helper: 'We deliver to this location'
          });
        } else {
          this.setState({
            city: '',
            state: '',
            pincode_error: 'Invalid Pincode',
            pincodeRightText: 'CHECK'
          });
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong', 'error');
      }
    } else {
      this.setState({
        pincode_error: 'Please enter valid 6 digit pincode'
      })
    }
  }

  handlePincode = async (event) => {
    const pincode = event.target.value;
    if (pincode.length > 6) {
      return;
    }
    this.setState({
      pincode: pincode,
      pincode_error: '',
      pincode_helper: ''
    });
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={this.state.product.description}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle={this.state.disabledText}
        disable={this.state.disabled}
        events={this.sendEvents('just_set_events')}
      >
        <div className="delivery-select-product">
          <div className="block1">
            <Carousel

              showStatus={false} showThumbs={false}
              showArrows={true}
              infiniteLoop={false}
              selectedItem={this.state.selectedIndex}
              onChange={(index) => {
                this.setState({
                  selectedIndex: index,
                  card_swipe: 'yes',
                  card_swipe_count: this.state.card_swipe_count + 1
                });
              }}
            >
              {this.state.offerImageData.map(this.renderOfferImages)}
            </Carousel>
          </div>


          <div className="block2">
            {/* <div className="delivery-select-logo">
              {this.productImgMap()}
            </div> */}
            <div className="mc">
              Making charges
            </div>
            <div className="">
              <div className="generic-page-title flex-center">
                {inrFormatDecimal(this.state.product.delivery_minting_cost)}
                <span className="all-tax"> Inclusive of all taxes</span>
              </div>
            </div>

            <div className="seller-name">
              Seller : {this.state.product.brand}
            </div>

            <div className="seller-name">
              Free shipping
            </div>

            <div className="seller-name">
              Return/replacement not allowed
            </div>

            <div className="seller-name">
              Cancellation not allowed
            </div>
          </div>

          <div className="block3">
            <div className="page-title">
              Delivering to
            </div>

              <div className="pincode-block InputField">
                <TextField
                  label="Enter Pin code"
                  type="text"
                  autoComplete="off"
                  name="pincode"
                  id="pincode"
                  error={this.state.pincode_error ? true: false}
                  helperText={this.state.pincode_helper || this.state.pincode_error}
                  onChange={(event) => this.handlePincode(event)}
                  value={this.state.pincode}
                  disabled={this.state.pincodeDisabled || this.state.pincodeLoading}
                />

                <label className="input-placeholder-right gold-placeholder-right"
                  onClick={() => this.checkPincode()}>
                    {!this.state.pincodeLoading && 
                      <span>
                        {this.state.pincodeRightText}
                      </span>
                    }

                    {this.state.pincodeLoading &&
                     <DotDotLoader style={{
                      textAlign: 'right'
                      }} />
                    }
                </label>
              </div>
          </div>

          <div className="block4">
            <div className="page-title">
              Product details
            </div>
            {this.state.product.product_highlights.map(this.renderProductHIghlights)}
          </div>
        </div>
      </Container>
    );
  }
}

export default DeliverySelectedProduct;
