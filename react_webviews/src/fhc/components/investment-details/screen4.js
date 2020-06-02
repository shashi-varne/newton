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

class InvestmentDetails4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      tax_investment: '',
      tax_investment_error: '',
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
        fhc_data = res.pfwresponse.result;
      }
      fhc_data = new FHC(fhc_data);
      this.setState({
        show_loader: false,
        fhc_data,
        tax_investment: !!Object.keys(fhc_data.tax_savings).length,
      });

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong. Please try again');
    }
  }

  handleRadioValue = name => index => {
    this.setState({
      [name]: yesOrNoOptions[index]['value'],
      [name + '_error']: '',
    });
  }

  handleChange = name => event => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (name === 'tax_saving_80C' || name === 'tax_saving_80CCD') {
      if (!inrFormatTest(event.target.value)) {
        return;
      }
      fhc_data.tax_savings[name] = event.target.value.replace(/\D/g, '');
      fhc_data[name + '_error'] = ''
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
    // this.sendEvents('next');
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if ([undefined, null, ''].includes(this.state.tax_investment)) {
      this.setState({
        tax_investment_error: 'Please select an option',
      });
    } else if (this.state.tax_investment && !fhc_data.isValidTaxes()) {
      this.setState({ fhc_data });
    } else {
      window.localStorage.setItem('fhc_data', JSON.stringify(fhc_data));
      this.navigate('invest-complete');
    }
  }

  render() {
    let amountInputs = null;
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    const { tax_saving_80C, tax_saving_80CCD } = fhc_data.tax_savings;

    if (this.state.tax_investment) {
      amountInputs =
      <Fragment>
        <div className="InputField">
          <Input
            error={(fhc_data.tax_saving_80C_error) ? true : false}
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
            error={(fhc_data.tax_saving_80CCD_error) ? true : false}
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
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/invest.svg`)}
            title={'Tax saving Details'} />
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.tax_investment_error) ? true : false}
              helperText={this.state.tax_investment_error}
              width="40"
              label="Have you invested under 80C or others?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="tax-saving"
              value={this.state.tax_investment}
              onChange={this.handleRadioValue('tax_investment')} />
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
