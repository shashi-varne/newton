import React, { Component } from 'react';

import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import {Imgc} from '../../../common/ui/Imgc';
const stepsContentMapper = [
  { 'icon': 'ic_gold_provider', 'content': 'Select gold coin' },
  { 'icon': 'ic_make_payment', 'content': 'Pay making charges' },
  { 'icon': 'deliver', 'content': 'Get home delivery' }
];


class DeliveryIntro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      provider: this.props.match.params.provider,
      productName: getConfig().productName,
      deliveryDisabled: true
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'delivery_journey'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }


  renderInfoSteps = (props, index) => {
    return (
      <div key={index} className="tile">
         <Imgc className="icon gold-common-stepes-icon" 
          src={require(`assets/${this.state.productName}/${props.icon}.svg`)} alt="Gold" />
        <div className="content">
          {index + 1}. {props.content}
        </div>
      </div>
    );
  }

  handleClick = () => {
    if(this.state.deliveryDisabled) {
      return;
    }

    this.sendEvents('next');
    this.navigate('delivery-products');
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Deliver gold"
        handleClick={this.handleClick}
        buttonTitle="SELECT GOLD COIN"
        events={this.sendEvents('just_set_events')}
        disable={this.state.deliveryDisabled}
        noFooter={this.state.deliveryDisabled}
      >

        <div className="common-top-page-subtitle">
          Now get your 24K gold delivered to your doorstep
          directly in the form of gold coin.
                </div>

        <div className="common-how-steps" style={{ border: 'none' }}>
          <div className="top-tile">
            <div className="top-title">
              How to get gold coin delivered?
            </div>
          </div>

          <div className='common-steps-images'>
            {stepsContentMapper.map(this.renderInfoSteps)}
          </div>
        </div>
       {this.state.deliveryDisabled && 
        <div style={{margin: '40px 0px 0px 0px', color: 'red', fontWeight:500, lineHeight:1.3}}>
          Due to temporary restrictions in movement and staffing because of COVID-19, 
          we are unable to process any deliveries until these restrictions are lifted.
          </div>}
      </Container>
    );
  }
}

export default DeliveryIntro;
