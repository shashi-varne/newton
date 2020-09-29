import React, { Component } from 'react';
import Container from '../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import ContactUs from '../../common/components/contact_us';

class DigiStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      status: getConfig().current_params.status
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'digi_kyc_status'
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
  }

  render() {
      const {show_loader, productName, status} = this.state;
    return (
      <Container
        showLoader={show_loader}
        title= {status === "success"? 'eSign KYC completed' : 'eSign KYC failed'}
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle= {status === "success" ? 'OKAY' : 'RETRY'}
        headerData={{icon: "close"}}
      >
        <div className="nsdl-status">
          <img
            src={ require(`assets/ils_esign_${status}_${productName}.svg`)}
            style={{width:"100%"}}
            alt="Nsdl Status" 
          />
          {status === "success" ? 
            <div className="digi-status-text">
                You have successfully signed your KYC documents.
            </div>
            :
            <div>
                Sorry! the eSign verification is failed. Please try again.
            </div>
          }
        </div>
        <ContactUs className="contact-us" />
      </Container>
    );
  }
}

export default DigiStatus;
