import React, { Component } from 'react';
import Container from '../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers } from '../../constants';
import BottomInfo from '../../../common/ui/BottomInfo';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import { storageService } from 'utils/validators';

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
      type: getConfig().productName,
      provider: this.props.match.params.provider,
      groupHealthPlanData: storageService().getObject('groupHealthPlanData')|| {},
    }
  }

  componentWillMount() {
    this.setState({
      providerData: health_providers[this.state.provider]
    })
  }


  async componentDidMount() {


  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = () => {

    let groupHealthPlanData = this.state.groupHealthPlanData;
    console.log(groupHealthPlanData);
    groupHealthPlanData.account_type = this.state.account_type;
    storageService().setObject('groupHealthPlanData',groupHealthPlanData );

    if(this.state.account_type === 'self') {
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