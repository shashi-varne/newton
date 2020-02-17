import React, { Component } from 'react';
import Container from '../../common/Container';
import qs from 'qs';
import sip_resumed_fisdom from 'assets/ils_esign_failed_fisdom.svg';
import sip_resumed_myway from 'assets/ils_esign_failed_myway.svg';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class EnpsSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      sip_resumed: getConfig().productName !== 'fisdom' ? sip_resumed_myway : sip_resumed_fisdom
    }
  }

  handleClick = () => {
    this.sendEvents('ok');
    nativeCallback({ action: 'exit' });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'consent',
      "properties": {
        "user_action": user_action,
        "screen_name": 'auth_success'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        fullWidthButton={true}
        onlyButton={true}
        disableBack={true}
        buttonTitle="Retry e-sign"
      >
        <div>
            <div className="main-top-title-new">NPS with e-Sign failed</div>
          <div className="success-img">
            <img alt="Mandate" src={this.state.sip_resumed} width="100%" />
          </div>
          <div className="success-text-info success-enps">
          e-Sign by Aadhaar has been failed, retry e-Sign to complete your NPS contribution.
          </div>

          <div className="success-bottom">
            <div className="success-bottom1">
              For any query, reach us at
            </div>
            <div className="success-bottom2">
              <div className="success-bottom2a">
                {getConfig().mobile}
              </div>
              <div className="success-bottom2b">
                |
              </div>
              <div className="success-bottom2a">
                {getConfig().askEmail}
              </div>
            </div>
          </div>
        </div>
      </Container >
    );
  }
}


export default EnpsSuccess;
