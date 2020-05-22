import React, { Component } from 'react';
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

class LoanDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      house_rent: '',
      house_rent_error: '',
      rent_per_month: '',
      rent_per_month_error: '',
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
      [name + '_error']: ''
    });
  }

  handleChange = name => event => {
    if (name === 'rent_per_month') {
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
        "screen_name": 'loan_details_three',
        "provider": this.state.provider,
        "house_rent": this.state.house_rent,
        "rent_per_month": this.state.rent_per_month,
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
    if (!this.state.house_rent) {
      this.setState({
        house_rent_error: 'Please select an option',
      });
    } else if (
      this.state.house_rent === 'yes' &&
      (!this.state.rent_per_month || !validateNumber(this.state.rent_per_month))
      ) {
      this.setState({
        rent_per_month_error: 'Rent per month cannot be negative or 0',
      });
    } else {
      console.log('ALL VALID - SCREEN 2 - LOAN');
      this.navigate('/fhc/earnings1');
    }
  }

  render() {
    let monthlyEMIInput = null;
    if (this.state.house_rent === 'yes') {
      monthlyEMIInput = <div className="InputField">
        <Input
          error={(this.state.rent_per_month_error) ? true : false}
          helperText={this.state.rent_per_month_error}
          type="text"
          width="40"
          label="Rent per month"
          class="Income"
          id="rent_per_month"
          name="rent_per_month"
          value={formatAmount(this.state.rent_per_month || '')}
          onChange={this.handleChange('rent_per_month')}
          onKeyChange={this.handleKeyChange('rent_per_month')} />
      </div>
    }
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Fin Health Check (FHC)"
        smallTitle={this.state.provider}
        count={false}
        total={5}
        current={3}
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
            title={(this.props.edit) ? 'Edit Loan Liability Details' : 'Loan Liability'} />
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.house_rent_error) ? true : false}
              helperText={this.state.house_rent_error}
              width="40"
              label="Do you pay house rent?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="house-rent"
              value={this.state.house_rent}
              onChange={this.handleRadioValue('house_rent')} />
          </div>
          {
            monthlyEMIInput
          }
        </FormControl>
      </Container>
    );
  }
}

export default LoanDetails2;
