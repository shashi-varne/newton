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
    'top_icon': 'ils_covid_failed_copy_2',
    'top_title': 'Instant KYC',
    'mid_title': '',
    'button_title': 'TRY LATER',
    'cta_state': '/loan/home',
    'close_state': '/loan/home'
  },
  'failed': {
    'top_icon': 'error_illustration',
    'top_title': 'Instant KYC failed!',
    'mid_title': '',
    'button_title': 'RETRY',
    'cta_state': '/loan/instant-kyc',
    'close_state': '/loan/journey'
  },
  'not_eligible': {//dropped for now
    'top_icon': 'error_illustration',
    'top_title': 'Instant KYC failed!',
    'mid_title': '',
    'button_title': 'RETRY',
    'cta_state': '/loan/home',
    'close_state': '/loan/journey'
  },
  'sorry': {//dropped for now
    'top_icon': 'error_illustration',
    'top_title': 'Sorry!',
    'mid_title': '',
    'button_title': 'OK',
    'cta_state': '/loan/home',
    'close_state': '/loan/home'
  },
  'eligible_sorry': {
    'top_icon': 'error_illustration',
    'top_title': 'Sorry!',
    'mid_title': '',
    'button_title': 'OK',
    'cta_state': '/loan/home',
    'close_state': '/loan/home'
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

const outsiders = ['sorry', 'eligible_sorry', 'loan_not_eligible']

class KycStatus extends Component {
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
      status = 'cancelled'
    }

    if (status === 'cancelled') {
      this.navigate('/loan/instant-kyc');
      return;
    }

    this.setState({
      status: status,
      commonMapper: commonMapper[status]
    })
  }

  kycCallback = async () => {

    if (this.state.okyc_id) {
      let status = this.state.status;
      let body = {
        "request_type": "okyc",
        'okyc_id': this.state.okyc_id
      }
      let resultData = await this.callBackApi(body);

      this.setState({
        kyc_checking: false
      })
      if (resultData.callback_status) {
        if (this.state.status === 'success') {
          this.navigate('/loan/instant-kyc');
        }
      } else {
        status = 'pending';
        this.setState({
          status: status,
          commonMapper: commonMapper[status]
        })
      }
    } else {
      this.setState({
        kyc_checking: false
      })
    }

  }


  onload = () => {
    if (outsiders.indexOf(this.state.status) !== -1) {
      this.setState({
        show_loader: false
      })
    } else {
      this.setState({
        kyc_checking: true,
        show_loader: false
      })

      let that = this;
      setTimeout(function(){ 
        that.kycCallback();
      }, 20000);

      
    }

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

  renderKycCheckUi() {

    if (this.state.kyc_checking) {
      return (
        <div className="loan-instant-kyc-eligi-checking">

          <div>
            {this.state.productName && <img
              src={require(`assets/${this.state.productName}/ic_purity.svg`)}
              style={{ padding: '80px 0 30px 0' }}
              alt="Gold" />}
          </div>
          <div className="calculate">
            Calculating KYC Status.
          </div>

          <div className="check-eligiblity">
            KYC verification will take little time.
            Please wait !!. This can take approximately 20 seconds.
          </div>
        </div>
      )
    }

    return null;

  }

  renderMainUi() {

    if (!this.state.kyc_checking) {
      return (
        <div className="gold-payment-container" id="goldSection">
        <div>
          {this.state.commonMapper['top_icon'] && <img style={{ width: '100%' }}
            src={require(`assets/${this.state.productName}/${this.state.commonMapper['top_icon']}.svg`)}
            alt="" />}
        </div>
        <div className="main-tile">

          <div>
            {this.state.status === 'pending' &&
              <p className="top-content">
                It is taking a little more time than usual. Please check after a while.
              </p>
            }


            {this.state.status === 'failed' &&
              <div>
                <p className="top-content">
                  Sorry, your instant KYC has failed due to some system issues. Please retry again.
                </p>
              </div>
            }

            {this.state.status === 'not_eligible' &&
              <div>
                <p className="top-content">
                  Your KYC cannot be verified due to which you are not eligible for loan. Thank You.
                </p>
              </div>
            }


            {this.state.status === 'sorry' &&
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

            {this.state.status === 'eligible_sorry' &&
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

            {this.state.status === 'loan_not_eligible' &&
              <div>
                <p className="top-content">
                  At the outset, we thank you for expressing interest in availing a loan.
                </p>
                <p className="top-content">
                  We regret to inform you that <b>we cannot process your application further at this stage</b>,
                  as it does not meet our partner’s policy criteria.
                </p>
                <p className="top-content">
                  Hope to be of assistance in future.
                </p>
              </div>
            }

          </div>

        </div>

        {!this.state.commonMapper.hide_contact && <ContactUs />}
      </div>
      )
    }

    return null;

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
        noFooter={this.state.commonMapper.noFooter || this.state.kyc_checking}
        noHeader={this.state.kyc_checking}
      >
          {this.renderMainUi()}
          {this.renderKycCheckUi()}
      </Container>
    );
  }
}

export default KycStatus;
