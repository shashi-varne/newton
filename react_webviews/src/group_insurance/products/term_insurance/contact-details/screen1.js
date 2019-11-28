import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../../common/ui/Toast';

import Container from '../../../common/Container';
import MobileInputWithoutIcon from '../../../../common/ui/MobileInputWithoutIcon';
import TitleWithIcon from '../../../../common/ui/TitleWithIcon';
import contact from 'assets/contact_details_icon.svg';
import contact_myway from 'assets/contact_details_icn.svg';
import Input from '../../../../common/ui/Input';
import email from 'assets/email_dark_icn.png';
import phone from 'assets/phone_dark_icn.png';
import Api from 'utils/api';
import { validateEmail, validateNumber, numberShouldStartWith, providerAsIpru } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class ContactDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      email: '',
      mobile_no: '',
      email_error: '',
      mobile_no_error: '',
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        disableBack: true
      }
    });
  }

  handleClick = async () => {
    this.sendEvents('next');
    if (this.state.email.length < 10 || !validateEmail(this.state.email)) {
      this.setState({
        email_error: 'Please enter valid email'
      });
    } else if (this.state.mobile_no.length !== 10 || !validateNumber(this.state.mobile_no)) {
      this.setState({
        mobile_no_error: 'Please enter valid mobile no'
      });
    } else if (!numberShouldStartWith(this.state.mobile_no)) {
      this.setState({
        mobile_no_error: 'Please enter valid mobile no'
      });
    } else {
      try {
        this.setState({ show_loader: true });
        const res = await Api.post('/api/insurance/profile', {
          insurance_app_id: this.state.params.insurance_id,
          email: this.state.email,
          mobile_no: this.state.mobile_no
        });

        if (res.pfwresponse.status_code === 200) {

          this.setState({ show_loader: false });
          if (this.props.edit) {

            if (this.state.provider === 'HDFC' && this.state.plutus_payment_status !== 'payment_done') {
              if (this.state.plutus_payment_status !== 'payment_done') {
                this.navigate('summary');
              } else {
                this.navigate('edit-contact1');
              }

            } else {
              this.navigate('summary');
            }
          } else {
            if (this.state.provider === 'HDFC' && this.state.plutus_payment_status !== 'payment_done') {
              if (this.state.plutus_payment_status !== 'payment_done') {
                this.navigate('professional');
              } else {
                this.navigate('contact1');
              }

            } else {
              this.navigate('professional');
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

  bannerText = () => {
    return (
      <span>
        Your policy will be <b>emailed</b> to you.<br />Let's stay connected!
      </span>
    );
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'contact_details_one',
        "provider": this.state.provider,
        "email": this.state.email ? 'yes' : 'no',
        "mobile": this.state.mobile_no ? 'yes' : 'no',
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
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Application Form"
        smallTitle={this.state.provider}
        count={true}
        total={providerAsIpru(this.state.provider) ? 5 : 4}
        current={2}
        banner={false}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save & Continue"
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={this.state.type !== 'fisdom' ? contact_myway : contact}
            title={(this.props.edit) ? 'Edit Contact Details' : 'Contact Details'} />
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
        </FormControl>
      </Container>
    );
  }
}

export default ContactDetails1;
