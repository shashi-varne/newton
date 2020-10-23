import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';

import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import MobileInputWithoutIcon from '../../../../common/ui/MobileInputWithoutIcon';
import Input from '../../../../common/ui/Input';
import email from 'assets/email_dark_icn.png';
import phone from 'assets/phone_dark_icn.png';
import name from 'assets/full_name_dark_icn.png';
import kotak_logo from 'assets/kotak_life_logo.png';
import Api from 'utils/api';
import { maritalOptions, genderOptions } from '../../../constants';
import {
  validateEmail, validateNumber, numberShouldStartWith,
  validateEmpty, open_browser_web
} from 'utils/validators';
import { getConfig } from 'utils/functions';
import { nativeCallback, openPdfCall } from 'utils/native_callback';

import LoaderModal from '../../../common/Modal';
import TermsAndConditions from '../../../../common/ui/tnc';

class PersonalDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      name: '',
      openModal: false,
      name_error: '',
      email: '',
      mobile_number: '',
      email_error: '',
      mobile_number_error: '',
      provider: '',
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      productName: getConfig().productName,
      tnc: window.sessionStorage.getItem('term_ins_tnc'),
      checked: true
    }
  }

  componentWillMount() {

    nativeCallback({ action: 'take_control_reset' });

    let providerLogoMapper = {
      'KOTAK': {
        'logo': kotak_logo,
        'insurance_title': 'Kotak Life Insurance'
      }
    }

    let provider = this.state.params.provider;
    let current_url = window.location.origin + '/group-insurance/term/intro' + getConfig().searchParams;
    this.setState({
      current_url: current_url,
      provider: provider,
      image: providerLogoMapper[provider].logo,
      insurance_title: providerLogoMapper[provider].insurance_title
    });
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/ins_service/api/insurance/account/summary')
      this.setState({
        show_loader: false
      });

      if (res.pfwresponse.status_code === 200) {
        const { name, email, mobile_number } = res.pfwresponse.result.insurance_account;
        this.setState({
          name: name || '',
          email: email || '',
          mobile_number: mobile_number || '',
        });
      } else if (res.pfwresponse.status_code === 401) {

      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message
          || 'Something went wrong');
      }


    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  handleChange = () => event => {
    if (event.target.name === 'mobile_number') {
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
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {

    this.sendEvents('next');

    var canSubmitForm = true;

    if (!validateEmpty(this.state.name)) {
      canSubmitForm = false;
      this.setState({
        name_error: 'Enter valid full name'
      });
    } else if (this.state.name.split(" ").length < 2) {
      canSubmitForm = false;
      this.setState({
        name_error: 'Enter valid full name'
      });
    }

    if (this.state.email.length < 10 || !validateEmail(this.state.email)) {
      canSubmitForm = false;
      this.setState({
        email_error: 'Please enter valid email'
      });
    }

    if (this.state.mobile_number.length !== 10 || !validateNumber(this.state.mobile_number)) {
      canSubmitForm = false;
      this.setState({
        mobile_number_error: 'Please enter valid mobile no'
      });
    } else if (!numberShouldStartWith(this.state.mobile_number)) {
      canSubmitForm = false;
      this.setState({
        mobile_number_error: 'Please enter valid mobile no'
      });
    }

    if (canSubmitForm) {
      try {
        let openModalMessage = 'Redirecting to ' + this.state.insurance_title + ' portal';
        this.setState({ openModal: true, openModalMessage: openModalMessage });

        var kotakBody = {
          name: this.state.name,
          mobile_no: this.state.mobile_number,
          email: this.state.email
        };
        const res = await Api.post('/api/ins_service/api/insurance/kotak/lead/create', kotakBody);

        if (res.pfwresponse.status_code === 200) {

          var kotakUrl = res.pfwresponse.result.lead;
          if (getConfig().app === 'web') {

            this.setState({
              show_loader: false,
              openModal: false,
              openModalMessage: ''
            });

            open_browser_web(kotakUrl, '_blank');
          } else {

            if (getConfig().app === 'ios') {
              nativeCallback({
                action: 'show_top_bar', message: {
                  title: this.state.insurance_title
                }
              });
            }

            nativeCallback({
              action: 'take_control', message: {
                back_url: this.state.current_url,
                show_top_bar: false,
                back_text: "We suggest you to complete the application process for fast issuance of your insurance.Do you still want to exit the application process"
              },

            });
            nativeCallback({ action: 'show_top_bar', message: { title: this.state.insurance_title } });

            window.location.href = kotakUrl;
          }

        } else {
          this.setState({
            show_loader: false, openModal: false,
            openModalMessage: ''
          });

          toast(res.pfwresponse.result.error || 'Something went wrong');
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
    }

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'basic_detail_v2',
        "provider": this.state.provider,
        'name': this.state.name ? 'yes' : 'no',
        'email': this.state.email ? 'yes' : 'no',
        'mobile_number': this.state.mobile_number ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  bannerText = () => {
    return (
      <span>
        Enter your personal details to get a free quote.
      </span>
    );
  }

  renderModal = () => {
    return (
      <LoaderModal 
        open={this.state.openModal}
        message={this.state.openModalMessage}
        productName={this.state.productName}
      />
    );
  }

  openInBrowser() {

    this.sendEvents('tnc_clicked');
    if (!getConfig().Web) {
      this.setState({
        show_loader: true
      })
    }

    let data = {
      url: this.state.tnc,
      header_title: 'Terms & Conditions',
      icon: 'close'
    };

    openPdfCall(data);
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        hide_header={this.state.show_loader}
        title="Personal Details"
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        buttonTitle="Save & Continue"
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <div className="InputField">
            <Input
              type="text"
              productType={this.state.type}
              error={(this.state.name_error) ? true : false}
              helperText={this.state.name_error}
              icon={name}
              width="40"
              label="Full Name"
              class="FullName"
              id="name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.email_error) ? true : false}
              helperText={this.state.email_error}
              type="email"
              icon={email}
              width="40"
              label="Email address"
              class="Email"
              id="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <MobileInputWithoutIcon
              error={(this.state.mobile_number_error) ? true : false}
              helperText={this.state.mobile_number_error}
              type="number"
              icon={phone}
              width="40"
              label="Mobile number"
              class="Mobile"
              id="number"
              name="mobile_number"
              value={this.state.mobile_number}
              onChange={this.handleChange()} />
          </div>
        </FormControl>
        <TermsAndConditions parent={this} />
        {this.renderModal()}
      </Container>
    );
  }
}

export default PersonalDetails1;
