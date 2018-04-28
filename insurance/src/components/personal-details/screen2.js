import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import mother from '../../assets/mother_dark_icn.png';
import father from '../../assets/father_dark_icn.png';
import location from '../../assets/location_dark_icn.png';
import Api from '../../utils/api';
import qs from 'qs';
import { validateAlphabets } from '../../utils/validators';

class PersonalDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mother_name: '',
      father_name: '',
      birth_place: '',
      show_loader: true,
      image: '',
      mother_name_error: '',
      father_name_error: '',
      birth_place_error: '',
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
      const { image } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        mother_name: mother_name || '',
        father_name: father_name || '',
        birth_place: birth_place || '',
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

  handleClick = async () => {
    if (this.state.mother_name.length < 3) {
      this.setState({
        mother_name_error: 'Please enter valid name'
      });
    } else if (!validateAlphabets(this.state.mother_name)) {
      this.setState({
        mother_name_error: 'Name can contain only alphabets'
      });
    } else if (this.state.father_name.length < 3) {
      this.setState({
        father_name_error: 'Please enter valid name'
      });
    } else if (!validateAlphabets(this.state.father_name)) {
      this.setState({
        father_name_error: 'Name can contain only alphabets'
      });
    } else if (this.state.birth_place.length < 3) {
      this.setState({
        birth_place_error: 'Please enter valid name'
      });
    } else if (!validateAlphabets(this.state.birth_place)) {
      this.setState({
        birth_place_error: 'Name can contain only alphabets'
      });
    } else {
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
        buttonTitle="Save Details"
        logo={this.state.image}
        >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.mother_name_error) ? true : false}
              helperText={this.state.mother_name_error}
              type="text"
              icon={mother}
              width="40"
              label="Mother's name"
              class="Mothername"
              id="mother-name"
              name="mother_name"
              value={this.state.mother_name}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.father_name_error) ? true : false}
              helperText={this.state.father_name_error}
              type="text"
              icon={father}
              width="40"
              label="Father's name"
              class="FatherName"
              id="father-name"
              name="father_name"
              value={this.state.father_name}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.birth_place_error) ? true : false}
              helperText={this.state.birth_place_error}
              icon={location}
              width="40"
              label="Place of birth"
              class="Place"
              id="birth-place"
              name="birth_place"
              value={this.state.birth_place}
              onChange={this.handleChange()} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default PersonalDetails2;
