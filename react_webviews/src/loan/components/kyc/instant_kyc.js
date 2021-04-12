import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import next_arrow from 'assets/next_arrow.svg';
import SVG from 'react-inlinesvg';
import { getConfig, getBasePath } from "utils/functions";
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import completed_step from "assets/completed_step.svg";
import { storageService } from 'utils/validators';

const portalStatus = ['verified_contact','okyc', 'okyc_failed', 'okyc_cancelled'];

class InstantKycHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
      getLeadBodyKeys: ['vendor_info'],
      lead: {},
      vendor_info: {},
      timeAlloted: 20,
      screen_name: 'instant-kyc',
      totalEligiRounds: 7,
      currentEligiRounds: 1
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {

    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};

    this.setState({
      vendor_info: lead.vendor_info,
      dmi_loan_status: vendor_info.dmi_loan_status
    })

  }

  sendEvents(user_action, data = {}) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'instant kyc',
        "get_kyc_done": portalStatus.indexOf(this.state.dmi_loan_status) === -1 ? 'yes' : 'no',
        "stage": portalStatus.indexOf(this.state.dmi_loan_status) === -1 ? 'approved' : 'default'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  redirectKyc = async () => {

    if (this.state.application_id && portalStatus.indexOf(this.state.dmi_loan_status) !== -1) {
      this.setState({
        show_loader: true
      });
      try {

        let res = await Api.get(`/relay/api/loan/okyc/get/url/${this.state.application_id}`);

        var resultData = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200 && !resultData.error) {

          let okyc_id = resultData.okyc_id;
          storageService().set('loan_okyc_id', okyc_id);
          let basepath = getBasePath();
          let paymentRedirectUrl = encodeURIComponent(
            basepath + `/loan/dmi/redirection-status/kyc` + getConfig().searchParams
          );

          let back_url = encodeURIComponent(
            basepath + `/loan/dmi/instant-kyc-status` + getConfig().searchParams + 
            '&flow=kyc&okyc_id=' + okyc_id
          );

          // for web no issue
          if(getConfig().Web) {
            paymentRedirectUrl = back_url;
          }

          var payment_link = resultData.okyc_url;
          var pgLink = payment_link;
          let app = getConfig().app;
          // eslint-disable-next-line
          pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl +
            '&app=' + app + '&back_url=' + back_url + '&generic_callback=' + getConfig().generic_callback;
        
          this.openInTabApp({
            url: pgLink,
            back_url: back_url
          });
          // if(!getConfig().Web) {
          //   this.setState({
          //     show_loader: false
          //   });
          // }

        } else {
          this.setState({
            show_loader: false
          });

          toast(resultData.error || resultData.message
            || 'Something went wrong');
        }
      } catch (err) {
        console.log(err)
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
    }

  }

  kycCallback = async () => {

    this.setState({
      eligi_checking: true
    });

    let body = {
      "request_type": "okyc",
      'okyc_id': this.state.vendor_info.dmi_okyc_id
    }
    let resultData = await this.callBackApi(body);
    if (resultData.callback_status) {
      this.triggerDecision();
    } else {
      let searchParams = getConfig().searchParams + '&status=pending&flow=kyc';
      this.navigate('instant-kyc-status', { searchParams: searchParams });
    }


  }

  triggerDecision = async () => {
    this.setState({
      eligi_checking: true
    });
    try {

      let res = await Api.get(`/relay/api/loan/dmi/accept_eligibility/${this.state.application_id}`);

      var resultData = res.pfwresponse.result;
      if (res.pfwresponse.status_code === 200 && !resultData.error) {
        //  
        this.setState({
          eligi_checking: true
        })

        this.startEligiCheck();

      } else {
        this.setState({
          eligi_checking: false
        });
        toast(resultData.error || resultData.message
          || 'Something went wrong');
      }
    } catch (err) {
      console.log(err)
      this.setState({
        eligi_checking: false
      });
      toast('Something went wrong');
    }
  }


  handleClick = () => {
    this.sendEvents('next');

    if (this.state.dmi_loan_status === 'okyc_success') {
      //ready for decision
      this.kycCallback();
    } else {
      this.startEligiCheck();
    }
  }

  renderEligibilityCheckUi() {

    if (this.state.eligi_checking) {
      return (
        <div className="loan-instant-kyc-eligi-checking">

          <div className="loader-container">
            {this.state.productName && <img
              src={require(`assets/${this.state.productName}/loader_gif.gif`)}
              style={{ padding: '80px 0 30px 0' }}
              alt="loader" />}
          </div>
          <div className="calculate">
            Calculating Eligibility….
          </div>

          <div className="check-eligiblity">
          Hold on while we check your loan eligibility!
          </div>
        </div>
      )
    }

    return null;

  }

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  countdown = () => {
    let timeAvailable = this.state.timeAvailable;

    console.log(timeAvailable)
    timeAvailable--;
    if (timeAvailable <= 0) {
      timeAvailable = 0;
      clearInterval(this.state.countdownInterval);
      this.decisionCallback();
    }

    this.setState({
      timeAvailable: timeAvailable
    })
  };

  startEligiCheck = () => {
    let intervalId = setInterval(this.countdown, 1000);
    this.setState({
      countdownInterval: intervalId,
      eligi_checking: true,
      timeAvailable: this.state.timeAlloted
    });
  }

  reTriggerEligi() {

    let intervalId = setInterval(this.countdown, 1000);

    this.setState({
      timeAvailable: this.state.totalTime,
      countdownInterval: intervalId
    });
    this.props.parent.resendOtp();
  }

  renderMainUI() {
    if (!this.state.eligi_checking) {
      return (
        <div>
          <div className="common-top-page-subtitle">
            It is mandatory for lenders to get “Know your Customer” done before giving loan to a customer.
            UIDAI has launched Aadhaar Paperless Offline KYC which is a secure sharable document that can be
            used by any Aadhaar number holder for offline verification of Identification.
        </div>
          <div className="loan-instant-kyc-home">

            <div className="action" onClick={() => {
              portalStatus.indexOf(this.state.dmi_loan_status) !== -1 &&
                    this.sendEvents('next')
              this.redirectKyc()
            }}>
              <div className="left">
                Get your KYC done
              </div>
              {portalStatus.indexOf(this.state.dmi_loan_status) !== -1 &&
                <SVG
                  className="right"
                  preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
                  src={next_arrow}
                />}
              {portalStatus.indexOf(this.state.dmi_loan_status) === -1 &&
                <img className="right" src={completed_step} alt="" />}
            </div>
          </div>
        </div>
      )
    }

    return null;
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Instant KYC"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="CHECK ELIGIBILITY"
        headerData={{
          icon: 'close'
        }}
        noHeader={this.state.eligi_checking}
        noFooter={this.state.eligi_checking}
        disable={portalStatus.indexOf(this.state.dmi_loan_status) !== -1}
      >

        {this.renderMainUI()}
        {this.renderEligibilityCheckUi()}
      </Container>
    );
  }
}

export default InstantKycHome;
