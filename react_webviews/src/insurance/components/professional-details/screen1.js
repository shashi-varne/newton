import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import RadioButton2 from '../../../common/ui/RadioButton2';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import professional from 'assets/professional_details_icon.svg';
import professional_myway from 'assets/professional_details_icn.svg';
import Input from '../../../common/ui/Input';
import pan from 'assets/pan_dark_icn.png';
import education from 'assets/education_dark_icn.png';
import occupation from 'assets/occupation_details_dark_icn.png';
import income from 'assets/annual_income_dark_icn.png';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';
import Api from 'utils/api';
import {
  declareOptions,
  occupationDetailOptionsHdfc, occupationDetailOptionsIpru,
  occupationCategoryOptions, educationQualificationsOptionsIpru,
  qualification, educationQualificationsOptionsMaxlife, occupationDetailOptionsMaxlife
} from '../../constants';
import { validatePan, validateNumber, formatAmount, validateEmpty, providerAsIpru } from 'utils/validators';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class ProfessionalDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      occupation_detail: '',
      occupation_detail_error: '',
      occupation_category: '',
      occupation_category_error: '',
      annual_income: '',
      annual_income_error: '',
      pan_number: '',
      pan_number_error: '',
      education_qualification: '',
      education_qualification_error: '',
      is_politically_exposed: 'N',
      is_criminal: 'N',
      image: '',
      provider: '',
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName
    }
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/profile/' + this.state.params.insurance_id, {
        groups: 'professional,misc'
      });
      const { annual_income, education_qualification, occupation_category, occupation_detail, is_criminal, is_politically_exposed, pan_number } = res.pfwresponse.result.profile;
      const { image, provider, cover_plan } = res.pfwresponse.result.quote_desc;
      this.setState({
        show_loader: false,
        occupation_detail: occupation_detail || '',
        occupation_category: occupation_category || '',
        annual_income: annual_income || '',
        pan_number: pan_number || '',
        education_qualification: education_qualification || '',
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

  handleChange = name => event => {
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
        [name]: event.target.value.replace(/,/g, ""),
        [name + '_error']: ''
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

  handleOccCategoryRadioValue = name => index => {
    this.setState({
      [name]: occupationCategoryOptions[index]['value'],
      [name + '_error']: ''
    });
  };

  handleOccDetailRadioValueIpru = name => index => {
    let options = this.state.provider === 'IPRU' ? occupationDetailOptionsIpru :
      occupationDetailOptionsMaxlife;
    this.setState({
      [name]: options[index]['value'],
      [name + '_error']: ''
    });
  };

  handleEduDetailRadioValue = name => index => {
    let options = this.state.provider === 'IPRU' ? educationQualificationsOptionsIpru :
      educationQualificationsOptionsMaxlife;
    this.setState({
      [name]: options[index]['value'],
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
      search: getConfig().searchParams + '&resume=' + this.state.params.resume,
      params: {
        disableBack: true
      }
    });
  }

  handleClick = async () => {

    this.sendEvents('next')
    if (!validateEmpty(this.state.pan_number) &&
      this.state.provider === 'HDFC') {
      this.setState({
        pan_number_error: 'PAN number cannot be empty'
      });
    } else if (!validatePan(this.state.pan_number) &&
      this.state.provider === 'HDFC') {
      this.setState({
        pan_number_error: 'Invalid PAN number'
      });
    } else if (!this.state.education_qualification) {
      this.setState({
        education_qualification_error: 'Invalid education qualification'
      });
    } else if (!this.state.occupation_detail) {
      this.setState({
        occupation_detail_error: 'Mandatory'
      });
    } else if (this.state.occupation_detail === 'SALRIED' && !this.state.occupation_category &&
      this.state.provider === 'HDFC') {
      this.setState({
        occupation_category_error: 'Mandatory'
      });
    } else if (!this.state.annual_income) {
      this.setState({
        annual_income_error: 'Annual income cannot be empty'
      });
    } else if ((!validateNumber(this.state.annual_income) || !this.state.annual_income)) {
      this.setState({
        annual_income_error: 'Invalid annual income'
      });
    } else if (this.state.provider === 'HDFC' && this.state.annual_income < 300000) {
      this.setState({
        annual_income_error: 'Minimum annual income is 3 Lakh'
      });
    } else if ((this.state.provider === 'IPRU' || this.state.provider === 'Maxlife') && this.state.annual_income < 500000) {
      this.setState({
        annual_income_error: 'Minimum annual income is 5 Lakh'
      });
    } else if (this.state.occupation_detail === 'SELF-EMPLOYED' && (!validateNumber(this.state.annual_income) || !this.state.annual_income)) {
      this.setState({
        annual_income_error: 'Invalid annual income'
      });
    } else {
      try {
        this.setState({ show_loader: true });
        let data = {};

        if (this.state.provider === 'HDFC') {
          data['pan_number'] = this.state.pan_number;
          data['is_politically_exposed'] = this.state.is_politically_exposed;
          data['is_criminal'] = this.state.is_criminal;
          data['occupation_category'] = this.state.occupation_category;
        }

        data['insurance_app_id'] = this.state.params.insurance_id;
        data['occupation_detail'] = this.state.occupation_detail;
        data['annual_income'] = this.state.annual_income;
        data['education_qualification'] = this.state.education_qualification;


        this.setState({ show_loader: true });

        const res = await Api.post('/api/insurance/profile', data);

        if (res.pfwresponse.status_code === 200) {

          // eslint-disable-next-line
          let sector_ev;
          if (this.state.occupation_detail === 'SALRIED') {
            sector_ev = 'salaried';
          } else if (this.state.occupation_detail === 'SELF-EMPLOYED') {
            sector_ev = 'self';
          } else {
            sector_ev = 'student';
          }

          this.setState({ show_loader: false });
          if (this.props.edit) {
            if (this.state.params.resume === "yes") {
              this.navigate('/insurance/resume');
            } else {
              this.navigate('/insurance/summary');
            }
          } else {
            this.navigate('/insurance/nominee');
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
        <div className="SectionHead" style={{
          marginBottom: 30, color: '#a2a2a2',
          fontSize: '14px', fontWeight: 'normal'
        }}>
          I declare that I am -
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

  renderIncome = () => {
    // this.state.occupation_detail === 'SELF-EMPLOYED' || this.state.occupation_detail === 'SALRIED'
    if (true) {
      return (
        <div className="InputField">
          <Input
            error={(this.state.annual_income_error) ? true : false}
            helperText={this.state.annual_income_error}
            type="text"
            icon={income}
            width="40"
            label="Annual Income *"
            class="Income"
            id="income"
            name="annual_income"
            value={formatAmount(this.state.annual_income || '')}
            onChange={this.handleChange('annual_income')}
            onKeyChange={this.handleKeyChange('annual_income')} />
        </div>
      );
    } else {
      return null;
    }
  }

  renderProvider() {
    if (this.state.provider === 'HDFC') {
      return (
        <div >
          <div className="InputField">
            <Input
              error={(this.state.pan_number_error) ? true : false}
              helperText={this.state.pan_number_error}
              type="text"
              icon={pan}
              width="40"
              label="PAN *"
              class="Pan"
              id="pan"
              name="pan_number"
              value={this.state.pan_number}
              onChange={this.handleChange('pan_number')} />
          </div>

        </div>
      );
    } else {
      return (
        <div >

        </div>
      );
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'professional_details',
        "provider": this.state.provider,
        'occupation_detail': this.state.occupation_detail ? 'yes' : 'no',
        'annual_income': this.state.annual_income ? 'yes' : 'no',
        'education_qualification': this.state.education_qualification ? 'yes' : 'no',
        "from_edit": (this.state.edit) ? 'yes' : 'no',
      }
    };

    if (this.state.provider === 'HDFC') {
      eventObj.properties.pan_number = this.state.pan_number ? 'yes' : 'no';
      eventObj.properties.is_politically_exposed = this.state.is_politically_exposed ? 'yes' : 'no';
      eventObj.properties.is_criminal = this.state.is_criminal ? 'yes' : 'no';
      eventObj.properties.occupation_category = this.state.occupation_category ? 'yes' : 'no';
    }

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
        total={providerAsIpru(this.state.provider) ? 5 : 4}
        current={3}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save & Continue"
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="20" icon={this.state.type !== 'fisdom' ? professional_myway : professional}
            title={(this.props.edit) ? 'Edit Professional Details' : 'Professional Details'} />
          {this.renderProvider()}
          {this.renderIncome()}
          {this.state.provider === 'HDFC' &&
            <div>
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
            </div>
          }
          {providerAsIpru(this.state.provider) &&
            <div>
              <div className="InputField">
                <RadioWithoutIcon
                  error={(this.state.education_qualification_error) ? true : false}
                  helperText={this.state.education_qualification_error}
                  icon={education}
                  width="40"
                  type="professional"
                  label="Educational qualification"
                  class="MaritalStatus"
                  options={(this.state.provider === 'IPRU' ? educationQualificationsOptionsIpru :
                    educationQualificationsOptionsMaxlife)}
                  id="education"
                  name="education_qualification"
                  value={this.state.education_qualification}
                  onChange={this.handleEduDetailRadioValue('education_qualification')} />
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
                  options={(this.state.provider === 'IPRU' ? occupationDetailOptionsIpru :
                    occupationDetailOptionsMaxlife)}
                  id="occupation"
                  name="occupation_detail"
                  value={this.state.occupation_detail}
                  onChange={this.handleOccDetailRadioValueIpru('occupation_detail')} />
              </div>
            </div>
          }
          {this.state.provider === 'HDFC' && this.renderCategory()}

          {this.state.provider === 'HDFC' && this.renderDeclaration()}
        </FormControl>

      </Container>
    );
  }
}

export default ProfessionalDetails1;
