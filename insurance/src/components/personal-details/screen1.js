import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import RadioWithIcon from '../../ui/RadioWithIcon';
import name from '../../assets/full_name_dark_icn.png';
import dob from '../../assets/dob_dark_icn.png';
import gender from '../../assets/gender_dark_icn.png';
import marital from '../../assets/marital_status_dark_icn.png';
import Api from '../../service/api';
import qs from 'qs';

const maritalOptions = [
  {
    'name': 'Unmarried',
    'value': 'UNMARRIED'
  },
  {
    'name': 'Married',
    'value': 'MARRIED'
  },
  {
    'name': 'Divorced',
    'value': 'DIVORCED'
  },
  {
    'name': 'Widow',
    'value': 'WIDOW'
  }
];
const genderOptions = [
  {
    'name': 'Male',
    'value': 'MALE'
  },
  {
    'name': 'Female',
    'value': 'FEMALE'
  }
];

class PersonalDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      name: '',
      dob: '',
      gender: '',
      marital_status: '',
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  componentDidMount() {
    Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'personal'
    }).then(res => {
      const { name, dob, gender, marital_status } = res.pfwresponse.result.profile;

      this.setState({
        show_loader: false,
        name: name || '',
        dob: (dob) ? dob.replace(/\\-/g, '/').split('/').reverse().join('-') : '',
        gender: gender || '',
        marital_status: marital_status || ''
      });
    }).catch(error => {
      this.setState({show_loader: false});
      console.log(error);
    });

  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleGenderRadioValue = name => index => {
    this.setState({
      [name]: genderOptions[index]['value']
    });
  };

  handleMaritalRadioValue = name => index => {
    this.setState({
      [name]: maritalOptions[index]['value']
    });
  };

  handleClick = async () => {
    const formattedDob = this.state.dob.replace(/\\-/g, '/').split('-').reverse().join('/');

    this.setState({show_loader: true});

    const res = await Api.post('/api/insurance/profile', {
      insurance_app_id: this.state.params.insurance_id,
      name: this.state.name,
      dob: formattedDob,
      gender: this.state.gender,
      marital_status: this.state.marital_status
    });

    if (res.pfwresponse.status_code === 200) {
      this.setState({show_loader: false});
      if (this.props.edit) {
        this.props.history.push({
          pathname: '/edit-personal1',
          search: '?insurance_id='+this.state.params.insurance_id
        });
      } else {
        this.props.history.push({
          pathname: '/personal',
          search: '?insurance_id='+this.state.params.insurance_id
        });
      }
    } else {
      this.setState({show_loader: false});
      alert('Error');
      console.log(res.pfwresponse.result.error);
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={(this.props.edit) ? 'Edit Personal Details' : 'Personal Details'}
        count={true}
        total={4}
        current={1}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save & Continue"
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
              value={this.state.name}
              onChange={this.handleChange('name')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="date"
              icon={dob}
              width="40"
              label="Date of birth"
              class="DOB"
              id="dob"
              value={this.state.dob}
              onChange={this.handleChange('dob')} />
          </div>
          <div className="InputField">
            <RadioWithIcon
              icon={gender}
              width="40"
              label="Gender"
              class="Gender"
              options={genderOptions}
              id="gender"
              value={this.state.gender}
              onChange={this.handleGenderRadioValue('gender')} />
          </div>
          <div className="InputField">
            <RadioWithIcon
              icon={marital}
              width="40"
              label="Marital Status"
              class="MaritalStatus"
              options={maritalOptions}
              id="marital-status"
              value={this.state.marital_status}
              onChange={this.handleMaritalRadioValue('marital_status')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default PersonalDetails1;
