import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import RadioWithIcon from '../../ui/RadioWithIcon';
import name from '../../assets/full_name_dark_icn.png';
import dob from '../../assets/dob_dark_icn.png';
import gender from '../../assets/gender_dark_icn.png';
import marital from '../../assets/marital_status_dark_icn.png';

const maritalOptions = ['Single', 'Married', 'Divorced', 'Widow'];
const genderOptions = ['Male', 'Female'];

class PersonalDetails1 extends Component {
  state = {
    fullName: '',
    dob: '',
    gender: '',
    maritalStatus: ''
  }

  handleInput = (e) => {
    this.setState({
      fullName: e.target.value
    });
  }

  render() {
    return (
      <Container
        title={'Personal Details'}
        count={true}
        total={5}
        current={1}
        state={this.state}
        >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              type="text"
              icon={name}
              width="40"
              label="Full Name"
              class="FullName"
              id="full-name"
              onChange={this.handleInput} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="date"
              icon={dob}
              width="40"
              label="Date of birth"
              class="DOB"
              id="dob" />
          </div>
          <div className="InputField">
            <RadioWithIcon
              icon={gender}
              width="40"
              label="Gender"
              class="Gender"
              options={genderOptions}
              id="gender" />
          </div>
          <div className="InputField">
            <RadioWithIcon
              icon={marital}
              width="40"
              label="Marital Status"
              class="MaritalStatus"
              options={maritalOptions}
              id="marital-status" />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default PersonalDetails1;
