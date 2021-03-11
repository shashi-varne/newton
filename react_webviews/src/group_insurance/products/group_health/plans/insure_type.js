import React, { Component } from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import BottomInfo from '../../../../common/ui/BottomInfo';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import { initialize } from '../common_data';

class GroupHealthSelectInsureType extends Component {

  constructor(props) {
    super(props);
    this.state = {
      screen_name: 'insure_type_screen'
    }
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }


  async componentDidMount() {
    
    this.setState({
      account_type: this.state.groupHealthPlanData.account_type || '',
      account_type_name: this.state.groupHealthPlanData.account_type_name || '',
      account_type_options: this.state.screenData.account_type_options,
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
    groupHealthPlanData.account_type_name  = this.state.account_type_name;

    groupHealthPlanData.eldest_member = ''; //reset
    groupHealthPlanData.eldest_dob = ''; //reset

    let post_body = groupHealthPlanData.post_body || {};

    if(post_body && post_body.quotation_id){
      delete post_body['quotation_id'];
    }

    post_body.account_type = this.state.account_type;
    post_body.insurance_type = this.state.account_type;
    groupHealthPlanData.post_body = post_body;
    this.setLocalProviderData(groupHealthPlanData);

    this.sendEvents('next');
    if (this.state.account_type === 'self') {

      groupHealthPlanData.post_body.adults = 1 ;
      groupHealthPlanData.post_body.children = 0 ;

      let ui_members = groupHealthPlanData.ui_members || {};

      let keys_to_reset = ['self', 'wife', 'husband', 'father', 'mother', 'son', 'son1', 'son2',
        'daughter', 'daughter1', 'daughter2'];

      for (var kr in keys_to_reset) {
        ui_members[keys_to_reset[kr]] = false;
      }

      ui_members.son_total = 0;
      ui_members.daughter_total = 0;

      ui_members.self = true;

      groupHealthPlanData.ui_members = ui_members;

      this.setLocalProviderData(groupHealthPlanData);

      this.navigate(this.state.next_screen || 'plan-dob');
    } else {
      this.navigate('plan-add-members');
    }

  }


  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'health_insurance',
      "properties": {
        "user_action": user_action,
        "product": this.state.providerConfig.provider_api,
        "screen_name": 'who is covered',
        "insuring": this.state.account_type_name || this.state.account_type
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
      [name]: this.state.account_type_options[event].value,
      account_type_name: this.state.account_type_options[event].name,
      [name + '_error']: ''
    }, ()=>{
      console.log(this.state)
    })
  };

  render() {

    return (
      <Container
        provider={this.state.provider}
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        showError={this.state.showError}
        errorData={this.state.errorData}
        skelton={this.state.skelton}
        title="Who would you like to insure?"
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
            options={this.state.account_type_options || []}
            id="account_type"
            name="account_type"
            error={(this.state.account_type_error) ? true : false}
            helperText={this.state.account_type_error}
            value={this.state.account_type || ''}
            onChange={this.handleChangeRadio('account_type')} />
        </div>
        <BottomInfo baseData={{ 'content': this.state.screenData.bottom_info_text }} />
      </Container>
    );
  }
}

export default GroupHealthSelectInsureType;