import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { inrFormatDecimal, storageService } from 'utils/validators';
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
      product:storageService().getObject('deliveryData') || {},
      openResponseDialog: false,
      disabledText: 'Proceed to address selection',
      disabled: true,
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

    console.log(this.state.product);
    if (!this.state.product) {
      this.navigate('/gold/delivery-products');
      return;
    }

    try {
      const res = await Api.get('/api/gold/user/sell/balance/'  + this.state.provider);

      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        let maxWeight = result.sellable_gold_balance || 0;
        let product = this.state.product;
        let disabledText = this.state.disabledText;
        let disabled = this.state.disabled;
        if (parseFloat(product.metal_weight) > maxWeight) {
          disabledText = 'Minimum ' + (parseFloat(product.metal_weight)).toFixed(2) + ' GM gold required';
          disabled = true;
        } else {
          disabled = false;
        }
        this.setState({
          show_loader: false,
          maxWeight: maxWeight,
          disabled:disabled,
          disabledText: disabledText
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

  sendEvents(user_action, data={}) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'gold_coin',
        'check_pincode': data.check_pincode  ? data.check_pincode : ''
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
      this.navigate('delivery-select-address');
    } else {
      toast("Insufficient Gold Balance", 'error');
    }
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
        <img className="gold-offer-slide-img" style={{height:381}}
          src={props} alt="Gold Offer" />
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
    this.sendEvents('next', {check_pincode: pincode});
    if (pincode && pincode.length === 6) {
      try {

        this.setState({
          pincodeLoading: true,
          pincode_helper: ''
        })
        const res = await Api.get('/api/gold/check/pincode_support/' + this.state.provider + '?pincode=' + pincode);
        this.setState({
          pincodeLoading: false
        })
        if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.message  === 'success') {
          this.setState({
            pincodeRightText: 'CHANGE',
            pincodeDisabled: true,
            pincode_helper: 'We deliver to this location'
          });
        } else {
          this.setState({
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
              {this.state.product.media.images.map(this.renderOfferImages)}
            </Carousel>
          </div>


          <div className="block2">
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

         {this.state.product.product_highlights && <div className="block4">
            <div className="page-title">
              Product details
            </div>
            {this.state.product.product_highlights.map(this.renderProductHIghlights)}
          </div>}
        </div>
      </Container>
    );
  }
}

export default DeliverySelectedProduct;
