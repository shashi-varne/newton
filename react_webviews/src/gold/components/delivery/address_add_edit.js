import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';

import Container from '../../common/Container';
import Input from '../../../common/ui/Input';
import location from 'assets/location_dark_icn.png';
import Api from 'utils/api';
import { validateNumber, validateLength, validateMinChar, validateConsecutiveChar, validateEmpty } from 'utils/validators';
import {getConfig} from "utils/functions";
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
      mobile_no: "",
      mobile_no_error: '',
      city: '',
      state: '',
      provider: this.props.match.params.provider
    }
  }

  componentDidMount() {

    if (this.props.edit) {
      if (this.state.params && this.state.params.address_id) {
        Api.get('/api/mandate/campaign/address/' + this.state.params.key + '?address_id=' + this.state.params.address_id).then(res => {
          if (res.pfwresponse.result) {
            let address = res.pfwresponse.result[0];
            this.setState({
              show_loader: false,
              pincode: address.pincode || '',
              addressline1: address.addressline1 || '',
              addressline2: address.addressline2 || '',
              city: address.city || '',
              state: address.state || '',
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
    } else if (event.target.name === 'mobile_no') {
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
          cstate: ''
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

    let canSubmitForm = true;
    // #TODO need to change cansubmitform flag logic

    if (this.state.name.split(" ").filter(e => e).length < 2) {
      this.setState({
        name_error: 'Enter valid full name'
      });
      canSubmitForm = false;
    } 
    
    if (this.state.mobile_no.length !== 10 || !validateNumber(this.state.mobile_no)) {
      this.setState({
        mobile_no_error: 'Please enter valid mobile no'
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
    } else if (!validateConsecutiveChar(this.state.addressline1)) {
      this.setState({
        addressline1_error: 'Address can not contain more than 3 same consecutive characters'
      });
      canSubmitForm = false;
    } else if (!validateLength(this.state.addressline1)) {
      this.setState({
        addressline1_error: 'Maximum length of address is 30'
      });
      canSubmitForm = false;
    } else if (!validateMinChar(this.state.addressline1)) {
      this.setState({
        addressline1_error: 'Address should contain minimum two characters'
      });
      canSubmitForm = false;
    }
    
    if (!validateEmpty(this.state.addressline2)) {
      this.setState({
        addressline2_error: 'Enter your street and locality'
      });
      canSubmitForm = false;
    } else if (!validateConsecutiveChar(this.state.addressline2)) {
      this.setState({
        addressline2_error: 'Address can not contain more than 3 same consecutive characters'
      });
      canSubmitForm = false;
    } else if (!validateLength(this.state.addressline2)) {
      this.setState({
        addressline2_error: 'Maximum length of address is 30'
      });
      canSubmitForm = false;
    } 

    if(canSubmitForm) {
      this.setState({ show_loader: true });
      let addressline = {
        "name": this.state.name,
        "mobile_no": this.state.mobile_no,
        "pincode": this.state.pincode,
        "country": "india",
        'addressline1': this.state.addressline1,
        'addressline2': this.state.addressline2,

      };

      let res;
      if (this.props.edit) {
        addressline.address_id = this.state.params.address_id;
        res = await Api.put('/api/gold/user/address/' + this.state.params.key, addressline);
      } else {
        res = await Api.post('/api/gold/user/address/' + this.state.params.key, addressline);
      }

      this.setState({ show_loader: false });
      if (res.pfwresponse.status_code === 200) {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong');
        this.navigate('delivery-select-address');
      } else {
        toast('Something went wrong', 'error');
      }
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
        buttonTitle="Save and continue"
        logo={this.state.image}
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
              error={(this.state.mobile_no_error) ? true : false}
              helperText={this.state.mobile_no_error}
              type="number"
              width="40"
              label="Mobile number"
              class="Mobile"
              id="number"
              name="mobile_no"
              value={this.state.mobile_no}
              onChange={this.handleChange('mobile_no')} />
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
