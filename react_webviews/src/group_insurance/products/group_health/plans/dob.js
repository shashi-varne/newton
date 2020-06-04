import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers } from '../../../constants';
import BottomInfo from '../../../../common/ui/BottomInfo';
import { storageService } from 'utils/validators';
import Input from '../../../../common/ui/Input';

class GroupHealthPlanDob extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: getConfig().productName,
      provider: this.props.match.params.provider,
      groupHealthPlanData: storageService().getObject('groupHealthPlanData'),
      header_title: 'Your date of birth'
    }
  }

  componentWillMount() {
    this.setState({
      providerData: health_providers[this.state.provider],
      header_title: this.state.groupHealthPlanData.account_type === 'self' ? 'Your date of birth': 'Date of birth details'
    })
  }


  async componentDidMount() {
    console.log(this.state.groupHealthPlanData);

    let groupHealthPlanData = this.state.groupHealthPlanData;
    groupHealthPlanData.ui_members = {
        'self': true,
        'wife': '',
        'father' : '',
        'mother': '',
        'son1': '',
        'son2': '',
        'daughter1': '',
        'daughter2': ''
    }

    let dob_data = [
        {
            'key': 'self',
            'label': 'Date of birth (DD/MM/YYYY)',
            'value': ''
        },
        {
            'key': 'wife',
            'label': "Wife's date of birth (DD/MM/YYYY)",
            'value': ''
        },
        
        {
            'key': 'father',
            'label': "Father's date of birth (DD/MM/YYYY)",
            'value': ''
        },
        {
            'key': 'mother',
            'label': "Mother's date of birth (DD/MM/YYYY)",
            'value': ''
        },
        {
            'key': 'son',
            'label': "Son's date of birth (DD/MM/YYYY)",
            'value': ''
        },
        {
            'key': 'son1',
            'label': "1st son's date of birth (DD/MM/YYYY)",
            'value': ''
        },
        {
            'key': 'son2',
            'label': "2nd son's date of birth (DD/MM/YYYY)",
            'value': ''
        },
        {
            'key': 'daughter',
            'label': "Daughter's date of birth (DD/MM/YYYY)",
            'value': ''
        },
        {
            'key': 'daughter1',
            'label': "1st daughter's date of birth (DD/MM/YYYY)",
            'value': ''
        },
        {
            'key': 'daughter2',
            'label': "1st daughter's date of birth (DD/MM/YYYY)",
            'value': ''
        }
    ]

  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = () => {

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

  render() {

    let currentDate = new Date().toISOString().slice(0, 10);
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title={this.state.header_title}
        fullWidthButton={true}
        buttonTitle="CONTINUE"
        onlyButton={true}
        handleClick={() => this.handleClick()}
      >

            <div className="InputField">
              <Input
                type="text"
                width="40"
                label="Date of birth (DD/MM/YYYY)"
                class="DOB"
                id="dob"
                name="dob"
                max={currentDate}
                error={(this.state.basic_details_data.dob_error) ? true : false}
                helperText={this.state.basic_details_data.dob_error}
                value={this.state.basic_details_data.dob || ''}
                placeholder="DD/MM/YYYY"
                maxLength="10"
                onChange={this.handleChange()} />
            </div>

        <BottomInfo baseData={{ 'content': 'Illness can hit you any time, get insured today to cover your medical expenses' }} />
      </Container>
    );
  }
}

export default GroupHealthPlanDob;