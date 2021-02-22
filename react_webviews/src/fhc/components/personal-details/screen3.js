import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import { fetchFHCData } from '../../common/ApiCalls';
import { storageService } from '../../../utils/validators';
import FHC from '../../FHCClass';
import { yesOrNoOptions } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import { navigate } from '../../common/commonFunctions';
import { getConfig } from 'utils/functions';

class PersonalDetails3 extends Component {
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

  handleRadioValue = name => index => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    fhc_data.family_status[name] = yesOrNoOptions[index]['value'];
    fhc_data[`${name}_error`] = '';
    this.setState({ fhc_data });
  }

  

  sendEvents(user_action) {
    let { fhc_data } = this.state;

    let eventObj = {
      "event_name": 'fhc',
      "properties": {
        "user_action": user_action,
        "screen_name": 'family details 2',
        "parents_dependency": fhc_data.family_status['dependent-parents'] ? 'yes' : 'no',
        "other_dependents": fhc_data.family_status['other-dependents'] ? 'yes' : 'no',
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
      storageService().setObject('fhc_data', fhc_data)
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
        edit={false}
        topIcon="close"
        buttonTitle="Save & Continue"
        fullWidthButton={true}
        onlyButton={true}
        classOverRide={'fhc-container'}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/group.svg`)}
            title='Family Details' />
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
