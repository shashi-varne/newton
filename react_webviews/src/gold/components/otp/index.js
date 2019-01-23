import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import Input from '../../ui/Input';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { ToastContainer } from 'react-toastify';
import toast from '../../ui/Toast';

class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      otpnumber: '',
      otpnumber_error: '',
      messageOtp: '',
      openResponseDialog: false,
      otpVerified: false,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }
  }

  componentWillMount() {
    let { params } = this.props.location;
    if (!params) {
      this.navigate('my-gold');
      return;
    }
    if (params.resend_link === null || params.verify_link === null) {
      this.navigate('my-gold');
      return;
    }

    this.setState({
      resend_link: params ? params.resend_link : '',
      verify_link: params ? params.verify_link : '',
      fromTypeDeliveryOtp: params ? params.fromType : '',
      messageOtp: params ? params.message : 'An OTP is sent to your registered mobile number, please verify to complete the process.',
    })
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
    this.setState({
      show_loader: false,
    });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleClick = async () => {

    if (!this.state.otpnumber) {
      this.setState({
        otpnumber_error: 'Please enter OTP'
      })
      return;
    }

    if (this.state.otpnumber.length !== 4) {
      this.setState({
        otpnumber_error: 'OTP is a 4 digit number'
      })
      return;
    }
    let url = this.state.params.base_url + this.state.verify_link + '?otp=' + this.state.otpnumber;

    try {
      this.setState({
        show_loader: true
      })
      const res = await Api.post(url);

      if (res.pfwresponse.status_code === 200) {

        let result = res.pfwresponse.result;
        if (result.message === 'success' || result.message === 'Success!!') {
          this.handleOtpVerified();
        } else {
          this.setState({
            show_loader: false,
            otpVerified: false,
            openResponseDialog: true,
            apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
          });
        }

      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }
  }

  handleChange = (field) => (event) => {
    if (event.target.value.length > 4) {
      return;
    }

    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + '_error']: ''
    });
  }

  resendOtp = async () => {
    let url = this.state.params.base_url + this.state.resend_link;
    try {
      this.setState({
        show_loader: true
      });
      const res = await Api.post(url);

      if (res.pfwresponse.status_code === 200) {

        let result = res.pfwresponse.result;
        if (result.resend_verification_otp_link !== '' && result.verification_link !== '') {
          var message = 'An OTP is sent to your mobile number ' + this.state.mobile_no + ', please verify to complete registration.'
          this.setState({
            show_loader: false,
            resend_link: result.resend_verification_otp_link,
            verify_link: result.verification_link, message: message
          })
        }
        this.setState({
          show_loader: false
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }

  };

  handleClose = () => {
    this.setState({
      openResponseDialog: false,
      openPopup: false
    });
  }

  handleOtpVerified = () => {
    if (this.state.fromTypeDeliveryOtp === 'buy') {
      this.navigate('my-gold');
    } else if (this.state.fromTypeDeliveryOtp === 'delivery') {
      if (window.localStorage.getItem('goldProduct')) {
        let product = JSON.parse(window.localStorage.getItem('goldProduct'));
        product.isFisdomVerified = true;
        window.localStorage.setItem('goldProduct', JSON.stringify(product));
        this.navigate('gold-delivery-order');
      } else {
        this.navigate('my-gold');
      }

    } else {
      this.navigate('my-gold');
    }
  }

  renderResponseDialog = () => {
    return (
      <Dialog
        open={this.state.openResponseDialog}
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
          {!this.state.otpVerified && <Button onClick={this.handleClose} color="primary" autoFocus>
            OK
          </Button>}
          {this.state.otpVerified && <Button onClick={this.handleOtpVerified} color="primary" autoFocus>
            Proceed
          </Button>}
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Verify OTP"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="otp-body">
          <div className="otp-input">
            <div className="InputField">
              <Input
                error={(this.state.otpnumber_error) ? true : false}
                helperText={this.state.otpnumber_error}
                type="text"
                width="40"
                label="Enter OTP"
                class="otp"
                id="otp"
                name="otpnumber"
                value={this.state.otpnumber}
                onChange={this.handleChange('otpnumber')} />
            </div>
            <p className="resend-otp text-center" style={{ color: '#4f2da7', fontWeight: 500 }} color="primary" onClick={this.resendOtp}>Resend OTP</p>
            <div className="text-center">{this.state.messageOtp}</div>
          </div>
        </div>
        {this.renderResponseDialog()}
        <ToastContainer autoClose={3000} />
      </Container>
    );
  }
}

export default Otp;
