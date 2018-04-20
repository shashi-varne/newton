import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import mother from '../../assets/mother_dark_icn.png';
import father from '../../assets/father_dark_icn.png';
import location from '../../assets/location_dark_icn.png';

class PersonalDetails2 extends Component {
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
              icon={mother}
              width="40"
              label="Mother's name"
              class="Mothername"
              id="mother-name"
              onChange={this.handleInput} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              icon={father}
              width="40"
              label="Father's name"
              class="FatherName"
              id="father-name" />
          </div>
          <div className="InputField">
            <InputWithIcon
              icon={location}
              width="40"
              label="Place of birth"
              class="Place"
              id="birth-place" />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default PersonalDetails2;
