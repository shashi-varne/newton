import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import ContactUs from '../../../common/components/contact_us';
import { getUrlParams } from 'utils/validators';
import ReactHtmlParser from 'react-html-parser'; 

const baseCommonMapper = {
  'kyc': {
   'success': {
    'top_icon': 'ic_read',
    'content': [
      'Press the X button to go back to Fisdom app and continue your journey.'
    ]
   },
   'cancelled': {
    'top_icon': 'ic_read',
    'content': [
      'Your KYC could not be completed. Please click on X button to go back to Fisdom app and resume your KYC journey.'
    ]
   },
   'failed': {
    'top_icon': 'ic_read',
    'content': [
      'Your KYC could not be completed. Please click on X button to go back to Fisdom app and resume your KYC journey.'
    ]
   }
  },
  'mandate': {
    'success': {
      'top_icon': 'ic_read',
      'content': [
        'Your KYC has been completed. Press the X button to go back to Fisdom app and continue your journey.'
      ]
     },
     'cancelled': {
      'top_icon': 'ic_read',
      'content': [
        'Press the X button to go back to Fisdom app and resume your KYC journey.'
      ]
     },
     'failed': {
      'top_title': '',
      'content': [
        'Your KYC could not be completed. Please click on X button to go back to Fisdom app and resume your KYC journey.'
      ]
     }
  }
}


class RedirectionStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: getUrlParams(),
      flow: this.props.match.params.flow || '',
      commonMapper: {
        content: []
      }
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let flow = this.state.flow;
    let { status } = this.state.params;

    if (!status) {
      status = 'cancelled';
    }

    console.log(baseCommonMapper[flow][status]);

    this.setState({
      status: status,
      commonMapper: baseCommonMapper[flow][status],
    })
  }


  onload = () => {

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'redirection status'
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

  renderContent = (props, index) => {
    return(
      <p key={index} className="top-content">
      {ReactHtmlParser(props)}
      </p>
    )
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
        classOverRide={'loanMainContainer'}
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

              {this.state.commonMapper.content.map(this.renderContent)}

            </div>

          </div>

          {!this.state.commonMapper.hide_contact && <ContactUs />}
        </div>
      </Container>
    );
  }
}

export default RedirectionStatus;
