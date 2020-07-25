import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import next_arrow from 'assets/next_arrow.svg';
import SVG from 'react-inlinesvg';
import { getConfig } from "utils/functions";
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import completed_step from "assets/completed_step.svg";
import { storageService } from 'utils/validators';

const portalStatus = ['verified_contact', 'okyc_failed', 'okyc_cancelled'];

class InstantKycHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
      getLeadBodyKeys: ['vendor_info'],
      lead: {},
      vendor_info: {}
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
          let current_url = window.location.href;
          let nativeRedirectUrl = current_url;

          let paymentRedirectUrl = encodeURIComponent(
            window.location.origin + `/loan/instant-kyc-status` + getConfig().searchParams
          );

          var payment_link = resultData.okyc_url;
          var pgLink = payment_link;
          let app = getConfig().app;
          var back_url = encodeURIComponent(current_url);
          // eslint-disable-next-line
          pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl +
            '&app=' + app + '&back_url=' + back_url;
          if (getConfig().generic_callback) {
            pgLink += '&generic_callback=' + getConfig().generic_callback;
          }


          if (getConfig().app === 'ios') {
            nativeCallback({
              action: 'show_top_bar', message: {
                title: 'KYC'
              }
            });
          }

          nativeCallback({
            action: 'take_control', message: {
              back_url: nativeRedirectUrl,
              back_text: 'Are you sure you want to exit the kyc process?'
            }
          });

          window.location.href = pgLink;

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
        show_loader: true
      });

      let body = {
        "request_type": "okyc",
        'okyc_id': this.state.vendor_info.dmi_okyc_id
      }
      let resultData = await this.callBackApi(body);
      if (resultData.callback_status) {
        this.triggerDecision();
      } else {
        let searchParams = getConfig().searchParams + '&status=pending';
        this.navigate('instant-kyc-status', { searchParams: searchParams });
      }
   

  }

  triggerDecision = async () => {
    this.setState({
      show_loader: true
    });
    try {

      let res = await Api.get(`/relay/api/loan/dmi/accept_eligibility/${this.state.application_id}`);

      var resultData = res.pfwresponse.result;
      if (res.pfwresponse.status_code === 200 && !resultData.error) {
        //  
        this.setState({
          eligi_checking: true
        })
        this.decisionCallback();

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


  handleClick = () => {
    this.sendEvents('next');
   
    if (this.state.dmi_loan_status === 'okyc_success') {
      //ready for decision
      this.kycCallback();
    }  else {
      this.decisionCallback();
    }
  }

  renderEligibilityCheckUi() {

    if (this.state.eligi_checking) {
      return (
        <div>

          <div>
            {this.state.productName && <img
              src={require(`assets/${this.state.productName}/ic_purity.svg`)}
              alt="Gold" />}
          </div>
          <div>
            Calculating Eligibility….
          </div>

          <div>
            Your eligible loan amount is being calculated by the lender using their own
            proprietary algorithm, based on the data provided by you. This can take approximately 2 mins.
          </div>
        </div>
      )
    }

    return null;

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

            <div className="action" onClick={() => this.redirectKyc()}>
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
