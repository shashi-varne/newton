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
import DropDownNew from '../../../common/ui/DropDownNew';
import { bankAccountTypeOptions } from 'utils/constants';
import TextField from 'material-ui/TextField';
import { storageService, getUrlParams } from "utils/validators";
import RefreshSellPrice from '../ui_components/sell_price';
import GoldOnloadAndTimer from '../ui_components/onload_and_timer';
import PriceChangeDialog from '../ui_components/price_change_dialog';

class SellAddEditBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skelton: true,
      openConfirmDialog: false,
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
      accountTypeOptions: bankAccountTypeOptions(false),
      formData: {
        account_type: '',
        ifsc_code: '',
        account_no: '',
        confirm_account_no: '',
        bank_image: '',
        name: ''
      },
      orderType: 'sell',
      pan_bank_flow: getUrlParams().pan_bank_flow || false
    }
    this.checkIFSCFormat = this.checkIFSCFormat.bind(this);
  }

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
      openConfirmDialog: false,
    });

    if (this.state.openPriceChangedDialog && this.state.timeAvailable > 0) {
      this.setState({
        openPriceChangedDialog: false
      })
    }
  }

  async componentDidMount() {
    this.onload();
    try {

      let formData = this.state.formData;
      if (this.props.edit) {
        formData = storageService().getObject('goldVerifyBankData') || {};
      }

      const res2 = await Api.get('/api/gold/user/account/' + this.state.provider);
      this.setState({
        skelton: false
      });

      if (res2.pfwresponse.status_code === 200) {
        let result = res2.pfwresponse.result;
        let user_info = result.gold_user_info.user_info;
        formData.name = user_info.name;
        this.setState({
          provider_info: result.gold_user_info.provider_info,
          user_info: user_info
        });
      } else {

        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message || 'Something went wrong');
      }

      this.setState({
        formData: formData
      })

    } catch (err) {
      console.log(err);
      this.setState({
        skelton: false
      });
      toast('Something went wrong');
    }
  }

  async checkIFSCFormat(ifsc_code) {

    let formData = this.state.formData;
    if (ifsc_code && ('' + ifsc_code).length === 11) {

      try {
        const res = await Api.get('/api/ifsc/' + (ifsc_code).toUpperCase());
        if (res.pfwresponse.status_code === 200) {
          let result = res.pfwresponse.result;
          if (result.length === 0) {
            formData.ifsc_error = 'Please enter a valid IFSC code';
            formData.bank_name = '';
            formData.branch_name = '';
            formData.ifsc_helper = '';
            formData.image = ''
          } else if (result[0]) {
            let bank = result[0];
            formData.ifsc_error = '';
            formData.bank_name = bank.bank;
            formData.branch_name = bank.branch;
            formData.ifsc_helper = formData.bank_name + ', ' + formData.branch_name;
            formData.bank_image = bank.image;
          }

          this.setState({
            show_loader: false,
            formData: formData
          });
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

  };

  navigate = (pathname) => {
    let searchParams = getConfig().searchParams;

    if(this.state.pan_bank_flow) {
        searchParams += '&pan_bank_flow=' + this.state.pan_bank_flow
    }
    this.props.history.push({
      pathname: pathname,
      search: searchParams
    });
  }

  handleChange = (field) => (event) => {
    let formData = this.state.formData;

    let value = event.target.value;
    let name = event.target.name;

    if (name === 'ifsc_code') {
      this.checkIFSCFormat(value);
      value = value.toUpperCase();
      formData[name] = value;

    } else {
      this.setState({
        [name]: value,
        [name + '_error']: ''
      });

      formData[name] = value;
      formData[name + '_error'] = '';

    }

    this.setState({
      formData: formData
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'add_bank_account',
        'account_no': this.state.formData.account_no ? 'yes' : 'no',
        'confirm_account_no': this.state.formData.confirm_account_no ? 'yes' : 'no',
        'ifsc_code': this.state.formData.ifsc_code ? 'yes' : 'no',
        'account_type': this.state.formData.account_type ? 'yes' : 'no',
        'update_type': this.props.edit ? 'edit' : 'add',
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

    if (this.state.ifsc_error) {
      return;
    }

    let canSubmitForm = true;
    let formData = this.state.formData;

    if (!formData.account_no) {
      formData.account_no_error = 'Please enter account number';
    } else if (formData.account_no.length < 5) {
      formData.account_no_error = 'Minimum length for account number is 5';
    }

    if (!formData.account_type) {
      formData.account_type_error = 'Please select account type';
    }

    if (!formData.name) {
      formData.name_error = 'Please enter name';
    }

    if (!formData.confirm_account_no) {
      formData.confirm_account_no_error = 'This field is required';
    } else if (formData.account_no !== formData.confirm_account_no) {
      formData.confirm_account_no_error = 'Account number mismatch';
    } else if (formData.confirm_account_no.length < 5) {
      formData.confirm_account_no_error = 'Minimum length for account number is 5';
    } else {
      formData.confirm_account_no_error = '';
    }

    if (!formData.ifsc_code) {
      formData.ifsc_error = 'Please enter IFSC Code';
    } else if (formData.ifsc_code && (formData.ifsc_code.length < 11 || formData.ifsc_code.length > 11)) {
      formData.ifsc_error = 'Invalid IFSC Code';
    }

    this.setState({
      formData: formData
    })

    let keysToCheck = ['account_no_error', 'confirm_account_no_error', 'ifsc_error', 'account_type_error'];
    for (var i = 0; i < keysToCheck.length; i++) {
      if (formData[keysToCheck[i]]) {
        canSubmitForm = false;
        break;
      }
    }

    if (canSubmitForm) {
      let bankData = this.state.formData;
      storageService().setObject('goldVerifyBankData', bankData);
      this.navigate('sell-verify-bank');
    }
  }

  handleAccountTypeRadioValue = name => value => {
    let formData = this.state.formData;
    formData[name] = value;
    formData[name + '_error'] = '';
    this.setState({
      formData: formData
    });
  };

  handleClick2 = () => {
    this.setState({
      openConfirmDialog: true,
      price_summary_clicked: true
    })
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title={`${this.props.edit ? 'Edit' : 'Add'} bank account`}
        edit={this.props.edit}
        handleClick={this.handleClick}
        handleClick2={this.handleClick2}
        buttonTitle="CONTINUE"
        events={this.sendEvents('just_set_events')}
        withProvider={!this.state.pan_bank_flow ? true : false}
        count={this.state.pan_bank_flow ? true : false}
        current={2}
        total={2}
        buttonData={this.state.bottomButtonData}
      >
        <div className="common-top-page-subtitle">
          Amount will be credited to your account
        </div>

        <GoldLivePrice parent={this} />
        <ConfirmDialog parent={this} />


        <div className="bank-details">
          <div className="InputField">
            <Input
              error={(this.state.formData.name_error) ? true : false}
              helperText={this.state.formData.name_error}
              type="text"
              disabled={this.state.formData.name ? true : false}
              width="40"
              autoComplete="nope"
              label="Account holder name"
              class="name"
              id="name"
              name="name"
              value={this.state.formData.name}
              onChange={this.handleChange('name')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.formData.account_no_error) ? true : false}
              helperText={this.state.formData.account_no_error}
              type="password"
              width="40"
              label="Your Account Number *"
              class="account_no"
              autoComplete="new-password"
              id="account_no"
              maxLength="21"
              name="account_no"
              value={this.state.formData.account_no}
              onChange={this.handleChange('account_no')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.formData.confirm_account_no_error) ? true : false}
              helperText={this.state.formData.confirm_account_no_error}
              type="number"
              width="40"
              label="Confirm Account Number *"
              class="confirm_account_no"
              id="confirm_account_no"
              name="confirm_account_no"
              maxLength="21"
              value={this.state.formData.confirm_account_no}
              onChange={this.handleChange('confirm_account_no')} />
          </div>
          <div className="InputField">
            <TextField
              error={(this.state.formData.ifsc_error) ? true : false}
              helperText={this.state.formData.ifsc_error}
              type="text"
              width="40"
              label="IFSC Code *"
              id="ifsc_code"
              name="ifsc_code"
              inputProps={{
                maxLength: 11,
              }}
              value={this.state.formData.ifsc_code}
              onChange={this.handleChange('ifsc_code')}
            />

            {this.state.formData.bank_image &&
              <label className="input-placeholder-right gold-placeholder-right">
                <img style={{ width: 20 }}
                  src={this.state.formData.bank_image} alt="info" />
              </label>}

            <div className="filler">
              {(this.state.formData.ifsc_helper && !this.state.formData.ifsc_error) && <span>{this.state.formData.ifsc_helper}</span>}
            </div>
          </div>
          <div className="InputField">
            <DropDownNew
              error={(this.state.formData.account_type_error) ? true : false}
              helperText={this.state.formData.account_type_error}
              width="40"
              type="professional"
              label="Select account type"
              class="MaritalStatus"
              isAOB={true}
              options={this.state.accountTypeOptions}
              id="education"
              name="account_type"
              value={this.state.formData.account_type}
              onChange={this.handleAccountTypeRadioValue('account_type')} />
          </div>
        </div>


        <PriceChangeDialog parent={this} />

        {this.state.openRefreshModule &&
          <RefreshSellPrice parent={this} />}

        {this.state.openOnloadModal &&
          <GoldOnloadAndTimer parent={this} />}
      </Container>
    );
  }
}

export default SellAddEditBank;
