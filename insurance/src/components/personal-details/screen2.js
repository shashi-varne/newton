import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import mother from '../../assets/mother_dark_icn.png';
import father from '../../assets/father_dark_icn.png';
import location from '../../assets/location_dark_icn.png';
import Api from '../../service/api';
import qs from 'qs';

class PersonalDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mother_name: '',
      father_name: '',
      birth_place: '',
      show_loader: true,
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
      const { mother_name, father_name, birth_place } = res.pfwresponse.result.profile;

      this.setState({
        show_loader: false,
        mother_name: mother_name || '',
        father_name: father_name || '',
        birth_place: birth_place || ''
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

  handleClick = async () => {
    this.setState({show_loader: true});
    const res = await Api.post('/api/insurance/profile', {
      insurance_app_id: this.state.params.insurance_id,
      father_name: this.state.father_name,
      mother_name: this.state.mother_name,
      birth_place: this.state.birth_place
    });

    if (res.pfwresponse.status_code === 200) {
      this.setState({show_loader: false});
      if (this.props.edit) {
        this.props.history.push({
          pathname: '/summary',
          search: '?insurance_id='+this.state.params.insurance_id
        });
      } else {
        this.props.history.push({
          pathname: '/contact',
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
        buttonTitle="Save Details"
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
