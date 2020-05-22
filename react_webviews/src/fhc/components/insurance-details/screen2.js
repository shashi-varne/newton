import React, { Component, Fragment } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import Input from '../../../common/ui/Input';
import { validateNumber, formatAmount, inrFormatTest } from 'utils/validators';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import personal from 'assets/personal_details_icon.svg';
import Api from 'utils/api';
import { yesOrNoOptions } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class InsuranceDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      medical_insurance: '',
      medical_insurance_error: '',
      annual_premium: '',
      annual_premium_error: '',
      cover_amt: '',
      cover_amt_error: '',
      image: '',
      provider: '',
      params: qs.parse(this.props.location.search.slice(1)),
      type: getConfig().productName
    }
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/profile/' + this.state.params.insurance_id, {
        groups: 'contact'
      });
      const { email, mobile_no } = res.pfwresponse.result.profile;
      const { image, provider, cover_plan } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        email: email || '',
        mobile_no: mobile_no || '',
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

  handleRadioValue = name => index => {
    this.setState({
      [name]: yesOrNoOptions[index]['value'],
      [name + '_error']: '',
    });
  }

  handleChange = name => event => {
    if (name === 'annual_premium' || name === 'cover_amt') {
      if (!inrFormatTest(event.target.value)) {
        return;
      }
      this.setState({
        [name]: event.target.value.replace(/,/g, ""),
        [name + '_error']: ''
      });
    }
  }

  handleKeyChange = name => event => {
    if (event.charCode >= 48 && event.charCode <= 57) {
      // valid
    } else {
      // invalid
      event.preventDefault();
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        disableBack: true
      }
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'fin_health_check',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance_details_one',
        "provider": this.state.provider,
        "medical_insurance": this.state.medical_insurance,
        "annual_premium": this.state.annual_premium,
        "cover_amt": this.state.cover_amt,
        "from_edit": (this.state.edit) ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    // this.sendEvents('next');
    if (!this.state.medical_insurance) {
      this.setState({
        medical_insurance_error: 'Please select an option',
      });
    } else if (
      this.state.life_insurance === 'yes' &&
      (!this.state.annual_premium || !validateNumber(this.state.annual_premium))
    ) {
      this.setState({
        annual_premium_error: 'Annual premium cannot be negative or 0',
      });
    } else if (
      this.state.life_insurance === 'yes' &&
      (!this.state.cover_amt || !validateNumber(this.state.cover_amt))
    ) {
      this.setState({
        cover_amt_error: 'Coverage cannot be negative or 0',
      });
    } else {
      console.log('ALL VALID - SCREEN 2 - insurance');
      this.navigate('/fhc/insurance-summary');
    }
  }

  render() {
    let amountInputs = null;
    if (this.state.medical_insurance === 'yes') {
      amountInputs =
      <Fragment>
        <div className="InputField">
          <Input
            error={(this.state.annual_premium_error) ? true : false}
            helperText={this.state.annual_premium_error}
            type="text"
            width="40"
            label="Annual premium"
            class="Income"
            id="annual-premium"
            name="annual_premium"
            value={formatAmount(this.state.annual_premium || '')}
            onChange={this.handleChange('annual_premium')}
            onKeyChange={this.handleKeyChange('annual_premium')} />
        </div>
        <div className="InputField">
          <Input
            error={(this.state.cover_amt_error) ? true : false}
            helperText={this.state.cover_amt_error}
            type="text"
            width="40"
            label="Cover amount"
            class="Income"
            id="cover-amt"
            name="cover_amt"
            value={formatAmount(this.state.cover_amt || '')}
            onChange={this.handleChange('cover_amt')}
            onKeyChange={this.handleKeyChange('cover_amt')} />
        </div>
      </Fragment>
    }
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Fin Health Check (FHC)"
        smallTitle={this.state.provider}
        count={false}
        total={5}
        current={4}
        banner={false}
        bannerText={''}
        handleClick={this.handleClick}
        edit={this.props.edit}
        topIcon="close"
        buttonTitle="Save & Continue"
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={this.state.type !== 'fisdom' ? personal : personal}
            title={(this.props.edit) ? 'Edit Insurance Details' : 'Insurance Details'} />
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.medical_insurance_error) ? true : false}
              helperText={this.state.medical_insurance_error}
              width="40"
              label="Do you have medical insurance?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="medical-insurance"
              value={this.state.medical_insurance}
              onChange={this.handleRadioValue('medical_insurance')} />
          </div>
          {
            amountInputs
          }
        </FormControl>
      </Container>
    );
  }
}

export default InsuranceDetails2;
