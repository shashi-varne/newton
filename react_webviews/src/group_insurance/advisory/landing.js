import React, { Component } from 'react'
import Container from '../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class AdvisoryLanding extends Component {

    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
        }
    }

    sendEvents(user_action, insurance_type, banner_clicked) {
        let eventObj = {
          "event_name": 'Group Insurance',
          "properties": {
            "user_action": user_action,
            "screen_name": 'insurance',
          }
        };
    
        if (user_action === 'just_set_events') {
          return eventObj;
        } else {
          nativeCallback({ events: eventObj });
        }
      }
    render() {
        return(
            <Container
            events={this.sendEvents('just_set_events')}
            // inPageTitle={false}
            // force_hide_inpage_title={true}
            fullWidthButton={true}
            headerType='insurance-advisory-start'
            onlyButton={true}
            buttonTitle="LET'S GET STARTED"
            >
            <div className="advisory-landing-container">
                <img className="advisory-landing" src={require(`assets/${this.state.type}/advisory-landing-banner.svg`)}/>
                {/* <p className="advisory-landing-title">Let's find out the right <br/> coverage for you</p> */}
            </div>

            </Container>
        )
    }
}

export default AdvisoryLanding