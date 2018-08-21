import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';

import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import mother from 'assets/mother_dark_icn.png';
import father from 'assets/father_dark_icn.png';
import location from 'assets/location_dark_icn.png';
import Api from 'utils/api';
import { validateEmpty,
validateLength,
validateConsecutiveChar,
validateAlphabets } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';

class PersonalDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mother_name: '',
      father_name: '',
      spouse_name: '',
      marital_status: '',
      birth_place: '',
      show_loader: true,
      image: '',
      mother_name_error: '',
      father_name_error: '',
      spouse_name_error: '',
      birth_place_error: '',
      provider: '',
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }
  }

  componentWillMount() {
    if (this.state.ismyway) {
      this.setState({
        type: 'myway'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime'
      });
    } else {
      this.setState({
        type: 'fisdom'
      });
    }
  }

  componentDidMount() {
    Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'personal'
    }).then(res => {
      const { mother_name, father_name, spouse_name,  birth_place, marital_status } = res.pfwresponse.result.profile;
      const { image, provider } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        mother_name: mother_name || '',
        father_name: father_name || '',
        marital_status: marital_status || '',
        spouse_name: spouse_name || '',
        birth_place: birth_place || '',
        image: image,
        provider: provider
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?insurance_id='+this.state.params.insurance_id+'&resume='+this.state.params.resume+'&base_url='+this.state.params.base_url
    });
  }

  handleClick = async () => {
    if (this.state.mother_name.split(" ").filter(e => e).length < 2) {
      this.setState({
        mother_name_error: 'Enter valid full name'
      });
    } else if (!validateEmpty(this.state.mother_name)) {
      this.setState({
        mother_name_error: 'Enter valid full name'
      });
    } else if (!validateLength(this.state.mother_name)) {
      this.setState({
        mother_name_error: 'Maximum length of name is 30 characters'
      });
    } else if (!validateConsecutiveChar(this.state.mother_name)) {
      this.setState({
        mother_name_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (!validateAlphabets(this.state.mother_name)) {
      this.setState({
        mother_name_error: 'Name can contain only alphabets'
      });
    } else if (this.state.marital_status === 'MARRIED' && this.state.spouse_name.split(" ").length < 2) {
      this.setState({
        spouse_name_error: 'Enter valid full name'
      });
    } else if (this.state.marital_status === 'MARRIED' && !validateEmpty(this.state.spouse_name)) {
      this.setState({
        spouse_name_error: 'Enter valid full name'
      });
    } else if (this.state.marital_status === 'MARRIED' && !validateLength(this.state.spouse_name)) {
      this.setState({
        spouse_name_error: 'Maximum length of name is 30 characters'
      });
    } else if (this.state.marital_status === 'MARRIED' && !validateConsecutiveChar(this.state.spouse_name)) {
      this.setState({
        spouse_name_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (this.state.marital_status === 'MARRIED' && !validateAlphabets(this.state.spouse_name)) {
      this.setState({
        spouse_name_error: 'Name can contain only alphabets'
      });
    } else if (this.state.father_name.split(" ").length < 2) {
      this.setState({
        father_name_error: 'Enter valid full name'
      });
    } else if (!validateEmpty(this.state.father_name)) {
      this.setState({
        father_name_error: 'Enter valid full name'
      });
    } else if (!validateLength(this.state.father_name)) {
      this.setState({
        father_name_error: 'Maximum length of name is 30 characters'
      });
    } else if (!validateConsecutiveChar(this.state.father_name)) {
      this.setState({
        father_name_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (!validateAlphabets(this.state.father_name)) {
      this.setState({
        father_name_error: 'Name can contain only alphabets'
      });
    } else if (this.state.birth_place.length < 3) {
      this.setState({
        birth_place_error: 'Enter a valid city name - alphabets only'
      });
    } else if (!validateAlphabets(this.state.birth_place)) {
      this.setState({
        birth_place_error: 'Enter a valid city name - alphabets only'
      });
    } else {
      this.setState({show_loader: true});
      const res = await Api.post('/api/insurance/profile', {
        insurance_app_id: this.state.params.insurance_id,
        father_name: this.state.father_name,
        spouse_name: this.state.spouse_name,
        mother_name: this.state.mother_name,
        birth_place: this.state.birth_place
      });

      if (res.pfwresponse.status_code === 200) {

        let eventObj = {
          "event_name": "personal_three_save",
          "properties": {
            "provider": this.state.provider,
            "mother_name": this.state.mother_name,
            "father_name": this.state.father_name,
            "place_birth": this.state.birth_place,
            "from_edit": (this.props.edit) ? 1 : 0
          }
        };

        nativeCallback({ events: eventObj });

        this.setState({show_loader: false});
        if (this.props.edit) {
          if (this.state.params.resume === "yes") {
            this.navigate('/insurance/resume');
          } else {
            this.navigate('/insurance/summary');
          }
        } else {
          this.navigate('/insurance/contact');
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
        type={this.state.type}
        >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.mother_name_error) ? true : false}
              helperText={this.state.mother_name_error || "Please enter full name"}
              type="text"
              icon={mother}
              width="40"
              label="Mother's name *"
              class="Mothername"
              id="mother-name"
              name="mother_name"
              value={this.state.mother_name}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.father_name_error) ? true : false}
              helperText={this.state.father_name_error || "Please enter full name"}
              type="text"
              icon={father}
              width="40"
              label="Father's name *"
              class="FatherName"
              id="father-name"
              name="father_name"
              value={this.state.father_name}
              onChange={this.handleChange()} />
          </div>
          {
            this.state.marital_status === 'MARRIED' &&
            <div className="InputField">
              <InputWithIcon
                error={(this.state.spouse_name_error) ? true : false}
                helperText={this.state.spouse_name_error || "Please enter full name"}
                type="text"
                icon={father}
                width="40"
                label="Spouse name *"
                class="SpouseName"
                id="spouse-name"
                name="spouse_name"
                value={this.state.spouse_name}
                onChange={this.handleChange()} />
            </div>
          }
          <div className="InputField">
            <InputWithIcon
              error={(this.state.birth_place_error) ? true : false}
              helperText={this.state.birth_place_error}
              icon={location}
              width="40"
              label="Place of birth *"
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
