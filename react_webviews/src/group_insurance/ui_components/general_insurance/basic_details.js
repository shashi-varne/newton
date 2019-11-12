import React, { Component } from 'react';
import Container from '../../common/Container';
import Input from '../../../common/ui/Input';
import MobileInputWithoutIcon from '../../../common/ui/MobileInputWithoutIcon';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import { genderOptions, insuranceMaritalStatus, relationshipOptions } from '../../constants';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

import {
  isValidDate, validateAlphabets,
  validateEmail, validateNumber, numberShouldStartWith,
   validateConsecutiveChar, validateLengthNames
} from 'utils/validators';

class BasicDetailsForm extends Component {
  state = {
    checked: false,
    parent: this.props.parent
  }

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      parent: this.props.parent,
      basic_details_data: this.props.parent.state.basic_details_data || {}
    };

    this.handleClickCurrent = this.handleClickCurrent.bind(this)

  }

  componentDidUpdate(prevState) {

    if (prevState.parent !== this.props.parent) {
      this.setState({
        parent: this.props.parent || {}
      })
    }

    if (this.state.basic_details_data !== this.props.parent.state.basic_details_data) {
      this.setState({
        basic_details_data: this.props.parent.state.basic_details_data
      })
    }

  }

  renderNominee = () => {
    return (
      <div>
        <div className="InputField">
          <Input
            type="text"
            width="40"
            label="Nominee's name"
            class="NomineeName"
            id="nominee-name"
            name="nominee_name"
            error={(this.state.basic_details_data.nominee && this.state.basic_details_data.nominee.name_error) ? true : false}
            helperText={this.state.basic_details_data.nominee ?  this.state.basic_details_data.nominee.name_error :''}
            value={this.state.basic_details_data.nominee ? this.state.basic_details_data.nominee.name || '': ''}
            onChange={this.handleChange()} />
        </div>
        <div className="InputField">
          <DropdownWithoutIcon
            width="40"
            options={relationshipOptions}
            id="relationship"
            label="Nominee's relationship"
            error={(this.state.basic_details_data.nominee && this.state.basic_details_data.nominee.relationship_error) ? true : false}
            helperText={this.state.basic_details_data.nominee ? this.state.basic_details_data.nominee.relationship_error: ''}
            value={this.state.basic_details_data.nominee ? this.state.basic_details_data.nominee.relationship || '': ''}
            name="nominee_relationship"
            onChange={this.handleChange('nominee_relationship')} />
        </div>
      </div>
    );
  }

  handleChange = name => event => {
    console.log(name)
    if (!name) {
       name = event.target.name;
    }
    let value = event.target ? event.target.value : '';
    let basic_details_data = this.state.basic_details_data || {};
    if(name.indexOf('nominee_') >= 0) {
      if (!basic_details_data.nominee) {
        basic_details_data.nominee = {};
      }

      if(name === 'nominee_name') {
        name = 'name'
      } else if(name === 'nominee_relationship') {
        name = 'relationship'
        value = event
      }
      basic_details_data.nominee[name] = value;
      basic_details_data.nominee[name + '_error'] = '';
    } else if (name === 'checked') {
      this.setState({
        [name]: event.target.checked
      })
    } else if (name === 'mobile_no') {
      if (value.length <= 10) {
        basic_details_data[name] =  value;
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
        for (var i = 0; i < value.length; i++) {
          if (value[i] === '/') {
            slash += 1;
          }
        }

        if (slash <= 1 && key !== 8 && key !== 46) {
          var strokes = value.length;

          if (strokes === 2 || strokes === 5) {
            thisVal = value;
            thisVal += '/';
            value = thisVal;
          }
          // if someone deletes the first slash and then types a number this handles it
          if (strokes >= 3 && strokes < 5) {
            thisVal = value;
            if (thisVal.charAt(2) !== '/') {
              var txt1 = thisVal.slice(0, 2) + "/" + thisVal.slice(2);
              value = txt1;
            }
          }
          // if someone deletes the second slash and then types a number this handles it
          if (strokes >= 6) {
            thisVal = value;

            if (thisVal.charAt(5) !== '/') {
              var txt2 = thisVal.slice(0, 5) + "/" + thisVal.slice(5);
              value = txt2;
            }
          }
        };

      }

      basic_details_data[name] =  value;
      basic_details_data[name + '_error'] = errorDate;
    }  else {
      basic_details_data[name] = value;
      basic_details_data[name + '_error'] = '';
    }

    this.setState({
      basic_details_data: basic_details_data
    })
  };

  handleClickCurrent() {
    console.log("handle click child")
    

    // this.sendEvents('next');
    let keysMapper = {
      'name' : 'name',
      'email' : 'email',
      'dob': 'dob',
      'mobile_no' : 'mobile number',
      'gender': 'gender',
      'marital_status': 'marital status'
    }
    let keys_to_check = ['name', 'email', 'dob', 'mobile_no','gender', 'marital_status']
    let basic_details_data = this.state.basic_details_data;

    for (var i=0; i < keys_to_check.length; i++) {
      let key_check = keys_to_check[i];
      if(!basic_details_data[key_check]) {
        basic_details_data[key_check + '_error'] = 'Please enter ' + keysMapper[key_check];
      }
    }

    
    if (!validateAlphabets(basic_details_data.name)) {
      basic_details_data['name_error'] = 'Name can contain only alphabets';
    } else if (validateLengthNames(basic_details_data.name, 'name', this.state.provider).isError) {

      basic_details_data['name_error'] = validateLengthNames(basic_details_data.name, 'name', basic_details_data.provider).error_msg;
    } else if (!validateConsecutiveChar(basic_details_data.name)) {
      basic_details_data['name_error'] = 'Name can not contain more than 3 same consecutive characters';
    }
    
    if (new Date(basic_details_data.dob) > new Date() || !isValidDate(basic_details_data.dob)) {
      basic_details_data['dob_error'] = 'Please enter valid date';
    } else if (basic_details_data.age > 65 || basic_details_data.age < 18) {
      basic_details_data['dob_error'] = 'Valid age is between 18 and 65';
    } 

    
    if ((basic_details_data.email.length < 10 || !validateEmail(basic_details_data.email))) {

      basic_details_data['email_error'] = 'Please enter valid email';
    }
    
    if ((basic_details_data.mobile_no.length !== 10 || !validateNumber(basic_details_data.mobile_no))
    || !numberShouldStartWith(basic_details_data.mobile_no)) {
      basic_details_data['email_error'] = 'Please enter valid mobile number';
      
    }

    this.setState({
      basic_details_data: basic_details_data
    })

    let canSubmitForm = true;
    for (var key in basic_details_data) {
      if(key.indexOf('error') >= 0) {
        if (basic_details_data[key]) {
          canSubmitForm = false;
          break;
        }
      }
    }

    if (canSubmitForm) {
      let final_data = {
          "product_name": "smart_wallet",
          "name": basic_details_data.name,
          "gender": basic_details_data.gender,
          "marital_status": basic_details_data.marital_status,
          "mobile_no": basic_details_data.mobile_no,
          "email": basic_details_data.email,
          "premium": basic_details_data.premium,
          "dob": basic_details_data.dob,
          "tax_amount": basic_details_data.tax_amount,
          "cover_amount": basic_details_data.cover_amount
      }

      if(this.state.checked) {
        let obj = {
          "name":  basic_details_data.nominee.name,
          "relation": basic_details_data.nominee.relationship
        }
        final_data['nominee'] = obj;
      }
      this.state.parent.handleClick(final_data)
    }
    
  }

  render() {
    let currentDate = new Date().toISOString().slice(0, 10);

    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Go to Summary'
        onlyButton={true}
        handleClick={()=> this.handleClickCurrent()}
        title="BasicDetails">
          <div style={{  }}>
            <div style={{  }}>
              <div style={{ color: '#160d2e', fontSize: '16px', lineHeight: '20px', fontWeight: '500', marginBottom: '10px' }}>Basics Details</div>
              <div style={{ color: '#878787', fontSize: '13px' }}>We only need your basic detail for verification</div>
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
                  onChange={this.handleChange()} />
              </div>
              <div className="InputField">
                <RadioWithoutIcon
                  width="40"
                  label="Marital Status"
                  class="Marital status:"
                  options={insuranceMaritalStatus}
                  id="marital-status"
                  name="marital_status"
                  error={(this.state.basic_details_data.marital_status_error) ? true : false}
                  helperText={this.state.basic_details_data.marital_status_error}
                  value={this.state.basic_details_data.marital_status || ''}
                  onChange={this.handleChange()} />
              </div>
              <div className="InputField">
                <div className="CheckBlock2" style={{ padding: '0 15px',margin: '10px 0' }}>
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
                      <div style={{ color: '#a2a2a2', fontSize: '14px' }}>Do you want to add nominee details?</div>
                    </Grid>
                  </Grid>
                </div>
              </div>
              { this.state.checked && this.renderNominee()}
            </div>
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