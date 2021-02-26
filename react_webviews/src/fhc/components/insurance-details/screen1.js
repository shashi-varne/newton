import React, { Component, Fragment } from 'react';
import { FormControl } from 'material-ui/Form';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import Input from '../../../common/ui/Input';
import { formatAmount, inrFormatTest } from 'utils/validators';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import { fetchFHCData } from '../../common/ApiCalls';
import { storageService } from '../../../utils/validators';
import { yesOrNoOptions } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import FHC from '../../FHCClass';
import { navigate } from '../../common/commonFunctions';
import { getConfig } from 'utils/functions';

class InsuranceDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      fhc_data: new FHC(),
      type: getConfig().productName
    };
    this.navigate = navigate.bind(this);
  }

  async componentDidMount() {
    try {
      let fhc_data = storageService().getObject('fhc_data');
      if (!fhc_data) {
        fhc_data = await fetchFHCData();
        storageService().setObject('fhc_data', fhc_data);
      } else {
        fhc_data = new FHC(fhc_data);
      }
      this.setState({
        show_loader: false,
        fhc_data,
      });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast(err);
    }
  }

  handleRadioValue = name => index => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    const selectedVal = yesOrNoOptions[index]['value'];

    fhc_data.life_insurance[name] = selectedVal;
    fhc_data.life_insurance.annual_premuim = 0;
    fhc_data.life_insurance.cover_value = 0;
    fhc_data.clearErrors(['life_is_present', 'life_annual_premuim', 'life_cover_value']);
    this.setState({ fhc_data });
  }

  handleChange = name => event => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    if (name === 'annual_premuim' || name === 'cover_value') {
      if (!inrFormatTest(event.target.value)) {
        return;
      }
      fhc_data.life_insurance[name] = event.target.value.replace(/,/g, '');
      fhc_data[`life_${name}_error`] = '';
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

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'fhc',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance details',
        "life_insurance": (this.state.fhc_data.life_insurance || {}).annual_premuim ? 'yes' : 'no',
        "from_edit": (this.state.edit) ? 'yes' : 'no',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents('next');
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (!fhc_data.isValidInsuranceInfo('life')) {
      this.setState({ fhc_data });
    } else {
      storageService().setObject('fhc_data', fhc_data)
      if (this.props.edit) {
        if (
          fhc_data.life_insurance.is_present ||
          fhc_data.medical_insurance.is_present
        ) {
          // Only show summary if any insurance is taken
          this.navigate('insurance-summary');
        } else {
          this.navigate('investment1');
        }
      } else {
        this.navigate('/fhc/insurance2');
      }
    }
  }

  bannerText = () => {
    return (
      <span>
        Let's check how well you are covered
      </span>
    );
  }

  render() {
    let amountInputs = null;
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    let { is_present, annual_premuim, cover_value } = fhc_data.life_insurance;
    if (is_present) {
      amountInputs =
      <Fragment>
        <div className="InputField">
          <Input
            error={!!fhc_data.life_annual_premuim_error}
            helperText={fhc_data.life_annual_premuim_error}
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
            error={!!fhc_data.life_cover_value_error}
            helperText={fhc_data.life_cover_value_error}
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
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        topIcon="close"
        buttonTitle="Save & Continue"
        fullWidthButton={true}
        onlyButton={true}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/secure.svg`)}
            title={(this.props.edit) ? 'Edit Insurance Details' : 'Insurance Details'} />
          <div className="InputField">
            <RadioWithoutIcon
              error={(fhc_data.life_is_present_error) ? true : false}
              helperText={fhc_data.life_is_present_error}
              width="40"
              label="Do you have life insurance?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="life-insurance"
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

export default InsuranceDetails1;
