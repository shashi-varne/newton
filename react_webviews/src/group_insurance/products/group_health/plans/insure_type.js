import React, { Component } from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import BottomInfo from '../../../../common/ui/BottomInfo';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import { storageService } from 'utils/validators';
import { initialize } from '../common_data';

const account_type_options = [
  {
    'name': 'Self',
    'value': 'self'
  },
  {
    'name': 'Family members',
    'value': 'family'
  },
  {
    'name': 'Self & family members',
    'value': 'selfandfamily'
  },
  {
    'name': 'Parents',
    'value': 'parents'
  }
];

class GroupHealthSelectInsureType extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }


  async componentDidMount() {
    this.setState({
      account_type: this.state.groupHealthPlanData.account_type || ''
    })

  }

  handleClick = () => {

    if (!this.state.account_type) {
      this.setState({
        account_type_error: 'Please select one'
      })
      return;
    }

    let groupHealthPlanData = this.state.groupHealthPlanData;
    groupHealthPlanData.account_type = this.state.account_type;

    let post_body = groupHealthPlanData.post_body || {};

    post_body.account_type = this.state.account_type;
    groupHealthPlanData.post_body = post_body;
    storageService().setObject('groupHealthPlanData', groupHealthPlanData);

    if (this.state.account_type === 'self') {

      groupHealthPlanData.post_body.mem_info = {
        adult: 1,
        child: 0
      }
      let ui_members = groupHealthPlanData.ui_members || {};

      let keys_to_reset = ['self', 'wife', 'father', 'mother', 'son', 'son1', 'son2',
        'daughter', 'daughter1', 'daughter2'];

      for (var kr in keys_to_reset) {
        ui_members[keys_to_reset[kr]] = false;
      }

      ui_members.son_total = 0;
      ui_members.daughter_total = 0;

      ui_members.self = true;

      groupHealthPlanData.ui_members = ui_members;

      storageService().setObject('groupHealthPlanData', groupHealthPlanData);

      this.navigate('plan-dob');
    } else {
      this.navigate('plan-add-members');
    }

  }


  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'health_suraksha',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChangeRadio = name => event => {
    this.setState({
      [name]: account_type_options[event].value,
      [name + '_error']: ''
    })

  };

  render() {


    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Whom do you want to insure? "
        fullWidthButton={true}
        buttonTitle="CONTINUE"
        onlyButton={true}
        handleClick={() => this.handleClick()}
      >

        <div className="InputField">
          <RadioWithoutIcon
            width="40"
            label=""
            isVertical={true}
            class="Gender:"
            options={account_type_options}
            id="account_type"
            name="account_type"
            error={(this.state.account_type_error) ? true : false}
            helperText={this.state.account_type_error}
            value={this.state.account_type || ''}
            onChange={this.handleChangeRadio('account_type')} />
        </div>
        <BottomInfo baseData={{ 'content': 'Trusted by 1 crore+ families' }} />
      </Container>
    );
  }
}

export default GroupHealthSelectInsureType;