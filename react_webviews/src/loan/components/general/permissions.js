import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import { getConfig } from 'utils/functions';
import '../Style.scss';

class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    // ****************************************************
    // code goes here
    // common things can be added inside initialize
    // use/add common functions from/to  ../../common/functions

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'introduction'
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
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Mandatory permissions"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
      >
        <div className="loan-permissions">

          <div style={{ display: 'flex'}}>
            <img
              src={ require(`assets/${this.state.productName}/ic_document_mobile.svg`)}
              style={{marginBottom: '95px'}}
              alt="" 
            />
            <div className="container">
              <div className="head">Mobile</div>
              <div className="content">
                {`Our app collects and monitors specific
                information about your device including
                your SIM Network service provider of your
                SMI.Device id and IP address. This help us
                to prevent fraud by uniquely identifying the
                devices.`}
              </div> 
            </div>
          </div>

          <div style={{ display: 'flex'}}>
            <img
              src={ require(`assets/${this.state.productName}/ic_document_location.svg`)}
              style={{marginBottom: '80px'}}
              alt="" 
            />
            <div className="container">
              <div className="head">Location</div>
              <div className="content">
                {`We collect and monitor the information about
                the location of your device for verifying the
                address, creating your risk profile, and make a
                better credit risk decision.`}
              </div> 
            </div>
          </div>

          <div className="content">
            Please note that above information is needed by <b>DMI Finance Pvt Ltd</b>, it is mandatorily to perform your credit risk assessment and is securely shared with our registered third party service providers for generating loan offers for you.
          </div>

        </div>
      </Container>
    );
  }
}

export default Permissions;
