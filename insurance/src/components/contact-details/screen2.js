import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import Dropdown from '../../ui/Select';
import location from '../../assets/location_dark_icn.png';
import Grid from 'material-ui/Grid';
import Checkbox from 'material-ui/Checkbox';

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

const countryOptions = [
  {
    value: 'india',
    label: 'India'
  }
];

class ContactDetails2 extends Component {
  state = {
    pincode: '',
    address: '',
    city: '',
    state: '',
    checked: true,
    cpincode: '',
    caddress: '',
    ccity: '',
    cstate: '',
    country: ''
  }

  handleChange = name => event => {
    if (name === 'checked') {
      this.setState({
        [name]: event.target.checked
      });
    } else {
      this.setState({
        [name]: event.target.value
      });
    }
  };

  bannerText = () => {
    return (
      <span>
        We will courier your policy paper at <em><b>your residence</b></em> too.
      </span>
    );
  }

  renderCorrespondenceAddress = () => {
    if (!this.state.checked) {
      return (
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              type="number"
              icon={location}
              width="40"
              label="Pincode"
              id="cpincode"
              onChange={this.handleChange('cpincode')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              id="caddress"
              label="Permanent address"
              onChange={this.handleChange('caddress')} />
          </div>
          <div className="InputField">
            <Dropdown
              options={cityOptions}
              id="ccity"
              label="City"
              onChange={this.handleChange('ccity')} />
          </div>
          <div className="InputField">
            <Dropdown
              options={stateOptions}
              id="cstate"
              label="State"
              onChange={this.handleChange('cstate')} />
          </div>
          <div className="InputField">
            <Dropdown
              options={countryOptions}
              id="country"
              label="Country"
              onChange={this.handleChange('country')} />
          </div>
        </FormControl>
      );
    } else {
      return null;
    }
  }

  componentDidUpdate() {
    var body = document.getElementsByTagName('body')[0].offsetHeight;
    var client = document.getElementsByClassName('Container-wrapper-1')[0].offsetHeight;

    if (client > body) {
      document.getElementsByClassName('Footer')[0].style.position = "relative" ;
    } else {
      document.getElementsByClassName('Footer')[0].style.position = "fixed" ;
    }
  }

  render() {
    return (
      <Container
        title={'Contact Details'}
        count={true}
        total={5}
        current={2}
        state={this.state}
        banner={true}
        bannerText={this.bannerText()}
        >
        <div className="SectionHead" style={{marginBottom: 15, color: 'rgb(68,68,68)', fontSize: 18, fontFamily: 'Roboto', fontWeight: 500}}>
          Permanent address
        </div>
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              type="number"
              icon={location}
              width="40"
              label="Pincode"
              id="pincode"
              onChange={this.handleChange('pincode')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              id="address"
              label="Permanent address"
              onChange={this.handleChange('address')} />
          </div>
          <div className="InputField">
            <Dropdown
              options={cityOptions}
              id="city"
              label="City"
              onChange={this.handleChange('city')} />
          </div>
          <div className="InputField">
            <Dropdown
              options={stateOptions}
              id="state"
              label="State"
              onChange={this.handleChange('state')} />
          </div>
        </FormControl>
        <div className="SectionHead" style={{marginBottom: 15, color: 'rgb(68,68,68)', fontSize: 18, fontFamily: 'Roboto', fontWeight: 500}}>
          Correspondence address
        </div>
        <div className="CheckBlock" style={{marginBottom: 20}}>
          <Grid container spacing={16} alignItems="flex-end">
            <Grid item xs={2}>
              <Checkbox
                defaultChecked
                color="default"
                value="checkedG"
                onChange={this.handleChange('checked')} />
            </Grid>
            <Grid item xs={10}>
              <span style={{color: 'rgb(68, 68, 68)', fontSize: 16}}>Correspondence address same as permanent address</span>
            </Grid>
          </Grid>
        </div>
        {this.renderCorrespondenceAddress()}
      </Container>
    );
  }
}

export default ContactDetails2;
