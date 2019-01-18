import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import Input from '../../ui/Input';
import Grid from 'material-ui/Grid';
import Checkbox from 'material-ui/Checkbox';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

class GoldRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      userInfo: {},
      name: "",
      email: "",
      pin_code: "",
      mobile_no: "",
      goldInfo: {},
      isRegistered: false,
      openDialog: false,
      openPopup: false,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      checked: false
    }
  }

  componentWillMount() {
    if (this.state.ismyway) {
      this.setState({
        type: 'myway'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime'
      });
    } else {
      this.setState({
        type: 'fisdom'
      });
    }
  }

  componentDidMount() {
    Api.get('/api/gold/user/account').then(res => {
      if (res.pfwresponse.status_code == 200) {
        let result = res.pfwresponse.result;
        let isRegistered = true;
        let userInfo = result.gold_user_info.user_info;
        if (userInfo.registration_status == "pending" ||
          !userInfo.registration_status ||
          result.gold_user_info.is_new_gold_user) {
          isRegistered = false;
        }

        const { name, email, pin_code, mobile_no } = userInfo;

        this.setState({
          show_loader: false,
          goldInfo: result.gold_user_info.safegold_info,
          userInfo: userInfo,
          isRegistered: isRegistered,
          name: name || "",
          email: email || "",
          pin_code: pin_code || "",
          mobile_no: mobile_no || "",
        });

        if (userInfo.mobile_verified == false &&
          isRegistered == false) {
          // $state.go('my-gold');
          return;
        }
        // this.checkPincode();

      } else {
        this.setState({
          show_loader: false, openDialog: true,
          apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
        });
      }

    }).catch(error => {
      this.setState({ show_loader: false });
      console.log(error);
    });

  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleChange = (field) => (event) => {
    if (event.target.name === 'checked') {
      this.setState({
        [event.target.name]: event.target.checked
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    }
  }


  handlePincode = (name) => async (event) => {
    // const pincode = event.target.value;

    // this.setState({
    //   [name]: pincode,
    //   [name+'_error']: ''
    // });

    // if (pincode.length === 6) {
    //   const res = await Api.get('/api/pincode/' + pincode);

    //   if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
    //     if (name === 'pincode') {
    //       this.setState({
    //         city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
    //         state: res.pfwresponse.result[0].state_name
    //       });
    //     } else {
    //       this.setState({
    //         ccity: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
    //         cstate: res.pfwresponse.result[0].state_name
    //       });
    //     }
    //   } else {
    //     this.setState({
    //       city: '',
    //       state: '',
    //       ccity: '',
    //       cstate: ''
    //     });
    //   }
    // }
  }

  verifyMobile = async () => {
    this.setState({
      show_loader: true
    });

    let options = {
      mobile_number: this.state.mobile_no,
    }
    const res = await Api.post('/api/gold/user/verify/mobilenumber', options);

    if (res.pfwresponse.status_code === 200) {

      let result = res.pfwresponse.result;
      if (result.resend_verification_otp_link != '' && result.verification_link != '') {
        window.localStorage.setItem('fromType', 'buy')
        var message = 'An OTP is sent to your mobile number ' + this.state.mobile_no + ', please verify to complete registration.'
        this.props.history.push({
          pathname: 'verify',
          search: '?base_url=' + this.state.params.base_url,
          params: {
            resend_link: result.resend_verification_otp_link,
            verify_link: result.verification_link, message: message, fromType: 'buy',
            message: message
          }
        });
      }
      this.setState({
        show_loader: false,
      });
    } else {
      this.setState({
        show_loader: false, openDialog: true,
        apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
      });
    }
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      openPopup: false
    });
  }

  renderResponseDialog = () => {
    return (
      <Dialog
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.state.apiError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleClick = async () => {
    this.setState({
      show_loader: true
    });

    let options = this.state.userInfo;

    options.name = this.state.name;
    options.mobile_no = this.state.mobile_no;
    options.email = this.state.email;
    options.pin_code = this.state.pin_code;

    const res = await Api.post('/api/gold/user/account', options);

    if (res.pfwresponse.status_code === 200) {
      this.verifyMobile();
    } else {

      if (res.pfwresponse.result.error != 'User with the same mobile number exists!' &&
        (this.state.userInfo.mobile_verified == false || res.pfwresponse.resultmobile_verified == false)) {
        this.verifyMobile();
      } else {
        this.setState({
          show_loader: false, openDialog: true,
          apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
        });
      }

    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Registration"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="register-form">
          <div className="InputField">
            <Input
              error={false}
              helperText=''
              type="text"
              width="40"
              label="Name *"
              class="name"
              id="name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange('name')} />
          </div>
          <div className="InputField">
            <Input
              error={false}
              helperText=''
              type="number"
              width="40"
              label="Mobile number *"
              class="Mobile"
              id="number"
              name="mobile_no"
              value={this.state.mobile_no}
              onChange={this.handleChange('mobile_no')} />
          </div>
          <div className="InputField">
            <Input
              error={false}
              helperText=''
              type="email"
              width="40"
              label="Email address *"
              class="Email"
              id="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange('email')} />
          </div>
          <div className="InputField">
            <Input
              error={false}
              helperText=''
              type="number"
              width="40"
              label="Pincode *"
              id="pincode"
              name="pin_code"
              value={this.state.pin_code}
              onChange={this.handleChange('pin_code')} />
          </div>
          <div className="CheckBlock">
            <Grid container spacing={16} alignItems="center">
              <Grid item xs={2} className="TextCenter">
                <Checkbox
                  defaultChecked
                  checked={this.state.checked}
                  color="default"
                  value="checked"
                  name="checked"
                  onChange={this.handleChange('checkbox')}
                  className="Checkbox" />
              </Grid>
              <Grid item xs={10}>
                <span className="Terms">I agree to the <a href="#">Terms and Conditions</a></span>
              </Grid>
            </Grid>
          </div>
        </div>
        {this.renderResponseDialog()}
      </Container>
    );
  }
}

export default GoldRegister;
