import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import RadioWithoutIcon from '../../ui/RadioWithoutIcon';
import name from '../../assets/name_present_employer_dark_icn.png';
import location from '../../assets/location_dark_icn.png';
import Dropdown from '../../ui/Select';
import Grid from 'material-ui/Grid';

const declareOptions = ['Yes', 'No'];
const cityOptions = [
  {
    value: 'bangalore',
    label: 'Bangalore'
  },
  {
    value: 'delhi',
    label: 'Delhi'
  },
  {
    value: 'mumbai',
    label: 'Mumbai'
  },
  {
    value: 'chennai',
    label: 'Chennai'
  }
];

const stateOptions = [
  {
    value: 'karnataka',
    label: 'Karnataka'
  },
  {
    value: 'up',
    label: 'Uttar Pradesh'
  },
  {
    value: 'ap',
    label: 'Andhra Pradesh'
  },
  {
    value: 'tn',
    label: 'Tamil Nadu'
  }
];

class ProfessionalDetails2 extends Component {
  state = {
    name: '',
    address: '',
    city: '',
    state: ''
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return (
      <Container
        title={'Professional Details'}
        count={true}
        total={5}
        current={4}
        state={this.state}
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
              onChange={this.handleChange('name')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              icon={location}
              width="40"
              label="Address of present employer"
              class="Address"
              id="address"
              onChange={this.handleChange('address')} />
          </div>
          <div className="InputField">
            <Dropdown
              options={cityOptions}
              id="ccity"
              label="City"
              onChange={this.handleChange('city')} />
          </div>
          <div className="InputField">
            <Dropdown
              options={stateOptions}
              id="cstate"
              label="State"
              onChange={this.handleChange('state')} />
          </div>
        </FormControl>
        <div className="SectionHead" style={{marginBottom: 30, color: 'rgb(68,68,68)', fontSize: 18, fontFamily: 'Roboto'}}>
          By tapping continue, you declare that you’re -
        </div>
        <div className="RadioBlock">
          <div className="RadioWithoutIcon" style={{marginBottom: 20, borderBottom: '1px solid #c6c6c6', paddingBottom: 20}}>
            <RadioWithoutIcon
              options={declareOptions}
              type="professional2"
              id="exposed"
              label="Politically exposed"
              onChange={this.handleChange('politicallyExposed')} />
          </div>
          <div className="RadioWithoutIcon">
            <RadioWithoutIcon
              options={declareOptions}
              type="professional2"
              id="criminal"
              label="Criminal proceedings"
              onChange={this.handleChange('politicallyExposed')} />
          </div>
        </div>
      </Container>
    );
  }
}

export default ProfessionalDetails2;
