import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import MobileInputWithoutIcon from '../../../common/ui/MobileInputWithoutIcon';
import Input from '../../../common/ui/Input';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import email from 'assets/email_dark_icn.png';
import phone from 'assets/phone_dark_icn.png';
import name from 'assets/full_name_dark_icn.png';
import marital from 'assets/marital_status_dark_icn.png';
import personal from 'assets/personal_details_icon.svg';
import personal_myway from 'assets/personal_details_icn.svg';
import Api from 'utils/api';
import { maritalOptions, genderOptions } from '../../constants';
import {
  validatePan, validateAlphabets, providerAsIpru,
  validateEmail, validateNumber, numberShouldStartWith,
  validateEmpty, validateConsecutiveChar, validateLengthNames
} from 'utils/validators';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class PersonalDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      name: '',
      dob: '',
      gender: '',
      marital_status: '',
      image: '',
      name_error: '',
      first_name: '',
      first_name_error: '',
      last_name: '',
      last_name_error: '',
      dob_error: '',
      gender_error: '',
      marital_status_error: '',
      spouse_name: '',
      spouse_name_error: '',
      pan_number: '',
      pan_number_error: '',
      email: '',
      mobile_no: '',
      email_error: '',
      mobile_no_error: '',
      father_name: '',
      father_name_error: '',
      provider: '',
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName
    }
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/profile/' + this.state.params.insurance_id, {
        groups: 'personal,professional,contact'
      })
      const { name, dob, gender, marital_status,
        email, mobile_no, pan_number, spouse_name,
        last_name, first_name, father_name, middle_name } = res.pfwresponse.result.profile;
      const { image, provider, cover_plan } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        name: name || '',
        dob: (dob) ? dob.replace(/\\-/g, '/').split('/').reverse().join('-') : '',
        gender: gender || '',
        pan_number: pan_number || '',
        marital_status: marital_status || '',
        email: email || '',
        mobile_no: mobile_no || '',
        spouse_name: spouse_name || '',
        image: image,
        provider: provider,
        cover_plan: cover_plan,
        first_name: first_name || '',
        middle_name: middle_name || '',
        last_name: last_name || '',
        father_name: father_name || ''
      });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  handleChange = () => event => {
    if (event.target.name === 'mobile_no') {
      if (event.target.value.length <= 10) {
        this.setState({
          [event.target.name]: event.target.value,
          [event.target.name + '_error']: ''
        });
      }
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
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
      [name]: maritalOptions[index]['value'],
      [name + '_error']: ''
    });
  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams + '&resume=' + this.state.params.resume
    });
  }

  handleClick = async () => {

    this.sendEvents('next');
    if (this.state.provider !== 'Maxlife' && !validateEmpty(this.state.name)) {
      this.setState({
        name_error: 'Enter valid name'
      });
    } else if (this.state.provider !== 'Maxlife' && !validateAlphabets(this.state.name)) {
      this.setState({
        name_error: 'Name can contain only alphabets'
      });
    } else if (this.state.provider !== 'Maxlife' &&
      validateLengthNames(this.state.name, 'name', this.state.provider).isError) {
      this.setState({
        name_error: validateLengthNames(this.state.name, 'name', this.state.provider).error_msg
      });
    } else if (this.state.provider !== 'Maxlife' && !validateConsecutiveChar(this.state.name)) {
      this.setState({
        name_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (this.state.provider === 'Maxlife' && !validateEmpty(this.state.first_name)) {
      this.setState({
        first_name_error: 'Enter valid first name'
      });
    } else if (this.state.provider === 'Maxlife' && !validateAlphabets(this.state.first_name)) {
      this.setState({
        first_name_error: 'First name can contain only alphabets'
      });
    } else if (this.state.provider === 'Maxlife' &&
      validateLengthNames(this.state.first_name, 'first_name', this.state.provider).isError) {
      this.setState({
        first_name_error: validateLengthNames(this.state.first_name, 'first_name', this.state.provider).error_msg
      });
    } else if (this.state.provider === 'Maxlife' && !validateConsecutiveChar(this.state.first_name)) {
      this.setState({
        first_name_error: 'First name can not contain more than 3 same consecutive characters'
      });
    } else if (this.state.provider === 'Maxlife' && this.state.middle_name &&
      validateLengthNames(this.state.middle_name, 'middle_name', this.state.provider).isError) {
      this.setState({
        middle_name_error: validateLengthNames(this.state.middle_name, 'middle_name', this.state.provider).error_msg
      });
    } else if (this.state.provider === 'Maxlife' && !validateEmpty(this.state.last_name)) {
      this.setState({
        last_name_error: 'Enter valid last name'
      });
    } else if (this.state.provider === 'Maxlife' && !validateAlphabets(this.state.last_name)) {
      this.setState({
        last_name_error: 'Last name can contain only alphabets'
      });
    } else if (this.state.provider === 'Maxlife' &&
      validateLengthNames(this.state.last_name, 'last_name', this.state.provider).isError) {
      this.setState({
        last_name_error: validateLengthNames(this.state.last_name, 'last_name', this.state.provider).error_msg
      });
    } else if (this.state.provider === 'Maxlife' && !validateConsecutiveChar(this.state.last_name)) {
      this.setState({
        last_name_error: 'Last name can not contain more than 3 same consecutive characters'
      });
    } else if (this.state.provider === 'Maxlife' &&
      validateLengthNames(this.state.father_name, 'father_name', this.state.provider).isError) {
      this.setState({
        father_name_error: validateLengthNames(this.state.father_name, 'father_name', this.state.provider).error_msg
      });
    } else if (this.state.provider === 'Maxlife' && !validateConsecutiveChar(this.state.father_name)) {
      this.setState({
        father_name_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (this.state.provider === 'Maxlife' && !validateAlphabets(this.state.father_name)) {
      this.setState({
        father_name_error: 'Name can contain only alphabets'
      });
    } else if (!this.state.gender) {
      this.setState({
        gender_error: 'Mandatory'
      });

    } else if (providerAsIpru(this.state.provider) && !validateEmpty(this.state.pan_number)) {
      this.setState({
        pan_number_error: 'PAN number cannot be empty'
      });
      return;
    } else if (providerAsIpru(this.state.provider) && !validatePan(this.state.pan_number)) {
      this.setState({
        pan_number_error: 'Invalid PAN number'
      });
      return;
    } else if (this.state.provider === 'HDFC' && !this.state.marital_status) {
      this.setState({
        marital_status_error: 'Mandatory'
      });

    } else if (this.state.provider === 'HDFC' && this.state.marital_status === 'MARRIED' && this.state.spouse_name.split(" ").length < 2) {
      this.setState({
        spouse_name_error: 'Enter valid full name'
      });
    } else if (this.state.provider === 'HDFC' && this.state.marital_status === 'MARRIED' && !validateEmpty(this.state.spouse_name)) {
      this.setState({
        spouse_name_error: 'Enter valid full name'
      });
    } else if (this.state.provider === 'HDFC' && this.state.marital_status === 'MARRIED' &&
      validateLengthNames(this.state.spouse_name, 'spouse_name', this.state.provider).isError) {
      this.setState({
        spouse_name_error: validateLengthNames(this.state.spouse_name, 'spouse_name', this.state.provider).error_msg
      });
    } else if (this.state.provider === 'HDFC' && this.state.marital_status === 'MARRIED' && !validateConsecutiveChar(this.state.spouse_name)) {
      this.setState({
        spouse_name_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (this.state.provider === 'HDFC' && this.state.marital_status === 'MARRIED' && !validateAlphabets(this.state.spouse_name)) {
      this.setState({
        spouse_name_error: 'Name can contain only alphabets'
      });
    } else if ((providerAsIpru(this.state.provider) && this.state.params.isKyc) && (this.state.email.length < 10 || !validateEmail(this.state.email))) {
      this.setState({
        email_error: 'Please enter valid email'
      });
    } else if ((providerAsIpru(this.state.provider) && this.state.params.isKyc) &&
      (this.state.mobile_no.length !== 10 || !validateNumber(this.state.mobile_no))) {
      this.setState({
        mobile_no_error: 'Please enter valid mobile no'
      });
    } else if ((providerAsIpru(this.state.provider) && this.state.params.isKyc) &&
      !numberShouldStartWith(this.state.mobile_no)) {
      this.setState({
        mobile_no_error: 'Please enter valid mobile no'
      });
    } else {
      try {
        this.setState({ show_loader: true });

        let data = {};
        data['insurance_app_id'] = this.state.params.insurance_id;
        data['name'] = this.state.name;
        data['gender'] = this.state.gender;

        if (this.state.provider === 'HDFC') {
          data['marital_status'] = this.state.marital_status;

          if (this.state.marital_status === 'MARRIED') {
            data['spouse_name'] = this.state.spouse_name;
          }
        } else if (this.state.provider === 'IPRU') {
          data['pan_number'] = this.state.pan_number;
        } else {
          data['pan_number'] = this.state.pan_number;
          data['first_name'] = this.state.first_name;
          data['last_name'] = this.state.last_name;
          data['father_name'] = this.state.father_name;
          delete data['name'];
        }

        if (this.state.params.isKyc) {
          data.email = this.state.email;
          data.mobile_no = this.state.mobile_no;
        }
        const res = await Api.post('/api/insurance/profile', data);

        if (res.pfwresponse.status_code === 200) {

          this.setState({ show_loader: false });

          if (this.state.provider === 'HDFC') {
            if (this.props.edit) {
              this.navigate('/insurance/edit-personal1');
            } else {
              this.navigate('/insurance/personal1');
            }
          } else {
            if (this.props.edit) {
              if (this.state.params.resume === "yes") {
                this.navigate('/insurance/resume');
              } else {
                this.navigate('/insurance/pincode');
              }
            } else {
              if (this.state.params.isKyc) {
                this.navigate('/insurance/professional');
              } else {
                this.navigate('/insurance/contact');
              }

            }
          }

        } else {
          this.setState({ show_loader: false });
          for (let error of res.pfwresponse.result.errors) {
            this.setState({
              [error.field + '_error']: error.message
            });
          }
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
    }

  }

  renderProvider() {
    if (this.state.provider === 'HDFC') {
      return (
        <div >
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.marital_status_error) ? true : false}
              helperText={this.state.marital_status_error}
              icon={marital}
              width="40"
              label="Marital Status"
              class="MaritalStatus"
              options={maritalOptions}
              id="marital-status"
              value={this.state.marital_status}
              onChange={this.handleMaritalRadioValue('marital_status')} />
          </div>
          {
            this.state.marital_status === 'MARRIED' &&
            <div className="InputField">
              <Input
                error={(this.state.spouse_name_error) ? true : false}
                helperText={this.state.spouse_name_error}
                type="text"
                width="40"
                label="Spouse name *"
                class="SpouseName"
                id="spouse-name"
                name="spouse_name"
                value={this.state.spouse_name}
                onChange={this.handleChange()} />
            </div>
          }
        </div>
      );
    } else {
      return (
        <div>
          {this.state.params.isKyc &&
            <div>
              <div className="InputField">
                <Input
                  error={(this.state.email_error) ? true : false}
                  helperText={this.state.email_error}
                  type="email"
                  icon={email}
                  width="40"
                  label="Email address *"
                  class="Email"
                  id="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange()} />
              </div>
              <div className="InputField">
                <MobileInputWithoutIcon
                  error={(this.state.mobile_no_error) ? true : false}
                  helperText={this.state.mobile_no_error}
                  type="number"
                  icon={phone}
                  width="40"
                  label="Mobile number *"
                  class="Mobile"
                  id="number"
                  name="mobile_no"
                  value={this.state.mobile_no}
                  onChange={this.handleChange()} />
              </div>
            </div>

          }
          <div >
            <div className="InputField">
              <Input
                error={(this.state.pan_number_error) ? true : false}
                helperText={this.state.pan_number_error}
                type="text"
                width="40"
                label="PAN *"
                class="Pan"
                id="pan"
                name="pan_number"
                value={this.state.pan_number}
                onChange={this.handleChange('pan_number')} />
            </div>
          </div>
        </div>
      );
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'personal_details_one',
        "provider": this.state.provider,
        'gender': this.state.gender ? 'yes' : 'no',
        'verify_details_flow': 'no',
        "from_edit": (this.props.edit) ? 'yes' : 'no'
      }
    };


    if (this.state.provider === 'HDFC') {
      eventObj.properties.name = this.state.name ? 'yes' : 'no';
      eventObj.properties['marital_status'] = this.state.marital_status ? 'yes' : 'no';

      if (this.state.marital_status === 'MARRIED') {
        eventObj.properties['spouse_name'] = this.state.spouse_name ? 'yes' : 'no';
      }

    } if (this.state.provider === 'IPRU') {
      eventObj.properties['pan_number'] = this.state.pan_number ? 'yes' : 'no';
      eventObj.properties.name = this.state.name ? 'yes' : 'no';

    } else if (this.state.provider === 'Maxlife') {
      eventObj.properties['pan_number'] = this.state.pan_number ? 'yes' : 'no';
      eventObj.properties['first_name'] = this.state.first_name ? 'yes' : 'no';
      eventObj.properties['last_name'] = this.state.last_name ? 'yes' : 'no';
      eventObj.properties['father_name'] = this.state.father_name ? 'yes' : 'no';
    }


    if (this.state.params.isKyc) {
      eventObj.properties.email = this.state.email ? 'yes' : 'no';
      eventObj.properties.mobile_no = this.state.mobile_no ? 'yes' : 'no';
      eventObj.properties.verify_details_flow = 'yes';
    }

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Application Form"
        smallTitle={this.state.provider}
        count={true}
        total={providerAsIpru(this.state.provider) ? 5 : 4}
        current={this.state.params.isKyc ? 2 : 1}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save & Continue"
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="20" icon={this.state.type !== 'fisdom' ? personal_myway : personal} title={(this.props.edit) ? 'Edit Personal Details' :
            (this.state.params.isKyc && !this.props.edit && providerAsIpru(this.state.provider)) ? 'Verify Personal Details' : 'Personal Details'} />
          {this.state.provider !== 'Maxlife' && <div className="InputField">
            <Input
              type="text"
              productType={this.state.type}
              error={(this.state.name_error) ? true : false}
              helperText={this.state.name_error}
              icon={name}
              width="40"
              label="Full Name *"
              class="FullName"
              id="name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange()} />
          </div>}
          {this.state.provider === 'Maxlife' && <div className="InputField">
            <Input
              type="text"
              productType={this.state.type}
              error={(this.state.first_name_error) ? true : false}
              helperText={this.state.first_name_error}
              icon={name}
              width="40"
              label="First Name *"
              class="FullName"
              id="first_name"
              name="first_name"
              value={this.state.first_name}
              onChange={this.handleChange()} />
          </div>}
          {this.state.provider === 'Maxlife' && <div className="InputField">
            <Input
              type="text"
              productType={this.state.type}
              error={(this.state.last_name_error) ? true : false}
              helperText={this.state.last_name_error}
              icon={name}
              width="40"
              label="Last Name *"
              class="FullName"
              id="last_name"
              name="last_name"
              value={this.state.last_name}
              onChange={this.handleChange()} />
          </div>}

          {this.state.provider === 'Maxlife' &&
            <div className="InputField">
              <Input
                type="text"
                productType={this.state.type}
                error={(this.state.middle_name_error) ? true : false}
                helperText={this.state.middle_name_error}
                icon={name}
                width="40"
                label="Middle Name (optional)"
                class="FullName"
                id="middle_name"
                name="middle_name"
                value={this.state.middle_name}
                onChange={this.handleChange()} />
            </div>
          }
          {this.state.provider === 'Maxlife' && <div className="InputField">
            <Input
              error={(this.state.father_name_error) ? true : false}
              helperText={this.state.father_name_error}
              type="text"
              width="40"
              label="Father's name *"
              class="FatherName"
              id="father-name"
              name="father_name"
              value={this.state.father_name}
              onChange={this.handleChange()} />
          </div>}
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.gender_error) ? true : false}
              helperText={this.state.gender_error}
              icon={marital}
              width="40"
              label="Gender"
              class="MaritalStatus"
              options={genderOptions}
              id="marital-status"
              value={this.state.gender}
              onChange={this.handleGenderRadioValue('gender')} />
          </div>
          {this.renderProvider()}
        </FormControl>
      </Container>
    );
  }
}

export default PersonalDetails1;
