import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import Input from '../../ui/Input';
import { validateNumber, validateStreetName, validateLength, validateMinChar, validateConsecutiveChar, validateEmpty } from 'utils/validators';

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
      ccity: '',
      cstate: '',
      city: '',
      state: '',
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

  handleChange = (field) => (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name+'_error']: ''
    });
  }

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    this.setState({
      [name]: pincode,
      [name+'_error']: ''
    });

    if (pincode.length === 6) {
      const res = await Api.get('https://nitish-dot-plutus-staging.appspot.com/api/pincode/' + pincode);

      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
        if (name === 'pincode') {
          this.setState({
            city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
            state: res.pfwresponse.result[0].state_name
          });
        } else {
          this.setState({
            ccity: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
            cstate: res.pfwresponse.result[0].state_name
          });
        }
      } else {
        this.setState({
          city: '',
          state: '',
          ccity: '',
          cstate: ''
        });
      }
    }
  }

  handleClick = async () => {
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
    } else if (!validateEmpty(this.state.landmark)) {
      this.setState({
        landmark_error: 'Enter nearest landmark'
      });
    } else if (!validateLength(this.state.landmark)) {
      this.setState({
        landmark_error: 'Maximum length of landmark is 30'
      });
    } else if (!validateStreetName(this.state.landmark)) {
      this.setState({
        landmark_error: 'Please enter valid landmark'
      });
    } else {
      // To-do
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
