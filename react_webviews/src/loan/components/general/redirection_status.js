import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import ContactUs from '../../../common/components/contact_us';
import { getUrlParams } from 'utils/validators';

const commonMapper = {
  'kyc': {
    'top_icon': 'ic_read',
    'top_title': 'Sorry!',
    'mid_title': '',
    'button_title': 'OK',
    'cta_state': '/loan/home',
    'close_state': '/loan/home'
  },
  'mandate': {
    'top_icon': 'ic_read',
    'top_title': 'E-mandate failed',
    'mid_title': '',
    'button_title': 'RETRY',
    'cta_state': '/loan/home',
    'close_state': '/loan/journey'
  }
}


class RedirectionStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: getUrlParams(),
      flow: this.props.match.params.flow,
      commonMapper: {},
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let status = this.state.flow;

    if (!status) {
      status = 'kyc'
    }

    this.setState({
      status: status,
      commonMapper: commonMapper[status]
    })
  }


  onload = () => {

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
    this.navigate(this.state.commonMapper.cta_state);
  }

  goBack = () => {
    this.navigate(this.state.commonMapper.close_state);
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={this.state.commonMapper.top_title}
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle={this.state.commonMapper.button_title}
        noHeader={true}
        headerData={{
          icon: 'close',
          goBack: this.goBack
        }}
        noFooter={true}
      >
        <div style={{ paddingTop: 120 }} className="gold-payment-container" id="goldSection">
          <div>
            {this.state.commonMapper['top_icon'] && <img style={{ width: '100%' }}
              src={require(`assets/${this.state.productName}/${this.state.commonMapper['top_icon']}.svg`)}
              alt="" />}
          </div>
          <div className="main-tile">

            <div>

              {this.state.status === 'kyc' &&
                <div>
                  <p className="top-content">
                  Please close this to continue journey..........
                  </p>
                </div>
              }

              {this.state.status === 'mandate' &&
                <div>
                  <p className="top-content">
                   Please close this to continue journey..........
                  </p>
                </div>
              }

            </div>

          </div>

          {!this.state.commonMapper.hide_contact && <ContactUs />}
        </div>
      </Container>
    );
  }
}

export default RedirectionStatus;
