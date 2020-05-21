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

class PersonalDetails3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      parental_dependence: '',
      parental_dependence_error: '',
      other_dependence: '',
      other_dependence_error: '',
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
    if (name === 'num_other_dependence') {
      this.setState({
        [name]: event,
        [name + '_error']: ''
      });
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
        "screen_name": 'personal_details_three',
        "provider": this.state.provider,
        "parental_dependence": this.state.parental_dependence,
        "other_dependence": this.state.other_dependence,
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
    if (!this.state.parental_dependence) {
      this.setState({
        parental_dependence_error: 'Please select an option',
      });
    } else if (!this.state.other_dependence) {
      this.setState({
        other_dependence_error: 'Please select an option',
      });
    } else {
      console.log('ALL VALID - SCREEN 3');
      this.navigate('/fhc/earnings1');
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
        current={1}
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
            title={(this.props.edit) ? 'Edit Family Details' : 'Family Details'} />
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.parental_dependence_error) ? true : false}
              helperText={this.state.parental_dependence_error}
              width="40"
              label="Are your parents dependent on you?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="parental-dependence"
              value={this.state.parental_dependence}
              onChange={this.handleRadioValue('parental_dependence')} />
          </div>
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.other_dependence_error) ? true : false}
              helperText={this.state.other_dependence_error}
              width="40"
              label="Do you have other dependence?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="other-dependence"
              value={this.state.other_dependence}
              onChange={this.handleRadioValue('other_dependence')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default PersonalDetails3;
