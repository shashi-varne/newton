import React from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import RadioWithIcon from '../../ui/RadioWithIcon';
import Input, { InputLabel } from 'material-ui/Input';
import name from '../../assets/full_name_dark_icn.png';
import dob from '../../assets/dob_dark_icn.png';
import gender from '../../assets/gender_dark_icn.png';

const PersonalDetails1 = () => (
  <Container title={'Personal Details'} count={true} total={5} current={1}>
    <FormControl fullWidth>
      <div className="InputField">
        <InputWithIcon
          type="text"
          icon={name}
          width="40"
          label="Full Name"
          class="FullName"
          id="full-name" />
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
          id="gender" />
      </div>
    </FormControl>
  </Container>
);

export default PersonalDetails1;
