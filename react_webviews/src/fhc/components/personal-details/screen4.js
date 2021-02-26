import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import income from 'assets/annual_income_dark_icn.png';
import Input from '../../../common/ui/Input';
import { formatAmount, inrFormatTest } from 'utils/validators';
import FHC from '../../FHCClass';
import { fetchFHCData, uploadFHCData } from '../../common/ApiCalls';
import { storageService } from '../../../utils/validators';

import { nativeCallback } from 'utils/native_callback';
import { navigate } from '../../common/commonFunctions';
import { getConfig } from 'utils/functions';

class PersonalDetails4 extends Component {
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

  handleClick = async () => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (!fhc_data.isValidSalaryInfo()) {
      this.setState({ fhc_data });
    } else {
      storageService().setObject('fhc_data', fhc_data)
      try {
        this.setState({ show_loader : true});
        const result = await uploadFHCData(fhc_data);
        storageService().setObject('enable_tax_saving', result.enable_tax_saving);
        this.navigate('personal-complete');
      } catch (err) {
        toast(err);
      }
    }
  }

  render() {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
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
        fullWidthButton={true}
        onlyButton={true}
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
