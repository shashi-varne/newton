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

class MandateBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      withProvider: true,
      get_lead: true,
      getLeadBodyKeys: ['bank_info', 'vendor_info']
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let accountTypeOptions = [
      'Savings',
      'Current'
    ];


    let { params } = this.props.location;
    if (!params) {
      params = {};
    }


    this.setState({
      accountTypeOptions: accountTypeOptions,
      fromPanScreen: !!params.fromPanScreen
    });

  }

  onload = () => {
    let lead = this.state.lead || {};
    let bank_info = lead.bank_info || {};
    let vendor_info = lead.vendor_info || {};

    // let dmi_loan_status = vendor_info.dmi_loan_status || '';
    let formDisabled = false;

    // if (['emandate', 'emandate_failed', 'emandate_exit'].indexOf(dmi_loan_status) !== -1) {
    //   formDisabled = true;
    // }

    let form_data = {
      "bank_name": bank_info.bank_name || '',
      "account_no": bank_info.account_number || '',
      "confirm_account_no": bank_info.account_number || '',
      "ifsc_code": bank_info.ifsc_code || '',
      "account_type": bank_info.type || '',
      "name": bank_info.account_holder_name || '',
      "bank_image": bank_info.bank_image || ''
    };


    let bottomButtonData = {
      leftTitle: 'Personal loan',
      leftSubtitle: numDifferentiationInr(vendor_info.approved_amount_decision)
    }

    this.setState({
      form_data: form_data,
      vendor_info: vendor_info,
      bottomButtonData: bottomButtonData,
      formDisabled: formDisabled
    }, () => {
      if(form_data.ifsc_code) {
        this.checkIFSCFormat(form_data.ifsc_code);
      }
    })

  }

  sendEvents(user_action) {
    let { form_data } = this.state;

    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'bank account details',
        "account_holder_name": form_data.name || '',
        'account_no': form_data.account_no || '',
        'confirm_account_no': form_data.confirm_account_no || '',
        'ifsc_code': form_data.ifsc_code || '',
        'account_type': form_data.account_type || '',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  checkIFSCFormat = async (ifsc_code) => {

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

    if (this.state.formDisabled) {
      this.redirectMandate();
    } else {
      let form_data = this.state.form_data;

      let canSubmitForm = true;


      if (!form_data.account_no) {
        form_data.account_no_error = 'Please enter account number';
      } else if (form_data.account_no.length < 5) {
        form_data.account_no_error = 'Minimum length for account number is 5'
      }

      if (!form_data.account_type) {
        form_data.account_type_error = 'Please select account type';
      }

      if (!form_data.name) {
        form_data.name_error = 'Please enter name'
      }

      if (!form_data.confirm_account_no) {
        form_data.confirm_account_no_error = 'This field is required';
      } else if (form_data.account_no !== form_data.confirm_account_no) {
        form_data.confirm_account_no_error = 'Account number mismatch';
      } else if (form_data.confirm_account_no.length < 5) {
        form_data.confirm_account_no_error = 'Minimum length for account number is 5';
      } else {
        form_data.confirm_account_no_error = '';
      }

      if (!form_data.ifsc_code) {
        form_data.ifsc_error = 'Please enter IFSC Code';
      } else if (form_data.ifsc_code && (form_data.ifsc_code.length < 11 || form_data.ifsc_code.length > 11)) {
        form_data.ifsc_error = 'Invalid IFSC Code';
      }


      this.setState({
        form_data: form_data
      })

      // let keysToCheck = ['account_no', 'confirm_account_no', 
      // 'ifsc', 'account_type'];


      for (var key in form_data) {
        if (key.indexOf('error') >= 0) {
          if (form_data[key]) {
            canSubmitForm = false;
            break;
          }
        }
      }

      if (canSubmitForm) {
        try {
          this.setState({
            show_loader: true
          })

          let body = {
            bank_name: form_data.bank_name,
            account_no: form_data.account_no,
            ifsc_code: form_data.ifsc_code,
            account_type: form_data.account_type,
            account_holder_name: form_data.name
          };

          const res = await Api.post(`/relay/api/loan/bank/update/${this.state.application_id}`, body);

          let resultData = res.pfwresponse.result;
          if (res.pfwresponse.status_code === 200 && !resultData.error) {
            this.redirectMandate();

          } else {
            this.setState({
              show_loader: false
            });

            if (resultData.invalid_fields && resultData.invalid_fields.length > 0 && resultData.error &&
              resultData.error.length > 0) {
              let form_data = this.state.form_data;

              for (var i in resultData.invalid_fields) {
                form_data[resultData.invalid_fields[i] + '_error'] = resultData.error[i];
              }

              this.setState({
                form_data: form_data
              })
            } else {
              toast(resultData.error || resultData.message
                || 'Something went wrong');
            }
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


  }

  handleAccountTypeRadioValue = name => value => {
    let form_data = this.state.form_data;
    form_data[name] = value;
    form_data[name + '_error'] = '';
    this.setState({
      form_data: form_data
    });
  };

  goBack = () => {
    this.sendEvents('back');
    this.navigate('upload-pan');
  }

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
        headerData={{
          goBack: this.state.fromPanScreen ? this.goBack : ''
        }}
      >
        <FormControl fullWidth>
          <div className="loan-mandate-bank">
            <div style={{ color: '#64778D', margin: '0 0 20px 0', lineHeight: '24px' }}>
              Amount will be credited to this bank a/c. Please make sure that this bank a/c is in your name.
            </div>

            <div className="InputField">
              <Input
                disabled={this.state.formDisabled}
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

            <div className="InputField" style={{ position: 'relative' }}>
              <Input
                disabled={this.state.formDisabled}
                error={(this.state.form_data.ifsc_error) ? true : false}
                helperText={this.state.form_data.ifsc_error}
                type="text"
                width="40"
                label="IFSC code"
                name="ifsc_code"
                inputProps={{
                  maxLength: 11,
                }}
                value={this.state.form_data.ifsc_code || ''}
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
                disabled={this.state.formDisabled}
                error={(this.state.form_data.account_no_error) ? true : false}
                helperText={this.state.form_data.account_no_error}
                type="password"
                width="40"
                label="Account Number"
                class="account_no"
                autoComplete="new-password"
                id="account_no"
                maxLength="21"
                name="account_no"
                value={this.state.form_data.account_no || ''}
                onChange={this.handleChange('account_no')}
              />
            </div>

            <div className="InputField">
              <Input
                disabled={this.state.formDisabled}
                error={(this.state.form_data.confirm_account_no_error) ? true : false}
                helperText={this.state.form_data.confirm_account_no_error}
                type="number"
                width="40"
                label="Confirm Account Number"
                class="confirm_account_no"
                id="confirm_account_no"
                name="confirm_account_no"
                maxLength="21"
                value={this.state.form_data.confirm_account_no || ''}
                onChange={this.handleChange('confirm_account_no')}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                disabled={this.state.formDisabled}
                width="40"
                options={this.state.accountTypeOptions}
                id="select_account_type"
                label="Select account type"
                class="select_account_type"
                error={(this.state.form_data.account_type_error) ? true : false}
                helperText={this.state.form_data.account_type_error}
                value={this.state.form_data.account_type || ''}
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
