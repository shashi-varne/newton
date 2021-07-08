import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import contact from 'assets/address_details_icon.svg';
import contact_myway from 'assets/address_icon_myway.svg';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';

import Container from '../../common/Container';
import Input from '../../../common/ui/Input';
import location from 'assets/location_dark_icn.png';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import { validateNumber, validateLengthDynamic, validateMinChar, validateConsecutiveChar, validateEmpty } from 'utils/validators';


class AddEditAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openDialogReset: false,
      pincode: '',
      pincode_error: '',
      addressline1: '',
      addressline1_error: '',
      addressline2: '',
      addressline2_error: '',
      city: '',
      state: '',
      checked: true,
      error: '',
      apiError: '',
      openDialog: false,
      address_present: false,
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/mandate/campaign/address/' + this.state.params.key);
      if (res.pfwresponse.result) {
        let address = res.pfwresponse.result[0];
        this.setState({
          show_loader: false,
          pincode: address.pincode || '',
          addressline1: address.addressline1 || '',
          addressline2: address.addressline2 || '',
          city: address.city || '',
          state: address.state || '',
          address_id: address.id || '',
          address_present: address.id ? true : false
        });
      }
      else {
        this.setState({
          show_loader: false,
          openDialog: true, apiError: res.pfwresponse.result.error
        });
      }


    } catch (err) {
      this.setState({
        show_loader: false
      })
      // toast("Something went wrong");
    }

  }

  handleChange = () => event => {
    if (event.target.name === 'checked') {
      this.setState({
        [event.target.name]: event.target.checked
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

    if (event.target.value.length > 6) {
      return;
    }

    this.setState({
      [name]: pincode,
      [name + '_error']: ''
    });

    if (pincode.length === 6) {
      try {
        const res = await Api.get('/api/pincode/' + pincode);

        if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
          if (name === 'pincode') {
            this.setState({
              city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
              state: res.pfwresponse.result[0].state_name,
              pincode_error: ''
            });
          } else {
            this.setState({
              ccity: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
              cstate: res.pfwresponse.result[0].state_name,
              pincode_error: ''
            });
          }
        } else {
          this.setState({
            city: '',
            state: '',
            ccity: '',
            cstate: '',
            pincode_error: 'Pincode not found'
          });
        }
      } catch (err) {
        this.setState({
          show_loader: false
        })
        toast("Something went wrong");
      }
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Campaign OTM Address',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Address',
        'addressline1': this.state.addressline1_error ? 'invalid' : this.state.addressline1 ? 'valid' : 'empty',
        'addressline2': this.state.addressline2_error ? 'invalid' : this.state.addressline2 ? 'valid' : 'empty',
        'pincode': this.state.pincode_error ? 'invalid' : this.state.pincode ? 'valid' : 'empty',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {
    let can_submit = true;
    if (!validateEmpty(this.state.addressline1)) {
      this.setState({
        addressline1_error: 'Enter your address'
      });
      can_submit = false;
    } else if (!validateConsecutiveChar(this.state.addressline1)) {
      this.setState({
        addressline1_error: 'Address can not contain more than 3 same consecutive characters'
      });
      can_submit = false;
    } else if (!validateLengthDynamic(this.state.addressline1, 160)) {
      this.setState({
        addressline1_error: 'Maximum length of address is 160'
      });
      can_submit = false;
    } else if (!validateMinChar(this.state.addressline1)) {
      this.setState({
        addressline1_error: 'Address should contain minimum two characters'
      });
      can_submit = false;
    }

    if (this.state.addressline2 && !validateConsecutiveChar(this.state.addressline2)) {
      this.setState({
        addressline2_error: 'Address can not contain more than 3 same consecutive characters'
      });
      can_submit = false;
    } else if (this.state.addressline2 && !validateLengthDynamic(this.state.addressline2, 160)) {
      this.setState({
        addressline2_error: 'Maximum length of address is 160'
      });
      can_submit = false;
    }

    if (this.state.pincode.length !== 6 || !validateNumber(this.state.pincode)) {
      this.setState({
        pincode_error: 'Please enter valid pincode'
      });
      can_submit = false;
    } else if (this.state.pincode_error) {
      can_submit = false;

    }

    this.sendEvents('next');

    if (can_submit) {
      try {
        this.setState({ show_loader: true });
        let addressline = {
          "pincode": this.state.pincode,
          "country": "india",
          'addressline1': this.state.addressline1,
          'addressline2': this.state.addressline2,

        };

        if (this.state.address_present) {
          addressline.address_id = this.state.address_id;
        }

        let res;
        if (this.state.address_present) {
          res = await Api.put('/api/mandate/campaign/address/' + this.state.params.key, addressline);
        } else {
          res = await Api.post('/api/mandate/campaign/address/' + this.state.params.key, addressline);
        }

        if (res.pfwresponse.status_code === 200) {
          let address_id_send = res.pfwresponse.result.address_id;
          // if (this.state.address_present) {
          //   address_id_send = this.state.address_id;
          // }

          let res2 = await Api.get('/api/mandate/campaign/address/confirm/' + this.state.params.key +
            '?address_id=' + address_id_send);
          this.setState({ show_loader: false });
          if (res2.pfwresponse.status_code === 200) {

            this.navigate('success');
          } else {
            toast(res2.pfwresponse.result.error || "Something went wrong");
          }
        } else {
          this.setState({
            show_loader: false
          });
          toast(res.pfwresponse.result.error || "Something went wrong");
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast("Something went wrong");
      }
    }
  }

  bannerText = () => {
    return (
      <span>
        Communication address for <b>OTM Form</b>
      </span>
    );
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Bank Mandate(OTM)"
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save and Continue"
        events={this.sendEvents('just_set_events')}
      >
        {/* Permanent Address Block */}
        <FormControl fullWidth>
          <TitleWithIcon width="16" icon={getConfig().productName !== 'fisdom' ? contact_myway : contact}
           title="Address Details" />
          <div className="InputField">
            <Input
              error={(this.state.addressline1_error) ? true : false}
              helperText={this.state.addressline1_error}
              type="text"
              id="addressline1"
              label="Address line 1 *"
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
              label="Address line 2 (optional)"
              name="addressline2"
              placeholder="ex: Curve Road, Shivaji Nagar"
              value={this.state.addressline2}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.pincode_error) ? true : false}
              helperText={this.state.pincode_error}
              type="number"
              icon={location}
              width="40"
              label="Pincode *"
              id="pincode"
              name="pincode"
              value={this.state.pincode}
              onChange={this.handlePincode('pincode')} />
          </div>
          <div className="InputField">
            <Input
              disabled={true}
              id="city"
              label="City *"
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

export default AddEditAddress;
