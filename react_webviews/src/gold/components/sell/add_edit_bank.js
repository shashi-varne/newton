import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import Input from '../../../common/ui/Input';

import toast from '../../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import GoldLivePrice from '../ui_components/live_price';
import ConfirmDialog from '../ui_components/confirm_dialog';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';
import {bankAccountTypeOptions} from 'utils/constants';

class SellAddEditBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openResponseDialog: false,
      openConfirmDialog: false,
      minutes: "",
      seconds: "",
      timeAvailable: "",
      ifsc_code: '',
      ifsc_error: '',
      ifsc_helper: '',
      bank_name: '',
      branch_name: '',
      params: qs.parse(props.history.location.search.slice(1)),
      account_no: '',
      account_no_error: '',
      confirm_account_no: '',
      confirm_account_no_error: '',
      countdownInterval: null,
      account_type: '',
      provider: this.props.match.params.provider,
      accountTypeOptions: bankAccountTypeOptions(false)
    }
    this.countdown = this.countdown.bind(this);
    this.checkIFSCFormat = this.checkIFSCFormat.bind(this);
  }

  async componentDidMount() {

    let confirmDialogData = {
        buttonData: {
            leftTitle: 'Sell gold worth',
            leftSubtitle: '₹1,000',
            leftArrow: 'down',
            provider: 'safegold'
        },
        buttonTitle: "Ok",
        content1: [
            {'name': 'Sell price for <b>0.014</b> gms', 'value': '₹194.17'},
            {'name': 'GST', 'value': '₹5.83'}
        ],
        content2: [
            {'name': 'Total', 'value': '₹200.00'}
        ]
    }

    this.setState({
        confirmDialogData: confirmDialogData
    })

    let timeAvailable = window.localStorage.getItem('timeAvailableSell');
    let sellData = JSON.parse(window.localStorage.getItem('sellData'));
    this.setState({
      timeAvailable: timeAvailable,
      sellData: sellData
    })
    if (timeAvailable >= 0 && sellData) {
      let intervalId = setInterval(this.countdown, 1000);
      this.setState({
        countdownInterval: intervalId
      });
    }

    try {
      const res = await Api.get('/api/gold/user/bank/details');
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        let bankDetails, account_no, confirm_account_no, ifsc_code;
        if (result.banks.length !== 0) {
          account_no = result.banks[0].account_number;
          confirm_account_no = result.banks[0].account_number;
          ifsc_code = result.banks[0].ifsc_code;
          this.checkIFSCFormat(result.banks[0].ifsc_code);
        } else {
          bankDetails = {
            account_no: '',
            confirm_account_no: '',
            ifsc_code: ''
          };
        }
        this.setState({
          // show_loader: false,
          bankDetails: bankDetails,
          account_no: account_no,
          confirm_account_no: confirm_account_no,
          ifsc_code: ifsc_code
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }

      const res2 = await Api.get('/api/gold/user/account');
      if (res2.pfwresponse.status_code === 200) {
        let result = res2.pfwresponse.result;
        let isRegistered = true;
        if (result.gold_user_info.user_info.registration_status === "pending" ||
          !result.gold_user_info.user_info.registration_status ||
          result.gold_user_info.is_new_gold_user) {
          isRegistered = false;
        }
        this.setState({
          show_loader: false,
          goldInfo: result.gold_user_info.safegold_info,
          userInfo: result.gold_user_info.user_info,
          isRegistered: isRegistered
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message || 'Something went wrong', 'error');
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }


  countdown = () => {
    let timeAvailable = this.state.timeAvailable;
    if (timeAvailable <= 0) {
      this.setState({
        minutes: '',
        seconds: ''
      })
      this.navigate('my-gold-locker');
      return;
    }

    let minutes = Math.floor(timeAvailable / 60);
    let seconds = Math.floor(timeAvailable - minutes * 60);
    --timeAvailable;
    this.setState({
      timeAvailable: timeAvailable,
      minutes: minutes,
      seconds: seconds
    })
    window.localStorage.setItem('timeAvailableSell', timeAvailable);
  };

  async checkIFSCFormat(ifsc_code) {
    if (ifsc_code && ('' + ifsc_code).length === 11) {

      try {
        const res = await Api.get('/api/ifsc/' + (ifsc_code).toUpperCase());
        if (res.pfwresponse.status_code === 200) {
          let result = res.pfwresponse.result;
          let bankDetails, ifsc_error, bank_name, branch_name, ifsc_helper;
          if (result.length === 0) {
            ifsc_error = 'Please enter a valid IFSC code';
            bank_name = '';
            branch_name = '';
            ifsc_helper = '';
          }

          if (result[0]) {
            ifsc_error = '';
            bank_name = result[0].bank;
            branch_name = result[0].branch;
            ifsc_helper = bank_name + ', ' + branch_name;
          }
          this.setState({
            show_loader: false,
            bank_name: bank_name,
            branch_name: branch_name,
            ifsc_error: ifsc_error,
            ifsc_helper: ifsc_helper,
            bankDetails: bankDetails
          });
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

  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleChange = (field) => (event) => {
    if (event.target.name === 'ifsc_code') {
      if (event.target.value.length > 11) {
        return;
      }
      this.checkIFSCFormat(event.target.value);
      this.setState({
        [event.target.name]: event.target.value
      });

    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    }
  }

  verifyMobile = async () => {
    this.setState({
      show_loader: true
    });

    let options = {
      mobile_number: this.state.userInfo.mobile_no,
    }
    try {
      const res = await Api.post('/api/gold/user/verify/mobilenumber', options);

      if (res.pfwresponse.status_code === 200) {
        this.setState({
          show_loader: false,
        });
        let result = res.pfwresponse.result;
        if (result.resend_verification_otp_link !== '' && result.verification_link !== '') {
          window.localStorage.setItem('fromType', 'sell')
          var message = 'An OTP is sent to your mobile number ' + this.state.userInfo.mobile_no + ', please verify to place sell order.'
          this.props.history.push({
            pathname: 'verify',
            search: getConfig().searchParams,
            params: {
              resend_link: result.resend_verification_otp_link,
              verify_link: result.verification_link,
              message: message, fromType: 'sell'
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

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Sell Bank Details',
        'account_no': this.state.account_no_error ? 'invalid' : this.state.account_no ? 'valid' : 'empty',
        'confirm_account_no': this.state.confirm_account_no_error ? 'invalid' : this.state.confirm_account_no ? 'valid' : 'empty',
        'ifsc_code': this.state.ifsc_code_error ? 'invalid' : this.state.ifsc_code ? 'valid' : 'empty'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {

    this.setState({
        openConfirmDialog: false
    })
    this.sendEvents('next');

    if (this.state.ifsc_error) {
      return;
    }

    if (!this.state.account_no) {
      this.setState({
        account_no_error: 'Please enter account number'
      });
    } else if (!this.state.confirm_account_no) {
      this.setState({
        confirm_account_no_error: 'This field is required'
      });
    } else if (this.state.account_no !== this.state.confirm_account_no) {
      this.setState({
        confirm_account_no_error: 'Account number mismatch'
      });
    } else if (!this.state.ifsc_code) {
      this.setState({
        ifsc_error: 'Please enter IFSC Code'
      });
    } else if (this.state.ifsc_code && (this.state.ifsc_code.length < 11 || this.state.ifsc_code.length > 11)) {
      this.setState({
        ifsc_error: 'Invalid IFSC Code'
      });
    } else {
      var options = {
        'account_number': this.state.account_no,
        'ifsc_code': this.state.ifsc_code
      };
      this.setState({
        show_loader: true
      });

      try {
        const res = await Api.post('/api/gold/user/bank/details', options);
        if (res.pfwresponse.status_code === 200) {
          let sellData = this.state.sellData;
          sellData.account_number = this.state.account_no;
          sellData.ifsc_code = this.state.ifsc_code;
          window.localStorage.setItem('sellData', JSON.stringify(sellData));
          this.verifyMobile();
          // this.setState({
          //   show_loader: false
          // });
          // this.navigate('sell-gold-order');
        } else {
          this.setState({
            show_loader: false, openResponseDialog: true,
            apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
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

  handleAccountTypeRadioValue = name => index => {
    this.setState({
      [name]: this.state.accountTypeOptions[index]['value'],
      [name + '_error']: ''
    });
  };

  handleClick2 = () => {
    this.setState({
      openConfirmDialog: true
    })
  }

  handleClose = () => {
    this.setState({
      openConfirmDialog: false
    })
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Add bank account"
        edit={this.props.edit}
        handleClick={this.handleClick}
        handleClick2={this.handleClick2}
        buttonTitle="Continue"
        events={this.sendEvents('just_set_events')}
        withProvider={true}
        buttonData= {{
            leftTitle: 'Sell gold worth',
            leftSubtitle: '₹1,000',
            leftArrow: 'up',
            provider: 'safegold'
        }}
      >
        <div className="common-top-page-subtitle">
         Amount will be credited to your account
        </div>

        <GoldLivePrice parent={this} />
        <ConfirmDialog parent={this} />
        
        <div className="bank-details">
            <div className="InputField">
                <Input
                error={(this.state.name_error) ? true : false}
                helperText={this.state.name_error}
                type="text"
                disabled={true}
                width="40"
                label="Account holder name"
                class="name"
                id="name"
                name="name"
                value={this.state.name}
                onChange={this.handleChange('name')} />
            </div>
            <div className="InputField">
                <Input
                error={(this.state.account_no_error) ? true : false}
                helperText={this.state.account_no_error}
                type="password"
                width="40"
                label="Your Account Number *"
                class="account_no"
                id="account_no"
                name="account_no"
                value={this.state.account_no}
                onChange={this.handleChange('account_no')} />
            </div>
            <div className="InputField">
                <Input
                error={(this.state.confirm_account_no_error) ? true : false}
                helperText={this.state.confirm_account_no_error}
                type="text"
                width="40"
                label="Confirm Account Number *"
                class="confirm_account_no"
                id="confirm_account_no"
                name="confirm_account_no"
                value={this.state.confirm_account_no}
                onChange={this.handleChange('confirm_account_no')} />
            </div>
            <div className="InputField">
                <Input
                error={(this.state.ifsc_error) ? true : false}
                helperText={this.state.ifsc_error}
                type="text"
                width="40"
                label="IFSC Code *"
                class="ifsc"
                id="ifsc_code"
                name="ifsc_code"
                value={this.state.ifsc_code}
                onChange={this.handleChange('ifsc_code')} />
                <div className="filler">
                {(this.state.ifsc_helper && !this.state.ifsc_error) && <span>{this.state.ifsc_helper}</span>}
                </div>
            </div>
            <div className="InputField">
                    <DropdownWithoutIcon
                    error={(this.state.account_type_error) ? true : false}
                    helperText={this.state.account_type_error}
                    width="40"
                    type="professional"
                    label="Select account type"
                    class="MaritalStatus"
                    options={this.state.accountTypeOptions}
                    id="education"
                    name="account_type"
                    value={this.state.account_type}
                    onChange={this.handleAccountTypeRadioValue('account_type')} />
                </div>
          {/* <div className="bank-timer">Price expires in <b>{this.state.minutes}:{this.state.seconds}</b></div> */}
        </div>
      </Container>
    );
  }
}

export default SellAddEditBank;
