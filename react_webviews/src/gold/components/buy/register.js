import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import Input from '../../../common/ui/Input';
// import Grid from 'material-ui/Grid';
// import Checkbox from 'material-ui/Checkbox';
import { validateNumber, validateEmail } from 'utils/validators';
import toast from '../../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

import GoldLivePrice from '../ui_components/live_price';
import ConfirmDialog from '../ui_components/confirm_dialog';
import PriceChangeDialog from '../ui_components/price_change_dialog';
import RefreshBuyPrice from '../ui_components/buy_price';
import {gold_providers} from  '../../constants';
import GoldOnloadAndTimer from '../ui_components/onload_and_timer';
import PlaceBuyOrder from '../ui_components/place_buy_order';

class GoldRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skelton: true,
      user_info: {},
      name: "",
      name_error: '',
      email: "",
      email_error: '',
      pin_code: "",
      pin_code_error: "",
      mobile_no: "",
      mobile_no_error: '',
      provider_info: {},
      isRegistered: false,
      openConfirmDialog: false,
      params: qs.parse(props.history.location.search.slice(1)),
      checked: false,
      city: '',
      state: '',
      terms_opened: 'no',
      provider: this.props.match.params.provider,
      openPriceChangedDialog: false,
      orderType: 'buy',
      name_disabled: false,
      mobile_no_disabled: false,
      email_disabled: false,
      proceedForOrder: false
    }

  }


  // common code for buy live price start

  onload = () => {
    this.setState({
      openOnloadModal: false
    })
    this.setState({
      openOnloadModal: true
    })
  }

  updateParent(key, value) {
    this.setState({
      [key]: value
    })
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

  // common code for buy live price end

  async componentDidMount() {

    this.onload();
    try {

      const res = await Api.get('/api/gold/user/account/' + this.state.provider);

    
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        let isRegistered = true;
        let user_info = result.gold_user_info.user_info;
        let provider_info = result.gold_user_info.provider_info;
        if (provider_info.registration_status === "pending" ||
          !provider_info.registration_status ||
          user_info.is_new_gold_user) {
          isRegistered = false;
        }

        let mobile_verified_current = provider_info.mobile_verified || false;

        const { name, email, pin_code, mobile_no } = user_info;
        
        // this.checkPincode(pin_code);

        this.setState({
          skelton: false,
          provider_info: provider_info,
          user_info: user_info,
          isRegistered: isRegistered,
          name: name || "",
          email: email || "",
          pin_code: pin_code || "",
          mobile_no: mobile_no || "",
          name_disabled: name ? true : false,
          email_disabled: email? true : false,
          pin_code_disabled: pin_code ? true : false,
          mobile_no_disabled: mobile_no ? true : false,
          mobile_verified_current: mobile_verified_current
        });


      } else {
        this.setState({
          skelton: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong');
      }
    } catch (err) {
      this.setState({
        skelton: false
      });
      toast('Something went wrong');
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
        toast('Something went wrong');
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
          window.sessionStorage.setItem('fromType', 'buy')
          var message = 'An OTP is sent to your mobile number ' + this.state.mobile_no + ', please verify to complete registration.'
          this.props.history.push({
            pathname: 'buy/verify',
            search: getConfig().searchParams,
            params: {
              resend_link: result.resend_verification_otp_link,
              verify_link: result.verification_link,
              message: message, fromType: 'buy',
              mobile_no: this.state.mobile_no
            }
          });
          toast(message);
        }

      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  createUser = async () => {

    this.setState({
      show_loader: true
    });

   
    try {
      const res = await Api.post('/api/gold/user/account/create/'  + this.state.provider);

      if (res.pfwresponse.status_code === 200 || (res.pfwresponse.status_code === 400 && res.pfwresponse.result.error === "Registration is already done") ) {
        // place order
        this.setState({
          proceedForOrder: true
        })
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
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
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'user_details_buy_gold',
        'name': this.state.name ? 'yes' : 'no',
        'email': this.state.email ? 'yes' : 'no',
        'mobile_no': this.state.mobile_no ? 'yes' : 'no',
        "existing_mobile_number": this.state.mobile_no_disabled ? 'yes' : 'no',
        'price_summary_clicked': this.state.price_summary_clicked ? 'yes' : 'no',
        "timeout_alert": this.state.timeout_alert_event ? 'yes' : 'no',
        "refresh_price": this.state.refresh_price_event ? 'yes' : 'no'
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

    this.sendEvents('next');
    let canSubmitForm = true;

    if (!this.state.name) {
      this.setState({
        name_error: 'Enter valid name'
      });
      canSubmitForm = false;
    }
    
    if (this.state.mobile_no.length !== 10 || !validateNumber(this.state.mobile_no)) {
      this.setState({
        mobile_no_error: 'Please enter valid mobile no'
      });
      canSubmitForm = false;
    } 
    
    else if (this.state.email.length < 10 || !validateEmail(this.state.email)) {
      this.setState({
        email_error: 'Please enter valid email'
      });
      canSubmitForm = false;
    }

    
    
    if(canSubmitForm) {

      this.setState({
        show_loader: true
      });

      if(this.state.mobile_verified_current) {
        this.createUser()
      } else {
        let options = {};

        options.name = this.state.name;
        options.mobile_no = this.state.mobile_no;
        options.email = this.state.email;
        options.pin_code = this.state.user_info.pin_code;
  
        try {
          const res = await Api.post('/api/gold/user/account/' + this.state.provider, options);
  
          if(res.pfwresponse.result.registered_with_another_account === true) {
            let error = 'Mobile number already registered with ' + this.state.provider + ', enter another mobile number';
            this.setState({
              mobile_no_disabled: false,
              show_loader: false,
              mobileAlreadyExist: true,
              mobile_no_error: error
            })
            // toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
            //   'Something went wrong');
          } else if(
            // res.pfwresponse.result.message === 'success'  || 
            res.pfwresponse.result.mobile_verified === false || this.state.mobileAlreadyExist) {
            this.verifyMobile();
          } else if(res.pfwresponse.result.mobile_verified === true || res.pfwresponse.result.coutinue_gold_profile_registration === true) {
            this.createUser();
          } else {
  
            this.setState({
              show_loader: false
            });
            toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
              'Something went wrong');
  
          }
        } catch (err) {
          this.setState({
            show_loader: false
          });
          toast('Something went wrong');
        }
      }

     
    }
  }

  handleClick2 = () => {
    this.setState({
      openConfirmDialog: true,
      price_summary_clicked: true
    })
  }
   goBack = () => {
    this.sendEvents('back');
    this.navigate("/gold/buy");
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title="Buy gold"
        handleClick={this.handleClick}
        handleClick2={this.handleClick2}
        edit={this.props.edit}
        withProvider={true}
        buttonTitle="CONTINUE"
        buttonData={this.state.bottomButtonData}
        events={this.sendEvents('just_set_events')}
        goBack={this.goBack}
        headerData={{
          goBack: this.goBack
        }}
      >
        <div className="common-top-page-subtitle">
          We need following details to open your {gold_providers[this.state.provider].title} account
        </div>

        <GoldLivePrice parent={this} />
        

        <div className="register-form">
          <div className="InputField">
            <Input
              error={(this.state.name_error) ? true : false}
              helperText={this.state.name_error}
              disabled={this.state.name_disabled}
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
              disabled={this.state.mobile_no_disabled}
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
              disabled={this.state.email_disabled}
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
          {/* <div className="CheckBlock">
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
                    color: getConfig().styles.primaryColor
                  }} onClick={() => this.openTermsAndCondition()}>Terms and Conditions</a></span>
              </Grid>
            </Grid>
          </div> */}
        </div>

        {this.state.openRefreshModule &&
         <RefreshBuyPrice parent={this} />}

        <ConfirmDialog parent={this} />
        <PriceChangeDialog parent={this} />

        {this.state.openOnloadModal && 
          <GoldOnloadAndTimer parent={this} />}

        {this.state.proceedForOrder &&
          <PlaceBuyOrder parent={this} />
        }
      </Container>
    );
  }
}

export default GoldRegister;
