import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import MobileInputWithIcon from '../../ui/MobileInputWithIcon';
import email from '../../assets/email_dark_icn.png';
import phone from '../../assets/phone_dark_icn.png';
import Api from '../../service/api';
import qs from 'query-string';

class ContactDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      mobile_no: '',
      show_loader: false,
      params: qs.parse(props.history.location.search)
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async componentDidMount() {
    this.setState({show_loader: true});
    const res = await Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'contact'
    });

    const { email, mobile_no } = res.pfwresponse.result.profile;

    await this.setStateAsync({
      show_loader: false,
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
    this.setState({show_loader: true});
    const res = await Api.post('/api/insurance/profile', {
      insurance_app_id: this.state.params.insurance_id,
      email: this.state.email,
      mobile_no: this.state.mobile_no
    });

    if (res.pfwresponse.status_code === 200) {
      this.setState({show_loader: true});
      if (this.props.edit) {
        this.props.history.push({
          pathname: '/edit-contact1',
          search: '?insurance_id='+this.state.params.insurance_id
        });
      } else {
        this.props.history.push({
          pathname: '/contact1',
          search: '?insurance_id='+this.state.params.insurance_id
        });
      }
    } else {
      this.setState({show_loader: false});
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
        showLoader={this.state.show_loader}
        title={(this.props.edit) ? 'Edit Contact Details' : 'Contact Details'}
        count={true}
        total={4}
        current={2}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save & Continue"
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
