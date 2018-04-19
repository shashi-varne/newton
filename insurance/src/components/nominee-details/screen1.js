import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import RadioWithIcon from '../../ui/RadioWithIcon';
import name from '../../assets/full_name_dark_icn.png';
import dob from '../../assets/dob_dark_icn.png';
import relationship from '../../assets/relationship_dark_icn.png';
import marital from '../../assets/marital_status_dark_icn.png';
import location from '../../assets/location_dark_icn.png';
import Grid from 'material-ui/Grid';
import Dropdown from '../../ui/Select';
import Checkbox from 'material-ui/Checkbox';

const maritalOptions = ['Single', 'Married', 'Divorced', 'Widow'];
const relationshipOptions = [
  {
    value: 'brother',
    label: 'Brother'
  }
];
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

class NomineeDetails extends Component {
  state = {
    name: '',
    dob: '',
    maritalStatus: '',
    relationship: '',
    checked: true,
    pincode: '',
    address: '',
    city: '',
    state: '',
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

  bannerText = () => {
    return (
      <span>
        <em><b>Nominee</b></em> is the one - who will <em><b>get the benefits</b></em> as per the insurance. Please share his/her details correctly.
      </span>
    );
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
        title={'Nominee Details'}
        count={true}
        total={5}
        current={3}
        state={this.state}
        banner={true}
        bannerText={this.bannerText()}
        >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              type="text"
              icon={name}
              width="40"
              label="Full Name"
              class="FullName"
              id="full-name"
              onChange={this.handleChange('name')}  />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="date"
              icon={dob}
              width="40"
              label="Date of birth"
              class="DOB"
              id="dob"
              onChange={this.handleChange('dob')} />
          </div>
          <div className="InputField">
            <RadioWithIcon
              icon={marital}
              width="40"
              label="Marital Status"
              class="MaritalStatus"
              options={maritalOptions}
              id="marital-status"
              onChange={this.handleChange('maritalStatus')} />
          </div>
          <div className="InputField">
            <Dropdown
              icon={relationship}
              width="40"
              options={relationshipOptions}
              id="relationship"
              label="Relationship"
              onChange={this.handleChange('relationship')} />
          </div>
        </FormControl>
        <div className="CheckBlock" style={{marginBottom: 20}}>
          <Grid container spacing={16} alignItems="flex-end">
            <Grid item xs={2} style={{textAlign: 'center'}}>
              <Checkbox
                defaultChecked
                color="default"
                value="checkedG"
                onChange={this.handleChange('checked')}
                style={{width: 'auto', height: 'auto'}} />
            </Grid>
            <Grid item xs={10}>
              <span style={{color: 'rgb(68, 68, 68)', fontSize: 16}}>Nomniee’s address is same as my address</span>
            </Grid>
          </Grid>
        </div>
        {this.renderCorrespondenceAddress()}
      </Container>
    );
  }
}

export default NomineeDetails;
