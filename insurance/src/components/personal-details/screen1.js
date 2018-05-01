import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import RadioWithIcon from '../../ui/RadioWithIcon';
import name from '../../assets/full_name_dark_icn.png';
import marital from '../../assets/marital_status_dark_icn.png';
import Api from '../../utils/api';
import qs from 'qs';
import { maritalOptions, genderOptions } from '../../utils/constants';
import { validateAlphabets, validateName } from '../../utils/validators';

class PersonalDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      name: '',
      dob: '',
      gender: '',
      marital_status: '',
      image: '',
      name_error: '',
      dob_error: '',
      gender_error: '',
      marital_status_error: '',
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
      const { image } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        name: name || '',
        dob: (dob) ? dob.replace(/\\-/g, '/').split('/').reverse().join('-') : '',
        gender: gender || '',
        marital_status: marital_status || '',
        image: image
      });
    }).catch(error => {
      this.setState({show_loader: false});
      console.log(error);
    });

  }

  handleChange = () => event => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name+'_error']: ''
    });
  };

  handleGenderRadioValue = name => index => {
    this.setState({
      [name]: genderOptions[index]['value']
    });
  };

  handleMaritalRadioValue = name => index => {
    this.setState({
      [name]: maritalOptions[index]['value'],
      [name+'_error']: ''
    });
  };

  handleClick = async () => {
    if (this.state.name.length < 3) {
      this.setState({
        name_error: 'Enter full valid name - alphabets only'
      });
    } else if (!validateName(this.state.name) || !validateAlphabets(this.state.name)) {
      this.setState({
        name_error: 'Enter full valid name - alphabets only'
      });
    } else if (!this.state.marital_status) {
      this.setState({
        marital_status_error: 'Mandatory'
      });
    } else {
      this.setState({show_loader: true});
      // const formattedDob = this.state.dob.replace(/\\-/g, '/').split('-').reverse().join('/');

      const res = await Api.post('/api/insurance/profile', {
        insurance_app_id: this.state.params.insurance_id,
        name: this.state.name,
        // dob: formattedDob,
        // gender: this.state.gender,
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
        for (let error of res.pfwresponse.result.errors) {
          this.setState({
            [error.field+'_error']: error.message
          });
        }
      }
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
        logo={this.state.image}
        >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              type="text"
              error={(this.state.name_error) ? true : false}
              helperText={this.state.name_error}
              icon={name}
              width="40"
              label="Full Name *"
              class="FullName"
              id="name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <RadioWithIcon
              error={(this.state.marital_status_error) ? true : false}
              helperText={this.state.marital_status_error}
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
