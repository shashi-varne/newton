import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import personal from 'assets/personal_details_icon.svg';
import marital from 'assets/marital_status_dark_icn.png';
import Api from 'utils/api';
import { yesOrNoOptions, kidsOptions } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class PersonalDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      marital_status: '',
      marital_status_error: '',
      kids: '',
      kids_error: '',
      num_kids: '',
      num_kids_error: '',
      kidsOptions: kidsOptions,
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
    if (name === 'num_kids') {
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
        "screen_name": 'personal_details_two',
        "provider": this.state.provider,
        "marital_status": this.state.marital_status,
        "kids": this.state.kids,
        "num_kids": this.state.num_kids,
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
    if (!this.state.marital_status) {
      this.setState({
        marital_status_error: 'Please select an option',
      });
    } else if (!this.state.kids) {
      this.setState({
        kids_error: 'Please select an option',
      });
    } else if (this.state.kids == 'yes' && !this.state.num_kids) {
      this.setState({
        num_kids_error: 'Please select an option'
      });
    } else {
      console.log('ALL VALID - SCREEN 2');
      this.navigate('/fhc/personal3');
    }
  }

  render() {
    let kidsSelect = null;
    if (this.state.kids === 'yes') {
      kidsSelect = <div className="InputField">
        <DropdownWithoutIcon
          error={(this.state.num_kids_error) ? true : false}
          helperText={this.state.num_kids_error}
          width="40"
          options={this.state.kidsOptions}
          id="num-kids"
          label="How many kids do you have?"
          value={this.state.num_kids}
          name="num_kids"
          onChange={this.handleChange('num_kids')} />
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
              error={(this.state.marital_status_error) ? true : false}
              helperText={this.state.marital_status_error}
              icon={marital}
              width="40"
              label="Are you married?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="marital-status"
              value={this.state.marital_status}
              onChange={this.handleRadioValue('marital_status')} />
          </div>
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.kids_error) ? true : false}
              helperText={this.state.kids_error}
              icon={marital}
              width="40"
              label="Do you have kids?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="kids"
              value={this.state.kids}
              onChange={this.handleRadioValue('kids')} />
          </div>
          {
            kidsSelect
          }
        </FormControl>
      </Container>
    );
  }
}

export default PersonalDetails2;
