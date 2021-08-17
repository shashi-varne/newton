import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import Input from '../../../common/ui/Input';
import { validateEmail } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import Api from 'utils/api';
class SendEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      email: "",
      email_error: '',
      change_email: false,
      params: qs.parse(props.history.location.search.slice(1)),
      productName: getConfig().productName
    }
  }

  async componentDidMount() {
    this.setState({
      show_loader: false
    });

    this.setState({
      email: this.state.params.email,
      updatedEmail: this.state.params.email
    })
  }

  handleChange = (field) => (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + '_error']: ''
    });

  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url + '&key=' + this.state.params.key +
        '&name=' + this.state.params.name + '&email=' + this.state.updatedEmail
    });
  }

  changeEmail() {
    this.setState({
      change_email: true
    })
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Campaign OTM Upload',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Resend OTM',
        'email_changed': this.state.change_email ? 'yes' : 'no',
        'email': this.state.email_error ? 'invalid' : this.state.email ? 'valid' : 'empty',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {
    if (!validateEmail(this.state.email)) {
      this.setState({
        email_error: 'Please enter valid email'
      });
    } else {
      try {
        this.setState({
          show_loader: true
        });
        this.setState({
          updatedEmail: this.state.email
        })
        const res = await Api.get('/api/mandate/mine/mail/mandate?email=' + this.state.email + '&mandate_urlsafe=' + this.state.params.key);
        if (res.pfwresponse.result.message === 'success') {
          this.setState({
            show_loader: false
          });
          this.navigate('email-success');
        } else {
          this.setState({
            updatedEmail: this.state.params.email
          })
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

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Confirm Email"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Continue"
        events={this.sendEvents('just_set_events')}
      >
        <div style={{ textAlign: 'center' }}>
          <img style={{ width: '25%' }} src={require(`assets/${this.state.productName}/mandate_pending_icon.svg`)} alt="OTM" />
        </div>
        <div style={{
          color: getConfig().default,
          fontSize: 16, textAlign: 'center', fontWeight: 500,
          margin: '20px 0 10px 0'
        }}>
          Hey {this.state.params.name},
        </div>
        <div style={{
          color: getConfig().default, margin: '10px 0px 10px 0px',
          fontSize: 16, textAlign: 'center'
        }}>
          We will email you a Bank Mandate(OTM) form,
upload the signed copy of it:
        </div>
        <div style={{ marginTop: 30 }}>
          <div style={{ width: '80%', float: 'left' }}>
            {!this.state.change_email && <div style={{ fontSize: 13, color: '#a2a2a2' }}>Email</div>}
            {this.state.change_email && <div className="InputField" style={{ marginTop: '-6px' }}>
              <Input
                error={(this.state.email_error) ? true : false}
                helperText={this.state.email_error}
                type="email"
                width="40"
                label="Email"
                class="Email"
                id="email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange('email')} />
            </div>}
            {!this.state.change_email && <div style={{ fontSize: 16, color: '#4a4a4a', marginTop: 8 }}>
              {this.state.email}
            </div>}
          </div>
          {!this.state.change_email && <div style={{
            fontSize: 13, color: getConfig().secondary, position: 'relative',
            marginTop: 10, fontWeight: 500
          }} onClick={() => this.changeEmail()}>
            Change
          </div>}
        </div>
      </Container>
    );
  }
}

export default SendEmail;
