import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import mother from '../../assets/mother_dark_icn.png';
import father from '../../assets/father_dark_icn.png';
import location from '../../assets/location_dark_icn.png';
import Api from '../../service/api';

class PersonalDetails2 extends Component {
  state = {
    mother_name: '',
    father_name: '',
    birth_place: ''
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async componentDidMount() {
    const res = await Api.get('/api/insurance/profile/5668600916475904', {
      groups: 'personal'
    });

    const { mother_name, father_name, birth_place } = res.pfwresponse.result.profile;

    await this.setStateAsync({
      mother_name: mother_name,
      father_name: father_name,
      birth_place: birth_place
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleClick = async () => {
    const res = await Api.post('/api/insurance/profile', {
      insurance_app_id: 5668600916475904,
      father_name: this.state.father_name,
      mother_name: this.state.mother_name,
      birth_place: this.state.birth_place
    });

    if (res.pfwresponse.status_code === 200) {
      this.props.history.push('contact-details-1');
    } else {
      alert('Error');
      console.log(res.pfwresponse.result.error);
    }
  }

  render() {
    return (
      <Container
        title={'Personal Details'}
        count={true}
        total={5}
        current={1}
        handleClick={this.handleClick}
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
              value={this.state.mother_name}
              onChange={this.handleChange('mother_name')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              icon={father}
              width="40"
              label="Father's name"
              class="FatherName"
              id="father-name"
              value={this.state.father_name}
              onChange={this.handleChange('father_name')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              icon={location}
              width="40"
              label="Place of birth"
              class="Place"
              id="birth-place"
              value={this.state.birth_place}
              onChange={this.handleChange('birth_place')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default PersonalDetails2;
