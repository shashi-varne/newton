import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import Input from "common/ui/Input";
import Api from 'utils/api';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';
import { FormControl } from 'material-ui/Form';
import toast from '../../../common/ui/Toast';
import BottomInfo from '../../../common/ui/BottomInfo';
import { numDifferentiationInr } from 'utils/validators';
import { getConfig } from "utils/functions";

class MandateBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      withProvider: true,
      get_lead: true,
      getLeadBodyKeys: ['bank_info']
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let accountTypeOptions = [
      'Savings',
      'Current'
    ];

    let bottomButtonData = {
      leftTitle: 'Personal loan',
      leftSubtitle: numDifferentiationInr(200000)
    }

    this.setState({
      accountTypeOptions: accountTypeOptions,
    });

    this.setState({
      bottomButtonData: bottomButtonData
    })
  }

  onload = () => {
    let lead = this.state.lead || {};
    let bank_info = lead.bank_info || {};
    let form_data = {
      "bank_name": bank_info.bank_name || '',
      "account_number": bank_info.account_number || '',
      "confirm_account_number": bank_info.account_number || '',
      "ifsc_code": bank_info.ifsc_code || '',
      "account_type": bank_info.type || '',
      "name": bank_info.account_holder_name || '',
      "bank_image": bank_info.bank_image || ''
    };

    this.setState({
        form_data: form_data,
        lead: lead,
    })

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'introduction',
        'account_number': this.state.form_data.account_number ? 'yes' : 'no',
        'confirm_account_number': this.state.form_data.confirm_account_number ? 'yes' : 'no',
        'ifsc_code': this.state.form_data.ifsc_code ? 'yes' : 'no',
        'account_type': this.state.form_data.account_type ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

   checkIFSCFormat = async(ifsc_code) => {

    let form_data = this.state.form_data;
    if (ifsc_code && ('' + ifsc_code).length === 11) {

      try {
        const res = await Api.get('/api/ifsc/' + (ifsc_code).toUpperCase());
        if (res.pfwresponse.status_code === 200) {
          let result = res.pfwresponse.result;
          if (result.length === 0) {
            form_data.ifsc_error = 'Please enter a valid IFSC code';
            form_data.bank_name = '';
            form_data.branch_name = '';
            form_data.ifsc_helper = '';
            form_data.image = ''
          } else if (result[0]) {
            let bank = result[0];
            form_data.ifsc_error = '';
            form_data.bank_name = bank.bank;
            form_data.branch_name = bank.branch;
            form_data.ifsc_helper = form_data.bank_name + ', ' + form_data.branch_name;
            form_data.bank_image = bank.image;
          }

          this.setState({
            show_loader: false,
            form_data: form_data
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

  handleChange = name => event => {
    let form_data = this.state.form_data;

    let value = event.target.value;
    let name = event.target.name;

    if (name === 'ifsc_code') {
      this.checkIFSCFormat(value);
      value = value.toUpperCase();
      form_data[name] = value;
    } else {
      this.setState({
        [name]: value,
        [name + '_error']: ''
      });

      form_data[name] = value;
      form_data[name + '_error'] = '';
    }

    this.setState({
      form_data: form_data
    })

  };

  handleClick = async () => {
    this.sendEvents('next');

    if (this.state.ifsc_error) {
      return;
    }
    let canSubmitForm = true;
    let form_data = this.state.form_data;

    if (!form_data.account_number) {
      form_data.account_number_error = 'Please enter account number';
    } else if (form_data.account_number.length < 5) {
      form_data.account_number_error = 'Minimum length for account number is 5'
    }
    if (!form_data.account_type) {
      form_data.account_type_error = 'Please select account type';
    }
    if (!form_data.name) {
      form_data.name_error = 'Please enter name'
    }
    if (!form_data.confirm_account_number) {
      form_data.confirm_account_number_error = 'This field is required';
    } else if (form_data.account_number !== form_data.confirm_account_number) {
      form_data.confirm_account_number_error = 'Account number mismatch';
    } else if (form_data.confirm_account_number.length < 5) {
      form_data.confirm_account_number_error = 'Minimum length for account number is 5';
    } else {
      form_data.confirm_account_number_error = '';
    }
    if (!form_data.ifsc_code) {
      form_data.ifsc_error = 'Please enter IFSC Code';
    } else if (form_data.ifsc_code && (form_data.ifsc_code.length < 11 || form_data.ifsc_code.length > 11)) {
      form_data.ifsc_error = 'Invalid IFSC Code';
    }
    this.setState({
      form_data: form_data
    })

    let keysToCheck = ['account_number', 'confirm_account_number', 
    'ifsc', 'account_type'];

    for (var i = 0; i < keysToCheck.length; i++) {
      if (form_data[keysToCheck[i]]) {
        canSubmitForm = false;
        break;
      }
    }
    if (canSubmitForm) {
      try {
        this.setState({
          show_loader: true
        })
  
        let body = {
          bank_name: form_data.bank_name,
          account_number: form_data.account_number,
          ifsc_code: form_data.ifsc_code,
          type: form_data.account_type,
          account_holder_name: form_data.account_holder_name
        };
  
        const res = await Api.post(`/relay/api/loan/eMandate/application/${this.state.application_id}`, body);
  
        let resultData  = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200 && !resultData.error) {

         
          let current_url = window.location.href;
          let nativeRedirectUrl = current_url;

          let paymentRedirectUrl = encodeURIComponent(
            window.location.origin + `/loan/mandate-status` + getConfig().searchParams
          );

          var payment_link = resultData.emandate_status.data;
          var pgLink = payment_link;
          let app = getConfig().app;
          var back_url = encodeURIComponent(current_url);
          // eslint-disable-next-line
          pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl +
            '&app=' + app + '&back_url=' + back_url;
          if (getConfig().generic_callback) {
            pgLink += '&generic_callback=' + getConfig().generic_callback;
          }


          if (getConfig().app === 'ios') {
            nativeCallback({
              action: 'show_top_bar', message: {
                title: 'KYC'
              }
            });
          }

          nativeCallback({
            action: 'take_control', message: {
              back_url: nativeRedirectUrl,
              back_text: 'Are you sure you want to exit the process?'
            }
          });

          window.location.href = pgLink;

          // this.openInTabApp(pgLink);

        } else {
          this.setState({
            show_loader: false
          });

          toast(resultData.error || resultData.message
            || 'Something went wrong');
        }
  
  
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
        console.log(err)
      }
    }
  }

  handleAccountTypeRadioValue = name => value => {
    let form_data = this.state.form_data;
    form_data[name] = value;
    form_data[name + '_error'] = '';
    this.setState({
      form_data: form_data
    });
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Bank a/c details"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="SETUP MANDATE"
        withProvider={this.state.withProvider}
        buttonData={this.state.bottomButtonData}
      >
        <FormControl fullWidth>
          <div className="loan-mandate-bank">
            <div style={{color: '#64778D', margin: '0 0 20px 0', lineHeight: '24px'}}>
              Amount will be credited to this bank a/c. Please make sure that this bank a/c is in your name.
            </div>

            <div className="InputField">
              <Input
                error={(this.state.form_data.name_error) ? true : false}
                helperText={this.state.form_data.name_error}
                type="text"
                width="40"
                autoComplete="nope"
                label="Account holder name"
                class="name"
                id="name"
                name="name"
                value={this.state.form_data.name || ''}
                onChange={this.handleChange('name')}
              />
            </div>

            <div className="InputField" style={{position: 'relative'}}>
              <Input
                error={(this.state.form_data.ifsc_error) ? true : false}
                helperText={this.state.form_data.ifsc_error}
                type="text"
                width="40"
                label="IFSC code"
                name="ifsc_code"
                inputProps={{
                  maxLength: 11,
                }}
                value={this.state.form_data.ifsc_code}
                onChange={this.handleChange('ifsc_code')} 
              />

              {this.state.form_data.bank_image &&
                <label className="input-placeholder-right gold-placeholder-right">
                  <img style={{ width: 20 }}
                    src={this.state.form_data.bank_image} alt="info" />
                </label>}

              <div className="filler">
                {(this.state.form_data.ifsc_helper && !this.state.form_data.ifsc_error) && <span>{this.state.form_data.ifsc_helper}</span>}
              </div>
            </div>

            <div className="InputField">
              <Input
                error={(this.state.form_data.account_number_error) ? true : false}
                helperText={this.state.form_data.account_number_error}
                type="password"
                width="40"
                label="Account Number"
                class="account_number"
                autoComplete="new-password"
                id="account_number"
                maxLength="21"
                name="account_number"
                value={this.state.form_data.account_number}
                onChange={this.handleChange('account_number')}
              />
            </div>

            <div className="InputField">
              <Input
                error={(this.state.form_data.confirm_account_number_error) ? true : false}
                helperText={this.state.form_data.confirm_account_number_error}
                type="number"
                width="40"
                label="Confirm Account Number"
                class="confirm_account_number"
                id="confirm_account_number"
                name="confirm_account_number"
                maxLength="21"
                value={this.state.form_data.confirm_account_number}
                onChange={this.handleChange('confirm_account_number')}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.accountTypeOptions}
                id="select_account_type"
                label="Select account type"
                class="select_account_type"
                error={(this.state.form_data.account_type_error) ? true : false}
                helperText={this.state.form_data.account_type_error}
                value={this.state.form_data.marital_status || ''}
                name="account_type"
                onChange={this.handleAccountTypeRadioValue('account_type')}
              />
            </div>

            <BottomInfo baseData={{ 'content': 'Your information is safe and secure with us' }} />

          </div>

        </FormControl>
      </Container>
    );
  }
}

export default MandateBank;
