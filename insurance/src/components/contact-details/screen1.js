import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import MobileInputWithIcon from '../../ui/MobileInputWithIcon';
import email from '../../assets/email_dark_icn.png';
import phone from '../../assets/phone_dark_icn.png';
import Api from '../../service/api';

class ContactDetails1 extends Component {
  state = {
    email: '',
    mobile_no: ''
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async componentDidMount() {
    const res = await Api.get('/api/insurance/profile/5668600916475904', {
      groups: 'contact'
    });

    const { email, mobile_no } = res.pfwresponse.result.profile;

    await this.setStateAsync({
      email: email,
      mobile_no: mobile_no
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleClick = async () => {
    const res = await Api.post('/api/insurance/profile', {
      insurance_app_id: 5668600916475904,
      email: this.state.email,
      mobile_no: this.state.mobile_no
    });

    if (res.pfwresponse.status_code === 200) {
      this.props.history.push('contact-details-2');
    } else {
      alert('Error');
      console.log(res.pfwresponse.result.error);
    }
  }

  bannerText = () => {
    return (
      <span>
        Your policy will be <em><b>emailed</b></em> to you.<br/>Let's stay connected!
      </span>
    );
  }

  render() {
    return (
      <Container
        title={'Contact Details'}
        count={true}
        total={5}
        current={2}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              type="email"
              icon={email}
              width="40"
              label="Email address"
              class="Email"
              id="email"
              value={this.state.email}
              onChange={this.handleChange('email')} />
          </div>
          <div className="InputField">
            <MobileInputWithIcon
              type="number"
              icon={phone}
              width="40"
              label="Mobile number"
              class="Mobile"
              id="number"
              value={this.state.mobile_no}
              onChange={this.handleChange('mobile_no')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default ContactDetails1;
