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

    console.log(this.state.lead);
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

    if(this.state.application_id) {
      this.setState({
        show_loader: true
      });
      try {
  
        let res = await Api.get(`/relay/api/loan/okyc/get/url/${this.state.application_id}`);
  
        this.setState({
          show_loader: false
        });
  
        var resultData = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200 && !resultData.error) {
          this.triggerOtp();
  
        } else {
         
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

  handleClick = () => {
    this.sendEvents('next');
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
        disable={this.state.dmi_loan_status !== 'okyc'}
      >

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
            {this.state.dmi_loan_status !== 'okyc' &&
              <SVG
                className="right"
                preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
                src={next_arrow}
              />}
            {this.state.dmi_loan_status === 'okyc' &&
              <img className="right" src={completed_step} alt="" />}
          </div>
        </div>
      </Container>
    );
  }
}

export default InstantKycHome;
