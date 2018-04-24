import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import RadioWithoutIcon from '../../ui/RadioWithoutIcon';
import name from '../../assets/name_present_employer_dark_icn.png';
import location from '../../assets/location_dark_icn.png';
import Dropdown from '../../ui/Select';
import Api from '../../service/api';

const declareOptions = ['Y', 'N'];

class ProfessionalDetails2 extends Component {
  state = {
    employer_name: '',
    pincode: '',
    address: '',
    landmark: '',
    city: '',
    state: ''
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    this.setState({
      [name]: pincode
    });

    if (pincode.length == 6) {
      const res = await Api.get('/api/pincode/' + pincode);

      if (res.pfwresponse.status_code === 200) {
        this.setState({
          city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
          state: res.pfwresponse.result[0].state_name
        });
      } else {
        alert('Error');
        console.log(res.pfwresponse.result.error);
      }
    }

  }

  handleClick = async () => {
    let data = {};

    data['insurance_app_id'] =  5526920682799104;
    data['employer_name'] = this.state.employer_name;
    data['employer_address'] = {
      'pincode': this.state.pincode,
      'addressline': this.state.address,
      'landmark': this.state.landmark
    }

    const res = await Api.post('/api/insurance/profile', data);

    if (res.pfwresponse.status_code === 200) {
      console.log(res.pfwresponse.result);
    } else {
      alert('Error');
      console.log(res.pfwresponse.result.error);
    }
  }

  render() {
    return (
      <Container
        title={'Professional Details'}
        count={true}
        total={5}
        current={4}
        handleClick={this.handleClick}
        >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              type="text"
              icon={name}
              width="40"
              label="Name of present employer"
              class="Name"
              id="name"
              value={this.state.employer_name}
              onChange={this.handleChange('employer_name')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="number"
              icon={location}
              width="40"
              label="Pincode"
              id="pincode"
              value={this.state.pincode}
              onChange={this.handlePincode('pincode')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              id="address"
              label="Address of present employer"
              value={this.state.address}
              onChange={this.handleChange('address')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              id="landmark"
              label="Landmark"
              value={this.state.landmark}
              onChange={this.handleChange('landmark')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="city"
              label="City"
              disabled={true}
              value={this.state.city}
              onChange={this.handleChange('city')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="state"
              label="State"
              disabled={true}
              value={this.state.state}
              onChange={this.handleChange('state')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default ProfessionalDetails2;
