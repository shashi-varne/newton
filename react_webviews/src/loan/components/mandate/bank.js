import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import Input from "common/ui/Input";
import { storageService } from '../../../utils/validators';
import Api from 'utils/api';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';
import { FormControl } from 'material-ui/Form';
import toast from '../../../common/ui/Toast';
import BottomInfo from '../../../common/ui/BottomInfo';
import { numDifferentiationInr } from 'utils/validators';

class MandateBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      application_id: storageService().get('loan_application_id'),
      formData: {
        account_type: '',
        ifsc_code: '',
        account_no: '',
        confirm_account_no: '',
        bank_image: '',
        name: ''
      },
      withProvider: true
    }
    this.checkIFSCFormat = this.checkIFSCFormat.bind(this);

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
    // ****************************************************
    // code goes here
    // common things can be added inside initialize
    // use/add common functions from/to  ../../common/functions

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'introduction',
        'account_no': this.state.formData.account_no ? 'yes' : 'no',
        'confirm_account_no': this.state.formData.confirm_account_no ? 'yes' : 'no',
        'ifsc_code': this.state.formData.ifsc_code ? 'yes' : 'no',
        'account_type': this.state.formData.account_type ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
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

  handleChange = name => event => {
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
    })

  };

  handleClick = async () => {
    this.sendEvents('next');
    if (this.state.ifsc_error) {
      return;
    }
    let canSubmitForm = true;
    let formData = this.state.formData;
    if (!formData.account_no) {
      formData.account_no_error = 'Please enter account number';
    } else if (formData.account_no.length < 5) {
      formData.account_no_error = 'Minimum length for account number is 5'
    }
    if (!formData.account_type) {
      formData.account_type_error = 'Please select account type';
    }
    if (!formData.name) {
      formData.name_error = 'Please enter name'
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
      try {
        this.setState({
          show_loader: true
        })
  
        let body = {
          bank_name: formData.bank_name,
          account_no: formData.account_no,
          ifsc_code: formData.ifsc_code,
          account_type: formData.account_type
        };
  
        const res = await Api.post(`/relay/api/loan/eMandate/application/${this.state.application_id}`, body);
  
        console.log(res.error)
  
  
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
    let formData = this.state.formData;
    formData[name] = value;
    formData[name + '_error'] = '';
    this.setState({
      formData: formData
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
        bottomButtonData={this.state.bottomButtonData}
      >
        <FormControl fullWidth>
          <div className="loan-mandate-bank">
            <div style={{color: '#64778D', margin: '0 0 20px 0'}}>
              Amount will be credited to this bank a/c. Please make sure that this bank a/c is in your name.
            </div>

            <div style={{marginBottom:'40px'}}>
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
                onChange={this.handleChange('name')}
              />
            </div>

            <div style={{marginBottom:'40px'}}>
              <Input
                error={(this.state.formData.ifsc_error) ? true : false}
                helperText={this.state.formData.ifsc_error}
                type="text"
                width="40"
                label="IFSC code"
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

            <div style={{marginBottom:'40px'}}>
              <Input
                error={(this.state.formData.account_no_error) ? true : false}
                helperText={this.state.formData.account_no_error}
                type="password"
                width="40"
                label="Account Number"
                class="account_no"
                autoComplete="new-password"
                id="account_no"
                maxLength="21"
                name="account_no"
                value={this.state.formData.account_no}
                onChange={this.handleChange('account_no')}
              />
            </div>

            <div style={{marginBottom:'40px'}}>
              <Input
                error={(this.state.formData.confirm_account_no_error) ? true : false}
                helperText={this.state.formData.confirm_account_no_error}
                type="number"
                width="40"
                label="Confirm Account Number"
                class="confirm_account_no"
                id="confirm_account_no"
                name="confirm_account_no"
                maxLength="21"
                value={this.state.formData.confirm_account_no}
                onChange={this.handleChange('confirm_account_no')}
              />
            </div>

            <div style={{marginBottom:'40px'}}>
              <DropdownWithoutIcon
                width="40"
                options={this.state.accountTypeOptions}
                id="select_account_type"
                label="Select account type"
                class="select_account_type"
                error={(this.state.formData.account_type_error) ? true : false}
                helperText={this.state.formData.account_type_error}
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
