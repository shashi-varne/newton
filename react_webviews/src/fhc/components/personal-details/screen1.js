import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import personal from 'assets/personal_details_icon.svg';
import Input from '../../../common/ui/Input';
import email from 'assets/email_dark_icn.png';
import dob from 'assets/dob_dark_icn.png';
import name from 'assets/full_name_dark_icn.png';
import Api from 'utils/api';
import {
  validateEmail, isValidDate, validateEmpty,
  validateLengthNames, validateConsecutiveChar, validateAlphabets
} from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class PersonalDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      name: '',
      name_error: '',
      dob: '',
      dob_error: '',
      email: '',
      email_error: '',
      image: '',
      provider: '',
      params: qs.parse(this.props.location.search.slice(1)),
      type: getConfig().productName
    }
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/profile/' + this.state.params.insurance_id, {
        groups: 'contact'
      });
      const { email, mobile_no } = res.pfwresponse.result.profile;
      const { image, provider, cover_plan } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        email: email || '',
        mobile_no: mobile_no || '',
        image: image,
        provider: provider,
        cover_plan: cover_plan
      });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  handleChange = name => event => {
    if (name === 'dob') {
      let errorDate = '';
      if (event.target.value.length > 10) {
        return;
      }

      var input = document.getElementById('dob');

      input.onkeyup = function (event) {
        var key = event.keyCode || event.charCode;

        var thisVal;

        let slash = 0;
        for (var i = 0; i < event.target.value.length; i++) {
          if (event.target.value[i] === '/') {
            slash += 1;
          }
        }

        if (slash <= 1 && key !== 8 && key !== 46) {
          var strokes = event.target.value.length;

          if (strokes === 2 || strokes === 5) {
            thisVal = event.target.value;
            thisVal += '/';
            event.target.value = thisVal;
          }
          // if someone deletes the first slash and then types a number this handles it
          if (strokes >= 3 && strokes < 5) {
            thisVal = event.target.value;
            if (thisVal.charAt(2) !== '/') {
              var txt1 = thisVal.slice(0, 2) + "/" + thisVal.slice(2);
              event.target.value = txt1;
            }
          }
          // if someone deletes the second slash and then types a number this handles it
          if (strokes >= 6) {
            thisVal = event.target.value;

            if (thisVal.charAt(5) !== '/') {
              var txt2 = thisVal.slice(0, 5) + "/" + thisVal.slice(5);
              event.target.value = txt2;
            }
          }
        };

      }

      this.setState({
        [name]: event.target.value,
        age: this.calculateAge(event.target.value.replace(/\\-/g, '/').split('/').reverse().join('/')),
        [event.target.name + '_error']: errorDate
      })
    } else {
      this.setState({
        [name]: event.target.value,
        [name + '_error']: '',
      });
    }
  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        disableBack: true
      }
    });
  }

  handleClick = () => {
    // this.sendEvents('next');
    if (this.state.name.split(" ").filter(e => e).length < 2) {
      this.setState({
        name_error: 'Enter valid full name'
      });
    } else if (!validateEmpty(this.state.name)) {
      this.setState({
        name_error: 'Enter valid full name'
      });
    } else if (validateLengthNames(this.state.name, 'name', this.state.provider).isError) {
      this.setState({
        name_error: validateLengthNames(this.state.name, 'name', this.state.provider).error_msg
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
    } else if (!isValidDate(this.state.dob)) {
      this.setState({
        dob_error: 'Please select valid date'
      });
    } else if (this.calculateAge(this.state.dob.replace(/\\-/g, '/').split('/').reverse().join('/')) < 0) {
      this.setState({
        dob_error: 'Future date is not allowed'
      });
    } else if (this.state.email.length < 10 || !validateEmail(this.state.email)) {
      this.setState({
        email_error: 'Please enter valid email'
      });
    } else {
      console.log('ALL VALID - SCREEN 1');
      this.navigate('/fhc/personal2');
    }
  };

  handleChange = name => event => {
    if (name === 'dob') {
      let errorDate = '';
      if (event.target.value.length > 10) {
        return;
      }

      var input = document.getElementById('dob');

      input.onkeyup = function (event) {
        var key = event.keyCode || event.charCode;

        var thisVal;

        let slash = 0;
        for (var i = 0; i < event.target.value.length; i++) {
          if (event.target.value[i] === '/') {
            slash += 1;
          }
        }

        if (slash <= 1 && key !== 8 && key !== 46) {
          var strokes = event.target.value.length;

          if (strokes === 2 || strokes === 5) {
            thisVal = event.target.value;
            thisVal += '/';
            event.target.value = thisVal;
          }
          // if someone deletes the first slash and then types a number this handles it
          if (strokes >= 3 && strokes < 5) {
            thisVal = event.target.value;
            if (thisVal.charAt(2) !== '/') {
              var txt1 = thisVal.slice(0, 2) + "/" + thisVal.slice(2);
              event.target.value = txt1;
            }
          }
          // if someone deletes the second slash and then types a number this handles it
          if (strokes >= 6) {
            thisVal = event.target.value;

            if (thisVal.charAt(5) !== '/') {
              var txt2 = thisVal.slice(0, 5) + "/" + thisVal.slice(5);
              event.target.value = txt2;
            }
          }
        };

      }

      this.setState({
        [name]: event.target.value,
        age: this.calculateAge(event.target.value.replace(/\\-/g, '/').split('/').reverse().join('/')),
        [name + '_error']: errorDate
      })
    } else {
      this.setState({
        [name]: event.target.value,
        [name + '_error']: ''
      });
    }
  };

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
        Let's get started with your basic information
      </span>
    );
  }

  handleFocus = () => event => {
    let currentDate = new Date().toISOString().slice(0, 10);
    document.getElementById("dob").valueAsDate = new Date(currentDate);
    document.getElementById("dob").max = currentDate;
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'fin_health_check',
      "properties": {
        "user_action": user_action,
        "screen_name": 'personal_details_one',
        "provider": this.state.provider,
        "email": this.state.email ? 'yes' : 'no',
        "name": this.state.name ? 'yes' : 'no',
        "dob": this.state.dob ? 'yes' : 'no',
        "from_edit": (this.state.edit) ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    let currentDate = new Date().toISOString().slice(0, 10);
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Application Form"
        smallTitle={this.state.provider}
        count={false}
        total={5}
        current={1}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        topIcon="close"
        buttonTitle="Save & Continue"
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={this.state.type !== 'fisdom' ? personal : personal}
            title={(this.props.edit) ? 'Verify Personal Details' : 'Personal Details'} />
          <div className="InputField">
            <Input
              type="text"
              productType={this.state.type}
              error={(this.state.name_error) ? true : false}
              helperText={this.state.name_error}
              width="40"
              icon={name}
              label="Full Name *"
              class="FullName"
              id="name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange('name')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.dob_error) ? true : false}
              helperText={this.state.dob_error}
              type="text"
              width="40"
              label="Date of birth *"
              icon={dob}
              class="DOB"
              id="dob"
              name="dob"
              max={currentDate}
              value={this.state.dob}
              placeholder="DD/MM/YYYY"
              maxLength="10"
              onChange={this.handleChange('dob')} />
          </div>
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
              onChange={this.handleChange('email')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default PersonalDetails1;
