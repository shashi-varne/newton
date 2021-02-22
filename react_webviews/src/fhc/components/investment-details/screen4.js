import React, { Component, Fragment } from 'react';
import { FormControl } from 'material-ui/Form';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import Input from '../../../common/ui/Input';
import { formatAmount, inrFormatTest } from 'utils/validators';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import { fetchFHCData, uploadFHCData } from '../../common/ApiCalls';
import { storageService } from '../../../utils/validators';
import { yesOrNoOptions } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import { navigate } from '../../common/commonFunctions';
import { getConfig } from 'utils/functions';
import FHC from '../../FHCClass';

class InvestmentDetails4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      tax_investment: '',
      tax_investment_error: '',
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
        tax_investment: !!Object.keys(fhc_data.tax_savings).length,
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
    if (name === 'is_present') {
      fhc_data.tax_savings = {
        is_present: yesOrNoOptions[index]['value'],
        tax_saving_80C: '0',
        tax_saving_80CCD: '0',
      };
    }
    fhc_data.clearErrors(['tax_saving_80C', 'tax_saving_80CCD', 'tax_is_present']);
    this.setState({ fhc_data });
  }

  handleChange = name => event => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (name === 'tax_saving_80C' || name === 'tax_saving_80CCD') {
      if (!inrFormatTest(event.target.value)) {
        return;
      }
      fhc_data.tax_savings[name] = event.target.value.replace(/\D/g, '');
      fhc_data.clearErrors(['tax_saving_80C', 'tax_saving_80CCD', 'tax_is_present']);
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
        "screen_name": 'tax saving details',
        "invested_under_80c": this.state.tax_investment ? 'yes' : 'no',
        "amount_under_80c": this.state.fhc_data.tax_saving_80C ? 'yes' : 'no',
        "tax_saving_80CCD": this.state.fhc_data.tax_saving_80CCD ? 'yes' : 'no',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {
    this.sendEvents('next');
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (!fhc_data.isValidTaxes()) {
      this.setState({ fhc_data });
    } else {
      this.setState({ show_loader: true });
      if (!Number(fhc_data.tax_savings.tax_saving_80C)) {
        fhc_data.tax_savings.tax_saving_80C = '0';
      } else if (!Number(fhc_data.tax_savings.tax_saving_80CCD)) {
        fhc_data.tax_savings.tax_saving_80CCD = '0';
      }
      
      storageService().setObject('fhc_data', fhc_data);
      try {
        fhc_data.generate_report = true;
        await uploadFHCData(fhc_data);
        this.navigate('invest-complete');
      } catch (err) {
        toast(err);
      }
      this.setState({ show_loader: false });
    }
  }

  render() {
    let amountInputs = null;
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    const { tax_saving_80C, tax_saving_80CCD, is_present } = fhc_data.tax_savings;

    if (is_present) {
      amountInputs =
      <Fragment>
        <div className="InputField">
          <Input
            error={!!fhc_data.tax_saving_80C_error}
            helperText={fhc_data.tax_saving_80C_error || 'Max Rs 1,50,000'}
            type="text"
            width="40"
            label="Investment under Sec 80C ?"
            class="Income"
            id="invest-80C"
            name="tax_saving_80C"
            value={formatAmount(tax_saving_80C || '')}
            onChange={this.handleChange('tax_saving_80C')}
            onKeyChange={this.handleKeyChange('tax_saving_80C')} />
        </div>
        <div className="InputField">
          <Input
            error={!!fhc_data.tax_saving_80CCD_error}
            helperText={fhc_data.tax_saving_80CCD_error || 'Max Rs 50,000'}
            type="text"
            width="40"
            label="Invested in NPS under Sec 80CCD ?"
            class="Income"
            id="invest-80CCD"
            name="tax_saving_80CCD"
            value={formatAmount(tax_saving_80CCD || '')}
            onChange={this.handleChange('tax_saving_80CCD')}
            onKeyChange={this.handleKeyChange('tax_saving_80CCD')} />
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
        edit={false}
        topIcon="close"
        buttonTitle="Save & Continue"
        fullWidthButton={true}
        onlyButton={true}
        classOverRide={'fhc-container'}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/invest.svg`)}
            title={'Tax saving Details'} />
          <div className="InputField">
            <RadioWithoutIcon
              error={!!fhc_data.tax_is_present_error}
              helperText={fhc_data.tax_is_present_error}
              width="40"
              label="Have you invested under 80C or others?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="tax-saving"
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

export default InvestmentDetails4;
