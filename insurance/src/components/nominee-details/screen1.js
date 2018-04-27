import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import RadioWithIcon from '../../ui/RadioWithIcon';
import name from '../../assets/full_name_dark_icn.png';
import dob from '../../assets/dob_dark_icn.png';
import gender from '../../assets/gender_dark_icn.png';
import relationship from '../../assets/relationship_dark_icn.png';
import marital from '../../assets/marital_status_dark_icn.png';
import location from '../../assets/location_dark_icn.png';
import Grid from 'material-ui/Grid';
import Dropdown from '../../ui/Select';
import Checkbox from 'material-ui/Checkbox';
import Api from '../../service/api';
import qs from 'qs';

const maritalOptions = [
  {
    'name': 'Unmarried',
    'value': 'UNMARRIED'
  },
  {
    'name': 'Married',
    'value': 'MARRIED'
  },
  {
    'name': 'Divorced',
    'value': 'DIVORCED'
  },
  {
    'name': 'Widow',
    'value': 'WIDOW'
  }
];
const genderOptions = [
  {
    'name': 'Male',
    'value': 'MALE'
  },
  {
    'name': 'Female',
    'value': 'FEMALE'
  }
];


const relationshipOptions = [
  'BROTHER',
  'DAUGHTER',
  'FATHER',
  'GRAND DAUGHTER',
  'GRAND FATHER',
  'GRAND MOTHER',
  'GRAND SON',
  'HUSBAND',
  'MOTHER',
  'NEPHEW',
  'NIECE',
  'SISTER',
  'SON',
  'WIFE'
];

class NomineeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      age: '',
      name: '',
      dob: '',
      gender: '',
      marital_status: '',
      relationship: '',
      checked: true,
      pincode: '',
      addressline: '',
      landmark: '',
      city: '',
      state: '',
      country: 'INDIA',
      image: '',
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  componentDidMount() {
    Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'nominee'
    }).then(res => {
      const { nominee, nominee_address } = res.pfwresponse.result.profile;
      const { image } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        age: this.calculateAge(nominee.dob.replace(/\\-/g, '/').split('/').reverse().join('/')),
        name: nominee.name || '',
        dob: (nominee.dob) ? nominee.dob.replace(/\\-/g, '/').split('/').reverse().join('-') : '',
        gender: nominee.gender || '',
        marital_status: nominee.marital_status || '',
        relationship: nominee.relationship || '',
        checked: (Object.keys(nominee_address).length === 0) ? true : false,
        pincode: nominee_address.pincode || '',
        addressline: nominee_address.addressline || '',
        landmark: nominee_address.landmark || '',
        city: nominee_address.city || '',
        state: nominee_address.state || '',
        country: nominee_address.country || '',
        image: image
      });
    }).catch(error => {
      this.setState({show_loader: false});
      console.log(error);
    });
  }

  handleChange = name => event => {
    if (name === 'checked') {
      this.setState({
        [name]: event.target.checked
      });
    } else if (name === 'relationship') {
      this.setState({
        [name]: event
      });
    } else if (name === 'dob') {
      this.setState({
        [name]: event.target.value,
        age: this.calculateAge(event.target.value)
      })
    } else {
      this.setState({
        [name]: event.target.value
      });
    }
  };

  handleGenderRadioValue = name => index => {
    this.setState({
      [name]: genderOptions[index]['value']
    });
  };

  handleMaritalRadioValue = name => index => {
    this.setState({
      [name]: maritalOptions[index]['value']
    });
  };

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    this.setState({
      [name]: pincode
    });

    if (pincode.length === 6) {
      const res = await Api.get('/api/pincode/' + pincode);

      if (res.pfwresponse.status_code === 200) {
        this.setState({
          city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
          state: res.pfwresponse.result[0].state_name
        });
      } else {

        console.log(res.pfwresponse.result.error);
      }
    }
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
              id="pincode"
              value={this.state.pincode}
              onChange={this.handlePincode('pincode')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              id="address"
              label="Permanent address"
              value={this.state.addressline}
              onChange={this.handleChange('addressline')} />
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
              value={this.state.city}
              onChange={this.handleChange('city')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="state"
              label="State"
              value={this.state.state}
              onChange={this.handleChange('state')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="country"
              label="Country"
              value={this.state.country}
              onChange={this.handleChange('country')} />
          </div>
        </FormControl>
      );
    } else {
      return null;
    }
  }

  handleClick = async () => {
    let data = {
      nominee: {}
    };
    const formattedDob = this.state.dob.replace(/\\-/g, '/').split('-').reverse().join('/');

    data['insurance_app_id'] =  this.state.params.insurance_id;
    data['nominee']['name'] = this.state.name;
    data['nominee']['dob'] = formattedDob;
    data['nominee']['gender'] = this.state.gender;
    data['nominee']['marital_status'] = this.state.marital_status;
    data['nominee']['relationship'] = this.state.relationship;

    if (this.state.checked) {
      data['n_addr_same'] = 'Y';
    } else {
      data['nominee_address'] = {
        'pincode': this.state.pincode,
        'addressline': this.state.addressline,
        'landmark': this.state.landmark
      };
    }
    this.setState({show_loader: true});
    const res = await Api.post('/api/insurance/profile', data);

    if (res.pfwresponse.status_code === 200) {
      this.setState({show_loader: false});
      if (this.props.edit) {

        if (this.state.age < 18) {
          this.props.history.push({
            pathname: '/edit-appointee',
            search: '?insurance_id='+this.state.params.insurance_id
          });
        } else {
          this.props.history.push({
            pathname: '/summary',
            search: '?insurance_id='+this.state.params.insurance_id
          });
        }
      } else {

        if (this.state.age < 18) {
          this.props.history.push({
            pathname: '/appointee',
            search: '?insurance_id='+this.state.params.insurance_id
          });
        } else {
          this.props.history.push({
            pathname: '/professional',
            search: '?insurance_id='+this.state.params.insurance_id
          });
        }
      }
    } else {
      this.setState({show_loader: false});
      alert('Error');
      console.log(res.pfwresponse.result.error);
    }
  }

  calculateAge = (birthday) => {
    var today = new Date();
    var birthDate = new Date(birthday);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  bannerText = () => {
    return (
      <span>
        <em><b>Nominee</b></em> is the one - who will <em><b>get the benefits</b></em> as per the insurance. Please share his/her details correctly.
      </span>
    );
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={(this.props.edit) ? 'Edit Nominee Details' : 'Nominee Details'}
        count={true}
        total={4}
        current={3}
        state={this.state}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle={(this.state.age < 18) ? "Save & Continue" : "Save Details"}
        logo={this.state.image}
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
              value={this.state.name}
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
              value={this.state.dob}
              onChange={this.handleChange('dob')} />
          </div>
          <div className="InputField">
            <RadioWithIcon
              icon={gender}
              width="40"
              label="Gender"
              class="Gender"
              options={genderOptions}
              id="gender"
              value={this.state.gender}
              onChange={this.handleGenderRadioValue('gender')} />
          </div>
          <div className="InputField">
            <RadioWithIcon
              icon={marital}
              width="40"
              label="Marital Status"
              class="MaritalStatus"
              options={maritalOptions}
              id="marital-status"
              value={this.state.marital_status}
              onChange={this.handleMaritalRadioValue('marital_status')} />
          </div>
          <div className="InputField">
            <Dropdown
              icon={relationship}
              width="40"
              options={relationshipOptions}
              id="relationship"
              label="Relationship"
              value={this.state.relationship}
              onChange={this.handleChange('relationship')} />
          </div>
        </FormControl>
        <div className="CheckBlock" style={{marginTop: 20, marginBottom: 20}}>
          <Grid container spacing={16} alignItems="flex-end">
            <Grid item xs={2} style={{textAlign: 'center'}}>
              <Checkbox
                defaultChecked
                color="default"
                value="checked"
                onChange={this.handleChange('checked')}
                style={{width: 'auto', height: 'auto'}} />
            </Grid>
            <Grid item xs={10}>
              <span style={{color: 'rgb(68, 68, 68)', fontSize: 14}}>Nomniee’s address is same as my address</span>
            </Grid>
          </Grid>
        </div>
        {this.renderCorrespondenceAddress()}
      </Container>
    );
  }
}

export default NomineeDetails;
