import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
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
import Api from '../../service/api';
import qs from 'qs';

const declareOptions = ['Y', 'N'];
const occupationDetailOptions = ["SELF-EMPLOYED","SALRIED","STUDENT"];
const occupationCategoryOptions = ["GOVERNMENT","PRIVATE","PUBLIC"];
const qualification = [
  'B A',
  'BAMS',
  'BAC',
  'B B A',
  'BCA',
  'B COM',
  'BDS',
  'B E',
  'B ED',
  'BHMS',
  'BMLT',
  'B M S',
  'B PHARM',
  'BPY',
  'B SC',
  'B TECH',
  'BUMS',
  'BACHELOR OF VETERINARY SCIENCE',
  'CA',
  'CFA',
  'CSC',
  'DCE',
  'DIPLOMA IN CIVIL ENGINEERING',
  'D ED',
  'DIPLOMA IN ELECTRICAL ENGINEERING',
  'DIPLOMA IN FASHION DESIGNING',
  'DIPLOMA IN GENERAL NURSING',
  'DIPLOMA IN INTERIOR DESIGNING',
  'DIPLOMA IN INSTRUMENTATION ENGINEERING',
  'DIPLOMA',
  'DIPLOMA IN MECHANICAL ENGINEERING',
  'DMLT',
  'DIPLOMA IN PHARMACY',
  'DTE',
  'GRD',
  'H S C',
  'ICWA',
  'ILLITERATE',
  'ITI',
  'LLB',
  'MASTER OF LAW',
  'M A',
  'M. ARCH.',
  'MBA',
  'MBBS',
  'MCA',
  'M.CH',
  'MCM',
  'M D',
  'M E',
  'MED',
  'MMS',
  'M PHARM',
  'M. PHIL',
  'MPY',
  'M S',
  'M SC',
  'M TECH',
  'PGR',
  'PG DIPLOMA  BUSINESS ADMIN',
  'PBM',
  'PG DIPLOMA MARKETING MANAGEMENT',
  'PHARMD',
  'PH.D.',
  'S S C',
  'UNDER MATRIC (CLASS L TO LX)'
];

class ProfessionalDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      occupation_detail: '',
      occupation_category: '',
      annual_income: '',
      pan_number: '',
      education_qualification: '',
      designation: '',
      is_politically_exposed: 'N',
      is_criminal: 'N',
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async componentDidMount() {
    this.setState({show_loader: true});
    const res = await Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'professional,misc'
    });

    const { annual_income, designation, education_qualification, occupation_category, occupation_detail, is_criminal, is_politically_exposed, pan_number } = res.pfwresponse.result.profile;

    await this.setStateAsync({
      show_loader: false,
      occupation_detail: occupation_detail,
      occupation_category: occupation_category,
      annual_income: annual_income,
      pan_number: pan_number || '',
      education_qualification: education_qualification,
      designation: designation || '',
      is_politically_exposed: (is_criminal) ? 'Y' : 'N',
      is_criminal: (is_politically_exposed) ? 'Y' : 'N'
    });
  }

  handleChange = name => event => {
    if (name === 'checked') {
      this.setState({
        [name]: event.target.checked
      });
    } else if (name === 'education_qualification') {
      this.setState({
        [name]: event
      });
    } else if (name === 'is_politically_exposed' || name === 'is_criminal') {
      this.setState({
        [name]: declareOptions[event]
      });
    } else {
      this.setState({
        [name]: event.target.value
      });
    }
  };

  handleOccCategoryRadioValue = name => index => {
    this.setState({
      [name]: occupationCategoryOptions[index]
    });
  };

  handleOccDetailRadioValue = name => index => {
    this.setState({
      [name]: occupationDetailOptions[index]
    });
  };

  handleClick = async () => {
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

    this.setState({show_loader: true});

    const res = await Api.post('/api/insurance/profile', data);

    if (res.pfwresponse.status_code === 200) {
      this.setState({show_loader: false});
      if (this.props.edit) {
        if (this.state.occupation_detail === 'SALRIED') {
          this.props.history.push({
            pathname: '/edit-professional1',
            search: '?insurance_id='+this.state.params.insurance_id
          });
        } else {
          this.props.history.push({
            pathname: '/summary',
            search: '?insurance_id='+this.state.params.insurance_id
          });
        }
      } else {
        this.props.history.push({
          pathname: '/professional1',
          search: '?insurance_id='+this.state.params.insurance_id
        });
      }
    } else {
      this.setState({show_loader: false});
      alert('Error');
      console.log(res.pfwresponse.result.error);
    }
  }

  renderDesignation = () => {
    if (this.state.occupation_detail === 'SELF-EMPLOYED') {
      return (
        <div className="InputField">
          <InputWithIcon
            type="text"
            icon={designation}
            width="40"
            label="Designation"
            class="Designation"
            id="designation"
            value={this.state.designation}
            onChange={this.handleChange('designation')} />
        </div>
      );
    } else {
      return null;
    }
  }

  renderCategory = () => {
    if (this.state.occupation_detail === 'SELF-EMPLOYED' || this.state.occupation_detail === 'STUDENT') {
      return null;
    } else {
      return (
        <div className="InputField">
          <RadioWithIcon
            type="professional"
            label="Occupation category"
            class="Occupation"
            options={occupationCategoryOptions}
            id="occupation-category"
            value={this.state.occupation_category}
            onChange={this.handleOccCategoryRadioValue('occupation_category')} />
        </div>
      );
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
    if (this.state.occupation_detail === 'STUDENT') {
      return null;
    } else {
      return (
        <div className="InputField">
          <InputWithIcon
            type="text"
            icon={income}
            width="40"
            label="Annual Income"
            class="Income"
            id="income"
            value={this.state.annual_income}
            onChange={this.handleChange('annual_income')} />
        </div>
      );
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
        >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              type="text"
              icon={pan}
              width="40"
              label="PAN"
              class="Pan"
              id="pan"
              value={this.state.pan_number}
              onChange={this.handleChange('pan_number')} />
          </div>
          <div className="InputField">
            <Dropdown
              icon={education}
              width="40"
              options={qualification}
              label="Educational qualification"
              class="Education"
              id="education"
              value={this.state.education_qualification}
              onChange={this.handleChange('education_qualification')} />
          </div>
          <div className="InputField">
            <RadioWithIcon
              icon={occupation}
              width="40"
              type="professional"
              label="Occupation Details"
              class="Occupation"
              options={occupationDetailOptions}
              id="occupation"
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
