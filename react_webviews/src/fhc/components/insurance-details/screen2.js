import React, { Component, Fragment } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import Input from '../../../common/ui/Input';
import { formatAmount, inrFormatTest } from 'utils/validators';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import Api from 'utils/api';
import { yesOrNoOptions } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import FHC from '../../FHCClass';

class InsuranceDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      fhc_data: new FHC(),
      params: qs.parse(this.props.location.search.slice(1)),
      type: getConfig().productName
    }
  }

  async componentDidMount() {
    try {
      let fhc_data = JSON.parse(window.localStorage.getItem('fhc_data'));
      if (!fhc_data) {
        const res = await Api.get('page/financialhealthcheck/edit/mine', {
          format: 'json',
        });
        console.log('res', res);
        fhc_data = res.pfwresponse.result;
      }
      fhc_data = new FHC(fhc_data);
      this.setState({
        show_loader: false,
        fhc_data,
      });

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong. Please try again');
    }
  }

  handleRadioValue = name => index => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    const selectedVal = yesOrNoOptions[index]['value'];

    fhc_data.medical_insurance[name] = selectedVal;
    fhc_data[`${name}_error`] = '';
    this.setState({ fhc_data });
  }

  handleChange = name => event => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    if (name === 'annual_premuim' || name === 'cover_value') {
      if (!inrFormatTest(event.target.value)) {
        return;
      }
      fhc_data.medical_insurance[name] = event.target.value.replace(/,/g, '');
      fhc_data[`${name}_error`] = '';
    }
    this.setState({ fhc_data });
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
      "event_name": 'fhc',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance details',
        "medical_insurance": (this.state.fhc_data.medical_insurance || {}).annual_premuim ? 'yes' : 'no',
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
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (!fhc_data.isValidInsuranceInfo('medical')) {
      this.setState({ fhc_data });
    } else {
      window.localStorage.setItem('fhc_data', JSON.stringify(fhc_data));
      if (
        fhc_data.life_insurance.is_present ||
        fhc_data.medical_insurance.is_present
      ) {
        // Only show summary if any insurance is taken
        this.navigate('insurance-summary');
      } else {
        this.navigate('investment1');
      }
    }
  }

  render() {
    let amountInputs = null;
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    let { is_present, annual_premuim, cover_value } = fhc_data.medical_insurance;
    if (is_present) {
      amountInputs =
        <Fragment>
          <div className="InputField">
            <Input
              error={!!fhc_data.annual_premuim_error}
              helperText={fhc_data.annual_premuim_error}
              type="text"
              width="40"
              label="Annual premium"
              class="Income"
              id="annual-premium"
              name="annual_premuim"
              value={formatAmount(annual_premuim || '')}
              onChange={this.handleChange('annual_premuim')}
              onKeyChange={this.handleKeyChange('annual_premuim')} />
          </div>
          <div className="InputField">
            <Input
              error={!!fhc_data.cover_value_error}
              helperText={fhc_data.cover_value_error}
              type="text"
              width="40"
              label="Cover amount"
              class="Income"
              id="cover-value"
              name="cover_value"
              value={formatAmount(cover_value || '')}
              onChange={this.handleChange('cover_value')}
              onKeyChange={this.handleKeyChange('cover_value')} />
          </div>
        </Fragment>
    }
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Fin Health Check (FHC)"
        count={false}
        total={5}
        current={4}
        banner={false}
        bannerText={''}
        handleClick={this.handleClick}
        edit={this.props.edit}
        topIcon="close"
        buttonTitle="Save & Continue"
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/secure.svg`)}
            title={(this.props.edit) ? 'Edit Insurance Details' : 'Insurance Details'} />
          <div className="InputField">
            <RadioWithoutIcon
              error={(fhc_data.is_present_error) ? true : false}
              helperText={fhc_data.is_present_error}
              width="40"
              label="Do you have medical insurance?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="medical-insurance"
              value={is_present}
              onChange={this.handleRadioValue('is_present')} />
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
