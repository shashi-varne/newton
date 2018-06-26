import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import RadioWithIcon from '../../ui/RadioWithIcon';
import name from 'assets/full_name_dark_icn.png';
import dob from 'assets/dob_dark_icn.png';
import gender from 'assets/gender_dark_icn.png';
import relationship from 'assets/relationship_dark_icn.png';
import marital from 'assets/marital_status_dark_icn.png';
import location from 'assets/location_dark_icn.png';
import Dropdown from '../../ui/Select';
import Button from 'material-ui/Button';
import Api from 'utils/api';
import { maritalOptions, genderOptions, appointeeRelationshipOptions } from '../../constants';
import { validateAlphabets, validateNumber, validateStreetName, validateLength, validateMinChar, validateConsecutiveChar, validateEmpty } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';

class AppointeeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
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
      house_no: '',
      house_no_error: '',
      street: '',
      street_error: '',
      landmark: '',
      landmark_error: '',
      city: '',
      state: '',
      image: '',
      provider: '',
      apiError: '',
      openDialog: false,
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  componentDidMount() {
    Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'appointee'
    }).then(res => {
      const { appointee, appointee_address } = res.pfwresponse.result.profile;
      const { image, provider } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        name: appointee.name || '',
        dob: (appointee.dob) ? appointee.dob.replace(/\\-/g, '/').split('/').reverse().join('-') : '',
        gender: appointee.gender || '',
        marital_status: appointee.marital_status || '',
        relationship: appointee.relationship || '',
        checked: (Object.keys(appointee_address).length === 0) ? true : false,
        pincode: appointee_address.pincode || '',
        house_no: appointee_address.house_no || '',
        street: appointee_address.street || '',
        landmark: appointee_address.landmark || '',
        city: appointee_address.city || '',
        state: appointee_address.state || '',
        country: appointee_address.country || '',
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?insurance_id='+this.state.params.insurance_id+'&resume='+this.state.params.resume+'&base_url='+this.state.params.base_url
    });
  }

  handleClick = async () => {
    let age  = this.calculateAge(this.state.dob.replace(/\\-/g, '/').split('-').reverse().join('/'));
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
    } else if (age < 18) {
      this.setState({
        dob_error: 'Minimum age should be 18 years'
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
    } else if (!this.state.checked && !validateEmpty(this.state.house_no)) {
      this.setState({
        house_no_error: 'Enter your address'
      });
    } else if (!this.state.checked && !validateConsecutiveChar(this.state.house_no)) {
      this.setState({
        house_no_error: 'Address can not contain more than 3 same consecutive characters'
      });
    } else if (!this.state.checked && !validateLength(this.state.house_no)) {
      this.setState({
        house_no_error: 'Maximum length of address is 30'
      });
  }  else if (!this.state.checked && !validateMinChar(this.state.house_no)) {
      this.setState({
        house_no_error: 'Address should contain minimum two characters'
      });
    } else if (!this.state.checked && !validateEmpty(this.state.street)) {
      this.setState({
        street_error: 'Enter your street and locality'
      });
    } else if (!this.state.checked && !validateConsecutiveChar(this.state.street)) {
      this.setState({
        street_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (!this.state.checked && !validateLength(this.state.street)) {
      this.setState({
        street_error: 'Maximum length of address is 30'
      });
    } else if (!this.state.checked && !validateEmpty(this.state.landmark)) {
      this.setState({
        landmark_error: 'Enter nearest landmark'
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
        appointee: {}
      };
      const formattedDob = this.state.dob.replace(/\\-/g, '/').split('-').reverse().join('/');

      data['insurance_app_id'] =  this.state.params.insurance_id;
      data['appointee']['name'] = this.state.name;
      data['appointee']['dob'] = formattedDob;
      data['appointee']['gender'] = this.state.gender;
      data['appointee']['marital_status'] = this.state.marital_status;
      data['appointee']['relationship'] = this.state.relationship;

      if (this.state.checked) {
        data['a_addr_same'] = 'Y';
      } else {
        data['appointee_address'] = {
          'pincode': this.state.pincode,
          'house_no': this.state.house_no,
          'street': this.state.street,
          'landmark': this.state.landmark
        };
      }

      const res = await Api.post('/api/insurance/profile', data);

      if (res.pfwresponse.status_code === 200) {

        let eventObj = {
          "event_name": "apointee_save",
          "properties": {
            "provider": this.state.provider,
            "name_appointee": this.state.name,
            "dob_appointe": this.state.dob,
            "marital": this.state.marital_status.toLowerCase(),
            "relation": this.state.relationship,
            "address_same": (this.state.checked) ? 1 : 0,
            "pin": this.state.pincode,
            "add": this.state.addressline,
            "city": this.state.city,
            "state": this.state.state
          }
        };

        nativeCallback({ events: eventObj });

        this.setState({show_loader: false});
        if (this.props.edit) {
          if (this.state.params.resume === "yes") {
            this.navigate('/insurance/resume');
          } else {
            this.navigate('/insurance/summary');
          }
        } else {
          this.navigate('/insurance/professional');
        }
      } else {
        this.setState({show_loader: false});
        for (let error of res.pfwresponse.result.errors) {
          if (error.field === 'appointee_address' || error.field === 'appointee' || error.field === 'a_addr_same') {
            this.setState({ openDialog: true, apiError: error.message });
          }
          this.setState({
            [error.field+'_error']: error.message
          });
        }
      }
    }
  }

  bannerText = () => {
    return (
      <span>
        Incase Nominee is minor, Appointee will <em><b>get the benefits.</b></em>
      </span>
    );
  }

  handleFocus = () => event => {
    let currentDate = new Date().toISOString().slice(0,10);
    document.getElementById("dob").valueAsDate = null;
    document.getElementById("dob").max = currentDate;
  }

  handleClose = () => {
    this.setState({
      openDialog: false
    });
  }

  renderDialog = () => {
    return (
      <Dialog
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.state.apiError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={(this.props.edit) ? 'Edit Appointee Details' : 'Appointee Details'}
        count={true}
        total={4}
        current={3}
        state={this.state}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle={(this.props.edit) ? "Save Details" : "Save & Continue"}
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
              name="gender"
              value={this.state.gender}
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
              name="marital_status"
              value={this.state.marital_status}
              onChange={this.handleMaritalRadioValue('marital_status')} />
          </div>
          <div className="InputField">
            <Dropdown
              error={(this.state.relationship_error) ? true : false}
              helperText={this.state.relationship_error}
              icon={relationship}
              width="40"
              options={appointeeRelationshipOptions}
              id="relationship"
              name="relationship"
              label="Relationship"
              value={this.state.relationship}
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
                onChange={this.handleChange('checked')}
                className="Checkbox" />
            </Grid>
            <Grid item xs={10}>
              <span className="SameAddress">Apotniee’s address is same as my address</span>
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
                error={(this.state.house_no_error) ? true : false}
                helperText={this.state.house_no_error || "House No, Society"}
                type="text"
                id="house_no"
                label="Address line 1 *"
                placeholder="ex: 16 Queens paradise"
                value={this.state.house_no}
                name="house_no"
                onChange={this.handleChange('house_no')} />
            </div>
            <div className="InputField">
              <InputWithIcon
                error={(this.state.street_error) ? true : false}
                helperText={this.state.street_error || "Street, Locality"}
                type="text"
                id="street"
                label="Address line 2 *"
                placeholder="ex: Curve Road, Shivaji Nagar"
                value={this.state.street}
                name="street"
                onChange={this.handleChange('street')} />
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
        {this.renderDialog()}
      </Container>
    );
  }
}

export default AppointeeDetails;
