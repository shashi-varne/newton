import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import Input from '../../../common/ui/Input';
import Grid from 'material-ui/Grid';
import Checkbox from 'material-ui/Checkbox';
import { validateNumber, validateEmail, inrFormatDecimal2 } from 'utils/validators';
import toast from '../../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

import GoldLivePrice from '../ui_components/live_price';
import ConfirmDialog from '../ui_components/confirm_dialog';
import PriceChangeDialog from '../ui_components/price_change_dialog';
import RefreshBuyPrice from '../ui_components/buy_price';
import {providerMapper, stateMapper} from  '../../constants';
import { storageService } from 'utils/validators';

class GoldRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      userInfo: {},
      name: "",
      name_error: '',
      email: "",
      email_error: '',
      pin_code: "",
      pin_code_error: "",
      mobile_no: "",
      mobile_no_error: '',
      goldInfo: {},
      isRegistered: false,
      openConfirmDialog: false,
      params: qs.parse(props.history.location.search.slice(1)),
      checked: false,
      city: '',
      state: '',
      terms_opened: 'no',
      provider: this.props.match.params.provider,
      openPriceChangedDialog: false
    }

    this.refreshData = this.refreshData.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  countdown = () => {
    let timeAvailable = this.state.buyData.timeAvailable;
    let buyData = this.state.buyData;
    if (timeAvailable <= 0) {
      this.setState({
        minutes: 0,
        seconds: 0,
        openPriceChangedDialog: true,
        live_price: ''
      })

      storageService().set('forceBackState', stateMapper['buy-home']);

      return;
    }

    let minutes = Math.floor(timeAvailable / 60);
    let seconds = Math.floor(timeAvailable - minutes * 60);
    timeAvailable--;
    buyData.timeAvailable = timeAvailable;

    this.setState({
      timeAvailable: timeAvailable,
      minutes: minutes,
      seconds: seconds,
      buyData: buyData
    })
    
    storageService().setObject('buyData', buyData);
   
  };


  startTimer(buyData) {
    if (buyData) {
      let intervalId = setInterval(this.countdown, 1000);
      this.setState({
        countdownInterval: intervalId,
        show_loader: false
      });
    }
  }

  onload() {

    storageService().remove('forceBackState');

    let buyData = storageService().getObject('buyData');
    this.setState({
      buyData: buyData,
      live_price: buyData.goldBuyInfo.plutus_rate,
      openRefreshModule: false,
      timeAvailable: buyData.timeAvailable
    })
    this.startTimer(buyData);

    let confirmDialogData = {
      buttonData: {
        leftTitle: 'Buy gold worth',
        leftSubtitle: inrFormatDecimal2(buyData.amount_selected),
        leftArrow: 'down',
        provider: 'safegold'
      },
      buttonTitle: "OK",
      content1: [
        { 'name': 'Buy price for <b>' + buyData.weight_selected + '</b> gms', 'value': inrFormatDecimal2(buyData.base_amount) },
        { 'name': 'GST', 'value': inrFormatDecimal2(buyData.gst_amount) }
      ],
      content2: [
        { 'name': 'Total', 'value': inrFormatDecimal2(buyData.total_amount) }
      ]
    }

    let priceChangeDialogData = {
      buttonData: {
        leftTitle: 'To buy gold worth',
        leftSubtitle: inrFormatDecimal2(buyData.amount_selected),
        leftArrow: 'down',
        provider: 'safegold'
      },
      buttonTitle: "REFRESH",
      content1: [
        { 'name': 'Buy price for <b>0.014</b> gms', 'value': inrFormatDecimal2(buyData.base_amount) },
        { 'name': 'GST', 'value': inrFormatDecimal2(buyData.gst_amount) }
      ],
      content2: [
        { 'name': 'Total', 'value': inrFormatDecimal2(buyData.total_amount) }
      ]
    }

    let bottomButtonData = {
      leftTitle: 'Buy gold worth',
      leftSubtitle: inrFormatDecimal2(buyData.amount_selected),
      leftArrow: 'up',
      provider: 'safegold'
    }

    this.setState({
      confirmDialogData: confirmDialogData,
      priceChangeDialogData: priceChangeDialogData,
      bottomButtonData: bottomButtonData
    })

    
  }

  async componentDidMount() {

    this.onload();

    try {

      const res = await Api.get('/api/gold/user/account');
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        let isRegistered = true;
        let userInfo = result.gold_user_info.user_info;
        if (userInfo.registration_status === "pending" ||
          !userInfo.registration_status ||
          result.gold_user_info.is_new_gold_user) {
          isRegistered = false;
        }

        const { name, email, pin_code, mobile_no } = userInfo;
        this.checkPincode(pin_code);

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

        if (userInfo.mobile_verified === false &&
          isRegistered === false) {
          // $state.go('my-gold');
          return;
        }
        // this.checkPincode();

      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleChange = (field) => (event) => {
    if (event.target.name === 'checked') {
      this.setState({
        [event.target.name]: event.target.checked
      });
    } else if (event.target.name === 'mobile_no') {
      if (event.target.value.length > 10) {
        return;
      }
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    }


  }

  checkPincode = async (pincode) => {
    if (pincode && pincode.length === 6) {
      try {
        const res = await Api.get('/api/pincode/' + pincode);

        if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
          this.setState({
            city: res.pfwresponse.result[0].district_name || res.pfwresponse.result[0].taluk,
            state: res.pfwresponse.result[0].state_name
          });
        } else {
          this.setState({
            city: '',
            state: '',
            pin_code_error: 'Invalid Pincode'
          });
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong', 'error');
      }
    }
  }

  handlePincode = (name) => async (event) => {
    const pincode = event.target.value;
    if (pincode.length > 6) {
      return;
    }
    this.checkPincode(pincode);
    this.setState({
      [name]: pincode,
      [name + '_error']: ''
    });
  }

  verifyMobile = async () => {
    this.setState({
      show_loader: true
    });

    let options = {
      mobile_number: this.state.mobile_no,
    }
    try {
      const res = await Api.post('/api/gold/user/verify/mobilenumber', options);

      if (res.pfwresponse.status_code === 200) {
        this.setState({
          show_loader: false,
        });
        let result = res.pfwresponse.result;
        if (result.resend_verification_otp_link !== '' && result.verification_link !== '') {
          window.localStorage.setItem('fromType', 'buy')
          var message = 'An OTP is sent to your mobile number ' + this.state.mobile_no + ', please verify to complete registration.'
          this.props.history.push({
            pathname: 'verify',
            search: getConfig().searchParams,
            params: {
              resend_link: result.resend_verification_otp_link,
              verify_link: result.verification_link,
              message: message, fromType: 'buy'
            }
          });
          toast(message);
        }

      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }
  }

  handleClose = () => {
    this.setState({
      openConfirmDialog: false
    });

    if(this.state.openPriceChangedDialog && this.state.timeAvailable >0) {
      this.setState({
        openPriceChangedDialog: false
      })
    }
  }

  openTermsAndCondition() {
    this.setState({
      terms_opened: true
    })
    nativeCallback({
      action: 'open_in_browser',
      message: {
        url: 'https://www.safegold.com/assets/terms-and-conditions.pdf'
      }
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Registeration',
        'name': this.state.name_error ? 'invalid' : this.state.name ? 'valid' : 'empty',
        'email': this.state.email_error ? 'invalid' : this.state.email ? 'valid' : 'empty',
        'pin_code': this.state.pin_code_error ? 'invalid' : this.state.pin_code ? 'valid' : 'empty',
        'agree': this.state.checked ? 'yes' : 'no',
        'terms_opened': this.state.terms_opened
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {
    this.handleClose();

    if (this.state.name.split(" ").filter(e => e).length < 2) {
      this.setState({
        name_error: 'Enter valid full name'
      });
    } else if (this.state.mobile_no.length !== 10 || !validateNumber(this.state.mobile_no)) {
      this.setState({
        mobile_no_error: 'Please enter valid mobile no'
      });
    } else if (this.state.email.length < 10 || !validateEmail(this.state.email)) {
      this.setState({
        email_error: 'Please enter valid email'
      });
    } else if (!this.state.checked) {
      return;
    } else {

      this.setState({
        show_loader: true
      });

      let options = this.state.userInfo;

      options.name = this.state.name;
      options.mobile_no = this.state.mobile_no;
      options.email = this.state.email;
      options.pin_code = this.state.pin_code;

      try {
        const res = await Api.post('/api/gold/user/account', options);

        if (res.pfwresponse.status_code === 200) {
          this.verifyMobile();
        } else {

          if (res.pfwresponse.result.error !== 'User with the same mobile number exists!' &&
            (this.state.userInfo.mobile_verified === false || res.pfwresponse.result.mobile_verified === false)) {
            this.verifyMobile();
          } else {
            this.setState({
              show_loader: false
            });
            toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
              'Something went wrong', 'error');
          }

        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong', 'error');
      }
    }
  }

  handleClick2 = () => {
    this.setState({
      openConfirmDialog: true
    })
  }

  updateParent(key, value) {
    this.setState({
      [key]: value
    })
  }

  refreshData () {

    if(this.state.timeAvailable > 0) {
      this.handleClick();
    } else {
      this.setState({
        show_loader: true,
        openRefreshModule: true
      })
    }
    
  }

  dataRefreshed() {

  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Buy gold"
        handleClick={this.handleClick}
        handleClick2={this.handleClick2}
        edit={this.props.edit}
        withProvider={true}
        buttonTitle="Continue"
        events={this.sendEvents('just_set_events')}
        buttonData={this.state.bottomButtonData}
      >
        <div className="common-top-page-subtitle">
          We need following details to open your {providerMapper[this.state.provider].title} account
        </div>

        <GoldLivePrice parent={this} />
        <ConfirmDialog parent={this} />
        <PriceChangeDialog parent={this} />

        <div className="register-form">
          <div className="InputField">
            <Input
              error={(this.state.name_error) ? true : false}
              helperText={this.state.name_error}
              type="text"
              width="40"
              label="Name"
              class="name"
              id="name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange('name')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.mobile_no_error) ? true : false}
              helperText={this.state.mobile_no_error}
              type="number"
              width="40"
              label="Mobile"
              class="Mobile"
              id="number"
              name="mobile_no"
              value={this.state.mobile_no}
              onChange={this.handleChange('mobile_no')} />
          </div>
          <div className="InputField">
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
          </div>
          {/* <div className="InputField">
            <Input
              error={(this.state.pin_code_error) ? true : false}
              helperText={this.state.pin_code_error}
              type="number"
              width="40"
              label="Pincode *"
              id="pincode"
              name="pin_code"
              value={this.state.pin_code}
              onChange={this.handlePincode('pin_code')} />
            <div className="filler">
              {(this.state.city && this.state.state && !this.state.pin_code_error) && <span>{this.state.city} , {this.state.state}</span>}
            </div>
          </div> */}
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
                <span className="Terms">I agree to the <a
                  style={{
                    textDecoration: 'underline',
                    color: getConfig().primary
                  }} onClick={() => this.openTermsAndCondition()}>Terms and Conditions</a></span>
              </Grid>
            </Grid>
          </div>
        </div>

        {this.state.openRefreshModule &&
         <RefreshBuyPrice parent={this} />}
      </Container>
    );
  }
}

export default GoldRegister;
