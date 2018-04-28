import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import MobileInputWithIcon from '../../ui/MobileInputWithIcon';
import email from '../../assets/email_dark_icn.png';
import phone from '../../assets/phone_dark_icn.png';
import Api from '../../utils/api';
import qs from 'qs';
import { validateEmail, validateNumber } from '../../utils/validators';

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
      params: qs.parse(this.props.location.search.slice(1))
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  componentDidMount() {
    Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'contact'
    }).then(res => {
      const { email, mobile_no } = res.pfwresponse.result.profile;
      const { image } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        email: email || '',
        mobile_no: mobile_no || '',
        image: image
      });
    }).catch(error => {
      this.setState({show_loader: false});
      console.log(error);
    });
  }

  handleChange = () => event => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name+'_error']: ''
    });
  };

  handleClick = async () => {
    if (!validateEmail(this.state.email)) {
      this.setState({
        email_error: 'Please enter valid email'
      });
    } else if (this.state.mobile_no.length !== 10 || !validateNumber(this.state.mobile_no)) {
      this.setState({
        mobile_no_error: 'Please enter valid mobile no'
      });
    } else {
      this.setState({show_loader: true});
      const res = await Api.post('/api/insurance/profile', {
        insurance_app_id: this.state.params.insurance_id,
        email: this.state.email,
        mobile_no: this.state.mobile_no
      });

      if (res.pfwresponse.status_code === 200) {
        this.setState({show_loader: false});
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
        for (let error of res.pfwresponse.result.errors) {
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
        logo={this.state.image}
        >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
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
              onChange={this.handleChange('email')} />
          </div>
          <div className="InputField">
            <MobileInputWithIcon
              error={(this.state.mobile_no_error) ? true : false}
              helperText={this.state.mobile_no_error}
              type="number"
              icon={phone}
              width="40"
              label="Mobile number"
              class="Mobile"
              id="number"
              name="mobile_no"
              value={this.state.mobile_no}
              onChange={this.handleChange('mobile_no')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default ContactDetails1;
