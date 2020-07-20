import React, { Component } from 'react';

import qs from 'qs';
import Container from '../common/Container';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import thumb from 'assets/thumb.svg';
import edit from 'assets/edit.svg';
import '../../utils/native_listner_otm';
import { nativeCallback } from 'utils/native_callback';
import Input from '../../common/ui/Input';
import MobileInputWithoutIcon from '../../common/ui/MobileInputWithoutIcon';
import { validateEmail, validateNumber, numberShouldStartWith } from 'utils/validators';
import toast from '../../common/ui/Toast';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';

class Thankyou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      subcategory: '',
      query: '',
      email: '',
      email_error: '',
      mobile_no: '',
      mobile_no_error: '',
      is_email_not_present: false,
      is_mobile_not_present: false,
      openDialog: false,
      params: qs.parse(props.history.location.search.slice(1)),
    }
  }

  componentDidMount() {
    const {user, kyc_detail} = this.props.location.state.user;

    let email = !user.email ? kyc_detail.email : user.email;
    let mobile = !user.mobile ? kyc_detail.mobile : user.mobile;

    this.setState({
      email: email,
      mobile_no: mobile ? ((mobile.indexOf('|') > 1) ? mobile.split('|')[1] : mobile) : mobile,
      is_email_not_present: email ? true : false,
      is_mobile_not_present: mobile ? true : false
    })
  }

  navigate = (pathname) => {
    if (navigator.onLine) {
      this.props.history.push({
        pathname: pathname,
        search: getConfig().searchParams
      });
    } else {
      this.setState({
        openDialog: true
      });
    }
  }

  handleClose = () => {
    this.setState({
      openDialog: false
    });
  }

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Check your connection and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="DialogButtonFullWidth" onClick={this.handleClose} color="secondary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleClick = async () => {
    if (this.state.is_email_not_present && this.state.is_mobile_not_present) {
      this.navigate('/help');
    } else {
      this.submitUserData('next');
    }

  }

  secondaryHandleClick = async () => {
    if (this.state.is_email_not_present && this.state.is_mobile_not_present) {
      nativeCallback({ action: 'exit' });
    } else {
      this.submitUserData('home');
    }
  }

  submitUserData = async (type) => {
    if (!this.state.is_email_not_present && !this.state.email) {
      this.setState({
        email_error: 'Please enter valid email'
      });
    } else if (!this.state.is_email_not_present && (this.state.email && (this.state.email.length < 10 || !validateEmail(this.state.email)))) {
      this.setState({
        email_error: 'Please enter valid email'
      });
    } else if (!this.state.is_mobile_not_present && (this.state.mobile_no && (this.state.mobile_no.length !== 10 || !validateNumber(this.state.mobile_no)))) {
      this.setState({
        mobile_no_error: 'Please enter valid mobile no'
      });
    } else if (!this.state.is_mobile_not_present && !numberShouldStartWith(this.state.mobile_no)) {
      this.setState({
        mobile_no_error: 'Please enter valid mobile no'
      });
    } else {
      try {
        this.setState({ show_loader: true });

        let data = {
          'kyc': {
            'address': {}
          }
        };

        if (!this.state.is_email_not_present) {
          data['kyc']['address']['email'] = this.state.email;
        }
        if (!this.state.is_mobile_not_present) {
          data['kyc']['address']['mobile_number'] = (this.state.mobile_no.indexOf('|') > 1) ? this.state.mobile_no : '91|' + this.state.mobile_no;
        }

        const res = await Api.post('/api/kyc/v2/mine', data);

        if (res.pfwresponse.status_code === 200) {
          let eventObj = {
            "event_name": "help_n_support",
            "properties": {
              "screen_name": 'thank_you',
              'user_action': 'another_query'
            }
          };

          nativeCallback({ events: eventObj });

          this.setState({ show_loader: false });

          if (type === 'home') {
            nativeCallback({ action: 'exit' });
          } else if (type === 'next') {
            this.navigate('/help');
          }
        } else {
          this.setState({ show_loader: false });
          toast(res.pfwresponse.result.error);
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
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
  }

  showEdit() {
    return (
      <div className="editicon">
        <img src={edit} alt="" />
      </div>
    );
  }

  render() {
    return (
      <Container
        title={'Write to us'}
        buttonTitle="OK"
        handleClick={this.handleClick}
        hideheader={true}
      >
        <div className="Help pad20">
          <div className="thankyou">
            <img src={thumb} width="80" alt="" />
            <div className="title">Thank you for writing to us</div>
            <div className="description">Our support team will update you on your query within the next 6 working hours. Please check and confirm your contact details.</div>
            <div className="userdetail">
              <div className="InputField">
                <Input
                  error={(this.state.email_error) ? true : false}
                  helperText={this.state.email_error}
                  type="email"
                  width="40"
                  label="Email address"
                  class="Email"
                  id="email"
                  name="email"
                  value={this.state.email || ''}
                  onChange={this.handleChange()}
                  disabled={this.state.is_email_not_present} />
                {!this.state.email && this.showEdit()}
              </div>
              <div className="InputField">
                <MobileInputWithoutIcon
                  error={(this.state.mobile_no_error) ? true : false}
                  helperText={this.state.mobile_no_error}
                  type="number"
                  width="40"
                  label="Mobile number"
                  class="Mobile"
                  id="number"
                  name="mobile_no"
                  value={this.state.mobile_no || ''}
                  onChange={this.handleChange()}
                  disabled={this.state.is_mobile_not_present} />
                {!this.state.mobile_no && this.showEdit()}
              </div>
            </div>
          </div>
        </div>
        {this.renderDialog()}
      </Container>
    );
  }
}

export default Thankyou;