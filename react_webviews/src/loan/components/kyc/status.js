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
    'top_title': 'Not eligible for loan',
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
      okyc_id: storageService().get('loan_okyc_id'),
      timeAlloted: 20000,
      onloadApi: true
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
    
    let { status, okyc_id,flow } = this.state.params;
    if(flow === 'kyc') {
      this.setState({
        kyc_checking: true
      })
    }

    if (!status) {
      status = 'cancelled'
    }

    let { params } = this.props.location;
    if (!params) {
      params = {};
    }


    this.setState({
      status: status,
      rejection_reason: params.rejection_reason,
      okyc_id: okyc_id || this.state.okyc_id,
      commonMapper: commonMapper[status],
      flow:flow
    })
  }

  kycCallback = async () => {

    let status = this.state.status;
    if (this.state.okyc_id) {
      let body = {
        "request_type": "okyc",
        'okyc_id': this.state.okyc_id
      }
      let resultData = await this.callBackApi(body);

      let dmi_loan_status  = resultData.dmi_loan_status;

      if(!resultData.callback_status && this.state.onloadApi && 
        ['okyc_done', 'okyc_success'].indexOf(dmi_loan_status) !== -1) {
        this.setState({
          onloadApi: false
        })

        let that = this;
        setTimeout(function(){ 
          that.kycCallback();
        }, that.timeAlloted);

        return;
      } else {
        this.setState({
          onloadApi: false,
          kyc_checking: false
        })
      }
     
      if (resultData.callback_status || dmi_loan_status === 'okyc_done') {
        this.navigate('/loan/instant-kyc');
      } else {
        if(dmi_loan_status === 'okyc_failed') {
          status = 'failed';
        } else if(dmi_loan_status === 'okyc_success') {
          status = 'pending';
        } else {
          status = 'cancelled';
          this.navigate('/loan/instant-kyc');
          return;
        }
        
        this.setState({
          status: status,
          commonMapper: commonMapper[status]
        })
      }
    } else {
      status = 'pending';
      this.setState({
        status: status,
        kyc_checking: false,
        commonMapper: commonMapper[status]
      })
    }

  }


  onload = () => {
    if (outsiders.indexOf(this.state.status) !== -1) {
      this.setState({
        show_loader: false
      })
    } else if(this.state.flow === 'kyc') {

      this.setState({
        kyc_checking: true,
        show_loader: false
      })

      let that = this;
      setTimeout(function(){ 
        that.kycCallback();
      }, 2000);
    }

  }

  sendEvents(user_action) {
    let stage;
    if (this.state.status === 'not_eligible')
      stage = 'dmi fail'
    else if (this.state.status === 'failed')
      stage = 'third party fail'
    else if (this.state.status === 'pending')
      stage = 'no response'
    else
      stage = 'waiting'

    let eventObj;
    if (this.state.status === 'loan_not_eligible') {
      eventObj = {
        "event_name": 'lending',
        "properties": {
          "user_action": user_action,
          "screen_name": 'loan-eligibility',
          "stage": 'not eligible',
          "rejection_reason": this.state.rejection_reason === undefined ? 'Rejected by DMI' : this.state.rejection_reason
        }
      };
    } else if (this.state.status === 'sorry') {
      eventObj = {
        "event_name": 'lending',
        "properties": {
          "user_action": user_action,
          "screen_name": 'Sorry',
          "stage": 'creating profile failure'
        }
      }
    } else {
      eventObj = {
        "event_name": 'lending',
        "properties": {
          "user_action": user_action,
          "screen_name": 'kyc-response',
          "stage": stage
        }
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
    this.sendEvents('back');
    this.navigate(this.state.commonMapper.close_state);
  }

  renderKycCheckUi() {

    if (this.state.kyc_checking) {
      return (
        <div className="loan-instant-kyc-eligi-checking">

          <div className="loader-container">
            {this.state.productName && <img
              src={require(`assets/${this.state.productName}/loader_gif.gif`)}
              style={{ padding: '80px 0 30px 0' }}
              alt="loader" />}
          </div>
          <div className="calculate">
          Fetching KYC status.
          </div>

          <div className="check-eligiblity">
          KYC verification will take time. Please wait as this can take approximately 20 seconds.
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

            {(this.state.status === 'loan_not_eligible') &&
              <div>
                {(this.state.rejection_reason !== 'location' && this.state.rejection_reason !== 'occupation') && <div>
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
                </div>}

                {(this.state.rejection_reason === 'location') && 
                  <div>
                    <p className="top-content">Sorry! We don't serve in the selected location yet.</p>
                    <p className="top-content">
                      Thank you for expressing interest in availing a loan. Hope to be of assistance in future.
                    </p>
                  </div>
                }

                {(this.state.rejection_reason === 'occupation') &&
                  <div>
                    <p className="top-content">Sorry! As of now, we are only serving salaried professionals.</p>
                    <p className="top-content">
                      Thank you for expressing interest in availing a loan. Hope to be of assistance in future.
                    </p>
                  </div>
                }
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
        classOverRide={'loanMainContainer'}
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
