import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import RadioWithIcon from '../../ui/RadioWithIcon';
import pan from '../../assets/pan_dark_icn.png';
import education from '../../assets/education_dark_icn.png';
import occupation from '../../assets/occupation_details_dark_icn.png';
import income from '../../assets/annual_income_dark_icn.png';

const occupationCategoryOptions = ['Government', 'Private', 'Public'];
const occupationOptions = ['Salaried', 'Self-employed', 'Student'];

class ProfessionalDetails1 extends Component {
  state = {
    pan: '',
    qualification: '',
    income: ''
  }

  handleInput = (e) => {
    this.setState({
      fullName: e.target.value
    });
  }

  render() {
    return (
      <Container
        title={'Professional Details'}
        count={true}
        total={5}
        current={4}
        state={this.state}
        >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              type="text"
              icon={pan}
              width="40"
              label="PAN"
              class="Pan"
              id="pan"
              onChange={this.handleInput} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              icon={education}
              width="40"
              label="Educational qualification"
              class="Education"
              id="education"
              onChange={this.handleInput} />
          </div>
          <div className="InputField">
            <RadioWithIcon
              icon={occupation}
              width="40"
              type="professional"
              label="Occupation Details"
              class="Occupation"
              options={occupationOptions}
              id="occupation" />
          </div>
          <div className="InputField">
            <RadioWithIcon
              type="professional"
              label="Occupation category"
              class="Occupation"
              options={occupationCategoryOptions}
              id="occupation-category" />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              icon={income}
              width="40"
              label="Annual Income"
              class="Income"
              id="income"
              onChange={this.handleInput} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default ProfessionalDetails1;
