import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../../common/ui/Toast';

import Container from '../../../common/Container';
import TitleWithIcon from '../../../../common/ui/TitleWithIcon';
import personal from 'assets/personal_details_icon.svg';
import personal_myway from 'assets/personal_details_icn.svg';
import Input from '../../../../common/ui/Input';
import mother from 'assets/mother_dark_icn.png';
import father from 'assets/father_dark_icn.png';
import location from 'assets/location_dark_icn.png';
import Api from 'utils/api';
import {
  validateEmpty,
  validateConsecutiveChar,
  validateAlphabets,
  validateLengthNames
} from 'utils/validators';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

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
      provider: '',
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName
    }
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/profile/' + this.state.params.insurance_id, {
        groups: 'personal'
      })
      const { mother_name, father_name, birth_place, marital_status } = res.pfwresponse.result.profile;
      const { image, provider, cover_plan } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        mother_name: mother_name || '',
        father_name: father_name || '',
        marital_status: marital_status || '',
        birth_place: birth_place || '',
        image: image,
        provider: provider,
        cover_plan: cover_plan
      });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  handleChange = () => event => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + '_error']: ''
    });
  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams + '&resume=' + this.state.params.resume,
      params: {
        disableBack: true
      }
    });
  }

  handleClick = async () => {
    this.sendEvents('next');
    if (!validateEmpty(this.state.mother_name)) {
      this.setState({
        mother_name_error: 'Enter valid name'
      });
    } else if (validateLengthNames(this.state.mother_name, 'mother_name', this.state.provider).isError) {
      this.setState({
        mother_name_error: validateLengthNames(this.state.mother_name, 'mother_name', this.state.provider).error_msg
      });
    } else if (!validateConsecutiveChar(this.state.mother_name)) {
      this.setState({
        mother_name_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (!validateAlphabets(this.state.mother_name)) {
      this.setState({
        mother_name_error: 'Name can contain only alphabets'
      });
    } else if (!validateEmpty(this.state.father_name)) {
      this.setState({
        father_name_error: 'Enter valid name'
      });
    } else if (validateLengthNames(this.state.father_name, 'father_name', this.state.provider).isError) {
      this.setState({
        father_name_error: validateLengthNames(this.state.father_name, 'father_name', this.state.provider).error_msg
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
      try {
        this.setState({ show_loader: true });
        const res = await Api.post('/api/insurance/profile', {
          insurance_app_id: this.state.params.insurance_id,
          father_name: this.state.father_name,
          mother_name: this.state.mother_name,
          birth_place: this.state.birth_place
        });

        if (res.pfwresponse.status_code === 200) {

          this.setState({ show_loader: false });
          if (this.props.edit) {
            if (this.state.params.resume === "yes") {
              this.navigate('resume');
            } else {
              this.navigate('summary');
            }
          } else {
            this.navigate('contact');
          }
        } else {
          this.setState({ show_loader: false });
          for (let error of res.pfwresponse.result.errors) {
            this.setState({
              [error.field + '_error']: error.message
            });
          }
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'personal_details_two',
        "provider": this.state.provider,
        "mother_name": this.state.mother_name ? 'yes' : 'no',
        "father_name": this.state.father_name ? 'yes' : 'no',
        "place_birth": this.state.birth_place ? 'yes' : 'no',
        "from_edit": (this.props.edit) ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Application Form"
        smallTitle={this.state.provider}
        count={true}
        total={this.state.provider === 'IPRU' ? 5 : 4}
        current={1}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save & Continue"
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="20" icon={this.state.type !== 'fisdom' ? personal_myway : personal} title={(this.props.edit) ? 'Edit Personal Details' : 'Personal Details'} />
          <div className="InputField">
            <Input
              error={(this.state.mother_name_error) ? true : false}
              helperText={this.state.mother_name_error}
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
            <Input
              error={(this.state.father_name_error) ? true : false}
              helperText={this.state.father_name_error}
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
          <div className="InputField">
            <Input
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
