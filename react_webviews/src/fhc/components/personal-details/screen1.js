import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import toast from '../../../common/ui/Toast';
import { formatDate } from '../../../utils/validators';
import Container from '../../common/Container';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import Input from '../../../common/ui/Input';
import email from 'assets/email_dark_icn.png';
import dob from 'assets/dob_dark_icn.png';
import name from 'assets/full_name_dark_icn.png';
import FHC from '../../FHCClass';
import { storageService } from '../../../utils/validators';
import { fetchFHCData } from '../../common/ApiCalls';
import { nativeCallback } from 'utils/native_callback';
import { navigate } from '../../common/commonFunctions';
import { getConfig } from 'utils/functions';

class PersonalDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      fhc_data: new FHC(),
      type: getConfig().productName
    };
    this.navigate = navigate.bind(this);
  }

  async componentDidMount() {
    try {
      let fhc_data = storageService().getObject('fhc_data');
      if (!fhc_data) {
        fhc_data = await fetchFHCData();
        storageService().setObject('fhc_data', fhc_data);
      } else {
        fhc_data = new FHC(fhc_data);
      }
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
      toast(err);
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
      storageService().setObject('fhc_data', fhc_data)
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
      "event_name": 'fhc',
      "properties": {
        "user_action": user_action,
        "screen_name": 'personal details',
        "email": fhc_data.email ? 'yes' : 'no',
        "full_name": fhc_data.name ? 'yes' : 'no',
        "date_of_birth": fhc_data.dob ? 'yes' : 'no',
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
        edit={false}
        topIcon="close"
        buttonTitle="Save & Continue"
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/personal.svg`)}
            title='Personal Details' />
          <div className="InputField">
            <Input
              type="text"
              shrink={fhc_data.name}
              error={!!fhc_data.name_error}
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
              shrink={fhc_data.dob}
              error={!!fhc_data.dob_error}
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
              shrink={fhc_data.email}
              error={!!fhc_data.email_error}
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

export default PersonalDetails1;
