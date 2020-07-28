import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import ContactUs from '../../../common/components/contact_us';
import { getUrlParams } from 'utils/validators';
import { storageService } from 'utils/validators';

const commonMapper = {
  'cancelled': {

  },
  'success': {

  },
  'pending': {
    'top_icon': 'error_illustration',
    'top_title': 'Sorry!',
    'mid_title': '',
    'button_title': 'OK',
    'cta_state': '/loan/home',
    'close_state': '/loan/home'
  },
  'failed': {
    'top_icon': 'error_illustration',
    'top_title': 'E-mandate failed',
    'mid_title': '',
    'button_title': 'RETRY',
    'cta_state': '/loan/bank',
    'close_state': '/loan/journey'
  },
  'loan_not_eligible': {
    'top_icon': 'ils_loan_failed',
    'top_title': 'Sorry!',
    'mid_title': '',
    'button_title': 'OK',
    'cta_state': '/loan/home',
    'close_state': '/loan/home',
    'noFooter': true,
    'hide_contact': true
  }
}


class MandateStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: getUrlParams(),
      commonMapper: {},
      okyc_id: storageService().get('loan_okyc_id')
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let { status } = this.state.params;

    if (!status) {
      status = 'pending'
    }

    this.setState({
      status: status,
      commonMapper: commonMapper[status]
    })
  }

  getMandateCallback = async () => {

    let body = {
      "request_type": "emandate"
    }

    let status = this.state.status || '';

    let resultData = await this.callBackApi(body);
    let dmi_loan_status = resultData.dmi_loan_status;

    if (resultData.callback_status || dmi_loan_status === 'emandate_done') {
      this.navigate('/loan/reference');
    } else {

      if (dmi_loan_status === 'emandate_failed' || dmi_loan_status === 'emandate') {
        status = 'failed';
      } else {
        status = 'pending';
      }
      this.setState({
        status: status,
        commonMapper: commonMapper[status]
      })
    }

  }


  onload = () => {
    this.getMandateCallback();
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
        headerData={{
          icon: 'close',
          goBack: this.goBack
        }}
        noFooter={this.state.commonMapper.noFooter}
      >
        <div className="gold-payment-container" id="goldSection">
          <div>
            {this.state.commonMapper['top_icon'] && <img style={{ width: '100%' }}
              src={require(`assets/${this.state.productName}/${this.state.commonMapper['top_icon']}.svg`)}
              alt="" />}
          </div>
          <div className="main-tile">

            <div>

              {this.state.status === 'failed' &&
                <div>
                  <p className="top-content">
                    Sorry, E-mandate application has failed. Please retry again.
                  </p>
                </div>
              }

              {this.state.status === 'pending' &&
                <div>
                  <p className="top-content">
                    We have captured your detail but due to some system issues,you cannot proceed further.
                    Please try again after some time.
                  </p>
                  <p className="top-content">
                    You will receive a communication on your E-mail id once the issue is resolved.
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

export default MandateStatus;
