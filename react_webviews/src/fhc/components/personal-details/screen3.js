import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import personal from 'assets/personal_details_icon.svg';
import Api from 'utils/api';
import FHC from '../../FHCClass';
import { yesOrNoOptions } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class PersonalDetails3 extends Component {
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
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    fhc_data.family_status[name] = yesOrNoOptions[index]['value'];
    this.setState({ fhc_data });
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
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    let eventObj = {
      "event_name": 'fin_health_check',
      "properties": {
        "user_action": user_action,
        "screen_name": 'personal_details_three',
        "dependent-parents": fhc_data.family_status['dependent-parents'],
        "other-dependents": fhc_data.family_status['other-dependents'],
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

    let error = false;
    ['dependent-parents', 'other-dependents'].forEach(key => {
      if (fhc_data.family_status[key] === null || fhc_data.family_status[key] === undefined) {
        fhc_data[`${key}_error`] = 'Please select an option';
        error = true;
      }
    });
    if (error) {
      this.setState({ fhc_data });
    } else {
      window.localStorage.setItem('fhc_data', JSON.stringify(fhc_data));
      this.navigate('personal4');
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
        current={1}
        banner={false}
        bannerText={''}
        handleClick={this.handleClick}
        edit={this.props.edit}
        topIcon="close"
        buttonTitle="Save & Continue"
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={this.state.type !== 'fisdom' ? personal : personal}
            title={(this.props.edit) ? 'Edit Family Details' : 'Family Details'} />
          <div className="InputField">
            <RadioWithoutIcon
              error={(fhc_data['dependent-parents_error']) ? true : false}
              helperText={fhc_data['dependent-parents_error']}
              width="40"
              label="Are your parents dependent on you?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="parental-dependence"
              value={fhc_data.family_status['dependent-parents']}
              onChange={this.handleRadioValue('dependent-parents')} />
          </div>
          <div className="InputField">
            <RadioWithoutIcon
              error={(fhc_data['other-dependents_error']) ? true : false}
              helperText={fhc_data['other-dependents_error']}
              width="40"
              label="Do you have other dependence?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="other-dependence"
              value={fhc_data.family_status['other-dependents']}
              onChange={this.handleRadioValue('other-dependents')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default PersonalDetails3;
