import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import ContactUs from '../../../common/components/contact_us';
import { getUrlParams } from 'utils/validators';
const commonMapper = {
    'success': {
      'top_icon': 'ils_gold_purchase_success',
      'top_title': 'Gold purchase successful!',
      'mid_title': 'Payment details',
      'button_title': 'GO TO LOCKER',
      'cta_state': '/gold/gold-locker'
    },
    'pending': {
      'top_icon': 'ils_gold_purchase_pending',
      'top_title': 'Gold purchase pending!',
      'mid_title': 'Payment details',
      'button_title': 'GO TO LOCKER',
      'cta_state':  '/gold/gold-locker'
    },
    'failed': {
      'top_icon': 'ils_gold_purchase_failed',
      'top_title': 'Oops! gold purchase failed',
      'mid_title': '',
      'button_title': 'RETRY BUY GOLD',
      'cta_state': '/gold/buy'
    }
}

class KycStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: getUrlParams(),
      commonMapper: {}
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let { status } = this.state.params;

    status = 'success';
    
    this.setState({
      status: status,
      commonMapper: commonMapper[status]
    })
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
        title="DUMMY_HEADER_TITLE"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
      >
        <div className="gold-payment-container" id="goldSection">
          <div>
          <img style={{width: '100%'}} 
          src={ require(`assets/${this.state.productName}/${this.state.commonMapper['top_icon']}.svg`)} 
          alt="Gold" />
          </div>
                <div className="main-tile">
                  
                    <div>
                        {this.state.paymentSuccess && 
                          <p className="top-content"> 
                            If confirmed within 30 minutes we will place gold 
                            purchase order (at live price) else it will be refunded in 3-5 business days.  
                          </p>
                        }

                        {this.state.paymentPending && 
                          <div>
                            <p className="top-content"> 
                            If confirmed within 30 minutes we will place gold 
                            purchase order (at live price) else it will be refunded in 3-5 business days.  
                            </p>
                            <p className="top-content"> 
                            If confirmed within 30 minutes we will place gold 
                            purchase order (at live price) else it will be refunded in 3-5 business days.  
                            </p>
                          </div>
                        }

                        {this.state.paymentFailed && 
                          <div>
                            <p className="top-content"> 
                            If confirmed within 30 minutes we will place gold 
                            purchase order (at live price) else it will be refunded in 3-5 business days.  
                            </p>
                            <p className="top-content"> 
                              If any amount has been debited, it will be refunded within 3-5 business days.  
                            </p>
                          </div> 
                        }
                      
                    </div>
                  
                </div>

                <ContactUs />
        </div>
      </Container>
    );
  }
}

export default KycStatus;
