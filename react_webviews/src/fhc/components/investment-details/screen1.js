import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import Api from 'utils/api';
import { yesOrNoOptions } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import FHC from '../../FHCClass';

class InvestmentDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      fhc_data: new FHC(),
      has_investment: false,
      has_investment_error: '',
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
        has_investment: !!fhc_data.investments.length,
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
    const selectedVal = yesOrNoOptions[index]['value'];

    this.setState({
      [name]: selectedVal,
      [`${name}_error`]: '',
    });
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
        "screen_name": 'investment details',
        "investment": this.state.has_investment,
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

    if ([null, undefined, ''].includes(this.state.has_investment)) {
      this.setState({ has_investment_error: 'Please select an option' });
    } else {
      if (this.state.has_investment === false) {
        fhc_data.investments = [];
      }
      window.localStorage.setItem('fhc_data', JSON.stringify(fhc_data));
      if (this.state.has_investment) {
        this.navigate('/fhc/investment2');
      } else {
        //skip to screen 3 if user selects 'No' for investments
        this.navigate('/fhc/investment4');
      }
    }
  }

  bannerText = () => {
    return (
      <span>
        Let's have a look at your investments
      </span>
    );
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Fin Health Check (FHC)"
        count={false}
        total={5}
        current={3}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={false}
        topIcon="close"
        buttonTitle="Save & Continue"
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/invest.svg`)}
            title={'Investment Details'} />
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.has_investment_error) ? true : false}
              helperText={this.state.has_investment_error}
              width="40"
              label="Have you ever invested your money?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="investment"
              value={this.state.has_investment}
              onChange={this.handleRadioValue('has_investment')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default InvestmentDetails1;
