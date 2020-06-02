import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import income from 'assets/annual_income_dark_icn.png';
import Input from '../../../common/ui/Input';
import { formatAmount, inrFormatTest } from 'utils/validators';
import FHC from '../../FHCClass';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class PersonalDetails4 extends Component {
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        disableBack: true
      }
    });
  }

  bannerText = () => {
    return (
      <span>
        Let's check your monthly savings
      </span>
    );
  }

  sendEvents(user_action) {
    const { fhc_data } = this.state;
  
    let eventObj = {
      "event_name": 'fhc',
      "properties": {
        "user_action": user_action,
        "screen_name": 'earning expense details',
        "annual_ctc": fhc_data.annual_sal ? 'yes' : 'no',
        "monthly_salary": fhc_data.monthly_sal ? 'yes' : 'no',
        "monthy_expense": fhc_data.monthy_exp ? 'yes' : 'no',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = name => event => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (!inrFormatTest(event.target.value)) {
      return;
    }
    fhc_data[name] = event.target.value.replace(/,/g, "");
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

  handleClick = () => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (!fhc_data.isValidSalaryInfo()) {
      this.setState({ fhc_data });
    } else {
      window.localStorage.setItem('fhc_data', JSON.stringify(fhc_data));
      this.navigate('personal-complete')
    }
  }

  render() {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    console.log(fhc_data);
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Fin Health Check (FHC)"
        count={false}
        total={5}
        current={2}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={false}
        topIcon="close"
        buttonTitle="Save & Continue"
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/expense.svg`)}
            title='Earning and Expense Details' />
          <div className="InputField">
            <Input
              error={(fhc_data.annual_sal_error) ? true : false}
              helperText={fhc_data.annual_sal_error}
              type="text"
              icon={income}
              width="40"
              label="Annual CTC *"
              class="Income"
              id="income"
              name="annualCTC"
              value={formatAmount(fhc_data.annual_sal || '')}
              onChange={this.handleChange('annual_sal')}
              onKeyChange={this.handleKeyChange('annual_sal')} />
          </div>
          <div className="InputField">
            <Input
              error={(fhc_data.monthly_sal_error) ? true : false}
              helperText={fhc_data.monthly_sal_error}
              type="text"
              icon={income}
              width="40"
              label="Monthly Salary *"
              class="Income"
              id="income"
              name="monthly-sal"
              value={formatAmount(fhc_data.monthly_sal || '')}
              onChange={this.handleChange('monthly_sal')}
              onKeyChange={this.handleKeyChange('monthly_sal')} />
          </div>
          <div className="InputField">
            <Input
              error={(fhc_data.monthly_exp_error) ? true : false}
              helperText={fhc_data.monthly_exp_error}
              type="text"
              icon={income}
              width="40"
              label="Monthly Expenses *"
              class="Income"
              id="monthly-exp"
              name="monthly_exp"
              value={formatAmount(fhc_data.monthly_exp || '')}
              onChange={this.handleChange('monthly_exp')}
              onKeyChange={this.handleKeyChange('monthly_exp')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default PersonalDetails4;
