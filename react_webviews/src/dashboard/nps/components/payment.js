import React, { Component } from "react";
import { initialize } from "../common/commonFunctions";
import Container from "../../common/Container";
import { storageService } from "utils/validators";
import { formatAmountInr } from "utils/validators";
import { getConfig } from "../../../utils/functions";

class NpsPaymentCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      screen_name: 'npsPaymentStatus',
      amount: ''
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    const params = this.props.match?.params || {}
    const status = params.status;
    if(!params.status) {
      this.navigate("/");
      return;
    }
    const npsRecommended = storageService().getObject("nps-recommend") || {};
    const _eventOnLoad = {
      'event_name': 'payment_status',
      'properties': {
        'status': params.status,
        'amount': params.amount,
        'payment_id': params.id,
        'journey': {
          'name': 'nps',
          'investment_type': params.type,
          'investment_subtype': '',
          'risk_type': npsRecommended.risk
        }
      }
    };
    const config = getConfig();
  
    // send event
    if (!config.Web) {
      window.callbackWeb.eventCallback(_eventOnLoad);
    } else if (config.isIframe) {
      const message = JSON.stringify(_eventOnLoad);
      window.callbackWeb.sendEvent(message);
    }
    const amount = params.amount || storageService().get('npsAmount');
    this.setState({
      amount: amount,
      status: status
    })
  };

  handleClick = async () => {
    const config = getConfig();
    if (this.state.status !== 'success') {
      this.navigate('/invest')
    } else {
      const result = await this.getNPSInvestmentStatus();
      storageService().set('nps_additional_details_required', true);
      // storageService().setObject('nps_additional_details', result.registration_details);
      // storageService().setObject('kyc', result.kyc_app);
  
      let currentUser = storageService().getObject("user");
      currentUser.nps_investment = true;
      storageService().setObject("user", currentUser)
      let _event = {
        event_name: "journey_details",
        properties: {
          journey: {
            name: "nps",
            trigger: "cta",
            journey_status: "incomplete",
            next_journey: "kyc",
          },
        },
      };
      if (!result?.registration_details?.additional_details_status) {
        if (currentUser.kyc_registration_v2 === 'init') {
          // send event
          if (!config.Web) {
            window.callbackWeb.eventCallback(_event);
          } else if (config.isIframe) {
            window.callbackWeb.sendEvent(_event);
          }
          this.navigate('/kyc/home');
        } else if (currentUser.kyc_registration_v2 === 'incomplete') {
          // send event
          if (!config.Web) {
            window.callbackWeb.eventCallback(_event);
          } else if (config.isIframe) {
            window.callbackWeb.sendEvent(_event);
          }
          this.navigate('/kyc/journey');
        } else {
          this.navigate('/nps/identity');
        }
      } else {
        let _event = {
          'event_name': 'journey_details',
          'properties': {
            'journey': {
              'name': 'nps',
              'trigger': 'cta',
              'journey_status': 'complete',
              'next_journey': 'reports'
            }
          }
        };
        // send event
        if (!config.Web) {
          window.callbackWeb.eventCallback(_event);
        } else if (config.isIframe) {
          window.callbackWeb.sendEvent(_event);
        }
        if(!config.isIframe) {
          this.navigate('/nps/investments');
        }
      }
    }
  };
 
  render() {
    return (
      <Container
        data-aid='nps-payment-status-screen'
        showLoader={this.state.show_loader}
        buttonTitle="OK"
        title="Payment Status"
        handleClick={this.handleClick}
      >
        <div className="nps-payment-callback" data-aid='nps-payment-callback'>
          <div
            className="invest-sucess container-padding"
            style={{ padding: "20px" }}
          >
            {this.state.status === 'success' && <div data-aid='nps-payment-successful'>
              <div className="icon">
                <img
                  alt=""
                  src={require("assets/thumb.svg")}
                  width="80"
                  height="80"
                />
              </div>
              <div className="sub-head">Payment Successful</div>
              <div className="sub-title">
                Payment of <b>{formatAmountInr(this.state.amount)}</b> towards NPS is successful
              </div>
            </div>}
            {this.state.status !== 'success' && <div className="invest-error" data-aid='nps-invest-error'>
              <h2>Error</h2>
              <p>Payment Failed</p>
            </div>}
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsPaymentCallback;
