import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';

import Container from '../../common/Container';
import Input from '../../../common/ui/Input';
import location from 'assets/location_dark_icn.png';
import Api from 'utils/api';
import { validateNumber, validateLengthDynamic, validateMinChar, 
 validateEmpty, getUrlParams } from 'utils/validators';
import {getConfig} from "utils/functions";
import { nativeCallback } from 'utils/native_callback';
import toast from '../../../common/ui/Toast';

class AddEditAddressDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      pincode: '',
      pincode_error: '',
      addressline1: '',
      addressline1_error: '',
      addressline2: '',
      addressline2_error: '',
      name: "",
      name_error: '',
      mobile_number: "",
      mobile_number_error: '',
      city: '',
      state: '',
      provider: this.props.match.params.provider,
      address_id: getUrlParams().address_id || ''
    }
  }

  componentDidMount() {

    if (this.props.edit) {
      if (this.state.address_id) {
        Api.get('/api/gold/address?address_id=' + this.state.address_id).then(res => {
          if (res.pfwresponse.result) {
            let address = res.pfwresponse.result[0];
            this.setState({
              show_loader: false,
              pincode: address.pincode || '',
              addressline1: address.addressline1 || '',
              addressline2: address.addressline2 || '',
              city: address.city || '',
              state: address.state || '',
              name: address.name || '',
              mobile_number: address.mobile_number || ''
            });
          }
          else {
            this.setState({
              show_loader: false,
              openDialog: true, apiError: res.pfwresponse.result.error
            });
          }


        }).catch(error => {
          this.setState({ show_loader: false });
        });
      } else {
        this.setState({ show_loader: false });
      }
    } else {
      this.setState({ show_loader: false });
    }

  }

  handleChange = () => event => {
    if (event.target.name === 'checked') {
      this.setState({
        [event.target.name]: event.target.checked
      });
    } else if (event.target.name === 'mobile_number') {
      if (event.target.value.length > 10) {
        return;
      }
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    }
  };

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    if(pincode.length > 6) {
      return;
    }
    this.setState({
      [name]: pincode,
      [name + '_error']: ''
    });

    if (pincode.length === 6) {
      const res = await Api.get('/api/pincode/' + pincode);

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
          cstate: '',
          pincode_error: 'Invalid pincode'
        });
      }
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {

    this.sendEvents('next');
    let canSubmitForm = true;

    if (this.state.name.split(" ").filter(e => e).length < 2) {
      this.setState({
        name_error: 'Enter valid full name'
      });
      canSubmitForm = false;
    } 
    
    if (this.state.mobile_number.length !== 10 || !validateNumber(this.state.mobile_number)) {
      this.setState({
        mobile_number_error: 'Please enter valid mobile no'
      });
      canSubmitForm = false;
    }

    if (this.state.pincode.length !== 6 || !validateNumber(this.state.pincode)) {
      this.setState({
        pincode_error: 'Please enter valid pincode'
      });
      canSubmitForm = false;
    } 
    
    if (!validateEmpty(this.state.addressline1)) {
      this.setState({
        addressline1_error: 'Enter your address'
      });
      canSubmitForm = false;
    } else if (!validateLengthDynamic(this.state.addressline1, 90)) {
      this.setState({
        addressline1_error: 'Maximum length of address is 90'
      });
      canSubmitForm = false;
    } else if (!validateMinChar(this.state.addressline1, 4)) {
      this.setState({
        addressline1_error: 'Address should contain minimum four characters'
      });
      canSubmitForm = false;
    }
    
    if (!validateEmpty(this.state.addressline2)) {
      this.setState({
        addressline2_error: 'Enter your street and locality'
      });
      canSubmitForm = false;
    } else if (!validateLengthDynamic(this.state.addressline2, 90)) {
      this.setState({
        addressline2_error: 'Maximum length of address is 90'
      });
      canSubmitForm = false;
    } 

    if(canSubmitForm) {
      this.setState({ show_loader: true });
      let addressline = {
        "name": this.state.name,
        "mobile_number": this.state.mobile_number,
        "pincode": this.state.pincode,
        "country": "india",
        'addressline1': this.state.addressline1,
        'addressline2': this.state.addressline2,

      };

      let res;
      if (this.props.edit) {
        addressline.changeType = 'update';
        addressline.address_id = this.state.address_id;
        res = await Api.post('/api/gold/address', addressline);
      } else {
        addressline.changeType = 'add';
        res = await Api.post('/api/gold/address', addressline);
      }

      this.setState({ show_loader: false });
      
      if (res.pfwresponse.status_code === 200) {
        this.navigate('delivery-select-address');
      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong');
      }
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'add_address',
        'name': this.state.name ? 'yes' : 'no',
        'mobile_number': this.state.mobile_number ? 'yes' : 'no',
        'pincode': this.state.pincode ? 'yes' : 'no',
        'addressline1': this.state.addressline1 ? 'yes' : 'no',
        'addressline2': this.state.addressline2 ? 'yes' : 'no',
        'city': this.state.city ? 'yes' : 'no',
        'state': this.state.state ? 'yes' : 'no',
        'update_type': this.props.edit ? 'edit' : 'add'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={(this.props.edit) ? 'Edit Address' : 'Add Address'}
        rightIcon={this.props.edit ? 'delete' : ''}
        resetpage={this.props.edit ? true : false}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="SAVE AND CONTINUE"
        logo={this.state.image}
        events={this.sendEvents('just_set_events')}
      >
        <FormControl fullWidth>
          <div className="InputField">
            <Input
              error={(this.state.name_error) ? true : false}
              helperText={this.state.name_error}
              type="text"
              width="40"
              label="Person’s name"
              class="name"
              id="name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange('name')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.mobile_number_error) ? true : false}
              helperText={this.state.mobile_number_error}
              type="number"
              width="40"
              label="Mobile number"
              class="Mobile"
              id="number"
              name="mobile_number"
              value={this.state.mobile_number}
              onChange={this.handleChange('mobile_number')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.pincode_error) ? true : false}
              helperText={this.state.pincode_error}
              type="number"
              icon={location}
              width="40"
              label="Pin code"
              id="pincode"
              name="pincode"
              maxLength="6"
              value={this.state.pincode}
              onChange={this.handlePincode('pincode')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.addressline1_error) ? true : false}
              helperText={this.state.addressline1_error}
              type="text"
              id="addressline1"
              label="Address 1"
              name="addressline1"
              placeholder="ex: 16/1 Queens paradise"
              value={this.state.addressline1}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.addressline2_error) ? true : false}
              helperText={this.state.addressline2_error}
              type="text"
              id="addressline2"
              label="Address 2"
              name="addressline2"
              placeholder="ex: Curve Road, Shivaji Nagar"
              value={this.state.addressline2}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <Input
              disabled={true}
              id="city"
              label="City/Town"
              value={this.state.city}
              name="city"
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <Input
              disabled={true}
              id="state"
              label="State *"
              value={this.state.state}
              name="state"
              onChange={this.handleChange()} />
          </div>
        </FormControl>

      </Container >
    );
  }
}

export default AddEditAddressDelivery;
