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
      form_data: {},
      next_state: 'journey',
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
    let that = this;
    window.callbackWeb.get_data({
      type: 'location_nsp_received',
      location_nsp_received: function location_nsp_received(data) {
        let body = {
           latitude: data.location.lat, 
           longitude: data.location.lng,
           device_id: data.device_id, 
           network_service_provider: data.nsp 
        };
        that.updateLead(body);
      }
    });
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Mandatory permissions"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="I AGREE"
      >
        <div className="loan-permissions">

          <div className="box">
          <img
              src={require(`assets/${this.state.productName}/ic_document_mobile.svg`)}
              alt=""
            />
            <div className="container">
              <div className="mobile-head">Mobile</div>
              <div className="content" style={{margin:'0 0 0 26px'}}>
              {`Our app collects and monitors specific
                information about your device including
                Network Service Provider of your SIM,
                Device id and IP address.This helps us
                to prevent fraud by uniquely identifying the
                devices.`}
              </div>
            </div>
          </div>

          <div  className="box">
          <img
              src={require(`assets/${this.state.productName}/ic_document_location.svg`)}
              alt=""
            />
            <div className="container">
              <div className="location-head">Location</div>
              <div className="content" style={{margin:'0 0 0 22px'}}>
              {`We collect and monitor the information about
                the location of your device for verifying the
                address, creating your risk profile, and make a
                better credit risk decision.`}
              </div>
            </div>
          </div>

          <div className="content">
            Please note that above information is mandatory. It is needed by <b>DMI Finance Pvt Ltd</b>, to perform your credit risk assessment and generate loan offers for you.
          </div>

        </div>
      </Container>
    );
  }
}

export default Permissions;
