import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import MobileInputWithIcon from '../../ui/MobileInputWithIcon';
import email from '../../assets/email_dark_icn.png';
import phone from '../../assets/phone_dark_icn.png';

class ContactDetails1 extends Component {
  state = {
    fullName: '',
    dob: '',
    gender: '',
    maritalStatus: ''
  }

  handleInput = (e) => {
    this.setState({
      fullName: e.target.value
    });
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
        state={this.state}
        banner={true}
        bannerText={this.bannerText()}
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
              onChange={this.handleInput} />
          </div>
          <div className="InputField">
            <MobileInputWithIcon
              type="number"
              icon={phone}
              width="40"
              label="Mobile number"
              class="Mobile"
              id="number"
              onChange={this.handleInput} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default ContactDetails1;
