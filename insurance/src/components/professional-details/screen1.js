import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';

import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import RadioWithIcon from '../../ui/RadioWithIcon';
import RadioWithoutIcon from '../../ui/RadioWithoutIcon';
import pan from '../../assets/pan_dark_icn.png';
import education from '../../assets/education_dark_icn.png';
import occupation from '../../assets/occupation_details_dark_icn.png';
import designation from '../../assets/designation_dark_icn.png';
import income from '../../assets/annual_income_dark_icn.png';
import Dropdown from '../../ui/Select';
import Api from '../../utils/api';
import { declareOptions, occupationDetailOptions, occupationCategoryOptions, qualification } from '../../utils/constants';
import { validatePan, validateNumber, formatAmount } from '../../utils/validators';

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
      designation: '',
      designation_error: '',
      is_politically_exposed: 'N',
      is_criminal: 'N',
      image: '',
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  componentDidMount() {
    Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'professional,misc'
    }).then(res => {
      const { annual_income, designation, education_qualification, occupation_category, occupation_detail, is_criminal, is_politically_exposed, pan_number } = res.pfwresponse.result.profile;
      const { image } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        occupation_detail: occupation_detail || '',
        occupation_category: occupation_category || '',
        annual_income: annual_income || '',
        pan_number: pan_number || '',
        education_qualification: education_qualification || '',
        designation: designation || '',
        is_politically_exposed: (is_criminal) ? 'Y' : 'N',
        is_criminal: (is_politically_exposed) ? 'Y' : 'N',
        image: image
      });
    }).catch(error => {
      this.setState({show_loader: false});
      console.log(error);
    });
  }

  handleChange = name => event => {
    if (name === 'checked') {
      this.setState({
        [name]: event.target.checked
      });
    } else if (name === 'education_qualification') {
      this.setState({
        [name]: event,
        [name+'_error']: ''
      });
    } else if (name === 'is_politically_exposed' || name === 'is_criminal') {
      this.setState({
        [name]: declareOptions[event]['value'],
      });
    } else {
      this.setState({
        [name]: event.target.value.replace (/,/g, ""),
        [name+'_error']: ''
      });
    }
  };

  handleOccCategoryRadioValue = name => index => {
    this.setState({
      [name]: occupationCategoryOptions[index]['value'],
      [name+'_error']: ''
    });
  };

  handleOccDetailRadioValue = name => index => {
    this.setState({
      [name]: occupationDetailOptions[index]['value'],
      [name+'_error']: ''
    });
  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?insurance_id='+this.state.params.insurance_id+'&resume='+this.state.params.resume
    });
  }

  handleClick = async () => {
    if (this.state.pan_number.length !== 10 || !validatePan(this.state.pan_number)) {
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
    } else if (this.state.occupation_detail === 'SALRIED' && !this.state.occupation_category) {
      this.setState({
        occupation_category_error: 'Mandatory'
      });
    } else if (this.state.occupation_detail === 'SALRIED' && !this.state.designation) {
      this.setState({
        designation_error: 'Invalid designation'
      });
    } else if (this.state.occupation_detail === 'SELF-EMPLOYED' && !this.state.designation) {
    this.setState({
      designation_error: 'Invalid designation'
    });
    } else if (this.state.occupation_detail === 'SALRIED' && (!validateNumber(this.state.annual_income) || !this.state.annual_income)) {
      this.setState({
        annual_income_error: 'Invalid annual income'
      });
    } else if (this.state.occupation_detail === 'SELF-EMPLOYED' && (!validateNumber(this.state.annual_income) || !this.state.annual_income)) {
      this.setState({
        annual_income_error: 'Invalid annual income'
      });
    } else {
      this.setState({show_loader: true});
      let data = {};

      data['insurance_app_id'] =  this.state.params.insurance_id;
      data['occupation_detail'] = this.state.occupation_detail;
      data['occupation_category'] = this.state.occupation_category;
      data['annual_income'] = this.state.annual_income;
      data['pan_number'] = this.state.pan_number;
      data['education_qualification'] = this.state.education_qualification;

      if (this.state.occupation_detail === 'SELF-EMPLOYED') {
        data['designation'] = this.state.designation;
        data['is_politically_exposed'] = this.state.is_politically_exposed;
        data['is_criminal'] = this.state.is_criminal;
      }
      if (this.state.occupation_detail === 'SALRIED') {
        data['designation'] = this.state.designation;
      }

      this.setState({show_loader: true});

      const res = await Api.post('/api/insurance/profile', data);

      if (res.pfwresponse.status_code === 200) {
        this.setState({show_loader: false});
        if (this.props.edit) {
          if (this.state.occupation_detail === 'SALRIED') {
            this.navigate('/edit-professional1');
          } else {
            if (this.state.params.resume === true) {
              this.navigate('/resume');
            } else {
              this.navigate('/summary');
            }
          }
        } else {
          if (this.state.occupation_detail === 'SALRIED') {
            this.navigate('/professional1');
          } else {
            this.navigate('/summary');
          }
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

  renderDesignation = () => {
    if (this.state.occupation_detail === 'SELF-EMPLOYED' || this.state.occupation_detail === 'SALRIED') {
      return (
        <div className="InputField">
          <InputWithIcon
            error={(this.state.designation_error) ? true : false}
            helperText={this.state.designation_error}
            type="text"
            icon={designation}
            width="40"
            label="Designation *"
            class="Designation"
            id="designation"
            name="designation"
            value={this.state.designation}
            onChange={this.handleChange('designation')} />
        </div>
      );
    } else {
      return null;
    }
  }

  renderCategory = () => {
    if (this.state.occupation_detail === 'SALRIED') {
      return (
        <div className="InputField">
          <RadioWithIcon
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
    if (this.state.occupation_detail === 'SELF-EMPLOYED') {
      return (
        <div>
          <div className="SectionHead" style={{marginBottom: 30, color: 'rgb(68,68,68)', fontSize: 14, fontFamily: 'Roboto'}}>
            By tapping continue, you declare that you’re -
          </div>
          <div className="RadioBlock">
            <div className="RadioWithoutIcon" style={{marginBottom: 20, borderBottom: '1px solid #c6c6c6', paddingBottom: 20}}>
              <RadioWithoutIcon
                options={declareOptions}
                type="professional2"
                id="exposed"
                label="Politically exposed"
                value={this.state.is_politically_exposed}
                onChange={this.handleChange('is_politically_exposed')} />
            </div>
            <div className="RadioWithoutIcon">
              <RadioWithoutIcon
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
    } else {
      return null;
    }
  }

  renderIncome = () => {
    if (this.state.occupation_detail === 'SELF-EMPLOYED' || this.state.occupation_detail === 'SALRIED') {
      return (
        <div className="InputField">
          <InputWithIcon
            error={(this.state.annual_income_error) ? true : false}
            helperText={this.state.annual_income_error}
            type="text"
            icon={income}
            width="40"
            label="Annual Income *"
            class="Income"
            id="income"
            name="annual_income"
            value={formatAmount(this.state.annual_income)}
            onChange={this.handleChange('annual_income')} />
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={(this.props.edit) ? 'Edit Professional Details' : 'Professional Details'}
        count={true}
        total={4}
        current={4}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save & Continue"
        logo={this.state.image}
        >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
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
          <div className="InputField">
            <Dropdown
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
            <RadioWithIcon
              error={(this.state.occupation_detail_error) ? true : false}
              helperText={this.state.occupation_detail_error}
              icon={occupation}
              width="40"
              type="professional"
              label="Occupation Details"
              class="Occupation"
              options={occupationDetailOptions}
              id="occupation"
              name="occupation_detail"
              value={this.state.occupation_detail}
              onChange={this.handleOccDetailRadioValue('occupation_detail')} />
          </div>
          {this.renderCategory()}
          {this.renderDesignation()}
          {this.renderIncome()}
        </FormControl>
        {this.renderDeclaration()}
      </Container>
    );
  }
}

export default ProfessionalDetails1;
