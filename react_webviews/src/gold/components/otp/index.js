import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import OtpDefault from '../../../common/ui/otp';
import PlaceBuyOrder from '../ui_components/place_buy_order';

class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      otpnumber: '',
      otpnumber_error: '',
      messageOtp: '',
      openResponseDialog: false,
      otpVerified: false,
      params: qs.parse(props.history.location.search.slice(1)),
      provider: this.props.match.params.provider,
      orderType: this.props.match.params.orderType,
      otp: '',
      timeAvailable: 30,
      totalTime: 30,
      otpBaseData: {},
      proceedForOrder: false
    }
  }

  updateParent = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  componentWillMount() {
    let { params } = this.props.location;

    if (!params || params.resend_link === null || params.verify_link === null) {

      if(this.state.orderType === 'buy') {
        this.navigate('/gold/' + this.state.provider + '/gold-register');
        
      } else {
        this.navigate('/gold/landing');
      }

      return;
    }

    let otpBaseData = {
      mobile_no: params ? params.mobile_no : ''
    }
    this.setState({
      otpBaseData: otpBaseData,
      resend_link: params ? params.resend_link : '',
      verify_link: params ? params.verify_link : '',
      messageOtp: params ? params.message : 'An OTP is sent to your registered mobile number, please verify to complete the process.',
    })
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {

    this.sendEvents('next', {otp_vaildation: true});
    if (!this.state.otp) {
      this.setState({
        otp_error: 'Please enter OTP'
      })
      return;
    }

    if (this.state.otp.length !== 4) {
      this.setState({
        otp_error: 'OTP is a 4 digit number'
      })
      return;
    }
    let url = this.state.verify_link + '/' + this.state.provider + 
              '?otp=' + this.state.otp;

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
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
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

    this.setState({
      show_loader: true,
      otp_error: '',
      otp: '',
      timeAvailable: this.state.totalTime,
      resend_otp_clicked: true
    })

    let url =  this.state.resend_link;
    try {
      this.setState({
        show_loader: true
      });
      const res = await Api.get(url);

      if (res.pfwresponse.status_code === 200) {

        let result = res.pfwresponse.result;
        if (result.resend_verification_otp_link !== '' && result.verification_link !== '') {
          var message = 'An OTP is sent to your mobile number ' + this.state.mobile_no + ', please verify.'
          this.setState({
            show_loader: false,
            resend_link: result.resend_verification_otp_link,
            verify_link: result.verification_link[0], message: message
          })
          toast(this.state.messageOtp);
        }
        this.setState({
          show_loader: false
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }

  };

  handleClose = () => {
    this.setState({
      openResponseDialog: false,
      openPopup: false
    });
  }

  handleOtpVerified = () => {
    this.sendEvents('next');
    if (this.state.orderType === 'buy') {
      // place buy order
      this.setState({
        proceedForOrder: true
      })

    } else if (this.state.orderType === 'sell') {
      this.navigate(this.state.provider + '/sell-gold-order');
    } else if (this.state.orderType === 'delivery') {
      if (window.sessionStorage.getItem('goldProduct')) {
        let product = JSON.parse(window.sessionStorage.getItem('goldProduct'));
        product.isFisdomVerified = true;
        window.sessionStorage.setItem('goldProduct', JSON.stringify(product));
        this.navigate(this.state.provider + '/gold-delivery-order');
      } else {
        this.navigate('/gold');
      }

    } else {
      this.navigate('/gold');
    }
  }

  sendEvents(user_action, data={}) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'otp_validation_buy_gold',
        'resend_otp_clicked': this.state.resend_otp_clicked ? 'yes' : 'no',
        'otp_vaildation ': data.otp_vaildation ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
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

  handleOtp = (otp) => {
    this.setState({
      otp: otp,
      otp_error: ''
    })
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title=""
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="PROCEED"
        events={this.sendEvents('just_set_events')}
      >
        {/* <div className="otp-body">
            <div className="text-center">{this.state.messageOtp}</div>
        </div> */}

        <div className="default-otp">

            <div className="title">
                Enter OTP to verify
            </div>
            <div className="content">
              We have send the OTP on 
              <span> mobile number
                <span className="content-auth"> {this.state.otpBaseData.mobile_no} </span> 
              </span>
              please enter to buy gold 
            </div>

            <OtpDefault parent={this} />
            {this.state.otp_error &&
              <div style={{ color: 'red', margin: '14px 0 0 0' }}>{this.state.otp_error}</div>}
          </div>

        {this.renderResponseDialog()}

        {this.state.proceedForOrder &&
          <PlaceBuyOrder parent={this} />
        }
      </Container>
    );
  }
}

export default Otp;
