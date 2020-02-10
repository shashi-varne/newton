import React, { Component } from 'react';

import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

const stepsContentMapper = [
    {'icon': 'ic_gold_provider', 'content': 'How to get gold coin delivered?'},
    {'icon': 'ic_make_payment', 'content': '2. Pay making charges'},
    {'icon': 'deliver', 'content': '3. Get home delivery'}
  ];

class DeliveryIntro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      provider: this.props.match.params.provider,
      productName: getConfig().productName
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
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Delivery Order Summary'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  
  renderInfoSteps =(props, index) => {
    return(
      <div key={index} className="tile">
        <img className="icon" 
        src={require(`assets/${this.state.productName}/${props.icon}.svg`)} alt="Gold" />
        <div className="content">
          {props.content}
        </div>
      </div>
    );
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Deliver gold"
        handleClick={this.handleClick}
        buttonTitle="Select gold coin"
        events={this.sendEvents('just_set_events')}
      >

                <div className="common-top-page-subtitle">
                    Now get your 24K gold delivered to your doorstep
                    directly in the form of gold coin.
                </div>

                <div className="gold-how-steps" style={{border: 'none'}}>
                    <div className="top-tile">
                        <div className="top-title">
                        How to buy digital gold?
                        </div>
                    </div>

                    <div className='gold-steps-images'>
                    {stepsContentMapper.map(this.renderInfoSteps)}
                    </div>
                </div>
      </Container>
    );
  }
}

export default DeliveryIntro;
