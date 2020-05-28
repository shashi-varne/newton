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
import FHC from '../../FHCClass';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class PersonalDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      fhc_data: new FHC(),
      params: qs.parse(this.props.location.search.slice(1)),
      type: getConfig().productName
    }
  }

  async componentDidMount() {
    try {
      let fhc_data = JSON.parse(window.localStorage.getItem('fhc_data'));
      if (!fhc_data) {
        const res = await Api.get('page/financialhealthcheck/edit/mine', {
          format: 'json',
        });
        console.log('res', res);
        fhc_data = res.pfwresponse.result;
      }
      fhc_data = new FHC(fhc_data);
      this.setState({
        show_loader: false,
        fhc_data,
      });

      var input = document.getElementById('dob');
      input.onkeyup = formatDate;

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  handleChange = name => event => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    if (name === 'dob') {
      if (event.target.value.length > 10) {
        return;
      }
      fhc_data.dob = event.target.value;
    } else {
      fhc_data[name] = event.target.value;
    }
    fhc_data[`${name}_error`] = '';
    this.setState({ fhc_data });
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
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (
      !fhc_data.isValidName() ||
      !fhc_data.isValidDOB() ||
      !fhc_data.isValidEmail()
    ) {
      this.setState({ fhc_data });
    } else {
      window.localStorage.setItem('fhc_data', JSON.stringify(fhc_data));
      this.navigate('personal2');
    }
  };

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
    let { fhc_data } = this.state;
    let eventObj = {
      "event_name": 'fin_health_check',
      "properties": {
        "user_action": user_action,
        "screen_name": 'personal_details_one',
        "provider": fhc_data.provider,
        "email": fhc_data.email ? 'yes' : 'no',
        "name": fhc_data.name ? 'yes' : 'no',
        "dob": fhc_data.dob ? 'yes' : 'no',
        "from_edit": (fhc_data.edit) ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    let currentDate = new Date().toISOString().slice(0, 10);
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Fin Health Check (FHC)"
        count={false}
        total={5}
        current={1}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        topIcon="close"
        buttonTitle="Save & Continue"
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={this.state.type !== 'fisdom' ? personal : personal}
            title={(this.props.edit) ? 'Verify Personal Details' : 'Personal Details'} />
          <div className="InputField">
            <Input
              type="text"
              productType={this.state.type}
              error={(fhc_data.name_error) ? true : false}
              helperText={fhc_data.name_error}
              width="40"
              icon={name}
              label="Full Name *"
              class="FullName"
              id="name"
              name="name"
              value={fhc_data.name}
              onChange={this.handleChange('name')} />
          </div>
          <div className="InputField">
            <Input
              error={(fhc_data.dob_error) ? true : false}
              helperText={fhc_data.dob_error}
              type="text"
              width="40"
              label="Date of birth *"
              icon={dob}
              class="DOB"
              id="dob"
              name="dob"
              max={currentDate}
              value={fhc_data.dob}
              placeholder="DD/MM/YYYY"
              maxLength="10"
              onChange={this.handleChange('dob')} />
          </div>
          <div className="InputField">
            <Input
              error={(fhc_data.email_error) ? true : false}
              helperText={fhc_data.email_error}
              type="email"
              icon={email}
              width="40"
              label="Email address *"
              class="Email"
              id="email"
              name="email"
              value={fhc_data.email}
              onChange={this.handleChange('email')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

function formatDate(event) {
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
  }
}

export default PersonalDetails1;
