import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import personal from 'assets/personal_details_icon.svg';
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
      toast('Something went wrong');
    }
  }

  handleRadioValue = name => index => {
    this.setState({
      [name]: yesOrNoOptions[index]['value'],
      [name + '_error']: '',
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
      "event_name": 'fin_health_check',
      "properties": {
        "user_action": user_action,
        "screen_name": 'loan_details_one',
        "provider": this.state.provider,
        "investment": this.state.investment,
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
    if (!this.state.investment) {
      this.setState({
        investment_error: 'Please select an option',
      });
    } else {
      console.log('ALL VALID - SCREEN 1 - Investment');
      if (this.state.investment === 'yes') {
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
        smallTitle={this.state.provider}
        count={false}
        total={5}
        current={3}
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
            title={'Investment Details'} />
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.investment_error) ? true : false}
              helperText={this.state.investment_error}
              width="40"
              label="Have you ever invested your money?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="investment"
              value={this.state.investment}
              onChange={this.handleRadioValue('investment')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default InvestmentDetails1;
