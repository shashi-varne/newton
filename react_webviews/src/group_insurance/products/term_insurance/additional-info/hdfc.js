import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../../common/ui/Toast';

import Container from '../../../common/Container';
import TitleWithIcon from '../../../../common/ui/TitleWithIcon';
import Input from '../../../../common/ui/Input';
import RadioButton2 from '../../../../common/ui/RadioButton2';
import education from 'assets/education_dark_icn.png';
import occupation from 'assets/occupation_details_dark_icn.png';
import professional from 'assets/professional_details_icon.svg';
import professional_myway from 'assets/professional_details_icn.svg';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import DropdownWithoutIcon from '../../../../common/ui/SelectWithoutIcon';
import Api from 'utils/api';
import marital from 'assets/marital_status_dark_icn.png';
import personal from 'assets/personal_details_icon.svg';
import personal_myway from 'assets/personal_details_icn.svg';
import {
  declareOptions,
  occupationDetailOptionsHdfc, occupationDetailOptionsIpru,
  occupationCategoryOptions, educationQualificationsOptionsIpru, qualification, maritalOptions, genderOptions
} from '../../../constants';
import {
  validateAlphabets, validateEmpty, validateLength, validateConsecutiveChar
} from 'utils/validators';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class AdditionalInfo extends Component {
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
      spouse_name: '',
      spouse_name_error: '',
      provider: '',
      mother_name: '',
      father_name: '',
      birth_place: '',
      mother_name_error: '',
      father_name_error: '',
      birth_place_error: '',
      occupation_detail: '',
      occupation_detail_error: '',
      occupation_category: '',
      occupation_category_error: '',
      education_qualification: '',
      education_qualification_error: '',
      is_politically_exposed: 'N',
      is_criminal: 'N',
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName
    }
  }

  async componentDidMount() {

    try {
      const res = await Api.get('/api/insurance/profile/' + this.state.params.insurance_id, {
        groups: 'personal,professional,misc'
      });

      const { name, dob, gender, marital_status, spouse_name,
        father_name, mother_name, birth_place,
        is_criminal, is_politically_exposed } = res.pfwresponse.result.profile;
      const { image, provider, cover_plan } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        name: name || '',
        dob: (dob) ? dob.replace(/\\-/g, '/').split('/').reverse().join('-') : '',
        gender: gender || '',
        marital_status: marital_status || '',
        mother_name: mother_name || '',
        father_name: father_name || '',
        spouse_name: spouse_name || '',
        birth_place: birth_place || '',
        occupation_detail: '',
        occupation_category: '',
        education_qualification: '',
        is_politically_exposed: (is_criminal) ? 'Y' : 'N',
        is_criminal: (is_politically_exposed) ? 'Y' : 'N',
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

  handleChange = (name) => event => {

    if (name === 'checked') {
      this.setState({
        [name]: event.target.checked
      });
    } else if (name === 'education_qualification') {
      this.setState({
        [name]: event,
        [name + '_error']: ''
      });
    } else if (name === 'is_politically_exposed' || name === 'is_criminal') {
      this.setState({
        [name]: declareOptions[event]['value'],
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    }

  };

  handleKeyChange = name => event => {
    if (event.charCode >= 48 && event.charCode <= 57) {
      // valid
    } else {
      // invalid
      event.preventDefault();
    }
  }

  handleGenderRadioValue = name => index => {
    this.setState({
      [name]: genderOptions[index]['value']
    });
  };

  handleMaritalRadioValue = name => index => {
    this.setState({
      [name]: maritalOptions[index]['value'],
      [name + '_error']: ''
    });
  };

  handleOccCategoryRadioValue = name => index => {
    this.setState({
      [name]: occupationCategoryOptions[index]['value'],
      [name + '_error']: ''
    });
  };

  handleOccDetailRadioValueIpru = name => index => {
    this.setState({
      [name]: occupationDetailOptionsIpru[index]['value'],
      [name + '_error']: ''
    });
  };

  handleEduDetailRadioValue = name => index => {
    this.setState({
      [name]: educationQualificationsOptionsIpru[index]['value'],
      [name + '_error']: ''
    });
  };

  handleOccDetailRadioValueHdfc = name => index => {
    this.setState({
      [name]: occupationDetailOptionsHdfc[index]['value'],
      [name + '_error']: ''
    });
  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParamsMustAppend + '&insurance_id=' + this.state.params.insurance_id,
      params: {
        disableBack: true
      }
    });
  }

  handleClick = async () => {

    if (!this.state.marital_status) {
      this.setState({
        marital_status_error: 'Mandatory'
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
    } else if (this.state.mother_name.split(" ").filter(e => e).length < 2) {
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
    } else if (!this.state.education_qualification) {
      this.setState({
        education_qualification_error: 'Invalid education qualification'
      });
    } else if (!this.state.occupation_detail) {
      this.setState({
        occupation_detail_error: 'Mandatory'
      });
    } else if (this.state.occupation_detail === 'SALRIED' && !this.state.occupation_category) {
      this.setState({
        occupation_category_error: 'Mandatory'
      });
    } else {
      try {
        this.setState({ show_loader: true });

        let data = {
          father_name: this.state.father_name,
          spouse_name: this.state.spouse_name,
          mother_name: this.state.mother_name,
          birth_place: this.state.birth_place,
          marital_status: this.state.marital_status,
          insurance_app_id: this.state.params.insurance_id
        };

        data['is_politically_exposed'] = this.state.is_politically_exposed;
        data['is_criminal'] = this.state.is_criminal;
        data['occupation_category'] = this.state.occupation_category;
        data['occupation_detail'] = this.state.occupation_detail;
        data['education_qualification'] = this.state.education_qualification;

        if (this.state.marital_status === 'MARRIED') {
          data['spouse_name'] = this.state.spouse_name;
        }
        const res = await Api.post('/api/insurance/profile', data);

        if (res.pfwresponse.status_code === 200) {

          let eventObj = {
            "event_name": "personal_two_save",
            "properties": {
              "provider": this.state.provider,
              "name": this.state.name,
              "dob": this.state.dob,
              "gender": this.state.gender.toLowerCase(),
              "marital": this.state.marital_status.toLowerCase(),
              "from_edit": (this.props.edit) ? 1 : 0
            }
          };

          nativeCallback({ events: eventObj });

          this.setState({ show_loader: false });

          this.navigate('summary');


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

  renderCategory = () => {
    if (this.state.occupation_detail === 'SALRIED') {
      return (
        <div className="InputField">
          <RadioWithoutIcon
            error={(this.state.occupation_category_error) ? true : false}
            helperText={this.state.occupation_category_error}
            type="professional"
            label="Occupation category"
            class="Occupation"
            options={occupationCategoryOptions}
            id="occupation-category"
            name="occupation_category"
            value={this.state.occupation_category}
            onChange={this.handleOccCategoryRadioValue('occupation_category')} />
        </div>
      );
    } else {
      return null;
    }
  }

  renderDeclaration = () => {
    return (
      <div>
        <div className="SectionHead" style={{ marginBottom: 30, color: 'rgb(68,68,68)', fontSize: 14, fontFamily: 'Rubik' }}>
          By tapping continue, you declare that you’re -
        </div>
        <div className="RadioBlock">
          <div className="RadioWithoutIcon" style={{ display: 'inline-table' }}>
            <RadioButton2
              options={declareOptions}
              type="professional2"
              id="exposed"
              label="Politically exposed"
              value={this.state.is_politically_exposed}
              onChange={this.handleChange('is_politically_exposed')} />
          </div>
          <div className="RadioWithoutIcon" style={{ display: 'inline-table' }}>
            <RadioButton2
              options={declareOptions}
              type="professional2"
              id="criminal"
              label="Criminal proceedings"
              value={this.state.is_criminal}
              onChange={this.handleChange('is_criminal')} />
          </div>
        </div>
      </div>
    );
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Intro'
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
        title="Additional Details"
        smallTitle={this.state.provider}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save & Continue"
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="20" icon={this.state.type !== 'fisdom' ? personal_myway : personal} title={(this.props.edit) ? 'Edit Personal Details' : 'Personal Details'} />
          <div className="InputField">
            <RadioWithoutIcon
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
          {
            this.state.marital_status === 'MARRIED' &&
            <div className="InputField">
              <Input
                error={(this.state.spouse_name_error) ? true : false}
                helperText={this.state.spouse_name_error}
                type="text"
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
            <Input
              error={(this.state.mother_name_error) ? true : false}
              helperText={this.state.mother_name_error}
              type="text"
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
              width="40"
              label="Place of birth *"
              class="Place"
              id="birth-place"
              name="birth_place"
              value={this.state.birth_place}
              onChange={this.handleChange()} />
          </div>
        </FormControl>

        <FormControl fullWidth>
          <TitleWithIcon width="20" icon={this.state.type !== 'fisdom' ? professional_myway : professional}
            title={(this.props.edit) ? 'Edit Professional Details' : 'Professional Details'} />
          <div className="InputField">
            <DropdownWithoutIcon
              error={(this.state.education_qualification_error) ? true : false}
              helperText={this.state.education_qualification_error}
              icon={education}
              width="40"
              options={qualification}
              label="Educational qualification"
              class="Education"
              id="education"
              name="education_qualification"
              value={this.state.education_qualification}
              onChange={this.handleChange('education_qualification')} />
          </div>
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.occupation_detail_error) ? true : false}
              helperText={this.state.occupation_detail_error}
              icon={occupation}
              width="40"
              type="professional"
              label="Occupation Details"
              class="MaritalStatus"
              options={occupationDetailOptionsHdfc}
              id="occupation"
              name="occupation_detail"
              value={this.state.occupation_detail}
              onChange={this.handleOccDetailRadioValueHdfc('occupation_detail')}
            />
          </div>

          {this.renderCategory()}
          {this.renderDeclaration()}
        </FormControl>
      </Container>
    );
  }
}

export default AdditionalInfo;
