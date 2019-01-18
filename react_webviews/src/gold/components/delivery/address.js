import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import Input from '../../ui/Input';
import { validateNumber, validateStreetName, validateLength, validateMinChar, validateConsecutiveChar, validateEmpty } from 'utils/validators';
import { options } from 'sw-toolbox';

class DeliveryAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      address: '',
      address_error: '',
      landmark: '',
      landmark_error: '',
      pincode: '',
      pincode_error: '',
      city: '',
      state: '',
    }
    this.verifyMobile = this.verifyMobile.bind(this);
  }

  componentWillMount() {
    let product = {};
    if (window.localStorage.getItem('goldProduct')) {
      product = JSON.parse(window.localStorage.getItem('goldProduct'));
      console.log(product);
    } else {
      this.navigate('my-gold-locker');
    }
    this.setState({
      product: product
    })
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

    Api.get('/api/gold/user/address').then(res => {
      if (res.pfwresponse.status_code == 200) {
        this.setState({
          show_loader: false
        })
        let result = res.pfwresponse.result;
        let addressMain = {}, pincode = '', address = '',
          city = '', landmark = '', userInfo = {};
        if (result.address && result.address.length != 0) {
          addressMain = result.address[result.address.length - 1];
          pincode = addressMain.pincode;
          address = addressMain.addressline;
          landmark = addressMain.landmark;
          city = addressMain.city;
        }
        userInfo = result.gold_user.user_info;
        this.setState({
          address: address,
          addressMain: addressMain,
          pincode: pincode,
          city: city,
          userInfo: userInfo,
          landmark: landmark
        })

      } else {
        this.setState({
          show_loader: false, openDialog: true,
          apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
        });
      }

    }).catch(error => {
      this.setState({ show_loader: false });
      console.log(error);
    });


  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleChange = (field) => (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + '_error']: ''
    });
  }

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    this.setState({
      [name]: pincode,
      [name + '_error']: ''
    });

    if (pincode.length === 6) {
      const res = await Api.get('/api/pincode/' + pincode);

      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
        this.setState({
          city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
          state: res.pfwresponse.result[0].state_name
        });
      } else {
        this.setState({
          city: '',
          state: ''
        });
      }
    }
  }

  verifyMobile = async () => {
    this.setState({
      show_loader: true
    });

    let options = {
      mobile_number: this.state.userInfo.mobile_no,
    }
    const res = await Api.post('/api/gold/user/verify/delivery/mobilenumber', options);

    if (res.pfwresponse.status_code === 200) {

      let result = res.pfwresponse.result;
      if (result.resend_verification_otp_link != '' && result.verification_link != '') {
        window.localStorage.setItem('fromType', 'delivery')
        var message = 'An OTP is sent to your mobile number ' + this.state.userInfo.mobile_no + ', please verify to complete registration.'
        this.props.history.push({
          pathname: 'verify',
          search: '?base_url=' + this.state.params.base_url,
          params: {
            resend_link: result.resend_verification_otp_link,
            verify_link: result.verification_link, message: message, fromType: 'delivery',
            message: message
          }
        });
      }
      this.setState({
        show_loader: false,
      });
    } else {
      this.setState({
        show_loader: false, openDialog: true,
        apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
      });
    }
  }

  handleClick = async () => {
    console.log("handlec")
    if (this.state.pincode.length !== 6 || !validateNumber(this.state.pincode)) {
      this.setState({
        pincode_error: 'Please enter valid pincode'
      });
    } else if (!validateEmpty(this.state.address)) {
      this.setState({
        address_error: 'Enter your address'
      });
    } else if (!validateConsecutiveChar(this.state.address)) {
      this.setState({
        address_error: 'Address can not contain more than 3 same consecutive characters'
      });
    } else if (!validateLength(this.state.address)) {
      this.setState({
        address_error: 'Maximum length of address is 30'
      });
    } else if (!validateMinChar(this.state.address)) {
      this.setState({
        address_error: 'Address should contain minimum two characters'
      });
    } else {
      this.setState({
        show_loader: true
      });

      let addressMain = this.state.addressMain;
      addressMain.pincode = this.state.pincode;
      addressMain.city = this.state.city;
      addressMain.address = this.state.address;
      addressMain.landmark = this.state.landmark;

      const res = await Api.post('/api/gold/user/address', addressMain);

      let product = this.state.product;
      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.message == 'success') {
        this.verifyMobile();
        product.address = addressMain;
        window.localStorage.setItem('goldProduct', JSON.stringify(product));
      } else {
        this.setState({
          show_loader: false, openDialog: true,
          apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
        });
      }
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Gold Delivery Address"
        edit={this.props.edit}
        handleClick={this.handleClick}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="delivery-address">
          <div className="InputField">
            <Input
              error={(this.state.pincode_error) ? true : false}
              helperText={this.state.pincode_error}
              type="number"
              width="40"
              label="Pincode *"
              id="pincode"
              name="pincode"
              value={this.state.pincode}
              onChange={this.handlePincode('pincode')} />
            <div className="filler">
              {(this.state.city && this.state.state) && <span>{this.state.city} , {this.state.state}</span>}
            </div>
          </div>
          <div className="InputField">
            <Input
              error={(this.state.address_error) ? true : false}
              helperText={this.state.address_error}
              type="text"
              width="40"
              label="Address *"
              class="address"
              id="address"
              name="address"
              value={this.state.address}
              onChange={this.handleChange('address')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.landmark_error) ? true : false}
              helperText={this.state.landmark_error}
              type="text"
              width="40"
              label="Landmark (Optional)"
              class="landmark"
              id="landmark"
              name="landmark"
              value={this.state.landmark}
              onChange={this.handleChange('landmark')} />
          </div>
        </div>
      </Container>
    );
  }
}

export default DeliveryAddress;
