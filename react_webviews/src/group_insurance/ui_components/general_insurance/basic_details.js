import React, { Component } from 'react';
import Container from '../../common/Container';
import Input from '../../../common/ui/Input';
import MobileInputWithoutIcon from '../../../common/ui/MobileInputWithoutIcon';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import {
  genderOptions, insuranceMaritalStatus, relationshipOptionsGroupInsuranceAll,
  insuranceProductTitleMapper
} from '../../constants';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import scrollIntoView from 'scroll-into-view-if-needed';

import {
  isValidDate, validateAlphabets,
  validateEmail, validateNumber, numberShouldStartWith,
  validateConsecutiveChar, validateLengthNames, IsFutureDate
} from 'utils/validators';

import { nativeCallback } from 'utils/native_callback';

class BasicDetailsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      parent: this.props.parent,
      basic_details_data: {
        nominee: {}
      },
      premium_details: {},
      inputDisabled: {},
      relationshipOptions: [],
      age: 0,
    };

    this.handleClickCurrent = this.handleClickCurrent.bind(this);
    this.nomineeRef = React.createRef();
    this.handleNomineeScroll = this.handleNomineeScroll.bind(this);

  }

  componentWillMount() {

    let inputDisabled = {

    };

    if (this.props.parent.state.product_key === 'SMART_WALLET') {
      inputDisabled.marital_status = true;
    }

    let lead_id = window.sessionStorage.getItem('group_insurance_lead_id_selected');
    this.setState({
      premium_details: this.props.parent.props.location.state ? this.props.parent.props.location.state.premium_details : '',
      lead_id: lead_id || '',
      inputDisabled: inputDisabled
    })

  }

  componentDidUpdate(prevState) {

    if (prevState.parent !== this.props.parent) {
      this.setState({
        parent: this.props.parent || {}
      })
    }

  }

  renderNominee = () => {
    return (
      <div style={{ display: !this.state.checked ? 'none' : 'initial' }}>
        <div className="InputField">
          <Input
            type="text"
            width="40"
            label="Nominee's name"
            class="NomineeName"
            id="nominee-name"
            name="nominee_name"
            error={(this.state.basic_details_data.nominee && this.state.basic_details_data.nominee.name_error) ? true : false}
            helperText={this.state.basic_details_data.nominee ? this.state.basic_details_data.nominee.name_error : ''}
            value={this.state.basic_details_data.nominee ? this.state.basic_details_data.nominee.name || '' : ''}
            onChange={this.handleChange('nominee_name')} />
        </div>
        <div id="nomineeScroll" ref={this.nomineeRef} className="InputField">
          <DropdownWithoutIcon
            width="40"
            options={this.state.relationshipOptions}
            id="relation"
            label="Nominee's relationship"
            error={(this.state.basic_details_data.nominee && this.state.basic_details_data.nominee.relation_error) ? true : false}
            helperText={this.state.basic_details_data.nominee ? this.state.basic_details_data.nominee.relation_error : ''}
            value={this.state.basic_details_data.nominee ? this.state.basic_details_data.nominee.relation || '' : ''}
            name="nominee_relation"
            onChange={this.handleChange('nominee_relation')} />
        </div>
      </div>

    );

  }

  setRelationshipOptions(proposer_gender) {
    let options = [];
    if (proposer_gender && proposer_gender.toLowerCase() === 'male') {
      options = relationshipOptionsGroupInsuranceAll['male'];
    } else if (proposer_gender && proposer_gender.toLowerCase() === 'female') {
      options = relationshipOptionsGroupInsuranceAll['female'];
    } else {
      options = relationshipOptionsGroupInsuranceAll['male'];
    }

    let basic_details_data = this.state.basic_details_data;
    basic_details_data.nominee.relation = '';
    this.setState({
      relationshipOptions: options,
      basic_details_data: basic_details_data
    })

  }

  handleNomineeScroll(value) {

    setTimeout(function () {
      if (value) {
        let element = document.getElementById('nomineeScroll');
        if (!element || element === null) {
          return;
        }

        scrollIntoView(element, {
          block: 'start',
          inline: 'nearest',
          behavior: 'smooth'
        })
      }

    }, 50);
  }

  handleChange = name => event => {
    if (!name) {
      name = event.target.name;
    }
    var value = event.target ? event.target.value : '';
    var basic_details_data = this.state.basic_details_data || {};
    if (name.indexOf('nominee_') >= 0) {
      if (!basic_details_data.nominee) {
        basic_details_data.nominee = {};
      }

      if (name === 'nominee_name') {
        name = 'name'
      } else if (name === 'nominee_relation') {
        name = 'relation'
        value = event
      }
      basic_details_data.nominee[name] = value;
      basic_details_data.nominee[name + '_error'] = '';
    } else if (name === 'checked') {
      this.setState({
        [name]: event.target.checked
      })
      this.handleNomineeScroll(event.target.checked);
    } else if (name === 'mobile_no') {
      if (value.length <= 10) {
        basic_details_data[name] = value;
        basic_details_data[name + '_error'] = '';
      }
    } else if (name === 'dob') {
      let errorDate = '';
      if (value.length > 10) {
        return;
      }

      var input = document.getElementById('dob');

      input.onkeyup = function (event) {
        var key = event.keyCode || event.charCode;

        var thisVal;

        let slash = 0;
        for (var i = 0; i < event.target.value.length; i++) {
          if (event.target.value[i] === '/') {
            slash += 1;
          }
        }

        if (slash <= 1 && key !== 8 && key !== 46) {
          var strokes = event.target.value.length;

          if (strokes === 2 || strokes === 5) {
            thisVal = event.target.value;
            thisVal += '/';
            event.target.value = thisVal;
          }
          // if someone deletes the first slash and then types a number this handles it
          if (strokes >= 3 && strokes < 5) {
            thisVal = event.target.value;
            if (thisVal.charAt(2) !== '/') {
              var txt1 = thisVal.slice(0, 2) + "/" + thisVal.slice(2);
              event.target.value = txt1;
            }
          }
          // if someone deletes the second slash and then types a number this handles it
          if (strokes >= 6) {
            thisVal = event.target.value;

            if (thisVal.charAt(5) !== '/') {
              var txt2 = thisVal.slice(0, 5) + "/" + thisVal.slice(5);
              event.target.value = txt2;
            }
          }
        };



      }

      basic_details_data[name] = event.target.value;
      basic_details_data[name + '_error'] = errorDate;
      let age = this.calculateAge(event.target.value.replace(/\\-/g, '/').split('/').reverse().join('/'));
      this.setState({
        age: age
      })
    } else {
      basic_details_data[name] = value;
      basic_details_data[name + '_error'] = '';
    }

    this.setState({
      basic_details_data: basic_details_data
    })

  };

  handleChangeRadio = name => event => {


    var basic_details_data = this.state.basic_details_data || {};

    let optionsMapper = {
      'gender': genderOptions,
      'marital_status': insuranceMaritalStatus
    }
    basic_details_data[name] = optionsMapper[name][event].value;
    basic_details_data[name + '_error'] = '';

    this.setState({
      basic_details_data: basic_details_data
    })

    if (name === 'gender') {
      this.setRelationshipOptions(optionsMapper[name][event].value);
    }

  };

  onload = async () => {
    
  

    this.setErrorData('onload');


    let premium_details = this.state.premium_details;
    let leadData = premium_details.lead || '';

    this.setRelationshipOptions('male');
    let basic_details_data = {
      "product_name": this.props.parent.state.product_key,
      "name": "",
      "gender": "",
      "marital_status": "",
      "mobile_no": "",
      "email": "",
      "dob": "",
      "nominee": {
        "name": "",
        "relation": ""
      },
      "nominee_checked": false,
      cover_amount: premium_details.cover_amount,
      premium: premium_details.premium,
      tax_amount: premium_details.tax_amount
    }

    let error = '';
    try {
  
      if (this.state.lead_id) { 
        this.setState({
          skelton: true
        })
        if(!leadData) {
         
          let res = await Api.get('api/insurancev2/api/insurance/bhartiaxa/lead/get/' + this.state.lead_id)
    
          leadData = res.pfwresponse.result.lead; 
             
          if (res.pfwresponse.status_code === 200) {
          this.setState({
            skelton: false
          })

            
          } else {
            toast(res.pfwresponse.result.error || res.pfwresponse.result.message
              || 'Something went wrong');
          }
        }
  
        Object.keys(basic_details_data).forEach((key) => {
          basic_details_data[key] = leadData[key]
        })

        this.setRelationshipOptions(basic_details_data.gender);
        basic_details_data['dob'] = basic_details_data['dob'] ? basic_details_data['dob'].replace(/\\-/g, '/').split('-').join('/') : '';
        let age = this.calculateAge(basic_details_data.dob.replace(/\\-/g, '/').split('/').reverse().join('/'));
        this.setState({
          age: age,
          checked: leadData.nominee_details || false,
          skelton: false
        })
       
      } else {
        this.setState({
          skelton: true
        })
        let res = await Api.get('api/ins_service/api/insurance/account/summary?provider=BHARTIAXA')

        
        if (res.pfwresponse.status_code === 200) {
        
          let result = {};
          if (res.pfwresponse.result.response_data) {
            result = res.pfwresponse.result.response_data.insurance_account || {};
          } else {
            result = res.pfwresponse.result.insurance_account || {};
          }
          this.setState({
            skelton: false
          })
          basic_details_data.name = result.name || '';
          basic_details_data.gender = result.gender || '';
          basic_details_data.marital_status = result.marital_status || '';
          basic_details_data.mobile_no = result.mobile_number || '';
          basic_details_data.email = result.email || '';
          basic_details_data.nominee = result.nominee ? result.nominee : {};
          this.setRelationshipOptions(basic_details_data.gender);
          basic_details_data['dob'] = result.dob ? result.dob.replace(/\\-/g, '/').split('-').join('/') : '';
          let age = this.calculateAge(basic_details_data.dob.replace(/\\-/g, '/').split('/').reverse().join('/'));
          this.setState({
            age: age
          })
        } else if (res.pfwresponse.status_code === 401) {

        } else {
          error = res.pfwresponse.result.error || res.pfwresponse.result.message
          || 'Something went wrong';
        }
      }


    } catch (err) {
      this.setState({
        showError: 'page',
        errorData: { ...this.state.errorData, type: 'crash' },
        skelton: false,
      });
    }

    // error = 'aaaaaaa'

    // set error data
    if(error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error
        },
        showError: 'page',
      })
    }
    this.setState({
      basic_details_data: basic_details_data
    })
  }
  async componentDidMount() {
    this.onload();
  }

  calculateAge = (birthday) => {
    var today = new Date();
    var birthDate = new Date(birthday);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  setErrorData = (type) => {

    this.setState({
      showError: false
    });
    if(type) {
      let mapper = {
        'onload':  {
          handleClick1: this.onload,
          button_text1: 'Fetch again',
          title1: ''
        },
        'submit': {
          handleClick1: this.handleClickCurrent,
          button_text1: 'Retry',
          handleClick2: () => {
            this.setState({
              showError: false
            })
          },
          button_text2: 'Edit'
        }
      };
  
      this.setState({
        errorData: {...mapper[type], setErrorData : this.setErrorData}
      })
    }

  }

  async handleClickCurrent() {


    this.setErrorData('submit');

  
    this.setState({
      showError: false
    })
    this.sendEvents('next');
    let keysMapper = {
      'name': 'name',
      'email': 'email',
      'dob': 'dob',
      'mobile_no': 'mobile number',
      'gender': 'gender',
      'marital_status': 'marital status'
    }

    let keys_to_check = ['name', 'email', 'dob', 'mobile_no', 'gender', 'marital_status']
    for (var j = 0; j < keys_to_check.length; j++) {
      if (this.state.inputDisabled[keys_to_check[j]]) {
        keys_to_check.splice(j, 1);
      }
    }

    let basic_details_data = this.state.basic_details_data;
    for (var i = 0; i < keys_to_check.length; i++) {
      let key_check = keys_to_check[i];
      let first_error = key_check === 'gender' || key_check === 'marital_status' ? 'Please select ' :
        'Please enter ';
      if (!basic_details_data[key_check]) {
        basic_details_data[key_check + '_error'] = first_error + keysMapper[key_check];
      }
    }


    if (!validateAlphabets(basic_details_data.name)) {
      basic_details_data['name_error'] = 'Name can contain only alphabets';
    }
    // else if (validateLengthNames(basic_details_data.name, 'name', this.state.provider).isError) {
    //   basic_details_data['name_error'] = validateLengthNames(basic_details_data.name, 'name', basic_details_data.provider).error_msg;
    // } else if (basic_details_data.name.split(" ").filter(e => e).length < 2) {
    //   basic_details_data['name_error'] = 'Enter valid full name';
    // } else if (basic_details_data.name.split(" ")[0].length < 2 || 
    // basic_details_data.name.split(" ")[basic_details_data.name.split(" ").length -1].length < 2) {
    //   basic_details_data['name_error'] = 'Minimum 2 words required , containing minimum 2 letters';
    // } else if (!validateConsecutiveChar(basic_details_data.name)) {
    //   basic_details_data['name_error'] = 'Name can not contain more than 3 same consecutive characters';
    // }

    if (new Date(basic_details_data.dob) > new Date() || !isValidDate(basic_details_data.dob)) {
      basic_details_data['dob_error'] = 'Please enter valid date';
    } else if (IsFutureDate(basic_details_data.dob)) {
      basic_details_data['dob_error'] = 'Future date is not allowed';
    } else if (this.props.parent.state.product_key === 'PERSONAL_ACCIDENT' && (basic_details_data.cover_amount === 500000 || basic_details_data.cover_amount === 1000000) && (this.state.age > 50 || this.state.age < 18)) {
      basic_details_data['dob_error'] = 'Valid age is between 18 and 50';
    } else if (this.props.parent.state.product_key !== 'DENGUE' && (this.state.age > 65 || this.state.age < 18)) {
        basic_details_data['dob_error'] = 'Valid age is between 18 and 65';
    } else if (this.props.parent.state.product_key === 'DENGUE' && (this.state.age > 50 || this.state.age < 18)) {
      basic_details_data['dob_error'] = 'Valid age is between 18 and 50';
    }
      
    if (!basic_details_data.email || (basic_details_data.email.length < 10 || !validateEmail(basic_details_data.email))) {

      basic_details_data['email_error'] = 'Please enter valid email';
    }

    if (!basic_details_data.mobile_no ||
      (basic_details_data.mobile_no.length !== 10 || !validateNumber(basic_details_data.mobile_no))
      || !numberShouldStartWith(basic_details_data.mobile_no)) {
      basic_details_data['mobile_no_error'] = 'Please enter valid mobile number';

    }

    let canSubmitForm = true;
    for (var key in basic_details_data) {
      if (key.indexOf('error') >= 0) {
        if (basic_details_data[key]) {
          canSubmitForm = false;
          break;
        }
      }
    }

    if (this.state.checked) {
      if (!validateAlphabets(basic_details_data.nominee.name)) {
        canSubmitForm = false;
        basic_details_data.nominee['name_error'] = 'Name can contain only alphabets';
      } else if (validateLengthNames(basic_details_data.nominee.name, 'name', this.state.provider).isError) {
        canSubmitForm = false;
        basic_details_data.nominee['name_error'] = validateLengthNames(basic_details_data.nominee.name,
          'name', basic_details_data.provider).error_msg;
      } else if (!validateConsecutiveChar(basic_details_data.nominee.name)) {
        canSubmitForm = false;
        basic_details_data.nominee['name_error'] = 'Name can not contain more than 3 same consecutive characters';
      }

      if (!basic_details_data.nominee.relation) {
        canSubmitForm = false;
        basic_details_data.nominee['relation_error'] = 'Please enter relationship';
      }

    }

    this.setState({
      basic_details_data: basic_details_data
    })



    if (canSubmitForm) {
      let final_data = {
        "product_name": this.props.parent.state.product_key,
        "name": basic_details_data.name,
        "gender": basic_details_data.gender,
        "marital_status": this.state.inputDisabled.marital_status ? '' : basic_details_data.marital_status,
        "mobile_no": basic_details_data.mobile_no,
        "email": basic_details_data.email,
        "premium": basic_details_data.premium,
        "dob": basic_details_data.dob,
        "tax_amount": basic_details_data.tax_amount,
        "cover_amount": basic_details_data.cover_amount
      }

      if (this.state.checked) {
        let obj = {
          "name": basic_details_data.nominee.name,
          "relation": basic_details_data.nominee.relation
        }
        final_data['nominee'] = obj;
        final_data['nominee'] = {};  //TODO remove
      } else {
        final_data['nominee'] = {};
      }

      final_data.product_name = this.props.parent.state.product_key;
      final_data.nominee_details = this.state.checked;


      let error = '';
      try {
        this.setState({
          show_loader: 'button'
        })
        let res2 = {};
        if (this.state.lead_id) {
          final_data.lead_id = this.state.lead_id;
          res2 = await Api.post('api/insurancev2/api/insurance/bhartiaxa/lead/update', final_data)
        } else {
          res2 = await Api.post('api/insurancev2/api/insurance/bhartiaxa/lead/create', final_data)
        }

        
        if (res2.pfwresponse.status_code === 200) {
          var lead_id_updated = this.state.lead_id || res2.pfwresponse.result.lead.id;
          window.sessionStorage.setItem('group_insurance_lead_id_selected', lead_id_updated || '');
          this.navigate('summary', {lead: res2.pfwresponse.result.updated_lead || {}})
        } else {
          this.setState({
            show_loader: false,
            
          })
          
          if ('error' in res2.pfwresponse.result) {
            if (Array.isArray(res2.pfwresponse.result.error)) {
              error = res2.pfwresponse.result.error[0]['error'];
            } else {
              error = res2.pfwresponse.result.error.error || res2.pfwresponse.result.error;
            }
          } else {
            error = res2.pfwresponse.result.message || res2.pfwresponse.result.message || 'Something went wrong'
          }
        }

      } catch (err) {
        this.setState({
          show_loader: false,
          showError: true,
          errorData: {
            ...this.state.errorData, type: 'crash'
          },
        });
      }

      // set error data
      if(error) {
        this.setState({
          errorData: {
            ...this.state.errorData,
            title2: error
          },
          showError:true
        })
      }

    }

  }

  navigate = (pathname, data) => {
    this.props.parent.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    }, data);
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'basic_details',
        "type": this.props.parent.state.product_key,
        "basic_details": {
          "name": this.state.basic_details_data['name'] ? 'yes' : 'no',
          "dob": this.state.basic_details_data['dob'] ? 'yes' : 'no',
          "gender": this.state.basic_details_data['gender'] ? 'yes' : 'no',
          "email": this.state.basic_details_data['email'] ? 'yes' : 'no',
          "mobile": this.state.basic_details_data['mobile_no'] ? 'yes' : 'no',
          "nominee_details": this.state.checked ? 'yes' : 'no',
          "nominee_name": this.state.checked && this.state.basic_details_data.nominee &&
            this.state.basic_details_data.nominee['name'] ? 'yes' : 'no',
          "nominee_relation": this.state.checked && this.state.basic_details_data.nominee &&
            this.state.basic_details_data.nominee['relation'] ? 'yes' : 'no',
        }
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    let currentDate = new Date().toISOString().slice(0, 10);
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        fullWidthButton={true}
        product_key={this.props.parent ? this.props.parent.state.product_key : ''}
        buttonTitle='Go to Summary'
        onlyButton={true}
        showError={this.state.showError}
        errorData={this.state.errorData}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        handleClick={() => this.handleClickCurrent()}
        title={insuranceProductTitleMapper[this.props.parent ? this.props.parent.state.product_key : '']}
        classOverRideContainer="basic-details">
        <div>
          <div>
            <div className="basic-details-heading">Your details</div>
            <div className="basic-details-subtitle">It's necessary for policy issuance</div>
          </div>
          <div style={{ marginTop: '40px' }}>
            <div className="InputField">
              <Input
                type="text"
                width="40"
                label="Name"
                class="Name"
                id="name"
                name="name"
                error={(this.state.basic_details_data.name_error) ? true : false}
                helperText={this.state.basic_details_data.name_error}
                value={this.state.basic_details_data.name || ''}
                onChange={this.handleChange()} />
            </div>
            <div className="InputField">
              <Input
                type="text"
                width="40"
                label="Date of birth (DD/MM/YYYY)"
                class="DOB"
                id="dob"
                name="dob"
                max={currentDate}
                error={(this.state.basic_details_data.dob_error) ? true : false}
                helperText={this.state.basic_details_data.dob_error}
                value={this.state.basic_details_data.dob || ''}
                placeholder="DD/MM/YYYY"
                maxLength="10"
                onChange={this.handleChange()} />
            </div>
            <div className="InputField">
              <Input
                type="email"
                width="40"
                label="E-mail address"
                class="Email"
                id="email"
                name="email"
                error={(this.state.basic_details_data.email_error) ? true : false}
                helperText={this.state.basic_details_data.email_error}
                value={this.state.basic_details_data.email || ''}
                onChange={this.handleChange()} />
            </div>
            <div className="InputField">
              <MobileInputWithoutIcon
                type="number"
                width="40"
                label="Mobile number"
                class="Mobile"
                id="number"
                name="mobile_no"
                error={(this.state.basic_details_data.mobile_no_error) ? true : false}
                helperText={this.state.basic_details_data.mobile_no_error}
                value={this.state.basic_details_data.mobile_no || ''}
                onChange={this.handleChange()} />
            </div>
            <div className="InputField">
              <RadioWithoutIcon
                width="40"
                label="Gender"
                class="Gender:"
                options={genderOptions}
                id="gender"
                name="gender"
                error={(this.state.basic_details_data.gender_error) ? true : false}
                helperText={this.state.basic_details_data.gender_error}
                value={this.state.basic_details_data.gender || ''}
                onChange={this.handleChangeRadio('gender')} />
            </div>

            {!this.state.inputDisabled.marital_status && <div className="InputField">
              <RadioWithoutIcon
                width="40"
                label="Marital status"
                class="Marital status:"
                options={insuranceMaritalStatus}
                id="marital-status"
                name="marital_status"
                error={(this.state.basic_details_data.marital_status_error) ? true : false}
                helperText={this.state.basic_details_data.marital_status_error}
                value={this.state.basic_details_data.marital_status || ''}
                onChange={this.handleChangeRadio('marital_status')} />
            </div>}
            <div className="InputField" style={{ marginBottom: '0px !important' }}>
              <div className="CheckBlock2" style={{ margin: '10px 0' }}>
                <Grid container spacing={16} alignItems="center">
                  <Grid item xs={1} className="TextCenter">
                    <Checkbox
                      defaultChecked
                      checked={this.state.checked}
                      color="default"
                      value="checked"
                      name="checked"
                      onChange={this.handleChange()}
                      className="Checkbox" />
                  </Grid>
                  <Grid item xs={11}>
                    <div className="checkbox-text">Do you want to add nominee details?</div>
                  </Grid>
                </Grid>
              </div>
            </div>
            {this.renderNominee()}
          </div>
          {this.props.parent.state.product_key === 'CORONA' && 
            <div className="bottom-info">World Health Organisation has declared coronavirus infection as pandemic. Stay safe!</div>
          }
        </div>
      </Container>
    );
  }
}


const BasicDetails = (props) => (
  <BasicDetailsForm
    {...props} />
);

export default BasicDetails;