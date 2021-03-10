import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import Autochange from '../../../common/ui/Autochange'
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import marital from 'assets/marital_status_dark_icn.png';
import { fetchFHCData } from '../../common/ApiCalls';
import { storageService } from '../../../utils/validators';
import FHC from '../../FHCClass';
import { yesOrNoOptions, kidsOptions } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import { navigate } from '../../common/commonFunctions';
import { getConfig } from 'utils/functions';

class PersonalDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      fhc_data: new FHC(),
      has_kids: '',
      has_kids_error: '',
      kidsOptions: kidsOptions,
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
        has_kids: !!Number(fhc_data.num_kids),
        fhc_data,
      });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast(err);
    }
  }

  handleRadioValue = name => index => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    const selectedVal = yesOrNoOptions[index]['value'];

    if (name === 'has_kids') {
      fhc_data.num_kids = selectedVal ? '1' : '0';
      this.setState({
        fhc_data,
        has_kids: selectedVal,
        has_kids_error: '',
      });
    } else {
      fhc_data[name] = selectedVal;
      fhc_data[`${name}_error`] = '';
      this.setState({ fhc_data });
    }
  }

  handleChange = name => event => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    if (name === 'num_kids') {
      fhc_data.num_kids = event;
      fhc_data.num_kids_error = '';
    }
    this.setState({ fhc_data });
  }

  sendEvents(user_action) {
    let { fhc_data } = this.state;

    let eventObj = {
      "event_name": 'fhc',
      "properties": {
        "user_action": user_action,
        "screen_name": 'family details 1',
        "marital_status": fhc_data.is_married ? 'yes' : 'no',
        "kids": fhc_data.has_kids ? 'yes' : 'no',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents('next');
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    
    if ([null, undefined, ''].includes(fhc_data.is_married)) {
      fhc_data.is_married_error = 'Please select an option';
      this.setState({ fhc_data });
    } else if ([null, undefined, ''].includes(this.state.has_kids)){
      this.setState({ has_kids_error: 'Please select an option' });
    } else if (this.state.has_kids && !Number(fhc_data.num_kids)) {
      fhc_data.num_kids_error = 'Please select an option';
      this.setState({ fhc_data });
    } else {
      storageService().setObject('fhc_data', fhc_data)
      this.navigate('personal3');
    }
  }

  render() {
    let kidsSelect = null;
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    const has_kids = this.state.has_kids;
    if (has_kids) {
      kidsSelect = <div className="InputField">
        <Autochange
          error={(fhc_data.num_kids_error) ? true : false}
          helperText={fhc_data.num_kids_error}
          width="40"
          options={this.state.kidsOptions}
          id="num-kids"
          label="How many kids do you have?"
          value={fhc_data.num_kids === '5' ? '5+' : fhc_data.num_kids}
          name="num_kids"
          onChange={this.handleChange('num_kids')} />
      </div>;
    }
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
        edit={false}
        topIcon="close"
        buttonTitle="Save & Continue"
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/group.svg`)}
            title='Family Details' />
          <div className="InputField">
            <RadioWithoutIcon
              error={(fhc_data.is_married_error) ? true : false}
              helperText={fhc_data.is_married_error}
              icon={marital}
              width="40"
              label="Are you married?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="marital-status"
              value={fhc_data.is_married}
              onChange={this.handleRadioValue('is_married')} />
          </div>
          <div className="InputField">
            <RadioWithoutIcon
              error={!!this.state.has_kids_error}
              helperText={this.state.has_kids_error}
              icon={marital}
              width="40"
              label="Do you have kids?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="has-kids"
              value={has_kids}
              onChange={this.handleRadioValue('has_kids')} />
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
