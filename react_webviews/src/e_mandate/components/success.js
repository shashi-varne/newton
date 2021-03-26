import React, { Component } from 'react';
// import Container from '../common/Container';
import qs from 'qs';
import sip_resumed_fisdom from 'assets/sip_resumed_illustration_fisdom.svg';
import sip_resumed_myway from 'assets/sip_resumed_illustration_myway.svg';
import { getConfig , isIframe} from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import ContactUs from '../../common/components/contact_us';
import {Imgc} from '../../common/ui/Imgc';


class MandateSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      iframe: isIframe(),
      params: qs.parse(props.history.location.search.slice(1)),
      sip_resumed: getConfig().productName !== 'fisdom' ? sip_resumed_myway : sip_resumed_fisdom,
      session_less_enach: window.sessionStorage.getItem('session_less_enach') || ''
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
      "event_name": 'e-mandate',
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

  loadComponent() {
    if (this.state.iframe) {
      return require(`../commoniFrame/Container`).default;
    } else {
      return require(`../common/Container`).default;
    }
  }

  render() {
    const Container = this.loadComponent();
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Authorisation successful"
        handleClick={this.handleClick}
        fullWidthButton={true}
        onlyButton={true}
        disableBack={true}
        buttonTitle="Ok"
        noFooter={this.state.session_less_enach}
        noBack={this.state.session_less_enach}
        iframeIcon={this.state.sip_resumed}
      >
        <div>
          {!this.state.iframe &&  <div className="success-img">
            <Imgc alt="Mandate" src={this.state.sip_resumed}
            style={{minHeight:130, width:"100%"}} />
          </div> }
          <div className="success-text">
            Congrats! easySIP authorised
          </div>
          <div className="success-text-info">
            e-mandate approval from bank takes 3-4 working days. Once approved, funds will get debited on schedule SIP day
          </div>

          <ContactUs />
        </div>
      </Container >
    );
  }
}


export default MandateSuccess;
