import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import personal from 'assets/personal_details_icon.svg';
import income from 'assets/annual_income_dark_icn.png';
import Input from '../../../common/ui/Input';
import { validateNumber, formatAmount, inrFormatTest } from 'utils/validators';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class PersonalDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      annualCTC: '',
      annualCTC_error: '',
      monthly_sal: '',
      monthly_sal_error: '',
      monthly_exp: '',
      monthly_exp_error: '',
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
    let eventObj = {
      "event_name": 'fin_health_check',
      "properties": {
        "user_action": user_action,
        "screen_name": 'personal_details_one',
        "provider": this.state.provider,
        "email": this.state.email ? 'yes' : 'no',
        "name": this.state.name ? 'yes' : 'no',
        "dob": this.state.dob ? 'yes' : 'no',
        "from_edit": (this.state.edit) ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = name => event => {
    if (!inrFormatTest(event.target.value)) {
      return;
    }
    this.setState({
      [name]: event.target.value.replace(/,/g, ""),
      [name + '_error']: ''
    });
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
    if (!this.state.annualCTC || !validateNumber(this.state.annualCTC)) {
      this.setState({
        annualCTC_error: 'Enter a valid Annual CTC',
        monthly_sal_error: 'Enter a valid Annual CTC first'
      });
    } else if (!this.state.monthly_sal || !validateNumber(this.state.monthly_sal)) {
      this.setState({
        monthly_sal_error: 'Enter a valid Monthly Salary amount'
      });
    } else if (this.state.monthly_sal > this.state.annualCTC / 12) {
      this.setState({
        monthly_sal_error: 'Monthly Salary cannot be greater than CTC/12'
      });
    } else if (!this.state.monthly_exp || !validateNumber(this.state.monthly_exp)) {
      this.setState({
        monthly_exp_error: 'Enter a valid Monthly Expense amount',
      });
    } else {
      console.log('ALL VALID - EXPENSE SCREEN')
      this.navigate('personal-complete')
    }
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Application Form"
        smallTitle={this.state.provider}
        count={false}
        total={5}
        current={2}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        topIcon="close"
        buttonTitle="Save & Continue"
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={this.state.type !== 'fisdom' ? personal : personal}
            title={(this.props.edit) ? 'Edit Earning and Expense Details' : 'Earning and Expense Details'} />
          <div className="InputField">
            <Input
              error={(this.state.annualCTC_error) ? true : false}
              helperText={this.state.annualCTC_error}
              type="text"
              icon={income}
              width="40"
              label="Annual CTC *"
              class="Income"
              id="income"
              name="annualCTC"
              value={formatAmount(this.state.annualCTC || '')}
              onChange={this.handleChange('annualCTC')}
              onKeyChange={this.handleKeyChange('annualCTC')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.monthly_sal_error) ? true : false}
              helperText={this.state.monthly_sal_error}
              type="text"
              icon={income}
              width="40"
              label="Monthly Salary *"
              class="Income"
              id="income"
              name="monthly-sal"
              value={formatAmount(this.state.monthly_sal || '')}
              onChange={this.handleChange('monthly_sal')}
              onKeyChange={this.handleKeyChange('monthly_sal')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.monthly_exp_error) ? true : false}
              helperText={this.state.monthly_exp_error}
              type="text"
              icon={income}
              width="40"
              label="Monthly Expenses *"
              class="Income"
              id="monthly-exp"
              name="monthly_exp"
              value={formatAmount(this.state.monthly_exp || '')}
              onChange={this.handleChange('monthly_exp')}
              onKeyChange={this.handleKeyChange('monthly_exp')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default PersonalDetails1;
