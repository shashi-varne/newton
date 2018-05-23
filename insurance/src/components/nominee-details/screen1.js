import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import Grid from 'material-ui/Grid';
import Checkbox from 'material-ui/Checkbox';

import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import RadioWithIcon from '../../ui/RadioWithIcon';
import name from '../../assets/full_name_dark_icn.png';
import dob from '../../assets/dob_dark_icn.png';
import gender from '../../assets/gender_dark_icn.png';
import relationship from '../../assets/relationship_dark_icn.png';
import marital from '../../assets/marital_status_dark_icn.png';
import location from '../../assets/location_dark_icn.png';
import Dropdown from '../../ui/Select';
import Api from '../../utils/api';
import { maritalOptions, genderOptions, relationshipOptions } from '../../utils/constants';
import { validateAlphabets, validateNumber, validateStreetName, validateLength, validateConsecutiveChar, validateEmpty } from '../../utils/validators';

class NomineeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      age: '',
      name: '',
      name_error: '',
      dob: '',
      dob_error: '',
      gender: '',
      gender_error: '',
      marital_status: '',
      marital_status_error: '',
      relationship: '',
      relationship_error: '',
      checked: true,
      pincode: '',
      pincode_error: '',
      addressline: '',
      addressline_error: '',
      landmark: '',
      landmark_error: '',
      city: '',
      state: '',
      image: '',
      provider: '',
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  componentDidMount() {
    Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'nominee'
    }).then(res => {
      const { nominee, nominee_address } = res.pfwresponse.result.profile;
      const { image, provider } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        age: (nominee.dob) ? this.calculateAge(nominee.dob.replace(/\\-/g, '/').split('/').reverse().join('/')) : '',
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
        image: image,
        provider: provider
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
        [name]: event,
        [name+'_error']: ''
      });
    } else if (name === 'dob') {
      this.setState({
        [name]: event.target.value,
        age: this.calculateAge(event.target.value),
        [event.target.name+'_error']: ''
      })
    } else {
      this.setState({
        [name]: event.target.value,
        [event.target.name+'_error']: ''
      });
    }
  };

  handleGenderRadioValue = name => index => {
    this.setState({
      [name]: genderOptions[index]['value'],
      [name+'_error']: ''
    });
  };

  handleMaritalRadioValue = name => index => {
    this.setState({
      [name]: maritalOptions[index]['value'],
      [name+'_error']: ''
    });
  };

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    this.setState({
      [name]: pincode,
      [name+'_error']: ''
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
          state:  ''
        });
      }
    }
  }

  handleFocus = () => event => {
    let currentDate = new Date().toISOString().slice(0,10);
    document.getElementById("dob").valueAsDate = new Date(currentDate);
    document.getElementById("dob").max = currentDate;
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?insurance_id='+this.state.params.insurance_id+'&resume='+this.state.params.resume+'&base_url='+this.state.params.base_url
    });
  }

  handleClick = async () => {
    if (this.state.name.split(" ").filter(e => e).length < 2) {
      this.setState({
        name_error: 'Enter valid full name'
      });
    } else if (!validateEmpty(this.state.name)) {
      this.setState({
        name_error: 'Enter valid full name'
      });
    } else if (!validateLength(this.state.name)) {
      this.setState({
        name_error: 'Maximum length of name is 30 characters'
      });
    } else if (!validateConsecutiveChar(this.state.name)) {
      this.setState({
        name_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (!validateAlphabets(this.state.name)) {
      this.setState({
        name_error: 'Name can contain only alphabets'
      });
    } else if (!this.state.dob) {
      this.setState({
        dob_error: 'Please select date'
      });
    } else if (new Date(this.state.dob) > new Date()) {
      this.setState({
        dob_error: 'Please select valid date'
      });
    } else if (!this.state.gender) {
      this.setState({
        gender_error: 'Mandatory'
      });
    } else if (!this.state.marital_status) {
      this.setState({
        marital_status_error: 'Mandatory'
      });
    } else if (!this.state.relationship) {
      this.setState({
        relationship_error: 'Please select relationship'
      });
    } else if (!this.state.checked && (this.state.pincode.length !== 6 || !validateNumber(this.state.pincode))) {
      this.setState({
        pincode_error: 'Please enter valid pincode'
      });
    } else if (!this.state.checked && !validateEmpty(this.state.addressline)) {
      this.setState({
        addressline_error: 'Address should begin with house number'
      });
    } else if (!this.state.checked && this.state.addressline.split(" ").length < 3) {
      this.setState({
        addressline_error: 'Address line should have at least 3 words'
      });
    } else if (!this.state.checked && !validateConsecutiveChar(this.state.addressline)) {
      this.setState({
        addressline_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (!this.state.checked && !validateEmpty(this.state.landmark)) {
      this.setState({
        landmark_error: 'Please enter valid landmark'
      });
    } else if (!this.state.checked && !validateLength(this.state.landmark)) {
      this.setState({
        landmark_error: 'Maximum length of landmark is 30'
      });
    } else if (!this.state.checked && !validateStreetName(this.state.landmark)) {
      this.setState({
        landmark_error: 'Please enter valid landmark'
      });
    } else {
      this.setState({show_loader: true});

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

      const res = await Api.post('/api/insurance/profile', data);

      if (res.pfwresponse.status_code === 200) {

        let eventObj = {
          "event_name": "nominee_save",
          "properties": {
            "provider": this.state.provider,
            "nominee_name": this.state.name,
            "nominee_dob": this.state.dob,
            "nominee_marital": this.state.marital_status.toLowerCase(),
            "nominee_relation": this.state.relationship,
            "address_same": (this.state.checked) ? 1 : 0,
            "pin_nominee": this.state.pincode,
            "city_nominee": this.state.city,
            "state_nominee": this.state.state,
            "from_edit": (this.state.edit) ? 1 : 0
          }
        };

        let jsonResponse = JSON.stringify(eventObj);
        window.location = "fisdom_webview://events?data="+jsonResponse;

        this.setState({show_loader: false});
        if (this.props.edit) {
          if (this.state.age < 18) {
            this.navigate('/edit-appointee');
          } else {
            if (this.state.params.resume === "yes") {
              this.navigate('/resume');
            } else {
              this.navigate('/summary');
            }
          }
        } else {
          if (this.state.age < 18) {
            this.navigate('/appointee');
          } else {
            this.navigate('/professional');
          }
        }
      } else {
        this.setState({show_loader: false});
        for (let error of res.pfwresponse.result.errors) {
          if (error.field === 'nominee_address' || error.field === 'nominee' || error.field === 'n_addr_same') {
            alert(error.message);
          }
          this.setState({
            [error.field+'_error']: error.message
          });
        }
      }
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
    let currentDate = new Date().toISOString().slice(0,10);
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
              error={(this.state.name_error) ? true : false}
              helperText={this.state.name_error || "Please enter full name"}
              type="text"
              icon={name}
              width="40"
              label="Full Name *"
              class="FullName"
              id="full-name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange('name')}  />
          </div>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.dob_error) ? true : false}
              helperText={this.state.dob_error}
              type="date"
              icon={dob}
              width="40"
              label="Date of birth *"
              class="DOB"
              id="dob"
              name="dob"
              max={currentDate}
              value={this.state.dob}
              onFocus={this.handleFocus()}
              onChange={this.handleChange('dob')} />
          </div>
          <div className="InputField">
            <RadioWithIcon
              error={(this.state.gender_error) ? true : false}
              helperText={this.state.gender_error}
              icon={gender}
              width="40"
              label="Gender"
              class="Gender"
              options={genderOptions}
              id="gender"
              value={this.state.gender}
              name="gender"
              onChange={this.handleGenderRadioValue('gender')} />
          </div>
          <div className="InputField">
            <RadioWithIcon
              error={(this.state.marital_status_error) ? true : false}
              helperText={this.state.marital_status_error}
              icon={marital}
              width="40"
              label="Marital Status"
              class="MaritalStatus"
              options={maritalOptions}
              id="marital-status"
              value={this.state.marital_status}
              name="marital_status"
              onChange={this.handleMaritalRadioValue('marital_status')} />
          </div>
          <div className="InputField">
            <Dropdown
              error={(this.state.relationship_error) ? true : false}
              helperText={this.state.relationship_error}
              icon={relationship}
              width="40"
              options={relationshipOptions}
              id="relationship"
              label="Relationship"
              value={this.state.relationship}
              name="relationship"
              onChange={this.handleChange('relationship')} />
          </div>
        </FormControl>

        {/* Correspondence Address Block */}
        <div className="CheckBlock">
          <Grid container spacing={16} alignItems="center">
            <Grid item xs={2} className="TextCenter">
              <Checkbox
                defaultChecked
                checked={this.state.checked}
                color="default"
                value="checked"
                name="checked"
                onChange={this.handleChange('checked')}
                className="Checkbox" />
            </Grid>
            <Grid item xs={10}>
              <span className="SameAddress">Nomniee’s address is same as my address</span>
            </Grid>
          </Grid>
        </div>

      {/* Correspondence Address */}
      {
        !this.state.checked &&
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
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
            <InputWithIcon
              error={(this.state.addressline_error) ? true : false}
              helperText={this.state.addressline_error || "Valid address - House No, Society, Locality"}
              type="text"
              id="address"
              label="Permanent address *"
              placeholder="ex: 16 Queens paradise"
              value={this.state.addressline}
              name="addressline"
              onChange={this.handleChange('addressline')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.landmark_error) ? true : false}
              helperText={this.state.landmark_error}
              type="text"
              id="landmark"
              label="Landmark *"
              value={this.state.landmark}
              name="landmark"
              onChange={this.handleChange('landmark')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="city"
              label="City *"
              value={this.state.city}
              name="city"
              onChange={this.handleChange('city')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="state"
              label="State *"
              value={this.state.state}
              name="state"
              onChange={this.handleChange('state')} />
          </div>
        </FormControl>
      }
      </Container>
    );
  }
}

export default NomineeDetails;
